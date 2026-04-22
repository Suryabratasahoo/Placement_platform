import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Drive } from "@/model/Drive";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        // Fetch all drives explicitly sorted chronologically by newest
        const drives = await Drive.find().sort({ createdAt: -1 });
        return NextResponse.json(drives, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // In a production app, verify the admin JWT token here.
        const body = await req.json();

        const { companyName, role, cgpa, ctc, placementType, lastDate, jdUrl, jdFileName, rounds, instructions, eligibleBranches, portalLink } = body;

        // Validate essential payload details
        if (!companyName || !role || !cgpa || !ctc || !placementType || !lastDate) {
            return NextResponse.json({ message: "Missing essential drive fields" }, { status: 400 });
        }

        if (!rounds || !Array.isArray(rounds) || rounds.length === 0) {
            return NextResponse.json({ message: "At least one recruitment phase must be provided." }, { status: 400 });
        }

        // Create new drive entry in MongoDB
        const newDrive = await Drive.create({
            companyName,
            role,
            eligibleBranches: Array.isArray(eligibleBranches) ? eligibleBranches : [],
            portalLink: portalLink || null,
            cgpa: Number(cgpa),
            ctc,
            placementType,
            lastDate,
            jdUrl,
            jdFileName,
            rounds,
            instructions: Array.isArray(instructions) ? instructions : []
        });

        return NextResponse.json({
            message: "Drive posted successfully",
            drive: newDrive
        }, { status: 201 });

    } catch (error: any) {
        console.error("Drive Creation Error:", error);
        return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
    }
}
