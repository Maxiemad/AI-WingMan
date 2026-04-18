const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    opportunityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Opportunity',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'submitted', 'accepted', 'rejected'],
        default: 'pending'
    },
    coverLetter: {
        type: String,
        default: ''
    },
    emailDraft: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

applicationSchema.index({ userId: 1, opportunityId: 1 }, { unique: true })

module.exports = mongoose.model('Application', applicationSchema)
