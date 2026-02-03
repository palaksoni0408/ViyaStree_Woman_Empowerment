const mongoose = require('mongoose')

const Course = new mongoose.Schema({
  courseId: { type: String, unique: true },
  title: String,
  skill: String,
  level: String,
  provider: String,
  duration: Number,
  url: String,
  syllabus: [String],
  quiz: mongoose.Schema.Types.Mixed,
  estimatedCompletion: String
})

module.exports = mongoose.model('Course', Course)
