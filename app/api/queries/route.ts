// app/api/queries/route.ts

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Query from '@/lib/models/Query';

export async function GET() {
    try {
        await connectDB();
        const queries = await Query.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: queries }, { status: 200 });
    } catch (error) {
        console.error("Error fetching queries:", error);
        return NextResponse.json({ success: false, error: 'Failed to fetch queries' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const newQuery = await Query.create(body);
        return NextResponse.json({ success: true, data: newQuery }, { status: 201 });
    } catch (error) {
        console.error("Error creating query:", error);
        return NextResponse.json({ success: false, error: 'Failed to create query' }, { status: 500 });
    }
}