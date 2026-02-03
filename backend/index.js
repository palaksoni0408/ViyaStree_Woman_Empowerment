const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/viyastree'
const PORT = process.env.PORT || 5000
const path = require('path')

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/v1/shaktih', require('./routes/shaktih'))
app.use('/api/v1/shiksha', require('./routes/shiksha'))
app.use('/api/v1/samruddhih', require('./routes/samruddhih'))
app.use('/api/v1/orchestration', require('./routes/orchestration'))
app.use('/api/v1/auth', require('./routes/auth'))

mongoose.connect(MONGO_URI).then(() => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}).catch(err => {
  console.error('Mongo connection error', err)
  process.exit(1)
})

module.exports = app
