const Opportunity = require('../models/Opportunity')
const User = require('../models/User')
const Orchestrator = require('../orchestrator')
const orchestrator = new Orchestrator()

/**
 * Match opportunities to user based on skill overlap.
 * Uses Jaccard similarity: intersection / union of skills.
 * 
 * Example: User has [A, B, C], Opportunity needs [B, C, D]
 * Intersection: [B, C] (2 skills)
 * Union: [A, B, C, D] (4 skills)
 * Match Score: 2/4 = 0.5 (50% match)
 */
exports.matchOpportunities = async (req, res) => {
  const { userId } = req.body

  try {
    // Step 1: Get user's completed skills
    const user = await User.findOne({ userId: userId || 'demo_user' })
    if (!user) {
      return res.status(404).json({ error: 'user not found' })
    }

    const userSkills = (user.progress && user.progress.completed_skills) || []

    // If user has no skills, return empty matches
    if (userSkills.length === 0) {
      return res.json({
        matches: [],
        totalMatches: 0,
        showing: 0,
        message: 'Complete some courses to get matched with opportunities!'
      })
    }

    // Step 2: Fetch all active opportunities
    const opportunities = await Opportunity.find({ isActive: true })

    // Step 3: Calculate match score for each opportunity
    const matches = opportunities.map(opp => {
      const oppSkills = opp.requiredSkills || []

      // Calculate Jaccard similarity (intersection / union)
      const matchScore = calculateJaccardSimilarity(userSkills, oppSkills)

      // Return opportunity with match score
      return {
        opportunityId: opp.opportunityId,
        title: opp.title,
        organization: opp.organization,
        location: opp.location,
        workType: opp.workType,
        requiredSkills: oppSkills,
        experienceLevel: opp.experienceLevel,
        salary: opp.salary,
        matchScore: matchScore,
        // Matched skills (intersection) for display
        matchedSkills: oppSkills.filter(skill => userSkills.includes(skill)),
        // Missing skills (in opp but not in user)
        missingSkills: oppSkills.filter(skill => !userSkills.includes(skill))
      }
    })

    // Step 4: Filter out zero matches and sort by score (descending)
    const filteredMatches = matches
      .filter(m => m.matchScore > 0)  // Only show opportunities with at least some match
      .sort((a, b) => b.matchScore - a.matchScore)  // Highest score first

    return res.json({
      matches: filteredMatches,
      totalMatches: filteredMatches.length,
      showing: filteredMatches.length,
      userSkills: userSkills  // Include for frontend display
    })

  } catch (error) {
    console.error('Match opportunities error:', error)
    return res.status(500).json({ error: 'Failed to match opportunities' })
  }
}

/**
 * Calculate Jaccard similarity between two skill arrays.
 * 
 * Jaccard Index = |A ∩ B| / |A ∪ B|
 * 
 * Returns a number between 0 and 1:
 * - 0.0 = no overlap
 * - 1.0 = perfect match
 * - 0.5 = 50% overlap
 * 
 * @param {string[]} userSkills - User's completed skills
 * @param {string[]} requiredSkills - Opportunity's required skills
 * @returns {number} Match score between 0 and 1
 */
function calculateJaccardSimilarity(userSkills, requiredSkills) {
  // Handle edge cases
  if (!userSkills || userSkills.length === 0) return 0
  if (!requiredSkills || requiredSkills.length === 0) return 0

  // Convert to Sets for efficient operations
  const userSet = new Set(userSkills.map(s => s.toLowerCase()))
  const requiredSet = new Set(requiredSkills.map(s => s.toLowerCase()))

  // Calculate intersection (skills in both sets)
  const intersection = new Set([...userSet].filter(skill => requiredSet.has(skill)))

  // Calculate union (all unique skills from both sets)
  const union = new Set([...userSet, ...requiredSet])

  // Jaccard similarity = intersection / union
  const similarity = intersection.size / union.size

  // Round to 2 decimal places for readability
  return Math.round(similarity * 100) / 100
}


exports.saveOpportunity = async (req, res) => {
  const { userId, opportunityId, status = 'interested' } = req.body
  const user = await User.findOne({ userId: userId || 'demo_user' })
  if (!user) return res.status(404).json({ error: 'user not found' })

  user.saved_opportunities = user.saved_opportunities || []
  if (!user.saved_opportunities.includes(opportunityId)) user.saved_opportunities.push(opportunityId)
  await user.save()

  // Emit event; orchestrator may notify if first saved
  orchestrator.emitEvent('opportunity_saved', user.userId, { opportunityId })

  return res.json({ saved: true, totalSaved: user.saved_opportunities.length, orchestrationTriggered: true })
}
