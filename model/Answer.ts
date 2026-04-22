// model/Answer.ts

import mongoose, { Schema } from 'mongoose';

const answerSchema = new Schema({
    questionId: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    userId: {
        type: String, // Can store the Zustand string ID here. 
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    universityId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isSenior: {
        type: Boolean,
        default: false
    },
    likes: {
        type: [String], // Array of User IDs
        default: []
    },
    dislikes: {
        type: [String], // Array of User IDs
        default: []
    }
}, { timestamps: true });

export const Answer = mongoose.models.Answer || mongoose.model('Answer', answerSchema);
