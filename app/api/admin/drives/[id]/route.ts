import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Drive } from "@/model/Drive";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await context.params;
        const drive = await Drive.findById(id);

        if (!drive) {
            return NextResponse.json({ message: "Drive sequence missing" }, { status: 404 });
        }

        return NextResponse.json(drive, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Server parsing override failed" }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const body = await req.json();
        const { id } = await context.params;

        // Natively pull identically structured Payload constraints
        const { companyName, role, cgpa, ctc, placementType, status, lastDate, jdUrl, jdFileName, rounds, instructions, eligibleBranches, portalLink } = body;

        if (!companyName || !role || !cgpa || !ctc || !placementType || !lastDate) {
            return NextResponse.json({ message: "Missing essential drive fields" }, { status: 400 });
        }

        if (!rounds || !Array.isArray(rounds) || rounds.length === 0) {
            return NextResponse.json({ message: "Pipeline must retain sequential phases." }, { status: 400 });
        }

        // Apply strict explicit mapping without erasing applicant caches
        const updatedDrive = await Drive.findByIdAndUpdate(
            id,
            {
                companyName,
                role,
                eligibleBranches: Array.isArray(eligibleBranches) ? eligibleBranches : [],
                portalLink: portalLink || null,
                cgpa: Number(cgpa),
                ctc,
                placementType,
                status,
                lastDate,
                jdUrl,
                jdFileName,
                rounds,
                instructions: Array.isArray(instructions) ? instructions : []
            },
            { new: true, runValidators: true }
        );

        if (!updatedDrive) {
            return NextResponse.json({ message: "Error acquiring isolated DB Object" }, { status: 404 });
        }

        return NextResponse.json(updatedDrive, { status: 200 });

    } catch (error: any) {
        console.error("PUT Object Rewrite Error:", error);
        return NextResponse.json({ message: "Critical backend failure handling the PUT Stream." }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await context.params;

        const deletedDrive = await Drive.findByIdAndDelete(id);

        if (!deletedDrive) {
            return NextResponse.json({ message: "Drive sequence missing or already deleted" }, { status: 404 });
        }

        return NextResponse.json({ message: "Drive removed securely." }, { status: 200 });

    } catch (error: any) {
        console.error("DELETE Execution Error:", error);
        return NextResponse.json({ message: "Critical error severing the designated drive sequence." }, { status: 500 });
    }
}
