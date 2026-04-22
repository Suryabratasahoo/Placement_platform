import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Announcement } from "@/model/Announcement";

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const body = await req.json();
        const { id } = await context.params;

        const { title, message, type, isUrgent } = body;

        const updatedAnnouncement = await Announcement.findByIdAndUpdate(
            id,
            { title, message, type, isUrgent },
            { new: true, runValidators: true }
        );

        if (!updatedAnnouncement) {
            return NextResponse.json({ message: "Announcement not found" }, { status: 404 });
        }

        return NextResponse.json(updatedAnnouncement, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: "Server error updating override." }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await context.params;

        const deletedAnnouncement = await Announcement.findByIdAndDelete(id);

        if (!deletedAnnouncement) {
            return NextResponse.json({ message: "Announcement missing or already deleted" }, { status: 404 });
        }

        return NextResponse.json({ message: "Announcement removed securely." }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: "Critical error severing the designated DB node." }, { status: 500 });
    }
}
