const mongoose = require('mongoose')

const Opportunity = new mongoose.Schema({
  opportunityId: { type: String, unique: true },
  title: String,
  organization: String,
  location: String,
  workType: String,
  requiredSkills: [String],
  experienceLevel: String,
  salary: mongoose.Schema.Types.Mixed,
  description: String,
  contactInfo: mongoose.Schema.Types.Mixed,
  postedDate: Date,
  isActive: { type: Boolean, default: true }
})

module.exports = mongoose.model('Opportunity', Opportunity)
