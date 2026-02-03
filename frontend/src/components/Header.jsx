import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User } from './Icon'

/**
 * Header Component
 * 
 * Top navigation bar following "Calm Authority" design system.
 * Navy background, clean navigation, professional appearance.
 */
export default function Header() {
  const loc = useLocation()
  const { user, logout } = useAuth()
  const [showSOS, setShowSOS] = useState(false)

  return (
    <header className="header" role="banner">
      <a className="skip-link" href="#main">Skip to content</a>

      <div className="header-container">
        <Link to="/" className="header-brand" style={{ textDecoration: 'none' }}>
          <h1>ViyaStree</h1>
          <small className="header-tagline">शक्तिः • शिक्षा • समृद्धिः</small>
        </Link>

        <nav role="navigation" aria-label="Main navigation">
          <Link to="/dashboard" aria-current={loc.pathname === '/dashboard' ? 'page' : undefined}>Dashboard</Link>
          <Link to="/dashboard/shiksha" aria-current={loc.pathname.startsWith('/dashboard/shiksha') ? 'page' : undefined}>Shiksha</Link>
          <Link to="/dashboard/samruddhih" aria-current={loc.pathname.startsWith('/dashboard/samruddhih') ? 'page' : undefined}>Samruddhih</Link>
          <Link to="/dashboard/shaktih" aria-current={loc.pathname.startsWith('/dashboard/shaktih') ? 'page' : undefined}>Shaktih</Link>
        </nav>

        <div className="header-actions" aria-hidden="false" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

          {/* SOS Button - Replacing Notification Bell */}
          <button
            onClick={() => setShowSOS(true)}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
              animation: 'pulse 2s infinite'
            }}
            title="Emergency SOS"
          >
            <span style={{ fontSize: '16px' }}>🚨</span>
            <span>SOS Alert</span>
          </button>

          <style>
            {`
              @keyframes pulse {
                0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
                100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
              }
            `}
          </style>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* User Profile Link */}
            <Link to="/dashboard/profile" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }} title="Edit Profile">
              <div style={{ textAlign: 'right', fontSize: '12px' }}>
                <div style={{ fontWeight: 600 }}>{user?.profile?.name || 'User'}</div>
                <div style={{ opacity: 0.7 }}>{user?.profile?.location || 'India'}</div>
              </div>
              <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {user?.profile?.avatar ? (
                  <img src={user.profile.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User />
                )}
              </div>
            </Link>

            {/* Logout Button */}
            <button onClick={logout} className="icon-btn" aria-label="Logout" title="Logout" style={{ marginLeft: '8px', color: '#fda4af' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        </div>
      </div>

      {/* SOS Modal */}
      {showSOS && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', maxWidth: '400px', width: '90%', textAlign: 'center', position: 'relative', border: '4px solid #ef4444' }}>
            <button
              onClick={() => setShowSOS(false)}
              style={{ position: 'absolute', top: 12, right: 12, background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}
            >
              ×
            </button>

            <div style={{ width: '80px', height: '80px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <div style={{ fontSize: '40px' }}>🚨</div>
            </div>

            <h2 style={{ color: '#ef4444', margin: '0 0 8px 0', fontSize: '24px' }}>SOS EMERGENCY</h2>
            <p style={{ color: '#475569', marginBottom: '24px' }}>Tap below to call immediate help</p>

            <div style={{ display: 'grid', gap: '12px' }}>
              <a href="tel:100" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '12px 16px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
                <span style={{ fontSize: '24px', marginRight: '16px' }}>👮‍♂️</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 'bold', color: '#1e293b' }}>Police</div>
                  <div style={{ color: '#ef4444', fontWeight: 'bold' }}>100</div>
                </div>
                <div style={{ marginLeft: 'auto', background: '#ef4444', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>CALL</div>
              </a>

              <a href="tel:102" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '12px 16px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
                <span style={{ fontSize: '24px', marginRight: '16px' }}>🚑</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 'bold', color: '#1e293b' }}>Ambulance</div>
                  <div style={{ color: '#ef4444', fontWeight: 'bold' }}>102</div>
                </div>
                <div style={{ marginLeft: 'auto', background: '#ef4444', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>CALL</div>
              </a>

              <a href="tel:1091" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '12px 16px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
                <span style={{ fontSize: '24px', marginRight: '16px' }}>👩</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 'bold', color: '#1e293b' }}>Women Helpline</div>
                  <div style={{ color: '#ef4444', fontWeight: 'bold' }}>1091</div>
                </div>
                <div style={{ marginLeft: 'auto', background: '#ef4444', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>CALL</div>
              </a>

              <a href="tel:181" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '12px 16px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
                <span style={{ fontSize: '24px', marginRight: '16px' }}>🛡️</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 'bold', color: '#1e293b' }}>Domestic Violence</div>
                  <div style={{ color: '#ef4444', fontWeight: 'bold' }}>181</div>
                </div>
                <div style={{ marginLeft: 'auto', background: '#ef4444', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>CALL</div>
              </a>
            </div>

            <button
              onClick={() => setShowSOS(false)}
              style={{ marginTop: '20px', background: 'transparent', border: 'none', color: '#64748b', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
