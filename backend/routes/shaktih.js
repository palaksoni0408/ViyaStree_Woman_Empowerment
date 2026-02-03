const express = require('express')
const router = express.Router()
const controller = require('../controllers/shaktihController')

router.post('/legal-query', controller.handleLegalQuery)
router.get('/lesson/:lessonId', controller.getLesson)

module.exports = router
