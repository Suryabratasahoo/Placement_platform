import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Experience } from "@/model/Experience";

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const body = await req.json();
        const { id } = await context.params;

        const { status } = body;

        // Validation envelope
        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ message: "Invalid status state requested" }, { status: 400 });
        }

        const reviewedExp = await Experience.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!reviewedExp) {
            return NextResponse.json({ message: "Experience lookup failed" }, { status: 404 });
        }

        return NextResponse.json(reviewedExp, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: "Server error executing review state." }, { status: 500 });
    }
}
