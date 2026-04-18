const cron = require('node-cron')
const opportunityService = require('../services/opportunityService')
const logger = require('../utils/logger')

class OpportunityCron {
    constructor() {
        this.jobs = []
    }

    start() {
        const cleanupJob = cron.schedule('0 */6 * * *', async () => {
            logger.info('Running expired opportunity cleanup')
            try {
                await opportunityService.cleanupExpired()
            } catch (err) {
                logger.error('Cleanup job failed', { error: err.message })
            }
        })

        const deadlineCheckJob = cron.schedule('0 9 * * *', async () => {
            logger.info('Checking upcoming deadlines')
            try {
                const upcoming = await opportunityService.getUpcomingDeadlines(3)
                if (upcoming.length > 0) {
                    logger.info(`Found ${upcoming.length} opportunities with deadlines in next 3 days`)
                }
            } catch (err) {
                logger.error('Deadline check failed', { error: err.message })
            }
        })

        this.jobs.push(cleanupJob, deadlineCheckJob)
        logger.info('Background workers started')
    }

    stop() {
        this.jobs.forEach(job => job.stop())
        logger.info('Background workers stopped')
    }
}

module.exports = new OpportunityCron()
