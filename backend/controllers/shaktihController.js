const KnowledgeBase = require('../models/KnowledgeBase')

/**
 * ============================================================================
 * ETHICAL SAFEGUARDS & INTENT CLASSIFICATION
 * ============================================================================
 * 
 * This handler processes legal/safety queries with two key safeguards:
 * 
 * 1. SEVERITY DETECTION:
 *    - Identifies urgent situations (abuse, threats, harm, coercion)
 *    - Immediately surfaces helpline information for urgent cases
 *    - Prioritizes user safety over information delivery
 * 
 * 2. INTENT CLASSIFICATION:
 *    - Categorizes query type for better response targeting
 *    - Helps route to appropriate resources
 *    - Improves analytics for most-needed support areas
 * 
 * CRITICAL: This is NOT a replacement for professional legal counsel or
 * crisis intervention. When in doubt, escalate to helplines.
 */
exports.handleLegalQuery = async (req, res) => {
  const { query } = req.body
  const analysis = analyzeQuery(query)

  try {
    // 1. Convert query to search terms
    const searchTerms = query.toLowerCase().split(' ').filter(word => word.length > 3)

    // 2. Build regex query (OR condition for any term matching content or keywords)
    const regexTerms = searchTerms.map(term => new RegExp(term, 'i'))

    // 3. Search KnowledgeBase
    // Priority: Match topic/intent first, then keywords
    let match = await KnowledgeBase.findOne({
      $or: [
        { keywords: { $in: regexTerms } },
        { content: { $in: regexTerms } }
      ]
    }).lean()

    // 4. Fallback: If intent was analyzed, try to find by intent
    if (!match && analysis.intent !== 'general') {
      match = await KnowledgeBase.findOne({ intent: analysis.intent }).lean()
    }

    if (match) {
      return res.json({
        response: match.content,
        relatedTopics: match.relatedTopics,
        severity: analysis.severity,
        helpline: analysis.severity === 'urgent' ? '181 (Women Helpline) or 100 (Police)' : null
      })
    } else {
      return res.json({
        response: "I couldn't find specific legal information on that topics. However, you can always call the Women's Helpline at 181 for guidance.",
        relatedTopics: ['maternity_benefits', 'posh_workplace_harassment', 'domestic_violence'],
        severity: analysis.severity
      })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Error processing legal query' })
  }
}

/**
 * Analyze query to detect intent and severity.
 * 
 * INTENT CATEGORIES:
 * - maternity: Pregnancy, leave, benefits
 * - pay: Wages, salary, equal pay
 * - harassment: Workplace harassment, abuse
 * - workplace: General workplace rights
 * - general: Other legal/safety queries
 * 
 * SEVERITY LEVELS:
 * - informational: Standard queries (default)
 * - urgent: Keywords indicating immediate danger/harm
 * 
 * @param {string} query - User's query text
 * @returns {object} - { intent, severity }
 */
function analyzeQuery(query) {
  const lowerQuery = query.toLowerCase()

  // ============================================================================
  // SEVERITY DETECTION (CRITICAL: Check for urgent situations first)
  // ============================================================================

  /**
   * ETHICAL SAFEGUARD: Urgent keywords indicate potential harm.
   * 
   * These keywords suggest the user may be in immediate danger and need
   * crisis intervention, not just information. Err on the side of caution.
   * 
   * Categories of urgent keywords:
   * - Physical harm: assault, violence, hurt, injury
   * - Psychological harm: abuse, threat, coercion, force
   * - Illegal actions: blackmail, extortion, stalking
   * - Immediate danger: help, emergency, scared, unsafe
   */
  const urgentKeywords = [
    // Physical harm
    'assault', 'violence', 'violent', 'hurt', 'injur', 'attack', 'hit', 'beat',

    // Psychological harm
    'abuse', 'abusive', 'threat', 'threaten', 'coerce', 'coercion', 'force', 'forced',

    // Illegal actions
    'blackmail', 'extort', 'stalk', 'rape', 'molest', 'harass',

    // Immediate danger indicators
    'help me', 'emergency', 'urgent', 'scared', 'afraid', 'unsafe', 'danger',
    'kidnap', 'trap', 'escape'
  ]

  const isUrgent = urgentKeywords.some(keyword => lowerQuery.includes(keyword))
  const severity = isUrgent ? 'urgent' : 'informational'

  // ============================================================================
  // INTENT CLASSIFICATION (Keyword-based categorization)
  // ============================================================================

  /**
   * Intent patterns map keywords to query categories.
   * These help route users to the most relevant resources.
   * 
   * Note: A query can match multiple intents. We return the first match.
   * Priority order: harassment → maternity → pay → workplace → general
   */
  const intentPatterns = {
    harassment: [
      'harass', 'harassment', 'abuse', 'abusive', 'victim', 'assault',
      'inappropriate', 'unwanted', 'touching', 'advances', 'bully'
    ],

    maternity: [
      'maternity', 'pregnancy', 'pregnant', 'leave', 'maternal',
      'child', 'baby', 'birth', 'parental'
    ],

    pay: [
      'pay', 'wage', 'salary', 'equal pay', 'compensation', 'payment',
      'income', 'earnings', 'paycheck', 'underpaid'
    ],

    workplace: [
      'workplace', 'work', 'job', 'employer', 'employee', 'contract',
      'termination', 'fired', 'resign', 'hours', 'overtime', 'rights'
    ]
  }

  // Determine intent by checking patterns
  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    if (patterns.some(pattern => lowerQuery.includes(pattern))) {
      return { intent, severity }
    }
  }

  // Default to general if no specific intent matched
  return { intent: 'general', severity }
}


exports.getLesson = async (req, res) => {
  const lessonId = req.params.lessonId
  // Placeholder response
  return res.json({ lesson: { id: lessonId, title: 'Sample Lesson', screens: [], quiz: [] }, userProgress: { completed: false, currentScreen: 0 } })
}
