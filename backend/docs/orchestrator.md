# Orchestrator Deep Dive

Scope: `backend/orchestrator.js`

This document explains the rule engine that connects events across Shiksha, Samruddhih, and Shaktih.

## Overview

`EmpowermentOrchestrator` is a class that:
1. Persists events in the `Event` collection.
2. Applies rule conditions to those events.
3. Executes action handlers that can update user state or produce side effects.

Controllers instantiate this class when they need to emit an event.

## Event Data Shape

All orchestration events share a common shape:
```json
{
  "eventName": "string",
  "userId": "string",
  "data": {},
  "explainability": {
    "causeEventId": "string",
    "impactDomain": "skill | livelihood | safety",
    "confidenceScore": 0.0
  }
}
```

Only `eventName`, `userId`, and `data` are required. `explainability` is optional.

## Constructor

The constructor initializes three registries:
1. `rules`: condition-driven mappings from events to actions.
2. `actions`: named functions that execute side effects.
3. `eventHandlers`: backward compatibility layer that delegates to `executeRules`.

### Current Rules

Rule 1:
- `when`: `skill_completed`
- `condition`: user has completed at least 3 skills
- `actions`: `triggerOpportunityMatching`

Rule 2:
- `when`: `opportunity_saved`
- `condition`: user has saved exactly 1 opportunity (first save)
- `actions`: `suggestSafetyLesson`

Rule 3:
- `when`: `safety_module_completed`
- `condition`: always true
- `actions`: `awardSafetyPoints`

### Current Actions

`triggerOpportunityMatching`:
- Logs a message that matching should be triggered.
- Does not call an external API or modify DB state.

`suggestSafetyLesson`:
- Logs a message suggesting a safety lesson.
- Does not modify DB state.

`awardSafetyPoints`:
- Runs `User.updateOne` to increment `progress.points` by 20.
- Logs a confirmation message.

## `emitEvent(eventName, userId, data, explainability = {})`

Purpose: Persist an event and trigger its handler.

Flow:
1. Log event name and user ID.
2. Build `eventDoc` with `userId`, `eventType`, `data`, `module`.
3. If `explainability` fields exist, add them to `eventDoc`.
4. Persist to MongoDB via `EventModel.create`.
5. If a handler exists for `eventName`, call it.
6. Catch and log errors for event persistence or handler execution.

Edge cases:
1. If event persistence fails, the handler still runs.
2. If there is no handler for `eventName`, the event is still persisted.
3. If the handler throws, the error is logged and swallowed.

## `executeRules(eventName, userId, data)`

Purpose: Evaluate rules for a given event and execute their actions.

Flow:
1. Load user by `userId`.
2. If user does not exist, exit early.
3. Filter `this.rules` by `rule.when === eventName`.
4. For each matching rule, evaluate `rule.condition(user, data)`.
5. If condition passes, execute actions in order.
6. If an action name is not found in the registry, log an error.
7. Continue processing remaining rules even if one fails.

Edge cases:
1. Missing user silently exits without any actions.
2. Errors in one rule do not stop other rules from running.
3. If `user.progress` is missing, conditions must handle it safely.

## Event Handlers

These methods exist for backward compatibility and call `executeRules`.

### `handleSkillCompletion(userId, data)`

Flow:
1. Calls `executeRules('skill_completed', userId, data)`.

### `handleOpportunitySaved(userId, data)`

Flow:
1. Calls `executeRules('opportunity_saved', userId, data)`.

### `handleSafetyCompletion(userId, data)`

Flow:
1. Calls `executeRules('safety_module_completed', userId, data)`.

## Where Events Are Emitted

Examples of events emitted in controllers:
- `shikshaController.updateProgress` emits `skill_completed`.
- `samruddhihController.saveOpportunity` emits `opportunity_saved`.

If additional event types are introduced, add them to `rules`, `actions`, and optionally `eventHandlers`.
