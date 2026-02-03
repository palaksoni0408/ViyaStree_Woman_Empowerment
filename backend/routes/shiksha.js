const express = require('express')
const router = express.Router()
const controller = require('../controllers/shikshaController')

router.post('/generate-path', controller.generatePath)
router.post('/update-progress', controller.updateProgress)
router.get('/courses', controller.getCourses)
router.get('/course/:courseId', controller.getCourse)

module.exports = router
