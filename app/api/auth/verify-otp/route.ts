import { NextResponse } from "next/server";
import redis, { connectRedis } from "@/lib/redis";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectRedis();

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

    // Optional: issue temporary signup token
    const signupToken = jwt.sign(
      { email, otpVerified: true },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    return NextResponse.json({
      message: "OTP verified successfully",
      signupToken
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}