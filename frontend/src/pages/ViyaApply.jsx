import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/base/PageHeader'
import InfoCard from '../components/base/InfoCard'
import Badge from '../components/base/Badge'

/**
 * ViyaApply - Unified Job Application System
 * Multi-step form with skill matching, resume building, and role-specific guidance
 */
export default function ViyaApply() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  
  const jobData = location.state?.job || {
    title: 'Job Title',
    company: 'Company',
    location: 'Location',
    requiredSkills: []
  }

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    phone: user?.phone || '',
    qualification: '',
    skills: [],
    experience: '',
    address: user?.address || '',
    resume: null,
    buildResume: true
  })
  const [submitted, setSubmitted] = useState(false)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)

  // Hindi voice function
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

  // Sample badges from Shiksha (simulated)
  const availableBadges = [
    { id: 'social_media', label: 'Social Media Basics', icon: '📱' },
    { id: 'content_writing', label: 'Content Writing', icon: '✍️' },
    { id: 'digital_marketing', label: 'Digital Marketing', icon: '📊' },
    { id: 'excel_basic', label: 'Excel Basics', icon: '📈' },
    { id: 'excel_intermediate', label: 'Excel Intermediate', icon: '📊' },
    { id: 'data_entry', label: 'Data Entry', icon: '⌨️' },
    { id: 'teaching', label: 'Teaching Skills', icon: '👩‍🏫' },
    { id: 'tailoring', label: 'Tailoring Techniques', icon: '🧵' }
  ]

  const toggleSkill = (skillId) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter(s => s !== skillId)
        : [...prev.skills, skillId]
    }))
  }

  const handleResumeUpload = (e) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        resume: e.target.files[0],
        buildResume: false
      }))
    }
  }

  const generateResume = () => {
    const resumeContent = `
RESUME - ${formData.name}

PERSONAL INFORMATION
Phone: ${formData.phone}
Address: ${formData.address}

EDUCATION
Qualification: ${formData.qualification || 'Not specified'}

SKILLS
${formData.skills.map(s => `• ${availableBadges.find(b => b.id === s)?.label || s}`).join('\n')}

EXPERIENCE
${formData.experience || 'Seeking first opportunity in this field'}

OBJECTIVE
Seeking an opportunity to grow and contribute to organizational success while developing professional skills.
    `
    const blob = new Blob([resumeContent], { type: 'text/plain' })
    setFormData(prev => ({
      ...prev,
      resume: new File([blob], 'resume.txt', { type: 'text/plain' })
    }))
  }

  const handleSubmit = async () => {
    playVoiceHindi('आपकी आवेदन सफलतापूर्वक जमा की जा रही है।')
    setShowSuccessAnimation(true)
    
    setTimeout(() => {
      setSubmitted(true)
    }, 2000)
  }

  // Role-specific content
  const getRoleGuidance = () => {
    const jobTitle = jobData.title.toLowerCase()
    if (jobTitle.includes('digital marketing')) {
      return {
        focus: '📱 Digital Literacy Focus',
        nudge: '🌟 Showcase your Social Media and Content Writing badges from Shiksha here!',
        tips: 'Digital marketing roles value online presence and communication skills.'
      }
    } else if (jobTitle.includes('data entry')) {
      return {
        focus: '⌨️ Accuracy & Tool Proficiency',
        nudge: '🌟 Attaching your Excel Intermediate certification improves your selection chances.',
        tips: 'Data entry requires precision, speed, and proficiency with office tools.'
      }
    } else if (jobTitle.includes('tailoring')) {
      return {
        focus: '🧵 Community Impact',
        nudge: '🌟 Mention your experience in teaching tailoring to other women in your community.',
        tips: 'Teaching roles value both skill expertise and ability to mentor others.'
      }
    }
    return {
      focus: '💼 Professional Development',
      nudge: '🌟 Highlight relevant skills and experience.',
      tips: 'Make your application stand out with specific examples.'
    }
  }

  const guidance = getRoleGuidance()

  if (submitted) {
    return (
      <main id="main" style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px', maxWidth: '500px' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
          <h2 style={{ color: '#14b8a6', marginBottom: '16px' }}>Application Submitted!</h2>
          <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '16px' }}>
            Your application for <strong>{jobData.title}</strong> has been successfully submitted. We'll notify you soon about the next steps.
          </p>
          <button
            onClick={() => navigate('/dashboard/samruddhih')}
            style={{
              padding: '12px 24px',
              background: '#14b8a6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ← Back to Jobs
          </button>
        </div>
      </main>
    )
  }

  return (
    <main id="main" style={{ background: '#f8fafc' }}>
      <PageHeader
        title="📝 ViyaApply — Job Application"
        subtitle={`Apply for: ${jobData.title} at ${jobData.company}`}
      />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        {/* Progress Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Step {step} of 4</span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>{Math.round((step / 4) * 100)}%</span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            background: '#e2e8f0',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(step / 4) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #14b8a6 0%, #0d9488 100%)',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>

        {/* Role Guidance Card */}
        <InfoCard style={{ marginBottom: '24px', background: '#f0fdf4', border: '2px solid #86efac' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h5 style={{ margin: '0 0 8px 0', color: '#166534' }}>{guidance.focus}</h5>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#15803d' }}>{guidance.nudge}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#166534', fontStyle: 'italic' }}>💡 {guidance.tips}</p>
            </div>
            <button
              onClick={() => playVoiceHindi(guidance.nudge)}
              style={{
                background: 'white',
                border: '2px solid #86efac',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >
              🔊
            </button>
          </div>
        </InfoCard>

        {/* Step 1: Personal Information */}
        {step === 1 && (
          <InfoCard title="Step 1: Personal Information">
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your full name"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Age *</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="Age"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Mobile number"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              style={{
                marginTop: '24px',
                width: '100%',
                padding: '12px',
                background: '#14b8a6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Continue →
            </button>
          </InfoCard>
        )}

        {/* Step 2: Education & Skills */}
        {step === 2 && (
          <InfoCard title="Step 2: Education & Skills">
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Highest Qualification *</label>
                <select
                  value={formData.qualification}
                  onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select qualification</option>
                  <option value="10th">10th Pass</option>
                  <option value="12th">12th Pass</option>
                  <option value="diploma">Diploma</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>Select Your Skills *</label>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                  Choose badges you've earned from Shiksha or training programs:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
                  {availableBadges.map(badge => (
                    <button
                      key={badge.id}
                      onClick={() => toggleSkill(badge.id)}
                      style={{
                        padding: '10px',
                        background: formData.skills.includes(badge.id) ? '#14b8a6' : '#f1f5f9',
                        color: formData.skills.includes(badge.id) ? 'white' : '#1f2937',
                        border: `2px solid ${formData.skills.includes(badge.id) ? '#0d9488' : '#cbd5e1'}`,
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {badge.icon} {badge.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f1f5f9',
                  color: '#1f2937',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#14b8a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Continue →
              </button>
            </div>
          </InfoCard>
        )}

        {/* Step 3: Experience & Address */}
        {step === 3 && (
          <InfoCard title="Step 3: Experience & Location">
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Work Experience</label>
                <textarea
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder="Describe your work experience, projects, or relevant activities..."
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Current Address *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Your residential address"
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f1f5f9',
                  color: '#1f2937',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(4)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#14b8a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Continue →
              </button>
            </div>
          </InfoCard>
        )}

        {/* Step 4: Resume */}
        {step === 4 && (
          <InfoCard title="Step 4: Resume Upload">
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ padding: '16px', background: '#f0f9ff', borderRadius: '8px', border: '2px solid #93c5fd' }}>
                <h5 style={{ margin: '0 0 12px 0', color: '#0c4a6e' }}>📋 Resume Options</h5>
                
                {/* Build Resume */}
                <div style={{ marginBottom: '16px', padding: '12px', background: 'white', borderRadius: '6px', border: '1px solid #93c5fd' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      checked={formData.buildResume}
                      onChange={() => {
                        setFormData(prev => ({ ...prev, buildResume: true }))
                        generateResume()
                      }}
                    />
                    <span style={{ fontWeight: 600 }}>🤖 Build a Professional Resume</span>
                  </label>
                  <p style={{ fontSize: '12px', color: '#0284c7', margin: '8px 0 0 28px' }}>
                    We'll generate a professional CV from your information above
                  </p>
                </div>

                {/* Upload Resume */}
                <div style={{ padding: '12px', background: 'white', borderRadius: '6px', border: '1px solid #93c5fd' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      checked={!formData.buildResume}
                      onChange={() => setFormData(prev => ({ ...prev, buildResume: false }))}
                    />
                    <span style={{ fontWeight: 600 }}>📁 Upload Your Resume</span>
                  </label>
                  {!formData.buildResume && (
                    <input
                      type="file"
                      onChange={handleResumeUpload}
                      accept=".pdf,.doc,.docx,.txt"
                      style={{ margin: '8px 0 0 28px', fontSize: '12px' }}
                    />
                  )}
                  <p style={{ fontSize: '12px', color: '#0284c7', margin: '8px 0 0 28px' }}>
                    Accepted formats: PDF, DOC, DOCX, TXT
                  </p>
                </div>
              </div>

              {formData.buildResume && (
                <div style={{ padding: '16px', background: '#fef3c7', borderRadius: '8px', border: '2px solid #fcd34d' }}>
                  <h5 style={{ margin: '0 0 12px 0', color: '#92400e' }}>✅ Resume Ready</h5>
                  <p style={{ fontSize: '14px', color: '#b45309', margin: 0 }}>
                    Your professional resume has been generated with all your information and skills.
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setStep(3)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f1f5f9',
                  color: '#1f2937',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#14b8a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {showSuccessAnimation ? '⏳ Submitting...' : '✅ Submit Application'}
              </button>
            </div>
          </InfoCard>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </main>
  )
}
