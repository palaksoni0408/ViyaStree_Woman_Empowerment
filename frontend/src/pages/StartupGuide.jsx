import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/base/PageHeader'
import Badge from '../components/base/Badge'

/**
 * StartupGuide - "Hunar Se Vyapaar" (Skills to Business)
 * 
 * A comprehensive 5-step startup journey for women entrepreneurs:
 * 1. Hunar Se Vyapaar (Skills Mapping)
 * 2. Bazaar Ki Pehchaan (Market Understanding)
 * 3. Sahi Sadan (Financial Planning)
 * 4. Digital Pehchaan (Marketing & Identity)
 * 5. Suraksha aur Niti (Legal & Safety)
 */
export default function StartupGuide() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Main flow state
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState([])
  const [skills, setSkills] = useState([])
  const [businessPurpose, setBusinessPurpose] = useState(null)
  const [selectedNiche, setSelectedNiche] = useState(null)
  const [pricing, setPricing] = useState({})
  const [budget, setBudget] = useState({ income: 0, expenses: 0 })
  const [businessName, setBusinessName] = useState('')
  const [generatedQR, setGeneratedQR] = useState(false)
  const treeRef = useRef(null)

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
      console.warn('Hindi voice not supported', e)
    }
  }

  // Load Lottie animation
  function loadLottieAnimation(container, jsonUrl) {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/lottie-web/build/player/lottie.min.js'
    script.onload = () => {
      if (window.lottie && container) {
        window.lottie.loadAnimation({
          container: container,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: jsonUrl
        })
      }
    }
    if (!document.body.querySelector('[src*="lottie-web"]')) {
      document.body.appendChild(script)
    }
  }

  // Mark step as complete
  const markStepComplete = (stepNum) => {
    if (!completedSteps.includes(stepNum)) {
      setCompletedSteps([...completedSteps, stepNum])
      playVoiceHindi('बहुत अच्छा! अगले चरण पर चलें।')
    }
  }

  // Available skills from user
  const availableSkills = [
    'Cooking', 'Stitching', 'Embroidery', 'Weaving',
    'Digital Data Entry', 'Content Writing', 'Teaching',
    'Beauty Services', 'Gardening', 'Handicrafts',
    'WhatsApp Marketing', 'Bookkeeping', 'Social Media'
  ]

  // Business niches
  const businessNiches = [
    { id: 'catering', title: 'Catering & Food', icon: '🍜', desc: 'Home-cooked meals for schools/offices', market: 'Are there schools or offices nearby that need home-cooked lunch delivery?' },
    { id: 'tailoring', title: 'Tailoring & Embroidery', icon: '🪡', desc: 'Stitching, alterations, embroidery work', market: 'Do local boutiques need embroidery or alteration services?' },
    { id: 'digital', title: 'Digital Services', icon: '📱', desc: 'WhatsApp Business, social media management', market: 'Can you help local shops manage their WhatsApp Business accounts?' },
    { id: 'handicrafts', title: 'Handicrafts & Art', icon: '🎨', desc: 'Pottery, paintings, handmade items', market: 'Are there tourists or local markets interested in handmade products?' },
    { id: 'beauty', title: 'Beauty Services', icon: '💄', desc: 'Salon services, makeup, mehendi', market: 'Is there demand for beauty services in your neighborhood?' },
    { id: 'education', title: 'Tutoring & Teaching', icon: '📚', desc: 'Online or offline classes for students', market: 'Are there students in your area needing tuition or skill training?' }
  ]

  // Pricing calculator
  const calculatePrice = (cost, profitMargin) => {
    return Math.ceil(cost * (1 + profitMargin / 100))
  }

  // Steps overview
  const steps = [
    { num: 1, title: 'Hunar Se Vyapaar', emoji: '🎯', desc: 'Map Your Skills' },
    { num: 2, title: 'Bazaar Ki Pehchaan', emoji: '🛍️', desc: 'Understand Your Market' },
    { num: 3, title: 'Sahi Sadan', emoji: '💰', desc: 'Plan Your Finances' },
    { num: 4, title: 'Digital Pehchaan', emoji: '📱', desc: 'Market Your Business' },
    { num: 5, title: 'Suraksha aur Niti', emoji: '🛡️', desc: 'Legal & Safety' }
  ]

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <PageHeader
        title="📖 Startup Guide"
        subtitle="Hunar Se Vyapaar: From Skills to Business"
        icon="🌱"
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        
        {/* HEADER */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          padding: '16px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            ← Back
          </button>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
            Step {currentStep} of {steps.length} | {completedSteps.length} Completed
          </span>
          <button
            onClick={() => playVoiceHindi('आप स्टार्टअप गाइड में स्वागत हैं। हर कदम आपको एक सफल उद्यमी बनने में मदद करेगा।')}
            style={{
              background: '#0ea5e9',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            🔊
          </button>
        </div>

        {/* PROGRESS TRACKER */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px', fontWeight: 600 }}>
            Your Entrepreneurial Journey
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
            {steps.map((step) => (
              <button
                key={step.num}
                onClick={() => step.num <= currentStep && setCurrentStep(step.num)}
                style={{
                  flex: '1',
                  minWidth: '100px',
                  padding: '12px 8px',
                  background: completedSteps.includes(step.num) ? '#dcfce7' : currentStep === step.num ? '#fef3c7' : '#f1f5f9',
                  border: `2px solid ${completedSteps.includes(step.num) ? '#22c55e' : currentStep === step.num ? '#fcd34d' : '#cbd5e1'}`,
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>{step.emoji}</div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#1f2937' }}>{step.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* STEP 1: HUNAR SE VYAPAAR (SKILLS MAPPING) */}
        {currentStep === 1 && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ marginTop: 0, color: '#1f2937' }}>🎯 Hunar Se Vyapaar - Map Your Skills</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              Identify your strengths. Every woman has unique talents that can become a thriving business!
            </p>

            {/* Skill Selection */}
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <h5 style={{ color: '#1f2937', marginTop: 0 }}>What are you good at?</h5>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '8px'
              }}>
                {availableSkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => {
                      if (skills.includes(skill)) {
                        setSkills(skills.filter(s => s !== skill))
                      } else {
                        setSkills([...skills, skill])
                      }
                    }}
                    style={{
                      padding: '10px 12px',
                      background: skills.includes(skill) ? '#0ea5e9' : '#f1f5f9',
                      color: skills.includes(skill) ? 'white' : '#1f2937',
                      border: `2px solid ${skills.includes(skill) ? '#0284c7' : '#cbd5e1'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 500,
                      transition: 'all 0.2s'
                    }}
                  >
                    {skills.includes(skill) ? '✓ ' : ''}{skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Business Purpose */}
            <div style={{ marginTop: '24px', marginBottom: '20px' }}>
              <h5 style={{ color: '#1f2937', marginTop: 0 }}>🎤 What is your purpose?</h5>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                Why do you want to start this business?
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { id: 'family', label: 'Support my family', emoji: '👨‍👩‍👧' },
                  { id: 'savings', label: 'Grow my own savings', emoji: '💰' },
                  { id: 'learn', label: 'Learn a new trade', emoji: '📚' },
                  { id: 'independence', label: 'Financial independence', emoji: '🦅' }
                ].map(purpose => (
                  <button
                    key={purpose.id}
                    onClick={() => {
                      setBusinessPurpose(purpose.id)
                      playVoiceHindi(`आपका उद्देश्य है ${purpose.label}। यह एक महान लक्ष्य है।`)
                    }}
                    style={{
                      padding: '10px 16px',
                      background: businessPurpose === purpose.id ? '#14b8a6' : 'white',
                      color: businessPurpose === purpose.id ? 'white' : '#1f2937',
                      border: `2px solid ${businessPurpose === purpose.id ? '#0d9488' : '#cbd5e1'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {purpose.emoji} {purpose.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                className="btn btn-ghost"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (skills.length > 0 && businessPurpose) {
                    markStepComplete(1)
                    setCurrentStep(2)
                  }
                }}
                disabled={skills.length === 0 || !businessPurpose}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: BAZAAR KI PEHCHAAN (MARKET UNDERSTANDING) */}
        {currentStep === 2 && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ marginTop: 0, color: '#1f2937' }}>🛍️ Bazaar Ki Pehchaan - Understand Your Market</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              Find your niche in the market. Choose a business model that matches your skills and local opportunities.
            </p>

            {/* Niche Selection */}
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <h5 style={{ color: '#1f2937', marginTop: 0 }}>Choose Your Business Niche</h5>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '12px'
              }}>
                {businessNiches.map(niche => (
                  <div
                    key={niche.id}
                    onClick={() => {
                      setSelectedNiche(niche.id)
                      playVoiceHindi(niche.market)
                    }}
                    style={{
                      padding: '16px',
                      background: selectedNiche === niche.id ? '#e0f2fe' : 'white',
                      border: `2px solid ${selectedNiche === niche.id ? '#0ea5e9' : '#cbd5e1'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{niche.icon}</div>
                    <h5 style={{ margin: '0 0 6px 0', color: '#1f2937' }}>{niche.title}</h5>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#64748b' }}>{niche.desc}</p>
                    <p style={{ margin: '0', fontSize: '11px', fontStyle: 'italic', color: '#0ea5e9', fontWeight: 600 }}>
                      Q: {niche.market}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Calculator */}
            {selectedNiche && (
              <div style={{
                background: '#fef3c7',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #fcd34d'
              }}>
                <h5 style={{ margin: '0 0 12px 0', color: '#92400e' }}>💰 Price Your Work</h5>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#92400e', fontWeight: 600 }}>Cost to produce</label>
                    <input
                      type="number"
                      placeholder="e.g., 300"
                      onChange={(e) => setPricing({ ...pricing, cost: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #fcd34d',
                        borderRadius: '4px',
                        marginTop: '4px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#92400e', fontWeight: 600 }}>Profit margin %</label>
                    <input
                      type="number"
                      placeholder="e.g., 40"
                      defaultValue="40"
                      onChange={(e) => setPricing({ ...pricing, margin: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #fcd34d',
                        borderRadius: '4px',
                        marginTop: '4px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
                {pricing.cost && pricing.margin && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    background: '#fef9e7',
                    borderRadius: '4px',
                    border: '1px solid #fbd34d'
                  }}>
                    <div style={{ fontSize: '12px', color: '#92400e', marginBottom: '4px' }}>Your selling price:</div>
                    <div style={{ fontSize: '22px', fontWeight: 600, color: '#b45309' }}>
                      ₹{calculatePrice(pricing.cost, pricing.margin)}
                    </div>
                    <div style={{ fontSize: '11px', color: '#92400e', marginTop: '4px' }}>
                      Profit: ₹{calculatePrice(pricing.cost, pricing.margin) - pricing.cost}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button className="btn btn-ghost" onClick={() => setCurrentStep(1)}>
                ← Back
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (selectedNiche) {
                    markStepComplete(2)
                    setCurrentStep(3)
                  }
                }}
                disabled={!selectedNiche}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SAHI SADAN (FINANCIAL PLANNING) */}
        {currentStep === 3 && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ marginTop: 0, color: '#1f2937' }}>💰 Sahi Sadan - Financial Planning & Funding</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              Understand your cash flow and access zero-interest funding for startup tools.
            </p>

            {/* Budget Tool */}
            <div style={{
              background: '#f0fdf4',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #86efac'
            }}>
              <h5 style={{ margin: '0 0 12px 0', color: '#166534' }}>📊 Daily Cash Flow</h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>Expected daily income</label>
                  <input
                    type="number"
                    placeholder="e.g., 500"
                    onChange={(e) => setBudget({ ...budget, income: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #86efac',
                      borderRadius: '4px',
                      marginTop: '4px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>Daily expenses</label>
                  <input
                    type="number"
                    placeholder="e.g., 200"
                    onChange={(e) => setBudget({ ...budget, expenses: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #86efac',
                      borderRadius: '4px',
                      marginTop: '4px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
              {budget.income > 0 && budget.expenses > 0 && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  background: '#e6fffa',
                  borderRadius: '4px',
                  border: '1px solid #86efac'
                }}>
                  <div style={{ fontSize: '12px', color: '#166534', marginBottom: '4px' }}>Daily profit:</div>
                  <div style={{ fontSize: '22px', fontWeight: 600, color: budget.income - budget.expenses > 0 ? '#15803d' : '#dc2626' }}>
                    ₹{budget.income - budget.expenses}
                  </div>
                  <div style={{ fontSize: '11px', color: '#166534', marginTop: '4px' }}>
                    Monthly: ₹{(budget.income - budget.expenses) * 30}
                  </div>
                </div>
              )}
            </div>

            {/* Funding Link */}
            <div style={{
              background: '#dbeafe',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #93c5fd'
            }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#0c4a6e' }}>🏛️ Zero-Interest Startup Funding</h5>
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#0c4a6e' }}>
                Need ₹2,000 - ₹10,000 for startup tools? Apply for zero-interest seed support through Udyam-Kosh.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/dashboard/udyam-kosh')}
                style={{ background: '#0284c7', color: 'white', border: 'none' }}
              >
                Apply for Funding →
              </button>
            </div>

            {/* Government Schemes */}
            <div style={{
              background: '#fef3c7',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #fcd34d'
            }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#92400e' }}>📱 Government Resources</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: '#92400e' }}>
                  → Udyam Sakhi Portal (MSME Registration)
                </button>
                <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: '#92400e' }}>
                  → Pradhan Mantri Mudra Yojana
                </button>
                <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: '#92400e' }}>
                  → Stand-Up India (₹10L - ₹1Cr)
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button className="btn btn-ghost" onClick={() => setCurrentStep(2)}>
                ← Back
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  markStepComplete(3)
                  setCurrentStep(4)
                }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: DIGITAL PEHCHAAN (MARKETING & IDENTITY) */}
        {currentStep === 4 && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ marginTop: 0, color: '#1f2937' }}>📱 Digital Pehchaan - Market Your Business</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              Go digital! Create your business identity and reach more customers.
            </p>

            {/* Business Name */}
            <div style={{
              background: '#e0f2fe',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #93c5fd'
            }}>
              <h5 style={{ margin: '0 0 12px 0', color: '#0c4a6e' }}>📛 Your Business Name</h5>
              <input
                type="text"
                placeholder="e.g., Priya's Home Catering"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #93c5fd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* WhatsApp Business */}
            <div style={{
              background: '#dcfce7',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #86efac'
            }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#166534' }}>💬 WhatsApp Business Setup</h5>
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#166534' }}>
                Create a digital catalog to show your products to customers on WhatsApp.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
                <button className="btn btn-primary" style={{ background: '#22c55e', border: 'none', color: 'white' }}>
                  📱 Create Catalog
                </button>
                <button className="btn btn-ghost">📸 Add Photos</button>
                <button className="btn btn-ghost">💰 Enable Payments</button>
              </div>
            </div>

            {/* QR Code Generator */}
            <div style={{
              background: '#f3e8ff',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #d8b4fe'
            }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#6b21a8' }}>🔗 ViyaStree QR Code</h5>
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#6b21a8' }}>
                Generate a custom QR code for your business. Customers can scan to see your "Verified Women Entrepreneur" badge and pay via UPI.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setGeneratedQR(true)
                  playVoiceHindi('आपका क्यूआर कोड तैयार हो गया है। ग्राहक इसे स्कैन कर सकते हैं।')
                }}
                style={{ background: '#8b5cf6', border: 'none', color: 'white' }}
              >
                🔲 Generate My QR Code
              </button>
              {generatedQR && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  background: '#faf5ff',
                  borderRadius: '6px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔲</div>
                  <div style={{ fontSize: '11px', color: '#6b21a8', marginBottom: '8px' }}>
                    Your QR Code is ready! Share with customers.
                  </div>
                  <Badge variant="success">✓ Verified Women Entrepreneur</Badge>
                </div>
              )}
            </div>

            {/* Social Selling */}
            <div style={{
              background: '#fce7f3',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #f472b6'
            }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#831843' }}>📸 Social Selling Basics</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                <button className="btn btn-ghost">📱 Instagram Tips</button>
                <button className="btn btn-ghost">👥 Facebook Groups</button>
                <button className="btn btn-ghost">🎬 Video Content</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button className="btn btn-ghost" onClick={() => setCurrentStep(3)}>
                ← Back
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (businessName) {
                    markStepComplete(4)
                    setCurrentStep(5)
                  }
                }}
                disabled={!businessName}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SURAKSHA AUR NITI (LEGAL & SAFETY) */}
        {currentStep === 5 && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ marginTop: 0, color: '#1f2937' }}>🛡️ Suraksha aur Niti - Legal & Safety Shield</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              Protect yourself and your business. Know your rights and stay safe.
            </p>

            {/* Business Rights */}
            <div style={{
              background: '#fef3c7',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #fcd34d'
            }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#92400e' }}>⚖️ Know Your Business Rights</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Property rights: Your business belongs to you',
                  'Fair trade: You can set your own prices',
                  'Harassment-free workplace: Report any workplace harassment',
                  'Right to leave: You can work on your own terms'
                ].map((right, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    gap: '8px',
                    padding: '8px',
                    background: '#fef9e7',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#92400e'
                  }}>
                    <span style={{ fontWeight: 600 }}>✓</span>
                    <span>{right}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Digital Safety */}
            <div style={{
              background: '#dbeafe',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #93c5fd'
            }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#0c4a6e' }}>🔐 Digital Security Tips</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Use strong passwords for business accounts',
                  'Enable two-factor authentication',
                  'Verify customer identities before transactions',
                  'Keep business and personal accounts separate',
                  'Report scams to authorities immediately'
                ].map((tip, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    gap: '8px',
                    padding: '8px',
                    background: '#e0f2fe',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#0c4a6e'
                  }}>
                    <span style={{ fontWeight: 600 }}>🔒</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MSME Registration */}
            <div style={{
              background: '#f0fdf4',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #86efac'
            }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#166534' }}>📝 Register Your Business (MSME)</h5>
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#166534' }}>
                Get an Udyam registration to unlock government benefits like:
              </p>
              <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', fontSize: '13px', color: '#166534' }}>
                <li>Access to government loans</li>
                <li>Tax benefits</li>
                <li>Subsidy schemes</li>
                <li>Recognition as formal business</li>
              </ul>
              <button className="btn btn-primary" style={{ background: '#22c55e', border: 'none', color: 'white' }}>
                📋 Start Udyam Registration
              </button>
            </div>

            {/* Success Tree */}
            <div style={{
              background: 'linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              border: '2px solid #86efac',
              marginBottom: '20px'
            }}>
              <h5 style={{ margin: '0 0 12px 0', color: '#166534' }}>🌳 Your Success Tree</h5>
              <div style={{
                fontSize: '48px',
                marginBottom: '12px',
                animation: 'grow 0.5s ease-out'
              }}>
                🌱
              </div>
              <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#166534' }}>
                You've completed {completedSteps.length} out of 5 steps!
              </p>
              <p style={{ margin: '0', fontSize: '12px', color: '#166534', fontStyle: 'italic' }}>
                {completedSteps.length === 5 ? '🎉 Your tree is blooming! Ready to launch!' : 'Complete all steps to bloom your success tree.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setCurrentStep(4)}>
                ← Back
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  markStepComplete(5)
                  playVoiceHindi('बहुत बढ़िया! आपका स्टार्टअप गाइड पूरा हो गया। अब आप व्यापार शुरू करने के लिए तैयार हैं।')
                  setTimeout(() => navigate('/dashboard'), 1500)
                }}
              >
                🎉 Complete & Launch →
              </button>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes grow {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
