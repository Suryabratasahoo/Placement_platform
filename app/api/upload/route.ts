import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// ✅ Configure Cloudinary once
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!
});

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        // ❌ No file
        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        // ❌ Only PDF allowed
        if (file.type !== "application/pdf") {
            return NextResponse.json(
                { error: "Only PDF files are allowed" },
                { status: 400 }
            );
        }

        // ❌ File too large (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: "File size exceeds 5MB limit" },
                { status: 400 }
            );
        }

        // ✅ Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // ✅ Upload to Cloudinary
        const uploadResult = await new Promise<any>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'raw', // best for PDFs
                    folder: 'placement_jds',
                    public_id: `jd_${Date.now()}`
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            stream.end(buffer);
        });

        // ✅ Return file URL + public_id (important for future delete)
        return NextResponse.json(
            {
                message: "File uploaded successfully",
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Upload Error:", error);

        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}