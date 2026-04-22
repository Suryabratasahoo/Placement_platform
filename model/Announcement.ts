import mongoose, { Schema } from 'mongoose';

const announcementSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['Drive Update', 'General Event'],
        required: true
    },
    isUrgent: {
        type: Boolean,
        default: false
    },
    readCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

if (mongoose.models.Announcement) {
    delete mongoose.models.Announcement;
}

export const Announcement = mongoose.model('Announcement', announcementSchema);
