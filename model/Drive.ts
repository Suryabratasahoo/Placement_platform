import mongoose, { Schema } from 'mongoose';

const driveSchema = new Schema({
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: [String],
        required: true
    },
    eligibleBranches: {
        type: [String],
        default: []
    },
    portalLink: {
        type: String,
        default: null
    },
    cgpa: {
        type: Number,
        required: true
    },
    ctc: {
        type: String,
        required: true
    },
    lastDate: {
        type: String,
        required: true
    },
    placementType: {
        type: String,
        enum: ['Dream', 'Superdream', 'Marquee'],
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Completed'],
        default: 'Active'
    },
    jdUrl: { type: String, default: null },
    jdFileName: { type: String, default: null },
    rounds: [{
        phaseNumber: { type: Number, required: true },
        roundName: { type: String, required: true },
        roundDescription: { type: String },
        roundDate: { type: Date, required: true }
    }],
    instructions: {
        type: [String],
        default: []
    },
    applicants: {
        type: [String],
        default: []
    }
}, { timestamps: true });

if (mongoose.models.Drive) {
    delete mongoose.models.Drive;
}

export const Drive = mongoose.model('Drive', driveSchema);
