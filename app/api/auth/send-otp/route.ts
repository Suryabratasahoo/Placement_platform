import { NextResponse } from "next/server";
import redis, { connectRedis } from "@/lib/redis";
import { sendEmail } from "@/lib/mail"


export async function POST(req: Request) {
    try {

        await connectRedis();
        const { email } = await req.json()
        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 })
        }



        // Rate limiting: Allow max 5 OTP requests per hour
        const attempts = await redis.incr(`otp_attempt:${email}`);
        if (attempts === 1) {
            await redis.expire(`otp_attempt:${email}`, 300);
        }
        if (attempts > 5) {
            return NextResponse.json(
                { message: "Too many requests. Try later." },
                { status: 429 }
            );
        }

        // generate otp
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        // Store OTP in Redis with 5 mins expiry
        await redis.set(`otp:${email}`, otp, { EX: 300 })
        await sendEmail(email, otp);

        return NextResponse.json({ message: "OTP sent successfully" })



    }catch(error){
        console.error("Error sending OTP:", error);
        return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 })
    }
}

