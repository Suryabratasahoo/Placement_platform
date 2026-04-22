import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./lib/mongodb";
import { Experience } from "./model/Experience";
import mongoose from "mongoose";

async function mock() {
    await connectDB();
    await Experience.create({
        authorName: "Rakesh Sharma",
        universityId: "12345",
        company: "Google",
        role: "SDE Intern",
        content: "The Google interview process consisted of 3 rounds. The first round was a generic OA focusing on Graphs and DP. The second round was heavily algorithmic focusing on Tree Traversals. Overall, ensure you master Leetcode medium/hard problems.\n\nGood luck!",
        status: "pending",
        type: "Internship"
    });
    
    await Experience.create({
        authorName: "Ananya Patel",
        universityId: "87654",
        company: "Microsoft",
        role: "SWE",
        content: "My Microsoft experience was very focused on System Design. Make sure your OOPS concepts are strong. They asked me to design a parking lot and scale it.",
        status: "pending",
        type: "Interview"
    });

    console.log("Mock experiences deployed!");
    mongoose.connection.close();
}

mock();
