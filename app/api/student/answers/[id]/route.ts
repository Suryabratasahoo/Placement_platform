import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Answer } from "@/model/Answer";
import { Question } from "@/model/Question";

// PATCH to update answer content (Author only)
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await context.params;
        const body = await req.json();
        const { content, userId } = body;

        if (!userId || !content) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        const answer = await Answer.findById(id);
        if (!answer) return NextResponse.json({ message: "Not found" }, { status: 404 });

        // Authorization: Check if author matches
        if (answer.userId !== userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        answer.content = content;
        await answer.save();

        return NextResponse.json(answer, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error updating answer" }, { status: 500 });
    }
}

// DELETE an answer (Author only)
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await context.params;
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
             return NextResponse.json({ message: "Missing userId" }, { status: 400 });
        }

        const answer = await Answer.findById(id);
        if (!answer) return NextResponse.json({ message: "Not found" }, { status: 404 });

        // Authorization
        if (answer.userId !== userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        // Clean up from the parent Question array
        if (answer.questionId) {
             await Question.findByIdAndUpdate(answer.questionId, {
                 $pull: { answers: answer._id }
             });
        }

        await Answer.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error deleting answer" }, { status: 500 });
    }
}
