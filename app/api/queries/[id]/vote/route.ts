// app/api/queries/[id]/vote/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Query from '@/lib/models/Query';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const urlParams = await params;
        await connectDB();
        const { answerId, userId, action } = await request.json();

        // 1. Find the document to check current status
        const query = await Query.findById(urlParams.id);
        if (!query) return NextResponse.json({ error: 'Query not found' }, { status: 404 });

        // 2. Find the specific answer
        const answer = query.answers.find((a: any) => a._id && a._id.toString() === answerId);
        if (!answer) return NextResponse.json({ error: 'Answer not found' }, { status: 404 });

        // 3. Check existing votes securely
        const hasLiked = answer.likes?.includes(userId) || false;
        const hasDisliked = answer.dislikes?.includes(userId) || false;

        let updateOperation = {};

        // 4. Construct native MongoDB operations
        if (action === 'like') {
            if (hasLiked) {
                // Toggle off: remove from likes
                updateOperation = { $pull: { "answers.$.likes": userId } };
            } else {
                // Toggle on: add to likes, rip out of dislikes
                updateOperation = {
                    $addToSet: { "answers.$.likes": userId },
                    $pull: { "answers.$.dislikes": userId }
                };
            }
        } else if (action === 'dislike') {
            if (hasDisliked) {
                // Toggle off: remove from dislikes
                updateOperation = { $pull: { "answers.$.dislikes": userId } };
            } else {
                // Toggle on: add to dislikes, rip out of likes
                updateOperation = {
                    $addToSet: { "answers.$.dislikes": userId },
                    $pull: { "answers.$.likes": userId }
                };
            }
        }

        // 5. Fire the atomic update directly to the database
        const updatedQuery = await Query.findOneAndUpdate(
            { _id: urlParams.id, "answers._id": answerId },
            updateOperation,
            { returnDocument: 'after' } // Returns the fresh data after the update
        );

        return NextResponse.json({ success: true, data: updatedQuery }, { status: 200 });

    } catch (error) {
        console.error("Vote error:", error);
        return NextResponse.json({ error: 'Failed to register vote' }, { status: 500 });
    }
}