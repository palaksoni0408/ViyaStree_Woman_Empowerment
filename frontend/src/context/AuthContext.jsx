import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [notifications, setNotifications] = useState([])

    // Use a ref or simple state to allow navigation from context if needed, 
    // though usually best done in components. 
    // Since this component wraps App changes, we might accept navigate as prop or just rely on state.

    // Helper to safely parse JSON (avoids "Unexpected end of JSON input")
    async function safeJson(res) {
        try {
            const text = await res.text()
            if (!text) return null
            return JSON.parse(text)
        } catch {
            return null
        }
    }

    useEffect(() => {
        // Check for token on load
        const checkUser = async () => {
            const token = localStorage.getItem('token')
            if (token) {
                try {
                    const res = await fetch('/api/v1/auth/me', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                    if (res.ok) {
                        const userData = await safeJson(res)
                        setUser(userData)
                    } else {
                        localStorage.removeItem('token')
                    }
                } catch (err) {
                    console.error('Failed to fetch user', err)
                    localStorage.removeItem('token')
                }
            }
            setLoading(false)
        }
        checkUser()
    }, [])

    function pushNotification(msg, explanation = null) {
        const id = Date.now()
        setNotifications(n => [...n, { id, msg, explanation }])
        setTimeout(() => setNotifications(n => n.filter(x => x.id !== id)), 6000)
    }

    async function login(email, password) {
        try {
            const res = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            const data = await safeJson(res) || {}

            if (!res.ok) {
                throw new Error(data.error || 'Login failed')
            }

            localStorage.setItem('token', data.token)
            setUser(data.user)
            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    async function signup(name, email, password, location) {
        try {
            const res = await fetch('/api/v1/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, location })
            })
            const data = await safeJson(res) || {}

            if (!res.ok) {
                throw new Error(data.error || 'Signup failed')
            }

            localStorage.setItem('token', data.token)
            setUser(data.user)
            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    function logout() {
        localStorage.removeItem('token')
        setUser(null)
    }

    // --- Legacy helpers from DemoContext integrated here ---
    async function completeCourse(courseId, quizScore = 85) {
        if (!user) return
        try {
            const resp = await fetch('/api/v1/shiksha/update-progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.userId, courseId, action: 'complete', quizScore })
            })
            const j = await resp.json()

            setUser(u => ({
                ...u,
                progress: {
                    ...(u.progress || {}),
                    points: (u.progress.points || 0) + (j.pointsEarned || 0),
                    completed_skills: Array.from(new Set([...(u.progress.completed_skills || []), courseId]))
                }
            }))

            if (j.orchestrationTriggered) {
                pushNotification(
                    "Orchestration: skill_completed emitted",
                    "Because you completed a course, we're checking if you qualify for job opportunities."
                )
            }
            return j
        } catch (e) { pushNotification('Error completing course'); return null }
    }

    async function saveOpportunity(opportunityId) {
        if (!user) return
        try {
            const resp = await fetch('/api/v1/samruddhih/save-opportunity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.userId, opportunityId })
            })
            const j = await resp.json()

            setUser(u => ({ ...u, saved_opportunities: Array.from(new Set([...(u.saved_opportunities || []), opportunityId])) }))

            if (j.orchestrationTriggered) {
                pushNotification(
                    "Orchestration: opportunity_saved emitted",
                    "Because you saved an opportunity, we're updating your livelihood progress."
                )
            }
            return j
        } catch (e) { pushNotification('Error saving opportunity'); return null }
    }

    async function askLegalQuery(query) {
        if (!user) return { error: 'Please login' }
        try {
            const resp = await fetch('/api/v1/shaktih/legal-query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.userId, query })
            })
            return await resp.json()
        } catch (e) { return { error: 'network' } }
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            signup,
            logout,
            // Shared methods
            completeCourse,
            saveOpportunity,
            askLegalQuery,
            notifications,
            pushNotification
        }}>
            {children}
        </AuthContext.Provider>
    )
}
