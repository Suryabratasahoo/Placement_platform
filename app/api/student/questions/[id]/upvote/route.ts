import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Question } from "@/model/Question";

// POST to toggle upvote on a question
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await context.params;
        const body = await req.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ message: "Missing userId" }, { status: 400 });
        }

        const question = await Question.findById(id);
        if (!question) {
            return NextResponse.json({ message: "Question not found" }, { status: 404 });
        }

        // Initialize array for legacy questions that might not have it
        const upvotedByList = question.upvotedBy || [];
        const hasLiked = upvotedByList.includes(userId);

        if (hasLiked) {
            // Remove like
            question.upvotedBy = upvotedByList.filter((id: string) => id !== userId);
            question.upvotes = Math.max(0, question.upvotes - 1);
        } else {
            // Add like
            question.upvotedBy.push(userId);
            question.upvotes += 1;
        }

        await question.save();

        return NextResponse.json({ 
            upvotes: question.upvotes, 
            userHasLiked: !hasLiked 
        }, { status: 200 });

    } catch (error: any) {
        console.error("Upvote error:", error);
        return NextResponse.json({ message: "Error upvoting" }, { status: 500 });
    }
}
