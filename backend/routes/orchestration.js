const express = require('express')
const router = express.Router()
const Orchestrator = require('../orchestrator')
const User = require('../models/User')
const orchestrator = new Orchestrator()

/**
 * Health check endpoint for deployment monitoring
 */
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'viyastree-backend'
  })
})

/**
 * Dashboard endpoint with empowerment score breakdown.
 * 
 * Calculates user's overall progress across three pillars:
 * - शिक्षा (Skill/Education)
 * - समृद्धिः (Livelihood/Opportunities)
 * - शक्तिः (Safety/Legal Awareness)
 */
router.get('/dashboard', async (req, res) => {
  const userId = req.query.userId || 'demo_user'

  try {
    // Fetch user data
    const user = await User.findOne({ userId })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Calculate empowerment score breakdown
    const scoreData = calculateEmpowermentScore(user)

    res.json({
      userId,
      empowermentScore: scoreData.totalScore,
      breakdown: scoreData.breakdown,
      rawCounts: scoreData.rawCounts,  // For transparency
      recommendations: [],  // Placeholder
      recentActivity: [],   // Placeholder
      nextSteps: []         // Placeholder
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    res.status(500).json({ error: 'Failed to fetch dashboard data' })
  }
})

/**
 * Calculate empowerment score based on user's progress across all three pillars.
 * 
 * SCORING METHODOLOGY:
 * 
 * The empowerment score reflects balanced progress across ViyaStree's three pillars.
 * Each pillar contributes equally (33.33%) to the total score.
 * 
 * PILLAR METRICS:
 * 
 * 1. SKILL (शिक्षा):
 *    - Measured by: completed_skills count
 *    - Calculation: min(count / 10, 1) * 100
 *    - Max contribution: 33.33 points (10+ skills)
 * 
 * 2. LIVELIHOOD (समृद्धिः):
 *    - Measured by: saved_opportunities count
 *    - Calculation: min(count / 5, 1) * 100
 *    - Max contribution: 33.33 points (5+ opportunities)
 * 
 * 3. SAFETY (शक्तिः):
 *    - Measured by: completed safety lessons count (from progress)
 *    - Calculation: min(count / 3, 1) * 100
 *    - Max contribution: 33.33 points (3+ lessons)
 * 
 * TOTAL SCORE: Sum of all three pillars (0-100)
 * 
 * BREAKDOWN PERCENTAGES:
 * Each pillar's percentage is calculated as:
 * (pillarScore / totalScore) * 100
 * 
 * DESIGN RATIONALE:
 * - Equal weighting encourages balanced growth across all areas
 * - Caps prevent over-indexing on single pillar
 * - Lower thresholds (3-10) make progress achievable
 * - Transparent calculation supports user understanding
 * 
 * @param {object} user - User document from database
 * @returns {object} - { totalScore, breakdown: {skill, livelihood, safety}, rawCounts }
 */
function calculateEmpowermentScore(user) {
  // Extract raw counts from user progress
  const completedSkills = (user.progress?.completed_skills || []).length
  const savedOpportunities = (user.saved_opportunities || []).length
  const safetyLessons = user.progress?.completed_safety_lessons || 0

  // ============================================================================
  // PILLAR SCORES (Each contributes max 33.33 points)
  // ============================================================================

  /**
   * SKILL PILLAR (शिक्षा)
   * Target: 10 completed skills for 100% contribution
   * Rationale: Learning diverse skills is foundation for livelihood
   */
  const skillScore = Math.min(completedSkills / 10, 1) * 33.33

  /**
   * LIVELIHOOD PILLAR (समृद्धिः)
   * Target: 5 saved opportunities for 100% contribution
   * Rationale: Saving opportunities shows intent, applying is next step
   */
  const livelihoodScore = Math.min(savedOpportunities / 5, 1) * 33.33

  /**
   * SAFETY PILLAR (शक्तिः)
   * Target: 3 completed safety lessons for 100% contribution
   * Rationale: Core legal awareness (maternity, harassment, rights)
   */
  const safetyScore = Math.min(safetyLessons / 3, 1) * 33.33

  // ============================================================================
  // TOTAL SCORE & BREAKDOWN PERCENTAGES
  // ============================================================================

  const totalScore = Math.round(skillScore + livelihoodScore + safetyScore)

  /**
   * Calculate percentage breakdown.
   * 
   * If totalScore is 0 (new user), distribute equally (33.33% each).
   * Otherwise, calculate each pillar's contribution as percentage of total.
   * 
   * Percentages sum to 100% (with rounding adjustments).
   */
  let breakdown
  if (totalScore === 0) {
    // New user: show equal potential across all pillars
    breakdown = {
      skill: 33.33,
      livelihood: 33.33,
      safety: 33.34  // Extra 0.01 to ensure sum = 100
    }
  } else {
    // Calculate percentages based on actual scores
    const skillPercent = (skillScore / totalScore) * 100
    const livelihoodPercent = (livelihoodScore / totalScore) * 100
    const safetyPercent = (safetyScore / totalScore) * 100

    // Round to 2 decimal places
    breakdown = {
      skill: Math.round(skillPercent * 100) / 100,
      livelihood: Math.round(livelihoodPercent * 100) / 100,
      safety: Math.round(safetyPercent * 100) / 100
    }

    // Ensure percentages sum to exactly 100 (adjust for rounding errors)
    const sum = breakdown.skill + breakdown.livelihood + breakdown.safety
    if (sum !== 100) {
      // Add rounding difference to largest contributor
      const largest = Object.keys(breakdown).reduce((a, b) =>
        breakdown[a] > breakdown[b] ? a : b
      )
      breakdown[largest] = Math.round((breakdown[largest] + (100 - sum)) * 100) / 100
    }
  }

  return {
    totalScore,
    breakdown,
    rawCounts: {
      completedSkills,
      savedOpportunities,
      safetyLessons
    }
  }
}

module.exports = router
