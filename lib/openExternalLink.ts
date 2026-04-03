import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";

/**
 * Opens an external URL in a way that works for both web and Capacitor native (iOS/Android).
 * - Native: uses Capacitor Browser plugin
 * - Web: uses window.open in a new tab
 */
export async function openExternalLink(
  url?: string,
  options?: {
    target?: "_blank" | "_self";
    features?: string;
  },
): Promise<{ ok: boolean; error?: unknown }> {
  if (!url || typeof url !== "string") {
    return { ok: false, error: new Error("Invalid URL") };
  }

  try {
    if (Capacitor.isNativePlatform()) {
      await Browser.open({ url });
      return { ok: true };
    }

    if (typeof window !== "undefined") {
      const target = options?.target ?? "_blank";
      const features = options?.features ?? "noopener,noreferrer";
      window.open(url, target, features);
      return { ok: true };
    }

    return { ok: false, error: new Error("No browser environment available") };
  } catch (error) {
    return { ok: false, error };
  }
}
