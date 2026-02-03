const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    name: String,
    location: String,
    avatar: String
  },
  preferences: { type: mongoose.Schema.Types.Mixed },
  progress: {
    level: { type: Number, default: 1 },
    points: { type: Number, default: 0 },
    completed_skills: [String],
    badges: [String],
    completed_safety_lessons: { type: Number, default: 0 }
  },
  saved_opportunities: [String],
  applications: [mongoose.Schema.Types.Mixed],
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', UserSchema)
