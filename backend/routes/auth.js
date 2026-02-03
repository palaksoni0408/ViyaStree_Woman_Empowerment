const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')

const upload = require('../middleware/upload')

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.get('/me', authMiddleware, authController.getMe)
router.put('/profile', authMiddleware, upload.single('avatar'), authController.updateProfile)

module.exports = router
