import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/app/lib/mongodb';
import { Admin } from '@/app/models/Admin';


export async function POST(request: Request) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('JWT_SECRET not properly configured');
      return NextResponse.json(
        { error: 'Server configuration error: JWT_SECRET not set' },
        { status: 500 }
      );
    }

    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await admin.comparePassword(password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: admin._id,
        email: admin.email,
        role: admin.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return NextResponse.json({
      message: 'Login successful',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    // Provide more specific error information
    const errorMessage = error instanceof Error 
      ? `${error.name}: ${error.message}` 
      : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
} 