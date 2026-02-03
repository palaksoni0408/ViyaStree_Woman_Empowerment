const express = require('express')
const router = express.Router()
const controller = require('../controllers/samruddhihController')

router.post('/match-opportunities', controller.matchOpportunities)
router.post('/save-opportunity', controller.saveOpportunity)

module.exports = router
