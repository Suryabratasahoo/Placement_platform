import mongoose, { Schema } from 'mongoose';

const experienceSchema = new Schema({
    authorName: {
        type: String,
        required: true,
        trim: true
    },
    universityId: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    type: {
        type: String,
        enum: ['Interview', 'Internship', 'General'],
        default: 'Interview'
    }
}, { timestamps: true });

if (mongoose.models.Experience) {
    delete mongoose.models.Experience;
}

export const Experience = mongoose.model('Experience', experienceSchema);
