import { NextResponse } from 'next/server';

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

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Data = buffer.toString('base64');
        
        // Create a data URL with the file's MIME type
        const dataUrl = `data:${file.type};base64,${base64Data}`;
        
        // Return the data URL that can be stored in the database
        return NextResponse.json({ 
            url: dataUrl
        });
    } catch (error) {
        console.error('Error processing file:', error);
        return NextResponse.json(
            { error: 'Error processing file' },
            { status: 500 }
        );
    }
} 