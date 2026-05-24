// /lib/models/Experience.ts

import mongoose, { Schema, model, models } from 'mongoose';

export interface IExperience {
    company: string;
    role: string;
    difficulty: string;
    rounds: number;
    content: string;
    authorName: string;
    authorId: string;
    helpfulVotes: string[];
    createdAt: Date;
}

const ExperienceSchema = new Schema<IExperience>({
    company: { type: String, required: true, uppercase: true },
    role: { type: String, required: true },
    difficulty: { type: String, required: true },
    rounds: { type: Number, required: true },
    content: { type: String, required: true },
    authorName: { type: String, required: true },
    authorId: { type: String, required: true },
    helpfulVotes: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

const Experience = models.Experience || model<IExperience>('Experience', ExperienceSchema);

export default Experience;