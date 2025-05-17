import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import { Partner } from '@/app/models/Partner';

export async function GET() {
  try {
    await connectDB();
    const pending = await Partner.countDocuments({ status: 'Pending' });
    const approved = await Partner.countDocuments({ status: 'Approved' });
    const rejected = await Partner.countDocuments({ status: 'Rejected' });
    return NextResponse.json({ pending, approved, rejected });
  } catch (error) {
    console.error('Error fetching partner counts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 