const Opportunity = require('../models/Opportunity')

class OpportunityRepository {
    async create(data) {
        const opp = new Opportunity(data)
        return opp.save()
    }

    async createMany(dataArray) {
        return Opportunity.insertMany(dataArray, { ordered: false })
    }

    async findAll(filters = {}) {
        let query = Opportunity.find({ isActive: true })

        if (filters.type) {
            query = query.where('type').equals(filters.type)
        }

        if (filters.tags && filters.tags.length > 0) {
            query = query.where('tags').in(filters.tags)
        }

        if (filters.deadlineAfter) {
            query = query.where('deadline').gte(filters.deadlineAfter)
        }

        return query.sort({ deadline: 1 }).exec()
    }

    async findById(id) {
        return Opportunity.findById(id)
    }

    async findByDeadlineRange(startDate, endDate) {
        return Opportunity.find({
            isActive: true,
            deadline: { $gte: startDate, $lte: endDate }
        }).sort({ deadline: 1 })
    }

    async markExpired() {
        const now = new Date()
        return Opportunity.updateMany(
            { deadline: { $lt: now }, isActive: true },
            { isActive: false }
        )
    }

    async count() {
        return Opportunity.countDocuments({ isActive: true })
    }
}

module.exports = new OpportunityRepository()
