const mongoose = require('mongoose')

let instance = null

class Database {
    constructor() {
        if (instance) return instance
        this.connection = null
        instance = this
    }

    async connect(uri) {
        if (this.connection) return this.connection

        try {
            this.connection = await mongoose.connect(uri)
            console.log(`MongoDB connected: ${this.connection.connection.host}`)
            return this.connection
        } catch (err) {
            console.error('Database connection failed:', err.message)
            process.exit(1)
        }
    }

    getConnection() {
        return this.connection
    }
}

module.exports = new Database()
