require('dotenv').config()
const mongoose = require('mongoose')
const Course = require('../models/Course')

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/viyastree'

async function check() {
    await mongoose.connect(MONGO_URI)
    const count = await Course.countDocuments()
    console.log('Course count:', count)
    const courses = await Course.find({})
    console.log('First course:', courses[0]?.title)
    await mongoose.disconnect()
}

check()
