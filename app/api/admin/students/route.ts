import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/model/User";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const students = await User.find({ role: "student" }).sort({ createdAt: -1 });

        return NextResponse.json(students, { status: 200 });
    } catch (error: any) {
        console.error("Fetch Student Error:", error);
        return NextResponse.json({ message: "Failed to fetch student data." }, { status: 500 });
    }
}
