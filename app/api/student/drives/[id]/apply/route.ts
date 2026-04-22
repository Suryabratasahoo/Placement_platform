import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Drive } from "@/model/Drive";
import { Application } from "@/model/Application";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await context.params;
        const body = await req.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ message: "Missing userId" }, { status: 400 });
        }

        const drive = await Drive.findById(id);
        if (!drive) {
            return NextResponse.json({ message: "Drive not found" }, { status: 404 });
        }

        // 1. Verify user hasn't already applied
        if (drive.applicants && drive.applicants.includes(userId)) {
            return NextResponse.json({ message: "You have already applied to this drive" }, { status: 409 });
        }

        // 2. Clone the rounds array into the application stages
        const stages = (drive.rounds || []).map((round: any) => ({
            phaseNumber: round.phaseNumber,
            roundName: round.roundName,
            roundDescription: round.roundDescription,
            roundDate: round.roundDate,
            status: 'Pending'
        }));

        // 3. Extract phaseNumber: 1 as the currentStage
        const phaseOne = stages.find((s: any) => s.phaseNumber === 1);

        // 4. Create the new Application record
        const newApplication = new Application({
            userId,
            driveId: id,
            stages: stages,
            currentStage: phaseOne || null
        });

        await newApplication.save();

        // 5. Append userId to Drive's applicants array
        if (!drive.applicants) drive.applicants = [];
        drive.applicants.push(userId);
        await drive.save();

        return NextResponse.json(newApplication, { status: 201 });
    } catch (error: any) {
        console.error("Error applying to drive:", error);
        return NextResponse.json({ message: "Internal server error applying to drive" }, { status: 500 });
    }
}
