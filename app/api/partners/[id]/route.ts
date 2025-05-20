import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import { Partner } from '@/app/models/Partner';

// Common headers for CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// GET /api/partners/[id] - Get a single partner
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const partner = await Partner.findById(params.id);

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
    console.error('Error fetching partner:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

// PATCH /api/partners/[id] - Update a partner
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();

    const partner = await Partner.findByIdAndUpdate(
      params.id,
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

// DELETE /api/partners/[id] - Delete a partner
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const partner = await Partner.findByIdAndDelete(params.id);

    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { 
          status: 404,
          headers: corsHeaders
        }
      );
    }

    return NextResponse.json(
      { message: 'Partner deleted successfully' },
      {
        headers: corsHeaders
      }
    );
  } catch (error) {
    console.error('Error deleting partner:', error);
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