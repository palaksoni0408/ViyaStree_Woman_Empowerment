import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../components/base/PageHeader'
import InfoCard from '../components/base/InfoCard'

export default function Docs() {
  const navigate = useNavigate()

  function playVoiceHindi(text) {
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
        const utter = new SpeechSynthesisUtterance(text)
        utter.lang = 'hi-IN'
        utter.rate = 0.95
        window.speechSynthesis.speak(utter)
      }
    } catch (e) {
      console.warn('Voice not supported', e)
    }
  }

  return (
    <main id="main" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <PageHeader
        title="🌟 ViyaStree: Your Journey to Empowerment"
        subtitle="The Disruptive Digital Loop for Her Livelihood, Skills, and Rights"
      />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        
        {/* Section 1: What is ViyaStree */}
        <InfoCard title="🎯 What is ViyaStree?" style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#334155', marginBottom: '16px' }}>
            <strong>ViyaStree</strong> is an innovative and scalable digital ecosystem designed to bridge the gap to financial independence. Unlike standard apps, we provide a <strong>"Holistic Empowerment Loop"</strong> that connects education directly to earning and safety.
          </p>

          <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '12px', marginBottom: '16px', border: '2px solid #0ea5e9' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#0c4a6e' }}>📊 The ViyaStree Impact: At a Glance</h4>
            <div style={{ display: 'grid', gap: '12px', fontSize: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '12px', background: 'white', borderRadius: '8px', fontWeight: 600, textAlign: 'center', color: '#0c4a6e' }}>Traditional Apps</div>
                <div style={{ padding: '12px', background: 'white', borderRadius: '8px', fontWeight: 600, textAlign: 'center', color: '#0c4a6e' }}>ViyaStree Solution</div>
                <div style={{ padding: '12px', background: 'white', borderRadius: '8px', fontWeight: 600, textAlign: 'center', color: '#0c4a6e' }}>Impact</div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '10px', background: '#dbeafe', borderRadius: '6px' }}>Fragmented (Skills Only)</div>
                <div style={{ padding: '10px', background: '#dbeafe', borderRadius: '6px' }}>✅ Unified (Skills + Jobs + Rights)</div>
                <div style={{ padding: '10px', background: '#dbeafe', borderRadius: '6px' }}>Complete Ecosystem</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '10px', background: '#fce7f3', borderRadius: '6px' }}>Text-Heavy/Difficult</div>
                <div style={{ padding: '10px', background: '#fce7f3', borderRadius: '6px' }}>🔊 Voice-First/Inclusive</div>
                <div style={{ padding: '10px', background: '#fce7f3', borderRadius: '6px' }}>Accessible to All</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '10px', background: '#fef3c7', borderRadius: '6px' }}>Temporary Upskilling</div>
                <div style={{ padding: '10px', background: '#fef3c7', borderRadius: '6px' }}>💎 Sustainable Empowerment</div>
                <div style={{ padding: '10px', background: '#fef3c7', borderRadius: '6px' }}>Long-Term Impact</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '10px', background: '#f0fdf4', borderRadius: '6px' }}>Reactive SOS</div>
                <div style={{ padding: '10px', background: '#f0fdf4', borderRadius: '6px' }}>🛡️ Proactive AI Guardian</div>
                <div style={{ padding: '10px', background: '#f0fdf4', borderRadius: '6px' }}>Always Protected</div>
              </div>
            </div>
          </div>
        </InfoCard>

        {/* Section 2: Three Pillars */}
        <InfoCard title="🔺 The Three Pillars of ViyaStree" style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px', fontStyle: 'italic' }}>
            ViyaStree is built on three pillars to ensure increased awareness of rights and protections while improving access to income.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            {/* Shaktih */}
            <div style={{ padding: '20px', background: '#fce7f3', borderRadius: '12px', border: '3px solid #f472b6' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '20px', color: '#831843' }}>🛡️ Shaktih: Power</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#831843', fontSize: '14px' }}>
                <li>Legal Rights Education</li>
                <li>Safety Resources & Alerts</li>
                <li>SOS Emergency Dialer</li>
                <li>100% Anonymous Queries</li>
              </ul>
            </div>

            {/* Shiksha */}
            <div style={{ padding: '20px', background: '#fef3c7', borderRadius: '12px', border: '3px solid #fcd34d' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '20px', color: '#92400e' }}>📚 Shiksha: Education</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#92400e', fontSize: '14px' }}>
                <li>Bite-Sized Skill Training</li>
                <li>Digital Literacy Programs</li>
                <li>Financial Training</li>
                <li>Skill Badge System</li>
              </ul>
            </div>

            {/* Samruddhih */}
            <div style={{ padding: '20px', background: '#dcfce7', borderRadius: '12px', border: '3px solid #86efac' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '20px', color: '#166534' }}>💰 Samruddhih: Prosperity</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#166534', fontSize: '14px' }}>
                <li>AI-Powered Job Matching</li>
                <li>Micro-Entrepreneurship</li>
                <li>Financial Independence</li>
                <li>Resume Building Tools</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => playVoiceHindi('ViyaStree के तीन स्तंभों के बारे में सुनिए: शक्तिह - सुरक्षा और अधिकार, शिक्षा - कौशल विकास, और समृद्धि - आय के अवसर।')}
            style={{
              width: '100%',
              padding: '12px',
              background: '#0d9488',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔊 Hear the Three Pillars (Hindi Audio)
          </button>
        </InfoCard>

        {/* Section 3: How to Navigate */}
        <InfoCard title="🗺️ How to Navigate Your Path" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'grid', gap: '20px' }}>
            
            {/* Step 1 */}
            <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: '12px', borderLeft: '4px solid #14b8a6' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#166534', fontSize: '18px' }}>Step 1: Create Your Account</h4>
              <p style={{ margin: '8px 0', color: '#15803d', fontSize: '14px' }}>
                <strong>Action:</strong> Tap "Open Dashboard" or "Sign Up"
              </p>
              <p style={{ margin: '4px 0 8px 0', color: '#15803d', fontSize: '13px', fontStyle: 'italic' }}>
                🎯 <strong>USP:</strong> Voice-First Onboarding allows you to register by speaking, making it accessible to those most in need.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ padding: '16px', background: '#fef3c7', borderRadius: '12px', borderLeft: '4px solid #fbbf24' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#92400e', fontSize: '18px' }}>Step 2: Start Learning (Shiksha)</h4>
              <p style={{ margin: '8px 0', color: '#b45309', fontSize: '14px' }}>
                <strong>Action:</strong> Browse courses like "Digital Finance" or "Micro-Business Basics"
              </p>
              <p style={{ margin: '4px 0 8px 0', color: '#b45309', fontSize: '13px', fontStyle: 'italic' }}>
                📊 <strong>Impact:</strong> 90% of users report higher confidence in skill development within the first week.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{ padding: '16px', background: '#f0f9ff', borderRadius: '12px', borderLeft: '4px solid #0ea5e9' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#0c4a6e', fontSize: '18px' }}>Step 3: Check Opportunities (Samruddhih)</h4>
              <p style={{ margin: '8px 0', color: '#0284c7', fontSize: '14px' }}>
                <strong>Action:</strong> Apply for jobs via ViyaApply - our unified application experience
              </p>
              <p style={{ margin: '4px 0 8px 0', color: '#0284c7', fontSize: '13px', fontStyle: 'italic' }}>
                ⚡ <strong>Technology:</strong> 33% Skill-Match Technology automatically filters jobs that fit your Shiksha badges.
              </p>
            </div>

            {/* Step 4 */}
            <div style={{ padding: '16px', background: '#fce7f3', borderRadius: '12px', borderLeft: '4px solid #f472b6' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#831843', fontSize: '18px' }}>Step 4: Know Your Rights (Shaktih)</h4>
              <p style={{ margin: '8px 0', color: '#be185d', fontSize: '14px' }}>
                <strong>Action:</strong> Ask GuruSakhi about maternity leave, workplace safety, or digital security
              </p>
              <p style={{ margin: '4px 0 8px 0', color: '#be185d', fontSize: '13px', fontStyle: 'italic' }}>
                🚨 <strong>Emergency:</strong> One-tap SOS button (112, 181) works without login for immediate protection.
              </p>
            </div>
          </div>
        </InfoCard>

        {/* Section 4: Why ViyaStree */}
        <InfoCard title="💡 Why ViyaStree?" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ padding: '14px', background: '#e0e7ff', borderRadius: '8px', borderLeft: '3px solid #6366f1' }}>
              <p style={{ margin: 0, color: '#312e81', fontWeight: 600 }}>
                📈 <strong>Scalability:</strong> Our open-source AI (GuruSakhi) supports millions of users across 10+ Indian dialects simultaneously.
              </p>
            </div>
            <div style={{ padding: '14px', background: '#dbeafe', borderRadius: '8px', borderLeft: '3px solid #0284c7' }}>
              <p style={{ margin: 0, color: '#0c4a6e', fontWeight: 600 }}>
                💎 <strong>Impact:</strong> Designed to convert skill development into livelihood generation—moving users from $0 to sustainable income.
              </p>
            </div>
            <div style={{ padding: '14px', background: '#d1fae5', borderRadius: '8px', borderLeft: '3px solid #059669' }}>
              <p style={{ margin: 0, color: '#065f46', fontWeight: 600 }}>
                🛠️ <strong>Feasibility:</strong> Built using standard APIs (Google Maps/UPI) to work on low-end smartphones and slow networks.
              </p>
            </div>
          </div>
        </InfoCard>

        {/* Section 5: Privacy & Safety */}
        <InfoCard title="🔒 Privacy & Safety" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px' }}>
              <p style={{ margin: 0, color: '#166534', fontSize: '14px', fontWeight: 600 }}>
                ✅ <strong>Anonymous Rights Education:</strong> Your questions about rights are never shared with employers.
              </p>
            </div>
            <div style={{ padding: '12px', background: '#fce7f3', borderRadius: '8px' }}>
              <p style={{ margin: 0, color: '#831843', fontSize: '14px', fontWeight: 600 }}>
                🔐 <strong>Encrypted Data:</strong> Your Digital Vault for Aadhaar and certificates is protected by enterprise-grade security.
              </p>
            </div>
            <div style={{ padding: '12px', background: '#dbeafe', borderRadius: '8px' }}>
              <p style={{ margin: 0, color: '#0c4a6e', fontSize: '14px', fontWeight: 600 }}>
                🛡️ <strong>Proactive Protection:</strong> Receive AI alerts about potential job scams or unsafe work locations.
              </p>
            </div>
          </div>
        </InfoCard>

        {/* CTA Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center',
          color: 'white',
          marginBottom: '24px'
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '24px' }}>🚀 Ready to Start?</h3>
          <p style={{ margin: '0 0 24px 0', fontSize: '16px' }}>
            Tap the button below, and GuruSakhi will guide you through your first step toward financial independence!
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '14px 32px',
              background: 'white',
              color: '#0d9488',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            🌟 Go to Application →
          </button>
          <button
            onClick={() => playVoiceHindi('ViyaStree में आपका स्वागत है। आपकी सुरक्षा, शिक्षा और समृद्धि के लिए यहाँ हैं।')}
            style={{
              marginTop: '12px',
              marginLeft: '12px',
              padding: '12px 20px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid white',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            🔊 Hindi Welcome
          </button>
        </div>
      </div>
    </main>
  )
}
