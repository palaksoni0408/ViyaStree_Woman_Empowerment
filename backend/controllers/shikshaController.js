const Course = require('../models/Course')
const User = require('../models/User')
const Orchestrator = require('../orchestrator')
const orchestrator = new Orchestrator()

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({})
    return res.json({ courses })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch courses' })
  }
}

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ courseId: req.params.courseId })
    if (!course) return res.status(404).json({ error: 'Course not found' })
    return res.json({ course })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch course' })
  }
}

exports.generatePath = async (req, res) => {
  const { interests = [], currentLevel = 'beginner', timeAvailable = 5 } = req.body
  // Minimal stub: return empty path for scaffolding - can be enhanced to filter courses
  const courses = await Course.find({})
  return res.json({ learningPath: courses, totalEstimatedTime: '0 weeks' })
}

exports.updateProgress = async (req, res) => {
  const { userId, courseId, action, quizScore } = req.body
  // Minimal points logic stub
  const user = await User.findOne({ userId: userId || 'demo_user' })
  if (!user) return res.status(404).json({ error: 'user not found' })

  let pointsEarned = 0
  if (quizScore >= 80) pointsEarned = 50
  else if (quizScore >= 60) pointsEarned = 30

  user.progress = user.progress || {}
  user.progress.points = (user.progress.points || 0) + pointsEarned
  user.progress.completed_skills = Array.from(new Set([...(user.progress.completed_skills || []), courseId]))

  // persist minimal changes
  await user.save()

  // Trigger orchestration (skill_completed)
  orchestrator.emitEvent('skill_completed', user.userId, { skill: courseId, pointsEarned })

  return res.json({ pointsEarned, totalPoints: user.progress.points, levelUp: false, orchestrationTriggered: true })
}


