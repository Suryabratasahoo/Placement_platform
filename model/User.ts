import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // =========================
    // COMMON FIELDS
    // =========================
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["student", "senior"],
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    universityId: {
      type: String,
      required: true,
      trim: true,
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    // =========================
    // STUDENT FIELDS
    // =========================
    branch: {
      type: String,
      enum: ["CSE", "ECE", "MECH", "CIVIL", "AIML"],
    },

    yearOfStudy: {
      type: Number,
      min: 1,
      max: 5,
    },

    cgpa: {
      type: Number,
      min: 0,
      max: 10,
    },

    gradYear: {
      type: Number,
    },

    domain: {
      type: String,
      enum: ["sde", "data", "cloud", "core"],
    },

    receivedOffer: {
      type: Boolean,
      default: false,
    },

    companyName: {
      type: String,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    placementGoal: {
      type: String,
      enum: ["Dream", "Any", "Core"],
    },

    // =========================
    // SENIOR FIELDS
    // =========================
    currentCompany: {
      type: String,
      trim: true,
    },

    jobTitle: {
      type: String,
      trim: true,
    },

    linkedInUrl: {
      type: String,
      trim: true,
    },

    experienceText: {
      type: String,
    },

    reputation: {
      type: Number,
      default: 0,
    },

    badges: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export const User =
  mongoose.models.User || mongoose.model("User", userSchema);