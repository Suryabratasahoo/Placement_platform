import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Query from '@/lib/models/Query';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const urlParams = await params;
        await connectDB();
        const query = await Query.findById(urlParams.id);
        if (!query) return NextResponse.json({ success: false, error: 'Query not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: query }, { status: 200 });
    } catch (error) {
        console.error("Error fetching query:", error);
        return NextResponse.json({ success: false, error: 'Failed to fetch query' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const urlParams = await params;
        await connectDB();
        const body = await request.json();
        
        const updatedQuery = await Query.findByIdAndUpdate(
            urlParams.id,
            { $push: { answers: body } },
            { new: true, runValidators: true }
        );

        if (!updatedQuery) {
            return NextResponse.json({ success: false, error: 'Query not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedQuery }, { status: 200 });
    } catch (error) {
        console.error("Error updating query:", error);
        return NextResponse.json({ success: false, error: 'Failed to update query' }, { status: 500 });
    }
}
