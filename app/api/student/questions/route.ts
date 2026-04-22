// app/api/student/questions/route.ts

import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Question } from "@/model/Question";

// GET all questions
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        
        // Fetch all questions, newest first
        const questions = await Question.find().sort({ createdAt: -1 });

        return NextResponse.json(questions, { status: 200 });
    } catch (error: any) {
        console.error("GET Questions Error:", error);
        return NextResponse.json({ 
            message: "Internal server error fetching questions",
            error: error.message 
        }, { status: 500 });
    }
}

// POST a new question
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        
        const { title, description, tags, author, universityId } = body;

        if (!title || !description || !author || !universityId) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const newQuestion = new Question({
            title,
            description,
            tags: tags || [],
            author, // Assuming this is the User ObjectId
            universityId,
            type: 'question'
        });

        await newQuestion.save();

        return NextResponse.json(newQuestion, { status: 201 });
    } catch (error: any) {
        console.error("POST Question Error:", error);
        return NextResponse.json({ message: "Error creating question", error: error.message }, { status: 500 });
    }
}
