const Application = require('../models/Application')

class ApplicationRepository {
    async create(data) {
        const app = new Application(data)
        return app.save()
    }

    async findByUser(userId) {
        return Application.find({ userId })
            .populate('opportunityId')
            .sort({ createdAt: -1 })
    }

    async findByUserAndOpportunity(userId, opportunityId) {
        return Application.findOne({ userId, opportunityId })
    }

    async findById(id) {
        return Application.findById(id).populate('opportunityId')
    }

    async updateStatus(id, status) {
        return Application.findByIdAndUpdate(
            id,
            { status, updatedAt: new Date() },
            { new: true }
        )
    }

    async countByUser(userId) {
        return Application.countDocuments({ userId })
    }

    async getStatusBreakdown(userId) {
        return Application.aggregate([
            { $match: { userId: require('mongoose').Types.ObjectId.createFromHexString(userId) } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ])
    }
}

module.exports = new ApplicationRepository()
