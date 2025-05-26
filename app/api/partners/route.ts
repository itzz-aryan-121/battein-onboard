import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import { Partner } from '@/app/models/Partner';

// Common headers for CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// GET /api/partners - Get all partners with pagination
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || 'all';

    const skip = (page - 1) * limit;
    const query = status !== 'all' ? { status } : {};

    const [partners, total] = await Promise.all([
      Partner.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Partner.countDocuments(query)
    ]);

    return NextResponse.json({
      partners,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }, {
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

// POST /api/partners - Create new partner application or update existing one
export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();

    // Check if a partner with the same phone number already exists
    const existing = await Partner.findOne({ phoneNumber: data.phoneNumber });
    
    if (existing) {
      // Update existing partner instead of throwing an error
      const updatedPartner = await Partner.findByIdAndUpdate(
        existing._id,
        { ...data, status: 'Pending' }, // Reset status to Pending for re-review
        { new: true, runValidators: true }
      );
      
      return NextResponse.json({
        ...updatedPartner.toObject(),
        message: 'Partner information updated successfully'
      }, {
        headers: corsHeaders
      });
    }

    // Create new partner if doesn't exist
    const partner = await Partner.create({
      ...data,
      status: 'Pending'
    });

    return NextResponse.json(partner, {
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Error creating/updating partner:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: corsHeaders
      }
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
        { 
          status: 400,
          headers: corsHeaders
        }
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
        { 
          status: 404,
          headers: corsHeaders
        }
      );
    }

    return NextResponse.json(partner, {
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Error updating partner:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

// OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: corsHeaders
  });
} 