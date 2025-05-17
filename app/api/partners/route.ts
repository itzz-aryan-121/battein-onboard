import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import { Partner } from '@/app/models/Partner';


// GET /api/partners - Get all partners (with filters)
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // No filtering, just return all partners with pagination
    const skip = (page - 1) * limit;
    const partners = await Partner.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Partner.countDocuments({});

    return NextResponse.json({
      partners,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/partners - Create new partner application
export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();

    // Create new partner (no applicationStatus)
    const partner = await Partner.create({
      ...data
    });

    return NextResponse.json(partner);
  } catch (error) {
    console.error('Error creating partner:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/partners/:id - Update partner application
export async function PUT(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Partner ID is required' },
        { status: 400 }
      );
    }

    // Update partner
    const partner = await Partner.findByIdAndUpdate(
      id,
      { ...data },
      { new: true, runValidators: true }
    );

    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(partner);
  } catch (error) {
    console.error('Error updating partner:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/partners/counts - Get counts of partners by status
export async function GET_counts(request: Request) {
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