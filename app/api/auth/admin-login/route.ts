import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/model/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const DEFAULT_ADMIN_EMAIL = "suryabratasahoo882@gmail.com";
const DEFAULT_ADMIN_PASS = "SuRy@8249";

export async function POST(req: Request) {
    try {
        await connectDB();

        // Auto-seed admin if absolutely no admins exist
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            const hashedDefaultPassword = await bcrypt.hash(DEFAULT_ADMIN_PASS, 10);
            await Admin.create({
                email: DEFAULT_ADMIN_EMAIL,
                password: hashedDefaultPassword
            });
            console.log("Default admin seeded successfully.");
        }

        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }

        const admin = await Admin.findOne({ email: email.toLowerCase() });

        if (!admin) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // Issue 7-day token
        const token = jwt.sign(
            { userId: admin._id, role: admin.role },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        const response = NextResponse.json({
            message: "Admin authenticated successfully",
            user: {
                id: admin._id,
                email: admin.email,
                role: admin.role
            }
        });

        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
            path: "/",
        });

        return response;

    } catch (error) {
        console.error("Admin Login Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
