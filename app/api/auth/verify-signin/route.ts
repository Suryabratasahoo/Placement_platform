import { NextResponse } from "next/server";
import redis, { connectRedis } from "@/lib/redis";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/model/User";

export async function POST(req: Request) {
    try {
        await connectRedis();
        await connectDB();

        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json(
                { message: "Email and OTP required" },
                { status: 400 }
            );
        }

        const storedOtp = await redis.get(`otp:${email}`);

        if (!storedOtp) {
            return NextResponse.json(
                { message: "OTP expired" },
                { status: 400 }
            );
        }

        if (storedOtp !== otp) {
            return NextResponse.json(
                { message: "Invalid OTP" },
                { status: 400 }
            );
        }

        // OTP valid → delete from Redis
        await redis.del(`otp:${email}`);

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { message: "User not found. Please register first." },
                { status: 404 }
            );
        }

        // Issue 7-day login token
        const loginToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        return NextResponse.json({
            message: "Sign in successful",
            token: loginToken,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                fullName: user.fullName,
                universityId: user.universityId,
            }
        });

    } catch (error) {
        console.error("Verify Signin Error:", error);
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}
