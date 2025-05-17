import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import { Partner } from '@/app/models/Partner';

// GET /api/partners/counts - Get counts of partners by status
export async function GET(request: NextRequest) {
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