import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import { Admin } from '@/app/models/Admin';

const SETUP_KEY = process.env.SETUP_KEY || 'battein-setup-key';

export async function POST(request: Request) {
  try {
    const { setupKey, email, password, name } = await request.json();

    // Verify setup key
    if (setupKey !== SETUP_KEY) {
      return NextResponse.json(
        { error: 'Invalid setup key' },
        { status: 401 }
      );
    }

    await connectDB();

    // Check if any admin exists
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return NextResponse.json(
        { error: 'Admin already exists' },
        { status: 400 }
      );
    }

    // Create first admin
    const admin = await Admin.create({
      email,
      password,
      name,
      role: 'super_admin'
    });

    return NextResponse.json({
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 