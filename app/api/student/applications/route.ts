import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Application } from "@/model/Application";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ message: "userId required" }, { status: 400 });
        }

        // Fetch all student applications
        const applications = await Application.find({ userId }).lean();

        // === 1. Weekly Activity Calculation (Bar Chart) ===
        const today = new Date();
        const startOfWeek = new Date(today);
        const day = startOfWeek.getDay() || 7; // Convert Sun(0) to 7
        startOfWeek.setDate(today.getDate() - day + 1);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        // Filter applications strictly for this active week
        const thisWeekApps = applications.filter((app: any) => {
            const appDate = new Date(app.appliedDate);
            return appDate >= startOfWeek && appDate <= endOfWeek;
        });

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const counts = new Array(7).fill(0);

        thisWeekApps.forEach((app: any) => {
            const activeDate = new Date(app.appliedDate);
            let d = activeDate.getDay();
            let index = d === 0 ? 6 : d - 1; // JS getDay: Sun=0, Mon=1. Map to Mon=0, Sun=6.
            counts[index]++;
        });

        // Use the highest count as the ceiling for maximum height percentage
        const maxVal = Math.max(...counts, 1);
        const currentDayIndex = (today.getDay() === 0 ? 6 : today.getDay() - 1);

        const barData = days.map((dayText, index) => ({
            day: dayText,
            val: counts[index],
            percentage: (counts[index] / maxVal) * 100,
            active: index === currentDayIndex
        }));

        const thisWeekTotal = counts.reduce((a, b) => a + b, 0);

        // === 2. High Level Stats ===
        const totalApplied = applications.length;
        // Count shortlisted as anything that passed Phase 1 or is in a later phase natively
        const totalShortlisted = applications.filter((app: any) => {
            return (app.currentStage && app.currentStage.phaseNumber > 1) ||
                (app.currentStage && app.currentStage.status === "Passed");
        }).length;

        // === 3. Pipeline Health Calculation (Donut Chart) ===
        let pending = 0;
        let reject = 0;
        let interview = 0;
        let offer = 0;
        let oa = 0;

        applications.forEach((app: any) => {
            const cStatus = app.currentStage?.status || 'Pending';
            const phaseNum = app.currentStage?.phaseNumber || 1;

            if (cStatus === 'Rejected' || cStatus === 'Failed') reject++;
            else if (cStatus === 'Passed' && phaseNum >= 3) offer++;
            else if (cStatus === 'Pending' && phaseNum === 1) pending++;
            else if (phaseNum === 2) oa++;
            else interview++;
        });

        const totalForPie = Math.max(1, pending + reject + offer + oa + interview);

        const pieData = [
            { label: "PENDING", value: Math.round((pending / totalForPie) * 100), color: "#818cf8" },
            { label: "OA STAGE", value: Math.round((oa / totalForPie) * 100), color: "#fb923c" },
            { label: "INTERVIEW", value: Math.round((interview / totalForPie) * 100), color: "#93c5fd" },
            { label: "OFFER", value: Math.round((offer / totalForPie) * 100), color: "#facc15" },
            { label: "REJECTED", value: Math.round((reject / totalForPie) * 100), color: "#f472b6" },
        ];

        return NextResponse.json({
            barData,
            thisWeekTotal,
            stats: { totalApplied, totalShortlisted },
            pieData
        }, { status: 200 });

    } catch (error: any) {
        console.error("Aggregation Error: ", error);
        return NextResponse.json({ message: "Server error aggregating data" }, { status: 500 });
    }
}
