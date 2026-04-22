"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Experience = void 0;
var mongoose_1 = require("mongoose");
var experienceSchema = new mongoose_1.Schema({
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
if (mongoose_1.default.models.Experience) {
    delete mongoose_1.default.models.Experience;
}
exports.Experience = mongoose_1.default.model('Experience', experienceSchema);
