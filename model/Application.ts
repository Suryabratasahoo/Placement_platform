import mongoose, { Schema } from 'mongoose';

const applicationStageSchema = new Schema({
    phaseNumber: { type: Number, required: true },
    roundName: { type: String, required: true },
    roundDescription: { type: String },
    roundDate: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Passed', 'Failed'], 
        default: 'Pending' 
    }
});

const applicationSchema = new Schema({
    userId: { 
        type: String, 
        required: true 
    },
    driveId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Drive', 
        required: true 
    },
    appliedDate: { 
        type: Date, 
        default: Date.now 
    },
    stages: [applicationStageSchema],
    currentStage: {
        type: applicationStageSchema,
        required: false
    }
}, { timestamps: true });

if (mongoose.models.Application) {
    delete mongoose.models.Application;
}

export const Application = mongoose.model('Application', applicationSchema);
