// model/Question.ts

import mongoose, { Schema } from 'mongoose';

const questionSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    upvotes: {
        type: Number,
        default: 0
    },
    upvotedBy: {
        type: [String],
        default: []
    },
    type: {
        type: String,
        enum: ['question', 'guide', 'experience'],
        default: 'question'
    },
    answers: {
        type: [Schema.Types.Mixed],
        default: []
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    universityId: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Export the model using the stable Next.js pattern
export const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);
