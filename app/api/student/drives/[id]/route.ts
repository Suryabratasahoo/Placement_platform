import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Drive } from '@/model/Drive';

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await context.params;
        const drive = await Drive.findById(id);
        if (!drive) {
            return NextResponse.json({ message: "Drive not found" }, { status: 404 });
        }
        return NextResponse.json(drive, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
