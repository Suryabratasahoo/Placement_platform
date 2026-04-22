// lib/models/Query.ts

import mongoose, { Schema, model, models } from 'mongoose';

export interface IQuery {
    title: string;
    description: string;
    tags: string[];
    author: string;
    upvotes: number;
    answers: {
        user: string;
        role: string;
        text: string;
        votes: number;
        createdAt: Date;
    }[];
    createdAt: Date;
}

const QuerySchema = new Schema<IQuery>({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    author: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    answers: [
        {
            user: { type: String, required: true },
            role: { type: String, required: true },
            text: { type: String, required: true },
            votes: { type: Number, default: 0 },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

const Query = models.Query || model<IQuery>('Query', QuerySchema);

export default Query;