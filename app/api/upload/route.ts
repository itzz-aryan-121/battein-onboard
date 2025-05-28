import { NextResponse } from 'next/server';
import cloudinary from '@/app/lib/cloudinary';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const uploadResult = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { resource_type: 'auto' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        return NextResponse.json({ url: uploadResult.secure_url });
    } catch (error) {
        console.error('Error processing file:', error);
        return NextResponse.json(
            { error: 'Error processing file' },
            { status: 500 }
        );
    }
}

// DELETE endpoint to remove old images
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const imageUrl = searchParams.get('url');
        
        if (!imageUrl) {
            return NextResponse.json(
                { error: 'Image URL is required' },
                { status: 400 }
            );
        }

        // Extract public_id from Cloudinary URL
        const publicId = extractPublicIdFromUrl(imageUrl);
        
        if (!publicId) {
            return NextResponse.json(
                { error: 'Invalid Cloudinary URL' },
                { status: 400 }
            );
        }

        // Delete from Cloudinary
        const deleteResult = await cloudinary.uploader.destroy(publicId);
        
        if (deleteResult.result === 'ok') {
            return NextResponse.json({ 
                message: 'Image deleted successfully',
                result: deleteResult 
            });
        } else {
            return NextResponse.json(
                { error: 'Failed to delete image', result: deleteResult },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        return NextResponse.json(
            { error: 'Error deleting image' },
            { status: 500 }
        );
    }
}

// Helper function to extract public_id from Cloudinary URL
function extractPublicIdFromUrl(url: string): string | null {
    try {
        // Cloudinary URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/public_id.jpg
        const urlParts = url.split('/');
        const uploadIndex = urlParts.findIndex(part => part === 'upload');
        
        if (uploadIndex === -1 || uploadIndex + 2 >= urlParts.length) {
            return null;
        }
        
        // Get the part after 'upload/v1234567890/' which is the public_id with extension
        const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join('/');
        
        // Remove file extension
        const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, '');
        
        return publicId;
    } catch (error) {
        console.error('Error extracting public_id:', error);
        return null;
    }
} 