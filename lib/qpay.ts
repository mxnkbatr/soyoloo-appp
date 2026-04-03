import { Redis } from "@upstash/redis";

const QPAY_URL = process.env.QPAY_URL || "https://merchant.qpay.mn/v2";
const QPAY_USERNAME = process.env.QPAY_USERNAME;
const QPAY_PASSWORD = process.env.QPAY_PASSWORD;
const QPAY_INVOICE_CODE = process.env.QPAY_INVOICE_CODE;

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

export async function getQPayToken(): Promise<string> {
  const cacheKey = "qpay_access_token";

  // 1. Check Redis Cache
  if (redis) {
    try {
      const cachedToken = await redis.get<string>(cacheKey);
      if (cachedToken) return cachedToken;
    } catch {}
  }

  // 2. Fetch New Token
  console.log("[QPay] Fetching new access token...");
  const authHeader = Buffer.from(`${QPAY_USERNAME}:${QPAY_PASSWORD}`).toString(
    "base64",
  );

  const response = await fetch(`${QPAY_URL}/auth/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("[QPay] Token fetch failed:", err);
    throw new Error("QPay authentication failed");
  }

  const data = await response.json();
  const token = data.access_token;

  // 3. Cache Token (expires in ~15 mins, cache for 14)
  if (redis) {
    try {
      await redis.set(cacheKey, token, { ex: 14 * 60 });
    } catch {}
  }

  return token;
}

export async function createInvoice(params: {
  orderId: string;
  amount: number;
  description: string;
  callbackBaseUrl?: string;
}) {
  const token = await getQPayToken();

  const baseUrl = (
    params.callbackBaseUrl ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    ""
  ).replace(/\/$/, "");

  const callbackUrl =
    baseUrl && baseUrl.startsWith("https://")
      ? `${baseUrl}/api/payment/qpay/callback?order_id=${params.orderId}`
      : undefined;

  const body = {
    invoice_code: QPAY_INVOICE_CODE,
    sender_invoice_no: params.orderId,
    invoice_receiver_code: "TERMINAL",
    invoice_description: params.description,
    amount: params.amount,
    ...(callbackUrl ? { callback_url: callbackUrl } : {}),
  };

  const response = await fetch(`${QPAY_URL}/invoice`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("[QPay] Invoice creation failed:", err);
    throw new Error("QPay invoice creation failed");
  }

  const data = await response.json();

  return {
    invoiceId: data.invoice_id,
    qrText: data.qr_text,
    qrImage: data.qr_image,
    urls: data.urls || [],
  };
}

export async function checkPayment(invoiceId: string) {
  const token = await getQPayToken();

  const body = {
    object_type: "INVOICE",
    object_id: invoiceId,
    offset: { page_number: 1, page_limit: 10 },
  };

  const response = await fetch(`${QPAY_URL}/payment/check`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.error("[QPay] Payment check failed");
    return { paid: false };
  }

  const data = await response.json();

  // QPay returns paid items in 'rows' if successful
  const isPaid = data.rows && data.rows.length > 0;

  if (isPaid) {
    const payment = data.rows[0];
    return {
      paid: true,
      amount: Number(payment.payment_amount),
      paidAt: new Date(payment.payment_date),
    };
  }

  return { paid: false };
}
