import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Experience } from "@/model/Experience";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        
        // Fetch queue and stats in parallel
        const [pendingExperiences, approvedCount, rejectedCount] = await Promise.all([
            Experience.find({ status: 'pending' }).sort({ createdAt: 1 }),
            Experience.countDocuments({ status: 'approved' }),
            Experience.countDocuments({ status: 'rejected' })
        ]);

        return NextResponse.json({
            pendings: pendingExperiences,
            stats: { approved: approvedCount, rejected: rejectedCount }
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: "Internal server error connecting to Queue" }, { status: 500 });
    }
}
