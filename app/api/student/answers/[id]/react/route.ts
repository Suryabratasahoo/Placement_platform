import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Answer } from "@/model/Answer";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await context.params;
        const body = await req.json();
        const { userId, type } = body; // type is 'like' or 'dislike'

        if (!userId || !['like', 'dislike'].includes(type)) {
            return NextResponse.json({ message: "Invalid request parameters" }, { status: 400 });
        }

        const answer = await Answer.findById(id);
        if (!answer) {
            return NextResponse.json({ message: "Answer not found" }, { status: 404 });
        }

        const hasLiked = answer.likes.includes(userId);
        const hasDisliked = answer.dislikes.includes(userId);

        if (type === 'like') {
            if (hasLiked) {
                // Undo like
                // Explicitly asserting answer.likes as any[] to use filter, Mongoose handles saving
                answer.likes = answer.likes.filter((id: string) => id !== userId) as any;
            } else {
                // Like and remove dislike
                answer.likes.push(userId);
                answer.dislikes = answer.dislikes.filter((id: string) => id !== userId) as any;
            }
        } else if (type === 'dislike') {
            if (hasDisliked) {
                // Undo dislike
                answer.dislikes = answer.dislikes.filter((id: string) => id !== userId) as any;
            } else {
                // Dislike and remove like
                answer.dislikes.push(userId);
                answer.likes = answer.likes.filter((id: string) => id !== userId) as any;
            }
        }

        await answer.save();

        return NextResponse.json({ 
            likes: answer.likes.length, 
            dislikes: answer.dislikes.length,
            userHasLiked: answer.likes.includes(userId),
            userHasDisliked: answer.dislikes.includes(userId)
        }, { status: 200 });

    } catch (error: any) {
        console.error("Reaction Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
