const EventModel = require('./models/Event')
const User = require('./models/User')

class EmpowermentOrchestrator {
  constructor() {
    // ============================================================================
    // RULES CONFIGURATION
    // ============================================================================
    /**
     * Rule-driven orchestration configuration.
     * 
     * Each rule defines:
     * - when: The event type to listen for (matches eventName in emitEvent)
     * - condition: A function (user, data) => boolean that evaluates whether to execute actions
     * - actions: Array of action identifiers to execute when condition is true
     * 
     * HOW TO ADD NEW RULES:
     * 
     * 1. Add a new rule object to this.rules array:
     *    {
     *      when: 'my_event_type',
     *      condition: (user, data) => {
     *        // Return true to execute actions, false to skip
     *        return user.progress.level > 5
     *      },
     *      actions: ['myActionName']
     *    }
     * 
     * 2. Define the action in this.actions registry below:
     *    myActionName: async (userId, user, data) => {
     *      // Your action logic here
     *      console.log('Action executed!')
     *    }
     * 
     * 3. (Optional) Add event handler to this.eventHandlers if needed
     * 
     * FEATURES:
     * - Multiple rules can listen to the same event type
     * - Multiple actions can be triggered by a single rule
     * - Conditions are evaluated sequentially
     * - Actions execute in the order specified
     * - Errors in one rule don't affect others (isolated execution)
     */
    this.rules = [
      {
        when: 'skill_completed',
        condition: (user, data) => {
          const completed = (user.progress && user.progress.completed_skills) || []
          return completed.length >= 3
        },
        actions: ['triggerOpportunityMatching']
      },
      {
        when: 'opportunity_saved',
        condition: (user, data) => {
          const saved = user.saved_opportunities || []
          return saved.length === 1
        },
        actions: ['suggestSafetyLesson']
      },
      {
        when: 'safety_module_completed',
        condition: (user, data) => true, // Always execute
        actions: ['awardSafetyPoints']
      }
    ]

    // ============================================================================
    // ACTIONS REGISTRY
    // ============================================================================
    /**
     * Actions registry maps action identifiers to implementation functions.
     * 
     * Each action receives:
     * - userId: The user ID from the event
     * - user: The full user document from database
     * - data: The event data payload
     * 
     * Actions are async and can perform any operation (logging, DB updates, API calls, etc.)
     */
    this.actions = {
      triggerOpportunityMatching: async (userId, user, data) => {
        // For demo scaffolding, just log. Real implementation would call matching and notifications.
        const skillCount = (user.progress && user.progress.completed_skills) ? user.progress.completed_skills.length : 0
        console.log(`User ${userId} has ${skillCount} skills — trigger opportunity matching`)
      },

      suggestSafetyLesson: async (userId, user, data) => {
        // Suggest safety lesson when user saves their first opportunity
        console.log(`User ${userId} saved first opportunity — suggest workplace safety lesson`)
      },

      awardSafetyPoints: async (userId, user, data) => {
        // Award points for completing safety module
        await User.updateOne({ userId }, { $inc: { 'progress.points': 20 } })
        console.log(`Awarded safety completion points to ${userId}`)
      }
    }

    // ============================================================================
    // EVENT HANDLERS (Backward Compatibility Layer)
    // ============================================================================
    /**
     * Event handlers maintain backward compatibility with existing code.
     * They delegate to the rule evaluation engine.
     * 
     * New events can be added here if needed, but the recommended approach
     * is to simply add rules to this.rules array instead.
     */
    this.eventHandlers = {
      skill_completed: this.handleSkillCompletion.bind(this),
      opportunity_saved: this.handleOpportunitySaved.bind(this),
      safety_module_completed: this.handleSafetyCompletion.bind(this)
    }
  }

  // ==============================================================================
  // CORE ORCHESTRATION ENGINE
  // ==============================================================================

  /**
   * Main entry point for event orchestration.
   * Persists event to database and executes matching handlers.
   * 
   * This API is backward compatible and should not be modified.
   * 
   * @param {string} eventName - Type of event being emitted
   * @param {string} userId - User ID associated with the event
   * @param {object} data - Event data payload
   * @param {object} [explainability] - Optional explainability metadata
   * @param {string} [explainability.causeEventId] - ID of event that caused this one
   * @param {string} [explainability.impactDomain] - Domain affected: "skill" | "livelihood" | "safety"
   * @param {number} [explainability.confidenceScore] - Confidence score (0-1) for ML-driven events
   */
  async emitEvent(eventName, userId, data, explainability = {}) {
    console.log(`Event: ${eventName} from user ${userId}`)

    // Persist event with optional explainability fields
    try {
      const eventDoc = {
        userId,
        eventType: eventName,
        data,
        module: data.module || null
      }

      // Add explainability fields if provided (backward compatible)
      if (explainability.causeEventId) {
        eventDoc.causeEventId = explainability.causeEventId
      }
      if (explainability.impactDomain) {
        eventDoc.impactDomain = explainability.impactDomain
      }
      if (explainability.confidenceScore !== undefined) {
        eventDoc.confidenceScore = explainability.confidenceScore
      }

      await EventModel.create(eventDoc)
    } catch (e) {
      console.error('Failed to persist event', e)
    }

    // Call handler if exists
    if (this.eventHandlers[eventName]) {
      try {
        await this.eventHandlers[eventName](userId, data)
      } catch (e) {
        console.error('Handler error', e)
      }
    }
  }

  /**
   * Generic rule evaluation engine.
   * 
   * Evaluates all rules matching the given event type and executes
   * actions for rules whose conditions evaluate to true.
   * 
   * This engine:
   * 1. Fetches the user document from database
   * 2. Filters rules matching the event type
   * 3. Evaluates each rule's condition function
   * 4. Executes all actions for rules with true conditions
   * 5. Handles errors gracefully (continues execution on failures)
   */
  async executeRules(eventName, userId, data) {
    const user = await User.findOne({ userId })
    if (!user) return

    // Filter rules for this event type
    const matchingRules = this.rules.filter(rule => rule.when === eventName)

    // Evaluate conditions and execute actions
    for (const rule of matchingRules) {
      try {
        // Evaluate condition
        if (rule.condition(user, data)) {
          // Execute all actions for this rule
          for (const actionName of rule.actions) {
            if (this.actions[actionName]) {
              await this.actions[actionName](userId, user, data)
            } else {
              console.error(`Action '${actionName}' not found in actions registry`)
            }
          }
        }
      } catch (e) {
        console.error(`Rule execution error for event '${eventName}':`, e)
        // Continue with next rule despite error
      }
    }
  }

  // ==============================================================================
  // EVENT HANDLERS (Backward Compatible)
  // ==============================================================================

  /**
   * Handles skill completion events.
   * Delegates to rule evaluation engine.
   */
  async handleSkillCompletion(userId, data) {
    await this.executeRules('skill_completed', userId, data)
  }

  /**
   * Handles opportunity saved events.
   * Delegates to rule evaluation engine.
   */
  async handleOpportunitySaved(userId, data) {
    await this.executeRules('opportunity_saved', userId, data)
  }

  /**
   * Handles safety module completion events.
   * Delegates to rule evaluation engine.
   */
  async handleSafetyCompletion(userId, data) {
    await this.executeRules('safety_module_completed', userId, data)
  }
}

module.exports = EmpowermentOrchestrator
