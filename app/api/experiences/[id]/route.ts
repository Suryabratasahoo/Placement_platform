// app/api/experiences/[id]/route.ts

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Experience from '@/lib/models/Experience';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const urlParams = await params;
        
        // Safety check: Prevent CastError if the ID format is wrong
        if (!mongoose.Types.ObjectId.isValid(urlParams.id)) {
            return NextResponse.json({ error: 'Invalid Experience ID format' }, { status: 400 });
        }

        await connectDB();
        
        const experience = await Experience.findById(urlParams.id);
        
        if (!experience) {
            return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: experience }, { status: 200 });
    } catch (error) {
        console.error("Error fetching experience:", error);
        return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 });
    }
}