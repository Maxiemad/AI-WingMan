const User = require('../models/User')

class UserRepository {
    async create(userData) {
        const user = new User(userData)
        return user.save()
    }

    async findByEmail(email) {
        return User.findOne({ email })
    }

    async findById(id) {
        return User.findById(id)
    }

    async updateProfile(id, updates) {
        return User.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
    }

    async getAllUsers() {
        return User.find({}).select('-password')
    }
}

module.exports = new UserRepository()
