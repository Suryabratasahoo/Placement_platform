import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/model/User";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectDB();
    console.log("Connected to DB");

    // 🔐 1. Get JWT from header
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // 🔐 2. Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }
    console.log("Decoded JWT:", decoded);

    if (!decoded.otpVerified) {
      return NextResponse.json(
        { message: "OTP verification required" },
        { status: 403 }
      );
    }

    const email = decoded.email;

    // 📦 3. Get payload
    const body = await req.json();
    const {
      role,
      fullName,
      universityId,

      branch,
      yearOfStudy,
      cgpa,
      gradYear,
      domain,
      receivedOffer,
      companyName,
      skills,
      placementGoal,

      currentCompany,
      jobTitle,
      linkedInUrl,
      experienceText,
    } = body;

    // 🚫 4. Prevent duplicate user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // 🧠 5. Role-based validation
    if (!role || !fullName || !universityId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (role === "student") {
      if (!branch || !yearOfStudy || !cgpa || !gradYear || !domain) {
        return NextResponse.json(
          { message: "Missing student fields" },
          { status: 400 }
        );
      }
    }

    if (role === "senior") {
      if (!currentCompany || !jobTitle) {
        return NextResponse.json(
          { message: "Missing senior fields" },
          { status: 400 }
        );
      }
    }

    // 🏗 6. Create user
    const newUser = await User.create({
      email,
      role,
      fullName,
      universityId,

      branch,
      yearOfStudy,
      cgpa,
      gradYear,
      domain,
      receivedOffer,
      companyName,
      skills,
      placementGoal,

      currentCompany,
      jobTitle,
      linkedInUrl,
      experienceText,

      profileCompleted: true,
    });

    // 🎟 7. Issue login token
    const loginToken = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      message: "Registration successful",
      token: loginToken,
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        fullName: newUser.fullName,
        universityId: newUser.universityId,
      },
    });

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}