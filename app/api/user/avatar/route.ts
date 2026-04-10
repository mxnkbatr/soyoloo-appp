import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { auth } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    // 1. Auth check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse body
    const { imageDataUrl } = await req.json();
    if (!imageDataUrl || !imageDataUrl.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Invalid image data' }, { status: 400 });
    }

    // 3. Upload to Cloudinary
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName) {
      return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 });
    }

    let imageUrl: string;

    if (uploadPreset) {
      // Unsigned upload (using upload preset)
      const formData = new FormData();
      formData.append('file', imageDataUrl);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'soyol/avatars');

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );
      const cloudData = await cloudRes.json();
      if (!cloudRes.ok) {
        console.error('[Avatar API] Cloudinary error:', cloudData);
        return NextResponse.json({ error: 'Зураг upload хийхэд алдаа гарлаа' }, { status: 500 });
      }
      imageUrl = cloudData.secure_url;
    } else if (apiKey && apiSecret) {
      // Signed upload
      const timestamp = Math.round(Date.now() / 1000);
      const folder = 'soyol/avatars';

      // Generate signature
      const crypto = await import('crypto');
      const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

      const formData = new FormData();
      formData.append('file', imageDataUrl);
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);
      formData.append('folder', folder);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );
      const cloudData = await cloudRes.json();
      if (!cloudRes.ok) {
        console.error('[Avatar API] Cloudinary error:', cloudData);
        return NextResponse.json({ error: 'Зураг upload хийхэд алдаа гарлаа' }, { status: 500 });
      }
      imageUrl = cloudData.secure_url;
    } else {
      return NextResponse.json({ error: 'Cloudinary credentials not configured' }, { status: 500 });
    }

    // 4. Update user imageUrl in MongoDB
    const users = await getCollection('users');
    await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { imageUrl, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true, imageUrl });

  } catch (error) {
    console.error('[Avatar API] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
