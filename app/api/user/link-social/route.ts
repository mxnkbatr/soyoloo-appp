import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

/**
 * POST /api/user/link-social
 * Links a Google or Facebook account to the currently logged-in user.
 * Body: { provider: 'google' | 'facebook', clerkToken: string }
 */
export async function POST(request: Request) {
  try {
    // Authenticate current user from JWT cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.sub as string;
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { provider, clerkToken, access_token } = await request.json();
    const tokenToVerify = access_token || clerkToken;
    if (!provider || !tokenToVerify) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (provider !== 'google' && provider !== 'facebook') {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
    }

    let externalId = '';
    let email = '';

    if (provider === 'google') {
      const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenToVerify}` },
      });
      if (!googleRes.ok) return NextResponse.json({ error: 'Invalid Google token' }, { status: 401 });
      const googleUser = await googleRes.json();
      externalId = googleUser.sub;
      email = googleUser.email;
    } else {
      return NextResponse.json({ error: 'Facebook linking not implemented yet' }, { status: 501 });
    }

    // Update user document with social link
    const usersCollection = await getCollection('users');
    const updateField = provider === 'google' ? 'googleId' : 'facebookId';

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          [updateField]: externalId,
          ...(email && { [`${provider}Email`]: email }),
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: `${provider === 'google' ? 'Google' : 'Facebook'} амжилттай холбогдлоо`,
      email,
    });
  } catch (error) {
    console.error('Link social error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * DELETE /api/user/link-social
 * Unlinks a Google or Facebook account from the current user.
 * Body: { provider: 'google' | 'facebook' }
 */
export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.sub as string;
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { provider } = await request.json();
    if (provider !== 'google' && provider !== 'facebook') {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
    }

    const idField = provider === 'google' ? 'googleId' : 'facebookId';
    const emailField = provider === 'google' ? 'googleEmail' : 'facebookEmail';

    const usersCollection = await getCollection('users');
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $unset: { [idField]: '', [emailField]: '' }, $set: { updatedAt: new Date() } }
    );

    return NextResponse.json({
      success: true,
      message: `${provider === 'google' ? 'Google' : 'Facebook'} холболт амжилттай салгагдлаа`,
    });
  } catch (error) {
    console.error('Unlink social error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * GET /api/user/link-social
 * Returns the currently logged-in user's linked social accounts.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.sub as string;

    const usersCollection = await getCollection('users');
    const user = await usersCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { googleId: 1, facebookId: 1, googleEmail: 1, facebookEmail: 1 } }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      google: user.googleId ? { linked: true, email: user.googleEmail } : { linked: false },
      facebook: user.facebookId ? { linked: true, email: user.facebookEmail } : { linked: false },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
