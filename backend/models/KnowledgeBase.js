const mongoose = require('mongoose')

const KB = new mongoose.Schema({
  category: String,
  topic: String,
  keywords: [String],
  content: mongoose.Schema.Types.Mixed,
  relatedTopics: [String],
  lastUpdated: { type: Date, default: Date.now }
})

module.exports = mongoose.model('KnowledgeBase', KB)
