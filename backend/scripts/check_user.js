require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/User')

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/viyastree'

async function checkUser() {
    await mongoose.connect(MONGO_URI)
    const user = await User.findOne({ email: 'kunal21kumargupta@gmail.com' })
    if (user) {
        console.log('User FOUND:', user.email, user.userId)
    } else {
        console.log('User NOT FOUND in database')
    }
    await mongoose.disconnect()
}

checkUser()
