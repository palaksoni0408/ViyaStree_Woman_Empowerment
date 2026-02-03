import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/base/PageHeader'
import InfoCard from '../components/base/InfoCard'

export default function Profile() {
    const { user, login } = useAuth() // we might need a way to update local user state without login
    // Actually, AuthContext should expose a way to refresh user data or manually update it
    // For now we can just refetch 'me' or update local state if we had a setUser exposed. 
    // Let's assume we can trigger a reload or implementing a specific update method in context is better.

    // Since we don't have a specific update method exported from context yet, 
    // we will just rely on the fact that 'user' refetches on mount of App or we can force a reload.
    // Better: Let's trust that we can just call an API and then maybe reload window or if we modify AuthContext.

    const [name, setName] = useState(user?.profile?.name || '')
    const [location, setLocation] = useState(user?.profile?.location || '')
    const [avatarPreview, setAvatarPreview] = useState(user?.profile?.avatar || null)
    const [msg, setMsg] = useState('')
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (user) {
            setName(user.profile.name || '')
            setLocation(user.profile.location || '')
            setAvatarPreview(user.profile.avatar || null)
        }
    }, [user])

    function handleFileChange(e) {
        const file = e.target.files[0]
        if (file) {
            setAvatarPreview(URL.createObjectURL(file))
        }
    }

    async function handleSave(e) {
        e.preventDefault()
        setSaving(true)
        setMsg('')
        setError('')

        const formData = new FormData()
        formData.append('name', name)
        formData.append('location', location)

        const fileInput = document.getElementById('avatar-upload')
        if (fileInput && fileInput.files[0]) {
            formData.append('avatar', fileInput.files[0])
        }

        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/v1/auth/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })
            const data = await res.json()
            if (res.ok) {
                setMsg('Profile updated successfully! Refreshing...')
                setTimeout(() => window.location.reload(), 1000)
            } else {
                setError(data.error || 'Failed to update')
            }
        } catch (err) {
            setError('Network error')
        } finally {
            setSaving(false)
        }
    }

    return (
        <main id="main">
            <PageHeader title="Profile Settings" subtitle="Manage your personal details" />

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <InfoCard title="Edit Profile">
                    {msg && <div style={{ padding: '12px', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '16px' }}>{msg}</div>}
                    {error && <div style={{ padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}

                    <form onSubmit={handleSave}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
                            <div style={{
                                width: '100px', height: '100px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                marginBottom: '16px',
                                backgroundColor: '#e2e8f0',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontSize: '32px', color: '#64748b' }}>?</span>
                                )}
                            </div>
                            <label
                                htmlFor="avatar-upload"
                                style={{
                                    cursor: 'pointer', color: '#0d9488', fontWeight: '600',
                                    padding: '8px 16px', border: '1px solid #0d9488', borderRadius: '6px'
                                }}
                            >
                                Change Photo
                            </label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>City / Location</label>
                            <input
                                type="text"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                required
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </InfoCard>
            </div>
        </main>
    )
}
