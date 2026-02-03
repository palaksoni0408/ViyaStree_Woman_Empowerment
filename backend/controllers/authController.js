const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid') // Assuming uuid might be needed or just use Date.now

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_123'

exports.signup = async (req, res) => {
    try {
        let { name, email, password, location } = req.body
        console.log('Signup attempt for:', email)

        if (!email || !password) {
            console.log('Signup failed: Missing fields')
            return res.status(400).json({ error: 'Email and password are required' })
        }

        // Normalize email
        email = email.trim().toLowerCase()

        // Check if user exists
        let user = await User.findOne({ email })
        if (user) {
            console.log('Signup failed: User exists')
            return res.status(400).json({ error: 'User already exists' })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create user
        const userId = 'user_' + Date.now() + Math.floor(Math.random() * 1000)

        user = await User.create({
            userId,
            email,
            password: hashedPassword,
            profile: {
                name,
                location: location || 'India'
            },
            progress: {
                level: 1,
                points: 0,
                completed_skills: [],
                badges: []
            }
        })
        console.log('User created:', user.email, user.userId)

        // Create token
        const token = jwt.sign(
            { userId: user.userId, id: user._id },
            JWT_SECRET,
            { expiresIn: '30d' }
        )

        res.status(201).json({
            token,
            user: {
                userId: user.userId,
                email: user.email,
                profile: user.profile,
                progress: user.progress
            }
        })
    } catch (error) {
        console.error('Signup error:', error)
        res.status(500).json({ error: 'Server error during signup' })
    }
}

exports.login = async (req, res) => {
    try {
        let { email, password } = req.body

        if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

        email = email.trim().toLowerCase()
        console.log('Login attempt for:', email)

        // Check user
        const user = await User.findOne({ email })
        if (!user) {
            console.log('Login failed: User not found')
            return res.status(404).json({ error: 'User not found' })
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' })
        }

        // Create token
        const token = jwt.sign(
            { userId: user.userId, id: user._id },
            JWT_SECRET,
            { expiresIn: '30d' }
        )

        res.json({
            token,
            user: {
                userId: user.userId,
                email: user.email,
                profile: user.profile,
                progress: user.progress,
                saved_opportunities: user.saved_opportunities
            }
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ error: 'Server error during login' })
    }
}

exports.getMe = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.user.userId }).select('-password')
        res.json(user)
    } catch (error) {
        res.status(500).json({ error: 'Server error' })
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const { name, location, avatar } = req.body
        const userId = req.user.userId

        const user = await User.findOne({ userId })
        if (!user) return res.status(404).json({ error: 'User not found' })

        if (name) user.profile.name = name
        if (location) user.profile.location = location
        // If file was uploaded, save relative path
        if (req.file) {
            // normalizing path for windows/unix compatibility in URLs if needed, but for now simple string
            user.profile.avatar = '/uploads/' + req.file.filename
        } else if (avatar) {
            // Allow manual URL update if provided via body (legacy/alternative)
            user.profile.avatar = avatar
        }

        await user.save()

        res.json({ success: true, user })
    } catch (error) {
        console.error('Update profile error:', error)
        res.status(500).json({ error: 'Failed to update profile' })
    }
}
