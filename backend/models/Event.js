const mongoose = require('mongoose')

/**
 * Event Model - Tracks all orchestration events with optional explainability fields.
 * 
 * ANALYTICS USE CASES:
 * 
 * 1. Event Causality Tracking (causeEventId):
 *    - Build event chains: "skill_completed" → "opportunity_matched" → "opportunity_saved"
 *    - Answer "why did this happen?" by tracing back to originating events
 *    - Example: safety_suggestion event links to opportunity_saved as cause
 * 
 * 2. Impact Domain Analysis (impactDomain):
 *    - Track which pillar (skill/livelihood/safety) each event affects
 *    - Generate cross-pillar analytics: "80% of skill events lead to livelihood actions"
 *    - Dashboard metrics: visualize empowerment loop effectiveness
 * 
 * 3. Confidence Scoring (confidenceScore):
 *    - ML model confidence for recommendation events
 *    - Filter high-confidence events for reporting
 *    - A/B testing: compare outcomes by confidence thresholds
 */
const EventSchema = new mongoose.Schema({
  // Core event identification
  userId: String,
  eventType: String,
  module: String,
  data: mongoose.Schema.Types.Mixed,
  triggeredActions: [mongoose.Schema.Types.Mixed],
  timestamp: { type: Date, default: Date.now },

  // ============================================================================
  // EXPLAINABILITY FIELDS (Optional - for analytics & causality tracking)
  // ============================================================================

  /**
   * ID of the event that caused this event (for event chain analysis).
   * Example: opportunity_matched event includes causeEventId of skill_completed event.
   */
  causeEventId: {
    type: String,
    required: false,
    index: true  // Index for efficient causality queries
  },

  /**
   * Primary domain affected by this event.
   * Maps to ViyaStree's three pillars for cross-pillar analytics.
   */
  impactDomain: {
    type: String,
    enum: ['skill', 'livelihood', 'safety'],
    required: false
  },

  /**
   * Confidence score (0-1) for ML-driven events.
   * Used for filtering recommendations and A/B testing.
   */
  confidenceScore: {
    type: Number,
    min: 0,
    max: 1,
    required: false
  }
})

// Index on eventType for efficient filtering
EventSchema.index({ eventType: 1, timestamp: -1 })

module.exports = mongoose.model('Event', EventSchema)
