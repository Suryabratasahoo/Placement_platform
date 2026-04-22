import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Drive } from '@/model/Drive';

export async function GET() {
    try {
        await connectDB();
        // Students should only see 'Active' drives by default
        const drives = await Drive.find({ status: 'Active' }).sort({ createdAt: -1 });
        return NextResponse.json(drives, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Internal server error connecting to Drives" }, { status: 500 });
    }
}
