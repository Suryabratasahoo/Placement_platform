import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Experience } from "@/model/Experience";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        
        // Fetch only experiences approved by the admin natively sorting newest first (Recent Feed)
        const approvedExperiences = await Experience.find({ status: 'approved' }).sort({ createdAt: -1 });

        return NextResponse.json(approvedExperiences, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Internal server error connecting to Student Experiences" }, { status: 500 });
    }
}
