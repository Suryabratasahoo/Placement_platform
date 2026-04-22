import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Announcement } from "@/model/Announcement";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        return NextResponse.json(announcements, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        const { title, message, type, isUrgent } = body;

        if (!title || !message || !type) {
            return NextResponse.json({ message: "Missing essential broadcast vectors" }, { status: 400 });
        }

        const newAnnouncement = await Announcement.create({
            title,
            message,
            type,
            isUrgent: Boolean(isUrgent),
            readCount: 0
        });

        return NextResponse.json({
            message: "Broadcast deployed successfully",
            announcement: newAnnouncement
        }, { status: 201 });

    } catch (error: any) {
        console.error("Broadcast Creation Error:", error);
        return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
    }
}
