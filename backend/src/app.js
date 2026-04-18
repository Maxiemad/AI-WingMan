require('dotenv').config()
const express = require('express')
const cors = require('cors')
const database = require('./utils/database')
const logger = require('./utils/logger')
const opportunityCron = require('./workers/opportunityCron')

const authRoutes = require('./routes/authRoutes')
const opportunityRoutes = require('./routes/opportunityRoutes')
const applicationRoutes = require('./routes/applicationRoutes')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`)
    next()
})

app.get('/api/health', (req, res) => {
    res.json({ status: 'running', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/opportunities', opportunityRoutes)
app.use('/api/applications', applicationRoutes)

app.use((err, req, res, next) => {
    logger.error('Unhandled error', { error: err.message, stack: err.stack })
    res.status(500).json({ error: 'Something went wrong' })
})

async function startServer() {
    await database.connect(process.env.MONGO_URI)
    opportunityCron.start()
    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`)
    })
}

startServer()

module.exports = app
