const fs = require('fs')
const path = require('path')

class Logger {
    constructor() {
        this.logDir = path.join(__dirname, '../../logs')
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true })
        }
    }

    _timestamp() {
        return new Date().toISOString()
    }

    _write(level, message, meta = {}) {
        const entry = {
            timestamp: this._timestamp(),
            level,
            message,
            ...meta
        }

        const line = JSON.stringify(entry)
        const filename = `${new Date().toISOString().split('T')[0]}.log`
        fs.appendFileSync(path.join(this.logDir, filename), line + '\n')

        if (level === 'error') {
            console.error(`[${level.toUpperCase()}] ${message}`)
        } else {
            console.log(`[${level.toUpperCase()}] ${message}`)
        }
    }

    info(message, meta) {
        this._write('info', message, meta)
    }

    warn(message, meta) {
        this._write('warn', message, meta)
    }

    error(message, meta) {
        this._write('error', message, meta)
    }

    debug(message, meta) {
        this._write('debug', message, meta)
    }
}

module.exports = new Logger()
