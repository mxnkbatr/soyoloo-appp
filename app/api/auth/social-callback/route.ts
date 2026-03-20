import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

/**
 * POST /api/auth/social-callback
 * Called by sso-callback page after Clerk social OAuth.
 * Gets the Clerk token, verifies it with Clerk, upserts the user in MongoDB,
 * and issues our own JWT cookie.
 */
export async function POST(request: Request) {
  try {
    const { clerkToken } = await request.json();

    if (!clerkToken) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    // Verify the Clerk token by calling Clerk's userinfo endpoint
    const clerkRes = await fetch('https://api.clerk.com/v1/me', {
      headers: {
        Authorization: `Bearer ${clerkToken}`,
      },
    });

    if (!clerkRes.ok) {
      return NextResponse.json({ error: 'Invalid Clerk token' }, { status: 401 });
    }

    const clerkUser = await clerkRes.json();
    const clerkId = clerkUser.id as string;
    const email = clerkUser.email_addresses?.[0]?.email_address as string | undefined;
    const name = `${clerkUser.first_name || ''} ${clerkUser.last_name || ''}`.trim() || email || 'User';
    const image = clerkUser.image_url as string | undefined;

    const usersCollection = await getCollection('users');

    // Find existing user by clerkId first, then by email
    let user = await usersCollection.findOne({ clerkId });
    if (!user && email) {
      user = await usersCollection.findOne({ email });
    }

    if (user) {
      // Update clerkId and social info
      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            clerkId,
            ...(email && { email }),
            ...(image && !user.image && { image }),
            updatedAt: new Date(),
          },
        }
      );
    } else {
      // Create new user
      const newUser = {
        clerkId,
        name,
        email: email || '',
        phone: '',
        image,
        role: 'user' as const,
        status: 'available' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await usersCollection.insertOne(newUser);
      user = { ...newUser, _id: result.insertedId };
    }

    // Issue our own JWT
    const token = await new SignJWT({
      sub: user._id.toString(),
      phone: user.phone || '',
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        phone: user.phone || '',
        role: user.role,
        status: user.status,
        name: user.name || name,
        image: user.image || image,
        email: user.email || email,
      },
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Social callback error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
