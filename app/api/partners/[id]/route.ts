import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import { Partner } from '@/app/models/Partner';

// Common headers for CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

// Helper to extract the ID from the URL
function getIdFromUrl(request: Request): string | null {
  const url = new URL(request.url);
  const parts = url.pathname.split('/');
  return parts[parts.length - 1] || null;
}

// Handle OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET /api/partners/[id]
export async function GET(request: Request) {
  try {
    await connectDB();
    const id = getIdFromUrl(request);
    if (!id) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400, headers: corsHeaders });
    }

    const partner = await Partner.findById(id);
    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json(partner, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching partner:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
  }
}

// PATCH /api/partners/[id]
export async function PATCH(request: Request) {
  try {
    await connectDB();
    const id = getIdFromUrl(request);
    if (!id) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400, headers: corsHeaders });
    }

    const data = await request.json();

    const partner = await Partner.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json(partner, { headers: corsHeaders });
  } catch (error) {
    console.error('Error updating partner:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
  }
}

// DELETE /api/partners/[id]
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const id = getIdFromUrl(request);
    if (!id) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400, headers: corsHeaders });
    }

    const partner = await Partner.findByIdAndDelete(id);
    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({ message: 'Partner deleted successfully' }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error deleting partner:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
  }
}

// PUT /api/partners/[id]/profile-pic
export async function PUT(request: Request) {
  try {
    await connectDB();
    const id = getIdFromUrl(request);
    if (!id) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400, headers: corsHeaders });
    }

    const body = await request.json();
    const { profilePicture } = body;

    if (!profilePicture || typeof profilePicture !== 'string') {
      return NextResponse.json({ error: 'Profile picture is required' }, { status: 400, headers: corsHeaders });
    }

    const updatedPartner = await Partner.findByIdAndUpdate(
      id,
      { profilePicture },
      { new: true, runValidators: true }
    );

    if (!updatedPartner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({ message: 'Profile picture updated successfully', partner: updatedPartner }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
  }
}
