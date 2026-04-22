import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Announcement } from "@/model/Announcement";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        // Fetch all announcements sorted by newest first
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        return NextResponse.json(announcements, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
