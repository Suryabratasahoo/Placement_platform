// app/api/experiences/route.ts

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Experience from '@/lib/models/Experience';

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        
        // Ensure all required fields are present
        const { company, role, difficulty, rounds, content, authorName, authorId } = body;
        
        if (!company || !role || !difficulty || !rounds || !content || !authorName || !authorId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newExperience = await Experience.create({
            company,
            role,
            difficulty,
            rounds: Number(rounds),
            content,
            authorName,
            authorId,
            helpfulVotes: []
        });

        return NextResponse.json({ success: true, data: newExperience }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating experience:", error);
        return NextResponse.json({ error: error.message || 'Failed to create experience' }, { status: 500 });
    }
}

export async function GET() {
    try {
        // Fetch all experiences, sorted by newest first
        const experiences = await Experience.find({}).sort({ createdAt: -1 });
        
        return NextResponse.json({ success: true, data: experiences }, { status: 200 });
    } catch (error) {
        console.error("Error fetching experiences feed:", error);
        return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
    }
}