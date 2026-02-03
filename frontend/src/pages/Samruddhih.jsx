import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/base/PageHeader'
import InfoCard from '../components/base/InfoCard'
import Badge from '../components/base/Badge'

/**
 * Samruddhih (Livelihood) Page
 * 
 * Professional job portal interface.
 * Design: Serious, trustworthy, job-portal-like.
 * Emphasizes skill-match and clear actions.
 */
const COLORS = {
  primary: '#0d9488', // Teal
  primaryDark: '#115e59',
  accent: '#d97706', // Gold
  accentLight: '#fef3c7',
  bg: '#f0f9ff',
  surface: 'rgba(255, 255, 255, 0.9)',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  border: '#e2e8f0',
  success: '#10b981',
  gradientTeal: 'linear-gradient(135deg, #0d9488 0%, #115e59 100%)',
  gradientGold: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
}

export default function Samruddhih() {
  const [activeTab, setActiveTab] = useState('jobs')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user, saveOpportunity } = useAuth()

  // State for new sections
  const [jobReadinessAnswers, setJobReadinessAnswers] = useState({})
  const [businessMindsetAnswers, setBusinessMindsetAnswers] = useState({})
  const [communityLeadershipAnswers, setCommunityLeadershipAnswers] = useState({})
  const [swipedJobIdx, setSwipedJobIdx] = useState(0)
  const [rozgarModal, setRozgarModal] = useState(null)
  const [udyamModal, setUdyamModal] = useState(null)
  const [kutumbModal, setKutumbModal] = useState(null)
  const [jobDetailModal, setJobDetailModal] = useState(null)
  const [fundingIntent, setFundingIntent] = useState('')
  const [literacyDone, setLiteracyDone] = useState(false)
  const [businessPlan, setBusinessPlan] = useState({
    idea: '',
    market: '',
    tools: '',
    cost: '',
    sales: '',
    purpose: ''
  })
  const [planGenerated, setPlanGenerated] = useState(false)
  const [planError, setPlanError] = useState('')

  // Playback function for Hindi audio
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
      console.warn('Hindi voice not supported', e)
    }
  }

  // Government Schemes Data
  const schemes = [
    {
      id: 'scheme_mudra',
      title: 'Pradhan Mantri Mudra Yojana',
      type: 'Business Loan',
      description: 'Loans up to ₹10 Lakhs for small enterprises. No collateral required.',
      tags: ['Loan', 'Business', 'No Collateral'],
      link: 'https://www.mudra.org.in/'
    },
    {
      id: 'scheme_standup',
      title: 'Stand Up India',
      type: 'Entrepreneurship',
      description: 'Bank loans ₹10L - ₹1Cr for SC/ST and Women entrepreneurs for greenfield projects.',
      tags: ['High Value', 'Entrepreneurship'],
      link: 'https://www.standupmitra.in/'
    },
    {
      id: 'scheme_sukanya',
      title: 'Sukanya Samriddhi Yojana',
      type: 'Savings',
      description: 'High-interest savings scheme for the girl child with tax benefits.',
      tags: ['Savings', 'Girl Child', 'Tax Free'],
      link: 'https://www.nsiindia.gov.in/'
    },
    {
      id: 'scheme_ehaat',
      title: 'Mahila E-Haat',
      type: 'Marketing',
      description: 'Direct online marketing platform for women entrepreneurs to sell products.',
      tags: ['Marketing', 'Sales', 'Digital'],
      link: 'http://mahilaehaat.rmk.nic.in/'
    }
  ]

  async function saveOpportunityClick(oppId) {
    setLoading(true)
    const j = await saveOpportunity(oppId)
    setMessage('✓ Opportunity saved successfully!')
    setLoading(false)
  }

  // Demo opportunities with skill matching
  const opportunities = [
    {
      id: 'opp_456',
      title: 'Digital Marketing Intern',
      company: 'TechCorp India',
      location: 'Remote',
      type: 'Part-time',
      salary: '₹30,000 - ₹50,000/month',
      requiredSkills: ['digital_marketing_basic', 'social_media', 'content_writing'],
      description: 'Looking for a motivated individual to help with our digital marketing campaigns.',
      matchPercentage: 67 // 2/3 skills matched
    },
    {
      id: 'opp_789',
      title: 'Data Entry Operator',
      company: 'BizSolutions Ltd',
      location: 'Pune',
      type: 'Full-time',
      salary: '₹20,000 - ₹25,000/month',
      requiredSkills: ['excel_intermediate', 'data_entry', 'ms_office'],
      description: 'Seeking detail-oriented candidate for data management role',
      matchPercentage: user.progress.completed_skills?.includes('excel_intermediate') ? 33 : 0
    },
    {
      id: 'opp_101',
      title: 'Tailoring Instructor',
      company: 'Community Skill Center',
      location: 'Mumbai',
      type: 'Contract',
      salary: '₹25,000/month',
      requiredSkills: ['tailoring_basic', 'tailoring_advanced', 'teaching'],
      description: 'Teach tailoring skills to women in the community',
      matchPercentage: user.progress.completed_skills?.includes('tailoring_basic') ? 33 : 0
    }
  ]

  // Calculate matched and missing skills
  const getUserSkills = () => user.progress.completed_skills || []

  const getSkillMatch = (oppSkills) => {
    const userSkills = getUserSkills()
    const matched = oppSkills.filter(s => userSkills.includes(s))
    const missing = oppSkills.filter(s => !userSkills.includes(s))
    return { matched, missing }
  }

  const completedSkills = getUserSkills().map(s => s.toLowerCase())
  const trustScore = Math.min(100, (completedSkills.length * 12) + (businessMindsetAnswers.profit === 'b' ? 10 : 0))
  const trustLabel = trustScore >= 70 ? 'High' : trustScore >= 40 ? 'Moderate' : 'Low'
  const hasFinancialBadge = completedSkills.some(s => s.includes('finance') || s.includes('financial') || s.includes('upi'))
  const aadhaarLinked = user?.profile?.aadhaarLinked === true
  const mindsetPassed = businessMindsetAnswers.profit === 'b'

  const estimatedProfit = (() => {
    const cost = parseFloat(businessPlan.cost)
    const sales = parseFloat(businessPlan.sales)
    if (Number.isNaN(cost) || Number.isNaN(sales)) return null
    return sales - cost
  })()

  return (
    <main id="main" className="dashboard samruddhih-page">
      <div className="dashboard-shell samruddhih-shell">
        {/* Hero Header */}
        <div className="samruddhih-hero">
          <div className="samruddhih-hero-logo">
            <img src="/samruddhih-logo.jpg" alt="Samruddhih Logo" />
          </div>
          <div className="samruddhih-hero-content">
            <h1>Samruddhih — Livelihood</h1>
            <p>Opportunities and Government Schemes for financial independence</p>
          </div>
        </div>

        {/* Modern Tab Navigation */}
        <div className="samruddhih-tabs">
        {[
          { id: 'jobs', icon: '💼', label: 'Jobs & Gigs' },
          { id: 'rozgar', icon: '🔍', label: 'RozgarSetu' },
          { id: 'udyam', icon: '🚀', label: 'UdyamSakhi' },
          { id: 'kutumb', icon: '👨‍👩‍👧', label: 'KutumbSahay' },
          { id: 'schemes', icon: '🏛️', label: 'Govt Schemes' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`samruddhih-tab ${activeTab === tab.id ? 'is-active' : ''}`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
        </div>

      {activeTab === 'jobs' ? (
        <>
          {/* User Skills Summary */}
          <div style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #f0fdfa 100%)',
            borderRadius: '20px',
            padding: '24px',
            border: `1px solid ${COLORS.primary}30`,
            boxShadow: '0 4px 15px rgba(13, 148, 136, 0.08)',
            marginBottom: '24px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: COLORS.primaryDark }}>
              <span>✅</span> Your Verified Skills
            </h3>
            <div className="flex flex-wrap gap-sm">
              {getUserSkills().length > 0 ? (
                getUserSkills().map(skill => (
                  <Badge key={skill} style={{ background: 'white', border: `1px solid ${COLORS.primary}`, color: COLORS.primary }}>
                    {skill.replace(/_/g, ' ')}
                  </Badge>
                ))
              ) : (
                <span className="text-secondary">
                  Complete courses in the Shiksha section to build your skills
                </span>
              )}
            </div>
          </div>

          {/* Opportunity Listings */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {opportunities.map(opp => {
              const { matched, missing } = getSkillMatch(opp.requiredSkills)
              const isSaved = user.saved_opportunities?.includes(opp.id)

              return (
                <div key={opp.id} style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.03)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 20px 30px rgba(0,0,0,0.06)'
                    e.currentTarget.style.borderColor = COLORS.primary
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.03)'
                    e.currentTarget.style.borderColor = '#e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '12px', textTransform: 'uppercase', color: COLORS.textSecondary, letterSpacing: '0.5px', marginBottom: '4px' }}>
                        {opp.company}
                      </div>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: COLORS.textPrimary }}>
                        {opp.title}
                      </h3>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px', fontSize: '13px', color: COLORS.textSecondary }}>
                        <span>📍 {opp.location}</span>
                        <span>•</span>
                        <span>⏱️ {opp.type}</span>
                      </div>
                    </div>
                    {matched.length > 0 && (
                      <div style={{
                        background: opp.matchPercentage >= 50 ? '#dcfce7' : '#f1f5f9',
                        color: opp.matchPercentage >= 50 ? '#166534' : '#475569',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontWeight: '700',
                        fontSize: '13px',
                        textAlign: 'center'
                      }}>
                        {Math.round((matched.length / opp.requiredSkills.length) * 100)}% Match
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: '20px', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: COLORS.textPrimary, marginBottom: '4px' }}>
                      {opp.salary}
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', color: COLORS.textSecondary }}>{opp.description}</p>
                  </div>

                  {/* Skills Section */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: COLORS.textSecondary, marginBottom: '8px', textTransform: 'uppercase' }}>
                      Required Skills
                    </div>
                    <div className="flex flex-wrap gap-sm">
                      {/* Matched Skills */}
                      {matched.map(skill => (
                        <Badge key={skill} style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' }}>
                          ✓ {skill.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                      {/* Missing Skills */}
                      {missing.map(skill => (
                        <Badge key={skill} style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }}>
                          {skill.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                    {missing.length > 0 && (
                      <div style={{ fontSize: '12px', color: COLORS.accent, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>💡</span>
                        <span>Build missing skills in <strong>Shiksha</strong> to confirm your job!</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      style={{
                        flex: 1,
                        background: 'white',
                        border: `1px solid ${COLORS.border}`,
                        color: COLORS.textSecondary,
                        padding: '12px',
                        borderRadius: '10px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                      onClick={() => saveOpportunityClick(opp.id)}
                      disabled={loading || isSaved}
                    >
                      {isSaved ? '✓ Saved' : 'Save'}
                    </button>
                    <button
                      style={{
                        flex: 1,
                        background: COLORS.primary,
                        color: 'white',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '10px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
                      }}
                      onClick={() => navigate('/dashboard/apply', { state: { job: opp } })}
                    >
                      Apply Now →
                    </button>
                  </div>

                  {message && opp.id === 'opp_456' && (
                    <div style={{ marginTop: '12px', color: COLORS.success, fontSize: '13px', fontWeight: '500', textAlign: 'center' }}>
                      {message}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      ) : activeTab === 'rozgar' ? (
        <>
          {/* 🔍 RozgarSetu – Find Jobs */}

          {/* Header section with context */}
          <div style={{ marginBottom: '24px', padding: '0 8px' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: COLORS.textPrimary }}>🔍 RozgarSetu</h2>
            <p style={{ margin: 0, color: COLORS.textSecondary }}>Hyper-local opportunities tailored for your location and skills.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>

            {/* LEFT COLUMN: Map & Nearby */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* NEARBY OPPORTUNITIES - Map Widget */}
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '20px',
                border: `1px solid ${COLORS.border}`,
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: COLORS.textPrimary }}>
                    <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '6px', borderRadius: '8px', fontSize: '14px' }}>📍</span>
                    Nearby Opportunities
                  </h4>
                  <button
                    onClick={() => window.alert('Interactive Full Screen Map Feature - Coming Soon!')}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '12px',
                      color: COLORS.primary,
                      fontWeight: '600',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    View Full Map ↗
                  </button>
                </div>

                {/* Map Container */}
                <div style={{
                  borderRadius: '16px',
                  height: '320px',
                  position: 'relative',
                  border: '2px solid #e2e8f0',
                  overflow: 'hidden',
                  background: '#f1f5f9'
                }}>
                  {/* Background Street Grid */}
                  <svg style={{ position: 'absolute', inset: 0, opacity: 0.15, background: '#f8fafc' }} viewBox="0 0 500 300" preserveAspectRatio="none">
                    <defs>
                      <pattern id="rozgar-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#64748b" strokeWidth="2" />
                      </pattern>
                    </defs>
                    <rect width="500" height="300" fill="url(#rozgar-grid)" />
                    <line x1="50" y1="20" x2="450" y2="280" stroke="#94a3b8" strokeWidth="12" />
                    <line x1="20" y1="150" x2="480" y2="150" stroke="#94a3b8" strokeWidth="10" />
                  </svg>

                  {/* Parks/Green areas */}
                  <div style={{
                    position: 'absolute',
                    left: '40%',
                    top: '60%',
                    width: '120px',
                    height: '80px',
                    background: '#dcfce7',
                    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                    opacity: 0.8,
                    pointerEvents: 'none'
                  }}></div>

                  {/* User Location */}
                  <div style={{
                    position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
                    width: '24px', height: '24px', background: COLORS.primary, borderRadius: '50%', border: '4px solid white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 5
                  }}>
                    <div style={{ position: 'absolute', inset: -12, border: `2px solid ${COLORS.primary}`, borderRadius: '50%', opacity: 0.3, animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }}></div>
                  </div>

                  {/* Job Pins */}
                  {[
                    { id: 1, title: 'Retail', x: 25, y: 30, color: '#f59e0b', type: 'retail' },
                    { id: 2, title: 'Logistics', x: 75, y: 40, color: '#ef4444', type: 'logistics' },
                    { id: 3, title: 'Sales', x: 60, y: 70, color: '#8b5cf6', type: 'sales' }
                  ].map(job => (
                    <button
                      key={job.id}
                      onClick={() => setJobDetailModal({
                        type: 'nearby',
                        title: job.title === 'Retail' ? 'Retail Assistant' : job.title === 'Logistics' ? 'Logistics Helper' : 'Sales Associate',
                        distance: '1.2 km',
                        salary: '₹12,000/mo',
                        earning: 'Daily Payouts',
                        safety: 4.8,
                        description: 'Local job opportunity verified for safety.',
                        walking_route: '10 min walk via Main Market road.'
                      })}
                      style={{
                        position: 'absolute',
                        left: `${job.x}%`,
                        top: `${job.y}%`,
                        background: 'white',
                        color: job.color,
                        border: `2px solid ${job.color}`,
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'transform 0.2s',
                        zIndex: 10
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
                    >
                      <span style={{ fontSize: '10px' }}>●</span> {job.title}
                    </button>
                  ))}

                  <div style={{
                    position: 'absolute', bottom: '12px', right: '12px',
                    background: 'rgba(255,255,255,0.9)', padding: '6px 12px', borderRadius: '8px',
                    fontSize: '11px', fontWeight: '600', color: COLORS.textSecondary,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', gap: '8px'
                  }}>
                    <span>🟢 Safe Zone</span>
                    <span>🔵 Verified</span>
                  </div>
                </div>
              </div>

              {/* NGO & GOVT ROLES */}
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '24px',
                border: `1px solid ${COLORS.border}`,
              }}>
                <h4 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: COLORS.textPrimary }}>
                  <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '6px', borderRadius: '8px', fontSize: '14px' }}>🤝</span>
                  NGO & Government Roles
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    {
                      id: 1,
                      title: 'NRLM Community Coordinator',
                      org: 'Ministry of Women & Child Dev',
                      type: 'Full-time',
                      tag: 'Govt',
                      roleType: 'Field Coordination',
                      location: 'Block & District level',
                      stipend: '₹8,000–₹12,000 / month',
                      description: 'Coordinate self-help groups (SHGs), track livelihoods, and support community training drives.',
                      responsibilities: ['Mobilize SHG members', 'Maintain progress registers', 'Coordinate training sessions', 'Report monthly outcomes'],
                      applyLink: 'https://www.nrlm.gov.in/',
                      benefits: 'eShram Insurance, Health Benefits, Monthly Stipend ₹8000, Travel Allowance',
                      eligibility: ['Age 18-40 years', 'Resident of state', 'Basic literacy (8th pass)', 'Able to work in community']
                    },
                    {
                      id: 2,
                      title: 'Anganwadi Worker',
                      org: 'State Health Dept',
                      type: 'Part-time',
                      tag: 'Stable',
                      roleType: 'Community Care',
                      location: 'Local Anganwadi Center',
                      stipend: '₹6,000–₹10,000 / month',
                      description: 'Support early childhood care, nutrition, and community health awareness.',
                      responsibilities: ['Track child health records', 'Coordinate nutrition distribution', 'Assist mothers with welfare schemes'],
                      applyLink: 'https://wcd.nic.in/',
                      benefits: 'Maternity Leave (6 months), Pension Eligibility, Lunch Provided, Educational Support',
                      eligibility: ['Age 21-45 years', '12th pass or higher', 'Health clearance required', 'Resident of village']
                    },
                    {
                      id: 3,
                      title: 'Digital Champion',
                      org: 'NITI Aayog',
                      type: 'Contract',
                      tag: 'Skill',
                      roleType: 'Digital Enablement',
                      location: 'Community Centers',
                      stipend: '₹7,000–₹15,000 / month',
                      description: 'Help local women adopt digital services, payments, and online forms.',
                      responsibilities: ['Train women on digital tools', 'Assist with online forms', 'Promote digital safety'],
                      applyLink: 'https://www.niti.gov.in/',
                      benefits: 'Stipend + Incentives, Free Skills Training, Certificate, Career Path to IT Jobs',
                      eligibility: ['Age 18-35 years', 'Smartphone access', 'Willing to train others', 'Tech-savvy']
                    }
                  ].map(job => (
                    <div
                      key={job.id}
                      onClick={() => setJobDetailModal({ ...job, workType: job.type, type: 'ngo' })}
                      style={{
                        padding: '16px',
                        border: '1px solid #f1f5f9',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        background: '#f8fafc',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                        e.currentTarget.style.borderColor = COLORS.border;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f8fafc';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = '#f1f5f9';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div style={{ fontWeight: '600', fontSize: '15px', color: COLORS.textPrimary }}>{job.title}</div>
                        <Badge style={{ background: '#ecfccb', color: '#4d7c0f', fontSize: '10px' }}>{job.tag}</Badge>
                      </div>
                      <div style={{ fontSize: '13px', color: COLORS.textSecondary, marginBottom: '8px' }}>{job.org}</div>
                      <div style={{ fontSize: '12px', display: 'flex', gap: '8px', color: COLORS.textSecondary }}>
                        <span style={{ background: 'white', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>{job.type}</span>
                        <span style={{ background: 'white', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', color: COLORS.success, borderColor: '#bbf7d0' }}>✓ Verified Employer</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Home Based & Quiz */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* HOME BASED WORK - Swipeable Card Deck */}
              <div style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                borderRadius: '24px',
                padding: '24px',
                color: 'white',
                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
                position: 'relative',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>🏠 Home-Based Work</h4>
                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                      Flexible Hours
                    </div>
                  </div>

                  {[
                    { id: 1, title: 'Data Entry Specialist', time: 'Flexible', match: 85, skills: ['Typing', 'Excel'], pay: '₹15,000' },
                    { id: 2, title: 'Content Translator', time: 'Part-time', match: 72, skills: ['English', 'Hindi'], pay: '₹10,000' },
                    { id: 3, title: 'Virtual Sales Rep', time: 'Flexible', match: 90, skills: ['Communication'], pay: 'Commission' }
                  ].map((job, idx) => (
                    swipedJobIdx === idx && (
                      <div key={job.id} style={{ animation: 'fadeIn 0.4s ease' }}>
                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '16px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                          <h3 style={{ margin: '0 0 8px 0', fontSize: '22px' }}>{job.title}</h3>
                          <div style={{ display: 'flex', gap: '12px', fontSize: '14px', opacity: 0.9, marginBottom: '16px' }}>
                            <span>⏰ {job.time}</span>
                            <span>💰 {job.pay}</span>
                          </div>

                          <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '12px', textTransform: 'uppercase', opacity: 0.7, marginBottom: '8px' }}>Requirements</div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {job.skills.map(s => (
                                <span key={s} style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '8px', fontSize: '12px' }}>{s}</span>
                              ))}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '12px' }}>
                            <div style={{ fontSize: '24px', fontWeight: '800' }}>{job.match}%</div>
                            <div style={{ fontSize: '13px', lineHeight: 1.4 }}>
                              <strong>High Match!</strong> Your skills align well with this role.
                            </div>
                          </div>
                        </div>

                        <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                          <button
                            onClick={() => setJobDetailModal({ type: 'remote', ...job, description: 'Work from home opportunity verified by UdyamSakhi.', tools: 'Laptop/Phone required' })}
                            style={{ flex: 1, background: 'white', color: '#4f46e5', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => setSwipedJobIdx((idx + 1) % 3)}
                            style={{ width: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '20px', color: 'white' }}
                          >
                            →
                          </button>
                        </div>
                      </div>
                    )
                  ))}
                </div>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', opacity: 0.7 }}>
                  Swipe to explore • Verified Home Jobs
                </div>
              </div>

              {/* Job Readiness Quiz */}
              <div style={{
                background: '#fffbeb',
                borderRadius: '24px',
                padding: '24px',
                border: '1px solid #fcd34d'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ background: '#f59e0b', color: 'white', padding: '10px', borderRadius: '12px', fontSize: '20px' }}>📋</div>
                  <div>
                    <h4 style={{ margin: 0, color: '#92400e' }}>Job Readiness Check</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#b45309' }}>Complete to get verified badge</p>
                  </div>
                </div>

                <div style={{ background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #fde68a' }}>
                  <p style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#78350f', fontWeight: '500' }}>
                    Do you have a bank account linked to your Aadhaar for direct payment?
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      className={`btn`}
                      style={{ flex: 1, background: jobReadinessAnswers.hasBank === 'yes' ? '#d97706' : '#fef3c7', color: jobReadinessAnswers.hasBank === 'yes' ? 'white' : '#92400e', border: 'none', padding: '10px', borderRadius: '10px', fontWeight: '600' }}
                      onClick={() => setJobReadinessAnswers({ hasBank: 'yes' })}
                    >
                      Yes
                    </button>
                    <button
                      className={`btn`}
                      style={{ flex: 1, background: jobReadinessAnswers.hasBank === 'no' ? '#d97706' : '#fef3c7', color: jobReadinessAnswers.hasBank === 'no' ? 'white' : '#92400e', border: 'none', padding: '10px', borderRadius: '10px', fontWeight: '600' }}
                      onClick={() => {
                        setJobReadinessAnswers({ hasBank: 'no' })
                        playVoiceHindi('अपना बैंक खाता खोलने के लिए, नजदीकी बैंक में जाएं और आधार कार्ड लाएं।')
                      }}
                    >
                      No
                    </button>
                  </div>
                  {jobReadinessAnswers.hasBank === 'no' && (
                    <div style={{ marginTop: '12px', padding: '10px', background: '#ecfdf5', borderRadius: '8px', color: '#065f46', fontSize: '13px', display: 'flex', gap: '8px' }}>
                      <span>🔊</span> Playing instructions for you...
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </>
      ) : activeTab === 'udyam' ? (
        <>
          {/* 🚀 UdyamSakhi – Micro-Entrepreneurship Support */}

          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: COLORS.textPrimary }}>🚀 UdyamSakhi</h2>
            <p style={{ margin: 0, color: COLORS.textSecondary }}>From Idea to Income: Your Entrepreneurial Journey</p>
          </div>

          <div style={{
            marginTop: '16px',
            padding: '32px',
            background: 'linear-gradient(135deg, #0d9488 0%, #115e59 100%)',
            borderRadius: '24px',
            color: 'white',
            marginBottom: '32px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(13, 148, 136, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative circles */}
            <div style={{ position: 'absolute', top: -20, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
            <div style={{ position: 'absolute', bottom: -30, right: -10, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>

            <h3 style={{ margin: '0 0 12px 0', fontSize: '28px', fontWeight: '800' }}>Start Your Business Today</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '16px', opacity: 0.9 }}>
              Follow our proven 5-step roadmap: Idea → Skills → Funding → Launch → Growth
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn"
                style={{ background: '#fbbf24', color: '#1f2937', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                onClick={() => setUdyamModal({ type: 'startup' })}
              >
                ✨ Create Business Plan
              </button>
              <button
                className="btn"
                style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}
                onClick={() => setUdyamModal({ type: 'loan' })}
              >
                💰 Check Loan Eligibility
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>

            {/* Card 1: Funding */}
            <div
              style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', textAlign: 'center', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ width: '60px', height: '60px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', margin: '0 auto 16px' }}>💰</div>
              <h4 style={{ margin: '0 0 8px 0', color: COLORS.textPrimary }}>Small Business Loan</h4>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: COLORS.textSecondary }}>Collateral-free loans (MUDRA) up to ₹10 Lakhs.</p>
              <button className="btn" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${COLORS.primary}`, color: COLORS.primary, background: 'white', fontWeight: '600', cursor: 'pointer' }} onClick={() => setUdyamModal({ type: 'loan' })}>View Schemes</button>
            </div>

            {/* Card 2: Tools */}
            <div
              style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', textAlign: 'center', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ width: '60px', height: '60px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', margin: '0 auto 16px' }}>�️</div>
              <h4 style={{ margin: '0 0 8px 0', color: COLORS.textPrimary }}>Business Tools</h4>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: COLORS.textSecondary }}>Ledgers, invoice makers, and marketing templates.</p>
              <button className="btn" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${COLORS.primary}`, color: COLORS.primary, background: 'white', fontWeight: '600', cursor: 'pointer' }} onClick={() => setUdyamModal({ type: 'tools' })}>Open Toolkit</button>
            </div>

            {/* Card 3: Track */}
            <div
              style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', textAlign: 'center', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ width: '60px', height: '60px', background: '#fef3c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', margin: '0 auto 16px' }}>📊</div>
              <h4 style={{ margin: '0 0 8px 0', color: COLORS.textPrimary }}>Track Progress</h4>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: COLORS.textSecondary }}>Monitor sales, expenses, and profits simply.</p>
              <button className="btn" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${COLORS.primary}`, color: COLORS.primary, background: 'white', fontWeight: '600', cursor: 'pointer' }} onClick={() => setUdyamModal({ type: 'progress' })}>Open Tracker</button>
            </div>
          </div>

          {/* Business Mindset Quiz */}
          <div style={{ padding: '24px', background: '#fff7ed', borderRadius: '20px', border: '1px solid #ffedd5' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ fontSize: '32px' }}>🧠</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#9a3412' }}>Entrepreneur Mindset Check</h4>
                <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#c2410c' }}>Test your business acumen with this quick scenario.</p>
                <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #fed7aa' }}>
                  <strong>Scenario: You made ₹500 profit today. What is the best next step?</strong>
                  <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      className={`btn`}
                      style={{ flex: 1, minWidth: '120px', background: businessMindsetAnswers.profit === 'a' ? '#f97316' : '#fff7ed', color: businessMindsetAnswers.profit === 'a' ? 'white' : '#c2410c', border: '1px solid #fdba74', padding: '10px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                      onClick={() => setBusinessMindsetAnswers({ profit: 'a' })}
                    >
                      Spend it all
                    </button>
                    <button
                      className={`btn`}
                      style={{ flex: 1, minWidth: '120px', background: businessMindsetAnswers.profit === 'b' ? '#f97316' : '#fff7ed', color: businessMindsetAnswers.profit === 'b' ? 'white' : '#c2410c', border: '1px solid #fdba74', padding: '10px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                      onClick={() => setBusinessMindsetAnswers({ profit: 'b' })}
                    >
                      Reinvest 20%
                    </button>
                  </div>
                  {businessMindsetAnswers.profit === 'b' && (
                    <div style={{ marginTop: '12px', color: '#166534', fontWeight: '600', fontSize: '14px' }}>
                      ✓ Correct! Reinvesting helps your business grow.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </>
      ) : activeTab === 'kutumb' ? (
        <>
          {/* 👨‍👩‍👧 KutumbSahay Samuh – Family & Child Co-ops */}

          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: COLORS.textPrimary }}>👨‍👩‍👧 KutumbSahay</h2>
            <p style={{ margin: 0, color: COLORS.textSecondary }}>Stronger Together: Community Support & Childcare</p>
          </div>

          <div style={{
            marginTop: '16px',
            padding: '32px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
            borderRadius: '24px',
            color: 'white',
            marginBottom: '32px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(124, 58, 237, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: -20, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
            <div style={{ position: 'absolute', bottom: -30, right: -10, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>

            <h3 style={{ margin: '0 0 12px 0', fontSize: '28px', fontWeight: '800' }}>Unite for Progress</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '16px', opacity: 0.9 }}>
              Join forces with other women for savings, childcare, and growth.
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn"
                style={{ background: '#facc15', color: '#4c1d95', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                onClick={() => setKutumbModal({ type: 'shg' })}
              >
                🤝 Join a Group
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>

            {/* Feature 1: Childcare */}
            <div
              style={{ background: 'white', borderRadius: '24px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', textAlign: 'center', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ width: '80px', height: '80px', background: '#ffe4e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 16px' }}>👶</div>
              <h4 style={{ margin: '0 0 8px 0', color: COLORS.textPrimary }}>Childcare Co-ops</h4>
              <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: COLORS.textSecondary }}>Find or form a neighborhood creche.</p>
              <button className="btn" style={{ width: '100%', background: 'white', color: '#be123c', border: '1px solid #fda4af', padding: '10px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }} onClick={() => setKutumbModal({ type: 'childcare' })}>Find Near You</button>
            </div>

            {/* Feature 2: SHG */}
            <div
              style={{ background: 'white', borderRadius: '24px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', textAlign: 'center', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ width: '80px', height: '80px', background: '#fae8ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 16px' }}>🤝</div>
              <h4 style={{ margin: '0 0 8px 0', color: COLORS.textPrimary }}>Self-Help Groups</h4>
              <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: COLORS.textSecondary }}>Connect with local SHGs for savings & support.</p>
              <button className="btn" style={{ width: '100%', background: 'white', color: '#7e22ce', border: '1px solid #d8b4fe', padding: '10px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }} onClick={() => setKutumbModal({ type: 'shg' })}>Connect Now</button>
            </div>

            {/* Feature 3: Map */}
            <div
              style={{ background: 'white', borderRadius: '24px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', textAlign: 'center', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ width: '80px', height: '80px', background: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 16px' }}>🗺️</div>
              <h4 style={{ margin: '0 0 8px 0', color: COLORS.textPrimary }}>Community Map</h4>
              <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: COLORS.textSecondary }}>Locate Anganwadis and community halls.</p>
              <button className="btn" style={{ width: '100%', background: 'white', color: '#0369a1', border: '1px solid #7dd3fc', padding: '10px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }} onClick={() => setKutumbModal({ type: 'board' })}>Open Map</button>
            </div>
          </div>

          {/* Community Leadership Quiz */}
          <div style={{ marginTop: '32px', padding: '32px', background: 'linear-gradient(to right, #f0fdf4, #ffffff)', borderRadius: '24px', border: '1px solid #bbf7d0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ fontSize: '48px', background: '#dcfce7', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>👑</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, color: '#166534', fontSize: '20px' }}>Community Leader Badge</h4>
                  <Badge style={{ background: '#fef08a', color: '#854d0e' }}>Level 1</Badge>
                </div>
                <div style={{ marginBottom: '16px', color: '#15803d', fontSize: '16px' }}>
                  <strong>Quiz:</strong> How many members are needed to register a basic Self-Help Group?
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {['3-5', '10-15', '20+'].map((opt, i) => (
                    <button
                      key={opt}
                      className={`btn`}
                      style={{
                        flex: 1,
                        minWidth: '100px',
                        background: communityLeadershipAnswers.shgMembers === ['a', 'b', 'c'][i] ? '#16a34a' : 'white',
                        color: communityLeadershipAnswers.shgMembers === ['a', 'b', 'c'][i] ? 'white' : '#166534',
                        border: '1px solid #86efac',
                        padding: '12px',
                        borderRadius: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onClick={() => setCommunityLeadershipAnswers({ shgMembers: ['a', 'b', 'c'][i] })}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {communityLeadershipAnswers.shgMembers === 'b' && (
                  <div style={{ marginTop: '16px', padding: '12px', background: '#dcfce7', borderRadius: '12px', color: '#166534', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>✅</span> Correct! 10-15 members are ideal for a manageable and effective group.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px', textAlign: 'center', padding: '24px', background: '#f8fafc', borderRadius: '16px' }} className="text-secondary">
            <h5 style={{ margin: '0 0 8px 0', color: COLORS.textSecondary }}>Official Partners</h5>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', opacity: 0.7 }}>
              <span>🏛️ NRLM (DAY-NRLM)</span>
              <span>🤝 Mission Shakti</span>
              <span>🏦 NABARD</span>
            </div>
          </div>
        </>
      ) : (
        <div style={{ display: 'grid', gap: '24px' }}>
          {schemes.map(scheme => (
            <InfoCard key={scheme.id}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                    {scheme.type}
                  </div>
                  <h3 className="card-title" style={{ marginBottom: '8px', color: '#1e293b' }}>
                    {scheme.title}
                  </h3>
                  <p className="text-secondary" style={{ marginBottom: '16px' }}>
                    {scheme.description}
                  </p>
                  <div className="flex flex-wrap gap-sm" style={{ marginBottom: '24px' }}>
                    {scheme.tags.map(tag => (
                      <Badge key={tag} variant={tag === 'Loan' || tag === 'Money' ? 'teal' : 'neutral'}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  View Details ↗
                </a>
              </div>
            </InfoCard>
          ))}

          <div style={{ padding: '24px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#0369a1' }}>Need help applying?</h4>
            <p style={{ margin: 0, color: '#0c4a6e', fontSize: '14px' }}>
              Visit your nearest <strong>Common Service Centre (CSC)</strong> or bank branch. You can also ask for guidance in the Shaktih section.
            </p>
          </div>
        </div>
      )}

      {rozgarModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: 20, borderRadius: 10, maxWidth: 640, width: '95%' }}>
            <button onClick={() => setRozgarModal(null)} style={{ float: 'right', border: 'none', background: 'transparent', fontSize: 20 }}>×</button>
            <h3 style={{ marginTop: 0 }}>
              {rozgarModal.type === 'nearby' && '📍 Nearby Opportunities'}
              {rozgarModal.type === 'remote' && '🏠 Home-Based Work'}
              {rozgarModal.type === 'ngo' && '🤝 NGO & Government Roles'}
            </h3>
            <div style={{ color: '#334155', marginBottom: 16 }}>
              {rozgarModal.type === 'nearby' && 'Retail, logistics, and local service roles available in your area. Swipe to explore opportunities.'}
              {rozgarModal.type === 'remote' && 'Work from home opportunities including data entry, content translation, and digital marketing roles.'}
              {rozgarModal.type === 'ngo' && 'Special women-focused initiatives from NGOs and government agencies providing flexible and supportive work environments.'}
            </div>
            <div style={{ marginTop: 12, textAlign: 'right' }}>
              <button className="btn btn-primary" onClick={() => setRozgarModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Job Detail Modal - Nearby, Remote, NGO */}
      {jobDetailModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: 'white', borderRadius: '12px', width: '95%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ position: 'relative', padding: '20px' }}>
              <button onClick={() => setJobDetailModal(null)} style={{ position: 'absolute', top: '12px', right: '12px', border: 'none', background: 'transparent', fontSize: '24px', cursor: 'pointer' }}>×</button>

              {/* Nearby Job Detail */}
              {jobDetailModal.type === 'nearby' && (
                <>
                  <h2 style={{ marginTop: 0, color: '#1f2937' }}>{jobDetailModal.title}</h2>
                  <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                    📍 {jobDetailModal.distance} away | 💵 {jobDetailModal.earning} | ⭐ Safety: {jobDetailModal.safety}/5
                  </div>

                  <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                    <strong>💼 Role & Earnings</strong>
                    <p style={{ margin: '8px 0', fontSize: '14px' }}>{jobDetailModal.description}</p>
                    <div>Monthly: {jobDetailModal.salary} | {jobDetailModal.earning}</div>
                  </div>

                  <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                    <strong>🛡️ Safety Shield Score: {jobDetailModal.safety}/5</strong>
                    <p style={{ margin: '8px 0', fontSize: '13px' }}>Community-verified safe neighborhood. Well-lit, women-friendly area with nearby transit.</p>
                  </div>

                  <div style={{ background: '#e0e7ff', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                    <strong>🚗 Commute Assist</strong>
                    <p style={{ margin: '8px 0', fontSize: '13px' }}>{jobDetailModal.walking_route}</p>
                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>Show Safest Route on Map</button>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <button className="btn btn-primary" style={{ flex: 1 }}>📞 Call Employer</button>
                    <button className="btn btn-ghost" style={{ flex: 1 }}>💬 Message via ViyaStree</button>
                  </div>

                  <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => playVoiceHindi(`${jobDetailModal.title} नौकरी। दूरी ${jobDetailModal.distance}। मासिक वेतन ${jobDetailModal.salary}। सुरक्षा रेटिंग ${jobDetailModal.safety} में से 5।`)}>
                    🔊 सुनें (हिंदी)
                  </button>
                </>
              )}

              {/* Remote Job Detail */}
              {jobDetailModal.type === 'remote' && (
                <>
                  <h2 style={{ marginTop: 0, color: '#1f2937' }}>{jobDetailModal.title}</h2>
                  <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                    ⏰ {jobDetailModal.time} | Match: {jobDetailModal.match}%
                  </div>

                  <div style={{ background: '#dbeafe', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                    <strong>📊 Skill Match Indicator</strong>
                    <div style={{ marginTop: '8px', background: 'white', height: '20px', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ background: '#0ea5e9', height: '100%', width: `${jobDetailModal.match}%`, transition: 'width 0.3s' }} />
                    </div>
                    <p style={{ margin: '8px 0 0 0', fontSize: '12px' }}>Your completed skills make you a {jobDetailModal.match}% match for this role</p>
                  </div>

                  <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                    <strong>⏱️ Time Flexibility</strong>
                    <p style={{ margin: '8px 0', fontSize: '13px' }}>
                      {jobDetailModal.time === 'Flexible' ? '✓ Work anytime - Balance family & earning' : 'Fixed hours - Predictable schedule'}
                    </p>
                  </div>

                  <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                    <strong>💳 Payment Verification</strong>
                    <p style={{ margin: '8px 0', fontSize: '13px' }}>✓ Verified Payment - Secure, traceable channels via bank transfer</p>
                  </div>

                  <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                    <strong>🛠️ Tool Kit Required</strong>
                    <p style={{ margin: '8px 0', fontSize: '13px' }}>{jobDetailModal.tools}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <button className="btn btn-primary" style={{ flex: 1 }}>Quick Apply</button>
                    <button className="btn btn-ghost" style={{ flex: 1 }}>Save for Later</button>
                  </div>

                  <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => playVoiceHindi(`${jobDetailModal.title}। समय: ${jobDetailModal.time}। मेल: ${jobDetailModal.match} प्रतिशत। आवश्यक उपकरण: ${jobDetailModal.tools}`)}>
                    🔊 सुनें (हिंदी)
                  </button>
                </>
              )}

              {/* NGO/Govt Job Detail */}
              {jobDetailModal.type === 'ngo' && (
                <>
                  <h2 style={{ marginTop: 0, color: '#1f2937' }}>{jobDetailModal.title}</h2>
                  <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                    🏛️ {jobDetailModal.org} {jobDetailModal.workType ? `• ⏱️ ${jobDetailModal.workType}` : ''} {jobDetailModal.location ? `• 📍 ${jobDetailModal.location}` : ''}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {jobDetailModal.tag && (
                      <span style={{ background: '#ecfccb', color: '#4d7c0f', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' }}>
                        {jobDetailModal.tag}
                      </span>
                    )}
                    {jobDetailModal.roleType && (
                      <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' }}>
                        Role: {jobDetailModal.roleType}
                      </span>
                    )}
                    {jobDetailModal.stipend && (
                      <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' }}>
                        Stipend: {jobDetailModal.stipend}
                      </span>
                    )}
                  </div>

                  {jobDetailModal.description && (
                    <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                      <strong>🧾 Role Summary</strong>
                      <p style={{ margin: '8px 0', fontSize: '13px' }}>{jobDetailModal.description}</p>
                    </div>
                  )}

                  {jobDetailModal.responsibilities?.length > 0 && (
                    <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                      <strong>✅ Key Responsibilities</strong>
                      <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '13px' }}>
                        {jobDetailModal.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                      </ul>
                    </div>
                  )}

                  <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                    <strong>🎁 Benefits Summary</strong>
                    <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '13px' }}>
                      {jobDetailModal.benefits
                        ? jobDetailModal.benefits.split(',').map((b, i) => <li key={i}>{b.trim()}</li>)
                        : <li>Benefits details available on the official portal.</li>}
                    </ul>
                  </div>

                  <div style={{ background: '#dbeafe', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                    <strong>✅ Eligibility Checklist</strong>
                    <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '13px' }}>
                      {jobDetailModal.eligibility?.length
                        ? jobDetailModal.eligibility.map((e, i) => <li key={i}>☐ {e}</li>)
                        : <li>Eligibility details available on the official portal.</li>}
                    </ul>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <button
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                      onClick={() => jobDetailModal.applyLink && window.open(jobDetailModal.applyLink, '_blank', 'noopener,noreferrer')}
                    >
                      Open Official Portal ↗
                    </button>
                    <button className="btn btn-ghost" style={{ flex: 1 }}>Ask GuruSakhi</button>
                  </div>

                  <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => playVoiceHindi(`${jobDetailModal.title}। लाभ: ${jobDetailModal.benefits || 'विवरण आधिकारिक पोर्टल पर है'}। योग्यता: ${jobDetailModal.eligibility?.[0] || 'विवरण आधिकारिक पोर्टल पर है'}।`)}>
                    🔊 सुनें (हिंदी)
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {rozgarModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: 20, borderRadius: 10, maxWidth: 640, width: '95%' }}>
            <button onClick={() => setRozgarModal(null)} style={{ float: 'right', border: 'none', background: 'transparent', fontSize: 20 }}>×</button>
            <h3 style={{ marginTop: 0 }}>
              {rozgarModal.type === 'nearby' && '📍 Nearby Opportunities'}
              {rozgarModal.type === 'remote' && '🏠 Home-Based Work'}
              {rozgarModal.type === 'ngo' && '🤝 NGO & Government Roles'}
            </h3>
            <div style={{ color: '#334155', marginBottom: 16 }}>
              {rozgarModal.type === 'nearby' && 'Retail, logistics, and local service roles available in your area. Swipe to explore opportunities.'}
              {rozgarModal.type === 'remote' && 'Work from home opportunities including data entry, content translation, and digital marketing roles.'}
              {rozgarModal.type === 'ngo' && 'Special women-focused initiatives from NGOs and government agencies providing flexible and supportive work environments.'}
            </div>
            <div style={{ marginTop: 12, textAlign: 'right' }}>
              <button className="btn btn-primary" onClick={() => setRozgarModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {udyamModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255,255,255,0.4)'
          }}>
            <div style={{ padding: '24px', background: 'linear-gradient(to right, #f0fdfa, #fff)', borderBottom: '1px solid #ccfbf1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: COLORS.primaryDark, display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px' }}>
                {udyamModal.type === 'loan' && <span style={{ fontSize: '24px' }}>💰</span>}
                {udyamModal.type === 'startup' && <span style={{ fontSize: '24px' }}>📋</span>}
                {udyamModal.type === 'progress' && <span style={{ fontSize: '24px' }}>📊</span>}
                {udyamModal.type === 'tools' && <span style={{ fontSize: '24px' }}>🛠️</span>}
                {udyamModal.type === 'apply' && <span style={{ fontSize: '24px' }}>✅</span>}

                {udyamModal.type === 'loan' && 'Loan Readiness & Eligibility'}
                {udyamModal.type === 'startup' && 'Mera Sapna, Mera Vyapaar'}
                {udyamModal.type === 'progress' && 'Entrepreneur Roadmap'}
                {udyamModal.type === 'tools' && 'Business Toolkit'}
                {udyamModal.type === 'apply' && 'Microfunding Application'}
              </h3>
              <button onClick={() => setUdyamModal(null)} style={{ border: 'none', background: '#e2e8f0', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>✕</button>
            </div>

            <div style={{ padding: '24px' }}>
              {udyamModal.type === 'loan' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 12px 0', color: COLORS.textPrimary }}>🛠️ Trust-First Microfunding Flow</h4>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      <div style={{ background: 'white', borderRadius: '12px', padding: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontWeight: 700, color: COLORS.textPrimary, marginBottom: '6px' }}>Step 1: Purpose Selection</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Choose your Funding Intent</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {['Home business', 'Sewing machine', 'Laptop for digital work', 'Emergency livelihood support'].map(intent => (
                            <button
                              key={intent}
                              className="btn"
                              style={{
                                background: fundingIntent === intent ? COLORS.primary : 'white',
                                color: fundingIntent === intent ? 'white' : COLORS.textSecondary,
                                border: `1px solid ${COLORS.border}`,
                                borderRadius: '999px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: 600
                              }}
                              onClick={() => setFundingIntent(intent)}
                            >
                              {intent}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ background: '#fff7ed', borderRadius: '12px', padding: '12px', border: '1px solid #fed7aa' }}>
                        <div style={{ fontWeight: 700, color: '#9a3412', marginBottom: '6px' }}>Step 2: Eligibility Light-Check</div>
                        <div style={{ fontSize: '12px', color: '#7c2d12', marginBottom: '10px' }}>
                          Self-declaration + Aadhaar (no heavy KYC). Skill progress boosts your Trust Score.
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '12px' }}>
                          <div style={{ fontSize: '12px', color: '#0f172a' }}>
                            Completed {completedSkills.length} Shiksha modules · Trust Score <strong>{trustLabel}</strong>
                          </div>
                          <div style={{ background: '#fff1f2', color: '#9f1239', padding: '4px 10px', borderRadius: '999px', fontWeight: 700, fontSize: '11px' }}>
                            {trustScore}/100
                          </div>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: '#fee2e2', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ width: `${trustScore}%`, height: '100%', background: 'linear-gradient(90deg, #f97316, #22c55e)' }}></div>
                        </div>
                        <div style={{ display: 'grid', gap: '6px', marginTop: '8px', fontSize: '12px', color: '#1f2937' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Badge Check: Financial Literacy 101</span>
                            <strong style={{ color: hasFinancialBadge ? '#166534' : '#b45309' }}>{hasFinancialBadge ? 'Verified' : 'Pending'}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Identity Check: Aadhaar linked</span>
                            <strong style={{ color: aadhaarLinked ? '#166534' : '#b45309' }}>{aadhaarLinked ? 'Linked' : 'Not linked'}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Mindset Quiz</span>
                            <strong style={{ color: mindsetPassed ? '#166534' : '#b45309' }}>{mindsetPassed ? 'Passed' : 'Pending'}</strong>
                          </div>
                        </div>
                      </div>

                      <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '12px', border: '1px solid #bbf7d0' }}>
                        <div style={{ fontWeight: 700, color: '#166534', marginBottom: '6px' }}>Step 3: Literacy Nudge</div>
                        <div style={{ fontSize: '12px', color: '#14532d', marginBottom: '10px' }}>
                          Mandatory 5-minute audio-visual module on budgeting & repayment.
                        </div>
                        <button
                          className="btn"
                          style={{
                            background: literacyDone ? '#16a34a' : COLORS.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '8px 12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            playVoiceHindi('बजटिंग और पुनर्भुगतान की आसान जानकारी। आय और खर्च लिखें, समय पर भुगतान करें, और अपने व्यवसाय को सुरक्षित रखें।')
                            setLiteracyDone(true)
                          }}
                        >
                          {literacyDone ? '✓ Module Completed' : 'Start 5-min Audio Module'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '16px', background: '#f0f9ff', borderRadius: '16px', border: '1px solid #bae6fd' }}>
                    <h4 style={{ margin: '0 0 12px 0', color: '#0c4a6e' }}>💰 Loan Categories (Udyam Tiers)</h4>
                    <div style={{ display: 'grid', gap: '10px', fontSize: '13px', color: '#0f172a' }}>
                      <div>• Zero-Interest Seed Support (₹2,000 – ₹10,000) — first-time home ventures</div>
                      <div>• Low-Interest Growth Loan (₹10,000 – ₹50,000) — scale your business</div>
                      <div>• Group-Backed Microloan — for SHG members</div>
                      <div>• Grant-Linked Funding — CSR/NGO grants for high-impact sectors</div>
                    </div>
                  </div>

                  <div style={{ padding: '16px', background: '#fff7ed', borderRadius: '16px', border: '1px solid #fed7aa' }}>
                    <h4 style={{ margin: '0 0 12px 0', color: '#9a3412' }}>🏛️ Government Resource Integration</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      <button className="btn" style={{ background: '#9a3412', color: 'white', border: 'none', borderRadius: '10px', padding: '8px 12px', fontWeight: '600', cursor: 'pointer' }}
                        onClick={() => window.open('https://udyamsakhi.msme.gov.in/', '_blank', 'noopener,noreferrer')}>
                        Udyam Sakhi Portal ↗
                      </button>
                      <button className="btn" style={{ background: 'white', color: '#9a3412', border: '1px solid #9a3412', borderRadius: '10px', padding: '8px 12px', fontWeight: '600', cursor: 'pointer' }}
                        onClick={() => window.open('https://www.standupmitra.in/', '_blank', 'noopener,noreferrer')}>
                        Stand-Up India ↗
                      </button>
                      <button className="btn" style={{ background: 'white', color: '#9a3412', border: '1px solid #9a3412', borderRadius: '10px', padding: '8px 12px', fontWeight: '600', cursor: 'pointer' }}
                        onClick={() => window.open('https://www.mudra.org.in/', '_blank', 'noopener,noreferrer')}>
                        PMMY (Shishu) ↗
                      </button>
                    </div>
                  </div>

                  <div style={{ padding: '16px', background: '#ecfccb', borderRadius: '16px', border: '1px solid #d9f99d' }}>
                    <h4 style={{ margin: '0 0 12px 0', color: '#365314' }}>📊 Engagement & Transparency</h4>
                    <div style={{ marginBottom: '10px', fontSize: '12px', color: '#365314' }}>Entrepreneurial Roadmap</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', fontSize: '11px', color: '#365314', marginBottom: '8px' }}>
                      <div style={{ background: '#bbf7d0', padding: '6px', borderRadius: '8px', textAlign: 'center' }}>Loan Requested</div>
                      <div style={{ background: '#fde68a', padding: '6px', borderRadius: '8px', textAlign: 'center' }}>Disbursal</div>
                      <div style={{ background: '#ddd6fe', padding: '6px', borderRadius: '8px', textAlign: 'center' }}>Repayment Rewards</div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#365314' }}>Direct Disbursal via UPI or Bank Transfer</div>
                    <div style={{ fontSize: '12px', color: '#365314' }}>ViyaStree Ledger builds your Trust Score with daily income/expense logs</div>
                  </div>

                  <div style={{ padding: '16px', background: '#fef2f2', borderRadius: '16px', border: '1px solid #fecaca' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#7f1d1d' }}>📝 Business Mindset Quiz</h4>
                    <div style={{ fontSize: '13px', color: '#7f1d1d', marginBottom: '10px' }}>
                      What is the best way to use your first business profit?
                    </div>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      <button
                        className="btn"
                        style={{ background: businessMindsetAnswers.profit === 'a' ? '#ef4444' : 'white', color: businessMindsetAnswers.profit === 'a' ? 'white' : '#7f1d1d', border: '1px solid #fecaca', borderRadius: '10px', padding: '8px 12px', fontWeight: '600' }}
                        onClick={() => setBusinessMindsetAnswers({ profit: 'a' })}
                      >
                        A) Spend it on household items
                      </button>
                      <button
                        className="btn"
                        style={{ background: businessMindsetAnswers.profit === 'b' ? '#16a34a' : 'white', color: businessMindsetAnswers.profit === 'b' ? 'white' : '#14532d', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '8px 12px', fontWeight: '600' }}
                        onClick={() => setBusinessMindsetAnswers({ profit: 'b' })}
                      >
                        B) Re-invest in tools/stock and save for EMI
                      </button>
                    </div>
                    {businessMindsetAnswers.profit === 'b' && (
                      <div style={{ marginTop: '8px', fontSize: '12px', color: '#166534', fontWeight: '700' }}>
                        ✓ Financial Literacy Badge unlocked — reduces interest on your next growth loan
                      </div>
                    )}
                  </div>

                  <button
                    className="btn"
                    style={{ background: COLORS.primary, color: 'white', padding: '12px', borderRadius: '12px', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                    onClick={() => setUdyamModal({ type: 'apply' })}
                  >
                    Apply Now
                  </button>
                </div>
              )}

              {udyamModal.type === 'startup' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ padding: '18px', borderRadius: '16px', background: '#f8fafc', border: '2px dashed #cbd5e1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h4 style={{ margin: 0, color: COLORS.textPrimary }}>Path to Prosperity — Startup Guide</h4>
                      <button
                        className="btn"
                        style={{ background: COLORS.primary, color: 'white', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                        onClick={() => playVoiceHindi('नमस्ते! यह स्टार्टअप गाइड आपको कदम-दर-कदम सही रास्ता दिखाएगा। आप बोलें, हम लिखेंगे।')}
                      >
                        🔊 सुनें
                      </button>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: COLORS.textSecondary }}>
                      A unified, step-by-step roadmap to turn your skills into income and financial independence.
                    </p>
                  </div>

                  {/* Step 1 */}
                  <div style={{ background: 'white', borderRadius: '14px', padding: '16px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '6px', textTransform: 'uppercase' }}>
                      Step 1: Hunar Se Vyapaar (Mapping Your Skills)
                    </div>
                    <div style={{ fontSize: '13px', color: '#475569', marginBottom: '10px' }}>
                      Skill Audit: What are you good at? (Cooking, Stitching, Digital Data Entry, Teaching)
                    </div>
                    <input
                      type="text"
                      placeholder="Your skills..."
                      value={businessPlan.idea}
                      onChange={(e) => setBusinessPlan(prev => ({ ...prev, idea: e.target.value }))}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '10px' }}
                    />
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>Shiksha Linkage:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                      {completedSkills.length > 0 ? (
                        completedSkills.map(skill => (
                          <span key={skill} style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' }}>
                            {skill.replace(/_/g, ' ')}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>No skills imported yet. Complete Shiksha modules to auto-link here.</span>
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: '#475569', marginBottom: '6px' }}>The “Why”:</div>
                    <input
                      type="text"
                      placeholder="Support family, build savings, learn a new trade..."
                      value={businessPlan.purpose}
                      onChange={(e) => setBusinessPlan(prev => ({ ...prev, purpose: e.target.value }))}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                    <button
                      className="btn"
                      style={{ marginTop: '8px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: '#334155' }}
                      onClick={() => playVoiceHindi('यह क्यों? क्या आप अपने परिवार का सहारा बनना चाहती हैं, बचत बढ़ाना चाहती हैं, या नया कौशल सीखना चाहती हैं?')}
                    >
                      🔊 सुनें (Why)
                    </button>
                  </div>

                  {/* Step 2 */}
                  <div style={{ background: '#fff7ed', borderRadius: '14px', padding: '16px', border: '1px solid #fed7aa' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#9a3412', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Step 2: Bazaar Ki Pehchaan (Market Understanding)
                    </div>
                    <ul style={{ margin: '0 0 10px 0', paddingLeft: '18px', fontSize: '13px', color: '#78350f', lineHeight: '1.6' }}>
                      <li>Catering/Food: nearby school or office for home-cooked lunch?</li>
                      <li>Tailoring: local boutiques needing embroidery work?</li>
                      <li>Digital Services: WhatsApp Business for local shops?</li>
                    </ul>
                    <div style={{ fontSize: '13px', color: '#78350f', marginBottom: '8px' }}>Who will buy from you?</div>
                    <input
                      type="text"
                      placeholder="Neighbors, local shops, online customers..."
                      value={businessPlan.market}
                      onChange={(e) => setBusinessPlan(prev => ({ ...prev, market: e.target.value }))}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  {/* Step 3 */}
                  <div style={{ background: '#f0f9ff', borderRadius: '14px', padding: '16px', border: '1px solid #bae6fd' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#0c4a6e', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Step 3: Sahi Sadan (Financial Planning & Funding)
                    </div>
                  <div style={{ fontSize: '13px', color: '#0f172a', marginBottom: '8px' }}>Cash In / Cash Out (daily)</div>
                  <input
                    type="text"
                    placeholder="Tools needed (e.g., sewing machine, smartphone, raw materials)"
                    value={businessPlan.tools}
                    onChange={(e) => setBusinessPlan(prev => ({ ...prev, tools: e.target.value }))}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '10px' }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        placeholder="Daily cost (₹)"
                        value={businessPlan.cost}
                        onChange={(e) => setBusinessPlan(prev => ({ ...prev, cost: e.target.value }))}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                      />
                      <input
                        type="text"
                        placeholder="Daily sales (₹)"
                        value={businessPlan.sales}
                        onChange={(e) => setBusinessPlan(prev => ({ ...prev, sales: e.target.value }))}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    {estimatedProfit !== null && (
                      <div style={{ fontSize: '13px', color: '#0f766e', fontWeight: '700', marginBottom: '10px' }}>
                        Estimated Daily Profit: ₹{estimatedProfit}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        className="btn"
                        style={{ background: COLORS.primary, color: 'white', border: 'none', borderRadius: '10px', padding: '10px 14px', fontWeight: '600' }}
                        onClick={() => setUdyamModal({ type: 'apply' })}
                      >
                        💰 Access Seed Support (₹2k–₹10k)
                      </button>
                      <button
                        className="btn"
                        style={{ background: 'white', color: '#0c4a6e', border: '1px solid #0c4a6e', borderRadius: '10px', padding: '10px 14px', fontWeight: '600' }}
                        onClick={() => window.open('https://www.standupmitra.in/', '_blank', 'noopener,noreferrer')}
                      >
                        Stand-Up India ↗
                      </button>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '16px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '6px', textTransform: 'uppercase' }}>
                      Step 4: Digital Pehchaan (Marketing & Identity)
                    </div>
                    <ul style={{ margin: '0 0 10px 0', paddingLeft: '18px', fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                      <li>WhatsApp Business setup & digital catalog</li>
                      <li>ViyaStree QR for “Verified Women Entrepreneur” badge</li>
                      <li>Social selling basics (Instagram/Facebook)</li>
                    </ul>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        className="btn"
                        style={{ background: 'white', border: `1px solid ${COLORS.primary}`, color: COLORS.primary, borderRadius: '10px', padding: '10px 14px', fontWeight: '600' }}
                        onClick={() => window.open('https://www.whatsapp.com/business/', '_blank', 'noopener,noreferrer')}
                      >
                        WhatsApp Business Guide
                      </button>
                      <button
                        className="btn"
                        style={{ background: COLORS.accent, color: 'white', border: 'none', borderRadius: '10px', padding: '10px 14px', fontWeight: '600' }}
                        onClick={() => window.alert('QR generation will be available in Phase 2.')}
                      >
                        Generate QR
                      </button>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div style={{ background: '#fff1f2', borderRadius: '14px', padding: '16px', border: '1px solid #fecdd3' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#7f1d1d', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Step 5: Suraksha aur Niti (Legal & Safety Shield)
                    </div>
                    <ul style={{ margin: '0 0 10px 0', paddingLeft: '18px', fontSize: '13px', color: '#7f1d1d', lineHeight: '1.6' }}>
                      <li>Business rights & harassment-free workplace laws</li>
                      <li>Digital safety for payments and accounts</li>
                      <li>Udyam/MSME registration to unlock benefits</li>
                    </ul>
                    <button
                      className="btn"
                      style={{ background: '#7f1d1d', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 14px', fontWeight: '600' }}
                      onClick={() => window.open('https://udyamregistration.gov.in/', '_blank', 'noopener,noreferrer')}
                    >
                      Start Udyam Registration ↗
                    </button>
                  </div>

                  {/* Success Tree */}
                  <div style={{ padding: '14px', background: '#ecfccb', borderRadius: '12px', border: '1px solid #d9f99d', fontSize: '13px', color: '#365314' }}>
                    <strong>Success Tree:</strong> As you complete each phase, your tree grows and blooms. After your first sale, the <strong>Impact</strong> badge unlocks in your dashboard.
                  </div>

                  {planError && (
                    <div style={{ padding: '10px 12px', background: '#fee2e2', borderRadius: '10px', border: '1px solid #fecaca', fontSize: '12px', color: '#b91c1c' }}>
                      {planError}
                    </div>
                  )}

                  <button
                    className="btn"
                    style={{ background: COLORS.accent, color: 'white', padding: '12px 20px', borderRadius: '10px', border: 'none', fontWeight: '700', width: '100%', cursor: 'pointer' }}
                    onClick={() => {
                      if (!businessPlan.idea || !businessPlan.market || !businessPlan.tools) {
                        setPlanError('Please fill in Skill Audit, Market, and Resource Map to generate your roadmap.')
                        return
                      }
                      setPlanError('')
                      setPlanGenerated(true)
                    }}
                  >
                    Generate Success Roadmap ✨
                  </button>

                  {planGenerated && (
                    <div style={{ padding: '16px', background: '#f0f9ff', borderRadius: '16px', border: '1px solid #bae6fd' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#0c4a6e' }}>✅ Your Success Roadmap (Preview)</h4>
                      <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                        <div><strong>Skills:</strong> {businessPlan.idea}</div>
                        <div><strong>Market:</strong> {businessPlan.market}</div>
                        <div><strong>Resources:</strong> {businessPlan.tools}</div>
                        {businessPlan.purpose && <div><strong>Why:</strong> {businessPlan.purpose}</div>}
                        {estimatedProfit !== null && (
                          <div><strong>Estimated Daily Profit:</strong> ₹{estimatedProfit}</div>
                        )}
                      </div>
                      <div style={{ marginTop: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button className="btn" style={{ background: COLORS.primary, color: 'white', border: 'none', borderRadius: '8px', padding: '8px 14px', fontWeight: 600 }}>
                          Save to Vault
                        </button>
                        <button className="btn" style={{ background: 'white', color: COLORS.primary, border: `1px solid ${COLORS.primary}`, borderRadius: '8px', padding: '8px 14px', fontWeight: 600 }}>
                          Download PDF
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {udyamModal.type === 'apply' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: COLORS.textPrimary }}>8-Step Microfunding Flow</h4>
                    <ol style={{ margin: 0, paddingLeft: '18px', color: '#475569', fontSize: '13px', lineHeight: '1.6' }}>
                      <li>Purpose selection</li>
                      <li>Eligibility light-check</li>
                      <li>5-minute literacy module</li>
                      <li>Select funding tier</li>
                      <li>Upload plan from GuruSakhi vault</li>
                      <li>Share basic business details</li>
                      <li>Choose payout method</li>
                      <li>Review & submit</li>
                    </ol>
                  </div>
                  {udyamModal.step === 1 && (
                    <div style={{ padding: '16px', background: '#f0f9ff', borderRadius: '16px', border: '1px solid #bae6fd' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#0c4a6e' }}>Step 1: Purpose Selection</h4>
                      <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#0f172a' }}>
                        Choose your funding intent so we can recommend the right support.
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {['Home business', 'Sewing machine', 'Laptop for digital work', 'Emergency livelihood support'].map(intent => (
                          <button
                            key={intent}
                            className="btn"
                            style={{
                              background: fundingIntent === intent ? COLORS.primary : 'white',
                              color: fundingIntent === intent ? 'white' : COLORS.textSecondary,
                              border: `1px solid ${COLORS.border}`,
                              borderRadius: '999px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              fontWeight: 600
                            }}
                            onClick={() => setFundingIntent(intent)}
                          >
                            {intent}
                          </button>
                        ))}
                      </div>
                      <button
                        className="btn"
                        style={{
                          marginTop: '12px',
                          background: COLORS.primary,
                          color: 'white',
                          padding: '10px 16px',
                          borderRadius: '10px',
                          border: 'none',
                          fontWeight: '600',
                          opacity: fundingIntent ? 1 : 0.6,
                          cursor: fundingIntent ? 'pointer' : 'not-allowed'
                        }}
                        disabled={!fundingIntent}
                        onClick={() => setUdyamModal(prev => ({ ...prev, step: 2 }))}
                      >
                        Continue to Step 2
                      </button>
                    </div>
                  )}
                  {udyamModal.step === 2 && (
                    <div style={{ padding: '16px', background: '#ecfdf5', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#166534' }}>Step 2: Eligibility Light-Check</h4>
                      <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#14532d' }}>
                        Self-declaration + Aadhaar. No heavy KYC required. Skill progress improves approval chances.
                      </p>
                      <div style={{ display: 'grid', gap: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#14532d' }}>
                          <input type="checkbox" defaultChecked={aadhaarLinked} />
                          Aadhaar linked for direct benefit transfer
                        </label>
                        <input type="text" placeholder="Full Name (as per Aadhaar)" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #bbf7d0' }} />
                        <input type="text" placeholder="Registered Mobile Number" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #bbf7d0' }} />
                      </div>
                      <button
                        className="btn"
                        style={{ marginTop: '12px', background: COLORS.primary, color: 'white', padding: '10px 16px', borderRadius: '10px', border: 'none', fontWeight: '600' }}
                        onClick={() => setUdyamModal(prev => ({ ...prev, step: 3 }))}
                      >
                        Continue to Step 3
                      </button>
                    </div>
                  )}

                  {udyamModal.step === 3 && (
                    <div style={{ padding: '16px', background: '#fff7ed', borderRadius: '16px', border: '1px solid #fed7aa' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#92400e' }}>Step 3: Literacy Nudge (5 min)</h4>
                      <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#78350f' }}>
                        Short audio-visual guidance on budgeting and repayment.
                      </p>
                      <button
                        className="btn"
                        style={{ background: literacyDone ? '#16a34a' : COLORS.primary, color: 'white', padding: '10px 16px', borderRadius: '10px', border: 'none', fontWeight: '600' }}
                        onClick={() => {
                          playVoiceHindi('आय और खर्च का हिसाब रखें, समय पर किश्त जमा करें, और अपने व्यवसाय को सुरक्षित रखें।')
                          setLiteracyDone(true)
                        }}
                      >
                        {literacyDone ? '✓ Module Completed' : 'Start Audio Module'}
                      </button>
                      <button
                        className="btn"
                        style={{ marginTop: '10px', background: COLORS.primary, color: 'white', padding: '10px 16px', borderRadius: '10px', border: 'none', fontWeight: '600', opacity: literacyDone ? 1 : 0.6 }}
                        disabled={!literacyDone}
                        onClick={() => setUdyamModal(prev => ({ ...prev, step: 4 }))}
                      >
                        Continue to Step 4
                      </button>
                    </div>
                  )}

                  {udyamModal.step === 4 && (
                    <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: COLORS.textPrimary }}>Step 4: Select Funding Tier</h4>
                      <div style={{ display: 'grid', gap: '10px', fontSize: '13px', color: '#475569' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input type="radio" name="tier" /> Zero-Interest Seed Support (₹2k–₹10k)
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input type="radio" name="tier" /> Low-Interest Growth Loan (₹10k–₹50k)
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input type="radio" name="tier" /> Group-Backed Microloan (SHG)
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input type="radio" name="tier" /> Grant-Linked Funding (CSR/NGO)
                        </label>
                      </div>
                      <button className="btn" style={{ marginTop: '12px', background: COLORS.primary, color: 'white', padding: '10px 16px', borderRadius: '10px', border: 'none', fontWeight: '600' }}
                        onClick={() => setUdyamModal(prev => ({ ...prev, step: 5 }))}
                      >
                        Continue to Step 5
                      </button>
                    </div>
                  )}

                  {udyamModal.step === 5 && (
                    <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: COLORS.textPrimary }}>Step 5: Upload Plan from GuruSakhi Vault</h4>
                      <input type="file" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                      <button className="btn" style={{ marginTop: '12px', background: COLORS.primary, color: 'white', padding: '10px 16px', borderRadius: '10px', border: 'none', fontWeight: '600' }}
                        onClick={() => setUdyamModal(prev => ({ ...prev, step: 6 }))}
                      >
                        Continue to Step 6
                      </button>
                    </div>
                  )}

                  {udyamModal.step === 6 && (
                    <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: COLORS.textPrimary }}>Step 6: Share Basic Business Details</h4>
                      <div style={{ display: 'grid', gap: '10px' }}>
                        <input type="text" placeholder="Business name" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        <input type="text" placeholder="Business category" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        <input type="text" placeholder="Location" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                      </div>
                      <button className="btn" style={{ marginTop: '12px', background: COLORS.primary, color: 'white', padding: '10px 16px', borderRadius: '10px', border: 'none', fontWeight: '600' }}
                        onClick={() => setUdyamModal(prev => ({ ...prev, step: 7 }))}
                      >
                        Continue to Step 7
                      </button>
                    </div>
                  )}

                  {udyamModal.step === 7 && (
                    <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: COLORS.textPrimary }}>Step 7: Choose Payout Method</h4>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                        <input type="radio" name="payout" /> Bank Transfer
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                        <input type="radio" name="payout" /> UPI
                      </label>
                      <button className="btn" style={{ marginTop: '12px', background: COLORS.primary, color: 'white', padding: '10px 16px', borderRadius: '10px', border: 'none', fontWeight: '600' }}
                        onClick={() => setUdyamModal(prev => ({ ...prev, step: 8 }))}
                      >
                        Continue to Step 8
                      </button>
                    </div>
                  )}

                  {udyamModal.step === 8 && (
                    <div style={{ padding: '16px', background: '#ecfdf5', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#166534' }}>Step 8: Review & Submit</h4>
                      <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#14532d' }}>
                        Suggested: 6 monthly instalments with a 2-week grace period.
                      </p>
                      <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#14532d' }}>
                        Submit your application for verification. We’ll update you within 3–5 business days.
                      </p>
                      <button className="btn" style={{ background: COLORS.primary, color: 'white', padding: '10px 16px', borderRadius: '10px', border: 'none', fontWeight: '600' }}
                        onClick={() => setUdyamModal(prev => ({ ...prev, step: 'submitted' }))}
                      >
                        Submit for Approval
                      </button>
                    </div>
                  )}

                  {udyamModal.step === 'submitted' && (
                    <div style={{ padding: '16px', background: '#f0f9ff', borderRadius: '16px', border: '1px solid #bae6fd' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#0c4a6e' }}>✅ Application Submitted</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#475569' }}>
                        Thanks! Your microfunding request is now under review.
                      </p>
                    </div>
                  )}

                  {!udyamModal.step && (
                    <button
                      className="btn"
                      style={{ background: COLORS.primary, color: 'white', padding: '12px', borderRadius: '12px', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                      onClick={() => setUdyamModal(prev => ({ ...prev, step: 1 }))}
                    >
                      Proceed to Step 1
                    </button>
                  )}
                </div>
              )}

              {udyamModal.type === 'tools' && (
                <div style={{ display: 'grid', gap: '16px' }}>
                  <p style={{ margin: 0, color: COLORS.textSecondary, marginBottom: '8px' }}>Digital tools to manage your business efficiently.</p>
                  {[
                    { icon: '📒', name: 'Digital Ledger', desc: 'Record daily income & expenses.', bg: '#fff7ed', border: '#ffedd5' },
                    { icon: '🧾', name: 'Invoice Maker', desc: 'Create professional bills for customers.', bg: '#f0fdf4', border: '#bbf7d0' },
                    { icon: '🎨', name: 'Marketing Templates', desc: 'Social media posters for your products.', bg: '#eff6ff', border: '#bfdbfe' }
                  ].map((tool, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: tool.bg, border: `1px solid ${tool.border}`, borderRadius: '16px' }}>
                      <div style={{ fontSize: '24px' }}>{tool.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '700', color: COLORS.textPrimary }}>{tool.name}</div>
                        <div style={{ fontSize: '13px', color: COLORS.textSecondary }}>{tool.desc}</div>
                      </div>
                      <button className="btn" style={{ background: 'white', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>Launch</button>
                    </div>
                  ))}
                </div>
              )}

              {udyamModal.type === 'progress' && (
                <div>
                  <h4 style={{ margin: '0 0 16px 0', color: COLORS.textPrimary }}>Your Entrepreneurial Milestones</h4>
                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '24px', paddingLeft: '20px' }}>
                    <div style={{ position: 'absolute', left: '7px', top: '8px', bottom: '0', width: '2px', background: '#e2e8f0' }}></div>
                    {[
                      { title: 'Idea Validation', status: 'completed' },
                      { title: 'Business Registration (Udyam)', status: 'active' },
                      { title: 'Open Bank Account', status: 'pending' },
                      { title: 'First Sale', status: 'pending' }
                    ].map((step, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <div style={{
                          position: 'absolute', left: '-20px', top: '2px', width: '16px', height: '16px', borderRadius: '50%', border: '2px solid white',
                          background: step.status === 'completed' ? COLORS.success : step.status === 'active' ? COLORS.accent : '#cbd5e1',
                          boxShadow: step.status === 'active' ? `0 0 0 4px ${COLORS.accentLight}` : 'none'
                        }}></div>
                        <div style={{ fontWeight: '600', color: step.status === 'pending' ? '#94a3b8' : COLORS.textPrimary }}>{step.title}</div>
                        <div style={{ fontSize: '12px', color: COLORS.textSecondary }}>{step.status === 'completed' ? 'Done' : step.status === 'active' ? 'In Progress' : 'Locked'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {kutumbModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ padding: '24px', background: 'linear-gradient(to right, #fdf4ff, #fff)', borderBottom: '1px solid #fce7f3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#86198f', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px' }}>
                {kutumbModal.type === 'childcare' && <span style={{ fontSize: '24px' }}>👶</span>}
                {kutumbModal.type === 'shg' && <span style={{ fontSize: '24px' }}>🤝</span>}
                {kutumbModal.type === 'board' && <span style={{ fontSize: '24px' }}>🗺️</span>}

                {kutumbModal.type === 'childcare' && 'Childcare Support'}
                {kutumbModal.type === 'shg' && 'Self-Help Groups'}
                {kutumbModal.type === 'board' && 'Community Map'}
              </h3>
              <button onClick={() => setKutumbModal(null)} style={{ border: 'none', background: '#e2e8f0', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>✕</button>
            </div>

            <div style={{ padding: '24px' }}>
              {kutumbModal.type === 'childcare' && (
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '16px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', background: '#ffe4e6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🏡</div>
                    <div>
                      <div style={{ fontWeight: '600' }}>Local Anganwadi Center</div>
                      <div style={{ fontSize: '13px', color: COLORS.textSecondary }}>0.5 km away • Free for ages 0-6</div>
                      <div style={{ fontSize: '12px', color: '#be123c', marginTop: '4px' }}>Open: 9 AM - 2 PM</div>
                    </div>
                    <button className="btn" style={{ marginLeft: 'auto', background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' }}>Call</button>
                  </div>
                  <button className="btn" style={{ background: COLORS.primary, color: 'white', padding: '12px', borderRadius: '12px', border: 'none', fontWeight: '600', width: '100%', cursor: 'pointer' }}>Request Neighborhood Creche</button>
                </div>
              )}

              {kutumbModal.type === 'shg' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ padding: '16px', background: '#fdf4ff', borderRadius: '16px', border: '1px solid #fae8ff' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#86198f' }}>✨ Benefits of Joining</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}><span>💰</span> Urgent Loans</div>
                      <div style={{ display: 'flex', gap: '6px' }}><span>📈</span> Skill Training</div>
                      <div style={{ display: 'flex', gap: '6px' }}><span>🏛️</span> Govt Subsidies</div>
                      <div style={{ display: 'flex', gap: '6px' }}><span>👭</span> Social Support</div>
                    </div>
                  </div>
                  <h4 style={{ margin: '8px 0 0 0' }}>Groups Near You</h4>
                  {[
                    { name: 'Jagriti Mahila Mandel', members: 12, savings: '₹50/week' },
                    { name: 'Saraswati SHG', members: 15, savings: '₹100/week' }
                  ].map((g, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                      <div>
                        <div style={{ fontWeight: '600' }}>{g.name}</div>
                        <div style={{ fontSize: '12px', color: COLORS.textSecondary }}>{g.members} Members • Saves {g.savings}</div>
                      </div>
                      <button style={{ background: 'white', border: `1px solid ${COLORS.primary}`, color: COLORS.primary, borderRadius: '20px', padding: '4px 12px', cursor: 'pointer' }}>Connect</button>
                    </div>
                  ))}
                </div>
              )}

              {kutumbModal.type === 'board' && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: COLORS.textSecondary }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🗺️</div>
                  <p>Map view is loading relevant community centers...</p>
                  <button className="btn" style={{ background: COLORS.primary, color: 'white', padding: '10px 24px', borderRadius: '24px', border: 'none', marginTop: '16px', cursor: 'pointer' }}>Refresh Location</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </main>
  )
}
