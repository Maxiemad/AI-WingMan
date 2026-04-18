const mongoose = require('mongoose')

const opportunitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['hackathon', 'internship', 'grant', 'fellowship', 'competition', 'job', 'collaboration'],
        required: true
    },
    url: {
        type: String,
        default: ''
    },
    organization: {
        type: String,
        default: ''
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    deadline: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        default: 'Remote'
    },
    stipend: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

opportunitySchema.index({ tags: 1 })
opportunitySchema.index({ deadline: 1 })
opportunitySchema.index({ type: 1 })

module.exports = mongoose.model('Opportunity', opportunitySchema)
