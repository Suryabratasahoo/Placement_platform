import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Question } from "@/model/Question";
import { Answer } from "@/model/Answer";

// GET a single question by ID & its answers
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const {id}= await context.params;
        const question = await Question.findById(id).lean();

        if (!question) {
            return NextResponse.json({ message: "Question not found" }, { status: 404 });
        }

        // Fetch new schema answers
        const answers = await Answer.find({ questionId: id }).sort({ createdAt: 1 }).lean();
        
        // Filter out ObjectIds from question.answers to only keep legacy embedded objects
        const legacyAnswers = (question.answers || []).filter((ans: any) => typeof ans === 'object' && ans.authorName);

        // Merge old legacy embedded answers with new schema answers for backward compatibility
        const mergedAnswers = [...legacyAnswers, ...answers];
        const finalQuestion = { ...question, answers: mergedAnswers };

        return NextResponse.json(finalQuestion, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Internal server error fetching question" }, { status: 500 });
    }
}

// POST an answer to a question (using New Schema)
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await context.params;
        const body = await req.json();
        const { userId, authorName, universityId, content, isSenior } = body;
        console.log(body);

        if (!userId || !authorName || !universityId || !content) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const question = await Question.findById(id);
        if (!question) {
            return NextResponse.json({ message: "Question not found" }, { status: 404 });
        }
        console.log("Question found:", question);

        // Rule: Creator cannot reply to their own question
        if (question.author.toString() === userId) {
            return NextResponse.json({ message: "You cannot answer your own question" }, { status: 403 });
        }

        const newAnswer = new Answer({
            questionId: id,
            userId,
            authorName,
            universityId,
            content,
            isSenior: isSenior || false,
        });

        await newAnswer.save();

        // Push ObjectId reference into the question's mixed array
        question.answers.push(newAnswer._id);
        console.log("New answer added to question:", newAnswer);
        console.log("Updated question answers array:", question.answers);
        await question.save();
        console.log("Updated question:", question);

        return NextResponse.json(newAnswer, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error adding answer" }, { status: 500 });
    }
}

// PATCH to update title and description (Author only)
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await context.params;
        const body = await req.json();
        const { title, description, userId } = body;

        const question = await Question.findById(id);
        if (!question) return NextResponse.json({ message: "Not found" }, { status: 404 });

        // Authorization: Check if author matches
        if (question.author.toString() !== userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        if (title) question.title = title;
        if (description) question.description = description;
        await question.save();

        return NextResponse.json(question, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error updating" }, { status: 500 });
    }
}

// DELETE a question (Author only)
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await context.params;
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        const question = await Question.findById(id);
        if (!question) return NextResponse.json({ message: "Not found" }, { status: 404 });

        // Authorization
        if (question.author.toString() !== userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        // Cascade delete: remove all associated answers
        await Answer.deleteMany({ questionId: id });

        await Question.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error deleting" }, { status: 500 });
    }
}
