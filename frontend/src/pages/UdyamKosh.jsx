import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/base/PageHeader'
import Badge from '../components/base/Badge'

/**
 * UdyamKosh - The Trust-First Microfunding Flow
 * 
 * An 8-step journey from funding need identification to disbursal and repayment rewards.
 * Designed with inclusive digital access for women with varying literacy levels.
 * 
 * Steps:
 * 1. Purpose Selection (Funding Intent)
 * 2. Eligibility Light-Check (Self-Declaration)
 * 3. Literacy Nudge (Budgeting Video)
 * 4. Loan Amount Selection (Interactive Slider)
 * 5. Eligibility Verification (Processing)
 * 6. Loan Approval & Disbursal
 * 7. ViyaStree Ledger Setup
 * 8. Graduation Tracker
 */
export default function UdyamKosh() {
  const { user, saveOpportunity } = useAuth()
  const navigate = useNavigate()
  
  // Main flow state
  const [currentStep, setCurrentStep] = useState(1)
  const [loanIntent, setLoanIntent] = useState(null)
  const [loanAmount, setLoanAmount] = useState(10000)
  const [eligibilityAnswers, setEligibilityAnswers] = useState({})
  const [literacyWatched, setLiteracyWatched] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [loanApproved, setLoanApproved] = useState(false)
  const [disbursalSuccess, setDisbursalSuccess] = useState(false)
  const [voiceRecording, setVoiceRecording] = useState(null)
  const videoRef = useRef(null)
  const mediaRecorder = useRef(null)

  // Graduation tracker state
  const [repaymentsMade, setRepaymentsMade] = useState(2)
  const [totalRepaymentTarget] = useState(3)

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

  // Load Lottie animation from CDN
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
    document.body.appendChild(script)
  }

  // Simulate processing and approval
  const handleProcessing = () => {
    setProcessing(true)
    const processingRef = useRef(null)
    
    // Load Dharmachakra animation
    if (processingRef.current) {
      loadLottieAnimation(processingRef.current, 'https://assets1.lottiefiles.com/packages/lf20_0snxbjhr.json')
    }

    setTimeout(() => {
      setProcessing(false)
      setLoanApproved(true)
      playVoiceHindi('आपका लोन अनुमोदित हो गया है। बधाई हो।')
    }, 3000)
  }

  // Simulate disbursal
  const handleDisbursal = () => {
    setDisbursalSuccess(true)
    playVoiceHindi('₹' + loanAmount + ' आपके बैंक खाते में ट्रांसफर हो गया है। आप सफल हैं।')
    setTimeout(() => {
      setCurrentStep(7)
    }, 2500)
  }

  // Video completion handler
  const handleVideoComplete = () => {
    setLiteracyWatched(true)
    playVoiceHindi('बधाई! आपने वित्तीय साक्षरता मॉड्यूल पूरा कर लिया है।')
  }

  // Simulate video progress
  useEffect(() => {
    if (currentStep === 3 && videoProgress < 100 && !literacyWatched) {
      const interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            handleVideoComplete()
            return 100
          }
          return prev + 10
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [currentStep, videoProgress, literacyWatched])

  // Path to Prosperity - All steps
  const steps = [
    { num: 1, title: 'Choose Intent', icon: '🎯', label: 'Purpose Selection' },
    { num: 2, title: 'Eligibility', icon: '✅', label: 'Light-Check' },
    { num: 3, title: 'Learn', icon: '📚', label: 'Literacy Nudge' },
    { num: 4, title: 'Choose Amount', icon: '💰', label: 'Loan Slider' },
    { num: 5, title: 'Verify', icon: '⚙️', label: 'Processing' },
    { num: 6, title: 'Approved!', icon: '🎉', label: 'Disbursal' },
    { num: 7, title: 'Track Income', icon: '📊', label: 'ViyaStree Ledger' },
    { num: 8, title: 'Grow', icon: '🌟', label: 'Graduate' }
  ]

  // Funding intent categories
  const fundingIntents = [
    { id: 'home', title: 'Home Business', icon: '🏪', description: 'Start small retail/service business from home', maxLoan: 20000 },
    { id: 'tools', title: 'Skill Tools', icon: '🪡', description: 'Sewing machine, crafting tools, equipment', maxLoan: 15000 },
    { id: 'digital', title: 'Digital Work', icon: '💻', description: 'Laptop, smartphone for online work', maxLoan: 25000 },
    { id: 'emergency', title: 'Emergency Support', icon: '🆘', description: 'Immediate livelihood during crisis', maxLoan: 10000 }
  ]

  // Loan amount visual representations
  const loanItems = {
    2000: { icon: '🔦', label: 'LED Light Business', color: '#fbbf24' },
    5000: { icon: '🪡', label: 'Sewing Machine', color: '#f472b6' },
    10000: { icon: '📱', label: 'Smartphone', color: '#818cf8' },
    15000: { icon: '🎨', label: 'Craft Supplies', color: '#34d399' },
    25000: { icon: '💻', label: 'Laptop', color: '#0ea5e9' },
    35000: { icon: '🛒', label: 'Retail Setup', color: '#ec4899' },
    50000: { icon: '🏬', label: 'Full Store', color: '#f97316' }
  }

  const getLoanRepresentation = (amount) => {
    const closest = Object.keys(loanItems).reduce((prev, curr) => 
      Math.abs(curr - amount) < Math.abs(prev - amount) ? curr : prev
    )
    return loanItems[closest]
  }

  // Eligibility questions
  const eligibilityQuestions = [
    { id: 'age', question: 'Are you 18 years or older?', label: '👤 Age Confirmation' },
    { id: 'citizen', question: 'Are you an Indian citizen or resident?', label: '🇮🇳 Citizenship' },
    { id: 'shiksha', question: 'Have you completed any Shiksha skill modules?', label: '📚 Skills Completed', bonus: true },
    { id: 'account', question: 'Do you have a bank account linked to Aadhaar?', label: '🏦 Bank Account' }
  ]

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <PageHeader
        title="🚀 Udyam-Kosh"
        subtitle="Path to Prosperity: Your Microfunding Journey"
        icon="💰"
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        
        {/* HEADER WITH NAVIGATION */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px',
          padding: '12px 16px',
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
            Step {currentStep} of {steps.length}
          </span>
          <button 
            onClick={() => playVoiceHindi('आप उदयम कोष में स्वागत हैं। यह महिलाओं के लिए एक सुरक्षित और भरोसेमंद माइक्रोफंडिंग प्लेटफॉर्म है।')}
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
            title="GuruSakhi Voice Guide"
          >
            🔊
          </button>
        </div>

        {/* PATH TO PROSPERITY TRACKER */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px', fontWeight: 600 }}>
            📍 Your Journey Path
          </h3>
          
          <div style={{ position: 'relative', padding: '20px 0' }}>
            {/* Vertical Progress Line */}
            <div style={{
              position: 'absolute',
              left: '30px',
              top: '0',
              bottom: '0',
              width: '4px',
              background: `linear-gradient(180deg, #14b8a6 0%, #14b8a6 ${(currentStep / steps.length) * 100}%, #e2e8f0 ${(currentStep / steps.length) * 100}%, #e2e8f0 100%)`
            }} />

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '80px' }}>
              {steps.map((step, idx) => (
                <div key={step.num} style={{ position: 'relative' }}>
                  {/* Step Circle */}
                  <div style={{
                    position: 'absolute',
                    left: '-65px',
                    top: '0',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: idx < currentStep - 1 ? '#f97316' : idx === currentStep - 1 ? '#f59e0b' : '#e2e8f0',
                    border: `3px solid ${idx < currentStep - 1 ? '#ea580c' : idx === currentStep - 1 ? '#d97706' : '#cbd5e1'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    cursor: idx < currentStep ? 'pointer' : 'default',
                    transition: 'all 0.3s'
                  }}
                  onClick={() => idx < currentStep && setCurrentStep(step.num)}
                  title={step.label}
                  >
                    {step.icon}
                  </div>

                  {/* Step Content */}
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: idx === currentStep - 1 ? '#fef3c7' : idx < currentStep - 1 ? '#dcfce7' : '#f1f5f9',
                    border: `1px solid ${idx === currentStep - 1 ? '#fcd34d' : idx < currentStep - 1 ? '#86efac' : '#cbd5e1'}`,
                    opacity: idx >= currentStep ? 0.6 : 1
                  }}>
                    <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {step.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STEP 1: PURPOSE SELECTION */}
        {currentStep === 1 && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ marginTop: 0, color: '#1f2937' }}>🎯 What do you need funding for?</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Choose your funding intent to match you with the right loan tier and support.</p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginTop: '16px',
              marginBottom: '20px'
            }}>
              {fundingIntents.map(intent => (
                <div
                  key={intent.id}
                  onClick={() => setLoanIntent(intent.id)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: `3px solid ${loanIntent === intent.id ? '#0ea5e9' : '#e2e8f0'}`,
                    background: loanIntent === intent.id ? '#e0f2fe' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => !loanIntent === intent.id && (e.currentTarget.style.borderColor = '#cbd5e1')}
                  onMouseLeave={(e) => !loanIntent === intent.id && (e.currentTarget.style.borderColor = '#e2e8f0')}
                >
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>{intent.icon}</div>
                  <h5 style={{ margin: '0 0 6px 0', color: '#1f2937' }}>{intent.title}</h5>
                  <p style={{ margin: '0', fontSize: '12px', color: '#64748b' }}>{intent.description}</p>
                  <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: 600, color: '#0ea5e9' }}>
                    Up to ₹{intent.maxLoan.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-ghost"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  if (loanIntent) {
                    playVoiceHindi('अच्छा चुनाव। अब आपकी पात्रता जांचेंगे।')
                    setCurrentStep(2)
                  }
                }}
                disabled={!loanIntent}
                style={{ opacity: loanIntent ? 1 : 0.5, cursor: loanIntent ? 'pointer' : 'not-allowed' }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ELIGIBILITY LIGHT-CHECK */}
        {currentStep === 2 && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ marginTop: 0, color: '#1f2937' }}>✅ Eligibility Light-Check</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Self-declaration for quick verification. We honor your honesty.</p>

            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              {eligibilityQuestions.map((q, idx) => (
                <div key={q.id} style={{
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#0ea5e9', marginBottom: '8px' }}>
                    {q.label} {q.bonus && '⭐'}
                  </div>
                  <div style={{ fontWeight: 500, color: '#1f2937', marginBottom: '10px' }}>
                    {q.question}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setEligibilityAnswers({ ...eligibilityAnswers, [q.id]: 'yes' })}
                      className={`btn ${eligibilityAnswers[q.id] === 'yes' ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ flex: 1 }}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setEligibilityAnswers({ ...eligibilityAnswers, [q.id]: 'no' })}
                      className={`btn ${eligibilityAnswers[q.id] === 'no' ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ flex: 1 }}
                    >
                      No
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Voice Self-Declaration */}
            <div style={{
              padding: '16px',
              background: '#e0f2fe',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #0ea5e9'
            }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#0c4a6e' }}>🎤 Voice Self-Declaration (Optional)</h5>
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#0c4a6e' }}>
                Speak your confirmation in your local dialect for a personal touch.
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setVoiceRecording(voiceRecording ? null : 'recording')
                  playVoiceHindi('आप अपनी स्वघोषणा रिकॉर्ड कर सकते हैं।')
                }}
              >
                {voiceRecording === 'recording' ? '⏹️ Stop Recording' : '🎤 Start Recording'}
              </button>
              {voiceRecording === 'recording' && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#0c4a6e', fontStyle: 'italic' }}>
                  🔴 Recording... Speak now
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-ghost"
                onClick={() => setCurrentStep(1)}
              >
                ← Back
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  const answered = eligibilityQuestions.every(q => eligibilityAnswers[q.id])
                  if (answered) {
                    playVoiceHindi('बहुत अच्छा। आप पात्र हैं। अब वित्तीय साक्षरता प्रशिक्षण देखें।')
                    setCurrentStep(3)
                  }
                }}
                disabled={!eligibilityQuestions.every(q => eligibilityAnswers[q.id])}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: LITERACY NUDGE - VIDEO */}
        {currentStep === 3 && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ marginTop: 0, color: '#1f2937' }}>📚 Budgeting & Repayment Literacy</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Watch this 5-minute module to understand sustainable repayment (mandatory for all borrowers).</p>

            {/* Video Player */}
            <div style={{
              marginTop: '20px',
              marginBottom: '20px',
              background: '#1f2937',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              minHeight: '240px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white'
            }}>
              {!literacyWatched ? (
                <>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎬</div>
                  <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>
                    Video: "₹10,000 to Success: Your Path to Sustainable Earning"
                  </p>
                  <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#cbd5e1' }}>
                    Duration: 5 minutes | Language: Hindi with Subtitles
                  </p>
                  
                  {/* Progress Bar */}
                  <div style={{
                    width: '100%',
                    maxWidth: '300px',
                    background: '#404854',
                    borderRadius: '4px',
                    height: '6px',
                    marginBottom: '12px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      background: 'linear-gradient(90deg, #f59e0b, #f97316)',
                      height: '100%',
                      width: `${videoProgress}%`,
                      transition: 'width 0.3s'
                    }} />
                  </div>
                  <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '16px' }}>
                    {videoProgress}% Complete
                  </div>

                  <button 
                    className="btn btn-primary"
                    onClick={() => setVideoProgress(0)}
                    disabled={videoProgress > 0}
                  >
                    {videoProgress === 0 ? '▶️ Watch Video' : '⏳ Watching...'}
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                  <p style={{ margin: '0', fontSize: '16px', fontWeight: 600 }}>Great! You've completed the training.</p>
                </>
              )}
            </div>

            {literacyWatched && (
              <Badge variant="success" style={{ marginBottom: '20px', width: '100%', textAlign: 'center', padding: '12px' }}>
                🎖️ Financial Literacy Certification Unlocked
              </Badge>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-ghost"
                onClick={() => setCurrentStep(2)}
              >
                ← Back
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  playVoiceHindi('अब अपने ऋण की राशि चुनें।')
                  setCurrentStep(4)
                }}
                disabled={!literacyWatched}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: LOAN SLIDER */}
        {currentStep === 4 && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ marginTop: 0, color: '#1f2937' }}>💰 Choose Your Loan Amount</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>See what your loan can help you purchase. Slide to explore options.</p>

            {/* Loan Representation Card */}
            <div style={{
              marginTop: '24px',
              marginBottom: '24px',
              padding: '24px',
              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              borderRadius: '12px',
              textAlign: 'center',
              color: 'white'
            }}>
              <div style={{ fontSize: '56px', marginBottom: '12px' }}>
                {getLoanRepresentation(loanAmount).icon}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                ₹{loanAmount.toLocaleString()}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>
                {getLoanRepresentation(loanAmount).label}
              </div>
            </div>

            {/* Amount Slider */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: '#64748b' }}>
                <span>₹2,000</span>
                <span>Your Choice</span>
                <span>₹50,000</span>
              </div>
              <input
                type="range"
                min="2000"
                max="50000"
                step="1000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '4px',
                  background: 'linear-gradient(90deg, #14b8a6 0%, #14b8a6 ' + ((loanAmount - 2000) / 48000) * 100 + '%, #e2e8f0 ' + ((loanAmount - 2000) / 48000) * 100 + '%, #e2e8f0 100%)',
                  outline: 'none',
                  WebkitAppearance: 'none',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Loan Details */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <div style={{
                padding: '12px',
                background: '#fef3c7',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid #fcd34d'
              }}>
                <div style={{ fontSize: '12px', color: '#92400e', fontWeight: 600 }}>Interest Rate</div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#b45309' }}>0-5%</div>
              </div>
              <div style={{
                padding: '12px',
                background: '#dbeafe',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid #93c5fd'
              }}>
                <div style={{ fontSize: '12px', color: '#0c4a6e', fontWeight: 600 }}>Repayment</div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#0284c7' }}>6-12 Months</div>
              </div>
              <div style={{
                padding: '12px',
                background: '#f0fdf4',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid #86efac'
              }}>
                <div style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>Monthly EMI</div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#15803d' }}>
                  ₹{Math.ceil(loanAmount / 8).toLocaleString()}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-ghost"
                onClick={() => setCurrentStep(3)}
              >
                ← Back
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  playVoiceHindi('₹' + loanAmount + ' के लिए अनुरोध भेजा जा रहा है।')
                  setCurrentStep(5)
                  setTimeout(() => handleProcessing(), 500)
                }}
              >
                Request Loan →
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: PROCESSING */}
        {currentStep === 5 && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '40px 20px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            textAlign: 'center'
          }}>
            {!loanApproved ? (
              <>
                <h3 style={{ marginTop: 0, color: '#1f2937' }}>⚙️ Verifying Your Eligibility...</h3>
                <div 
                  style={{
                    width: '200px',
                    height: '200px',
                    margin: '24px auto',
                    background: '#f0f9ff',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  ref={(el) => {
                    if (el && processing && !el.hasChildNodes()) {
                      loadLottieAnimation(el, 'https://assets2.lottiefiles.com/packages/lf20_jcikwtux.json')
                    }
                  }}
                />
                <p style={{ color: '#64748b', fontSize: '14px' }}>
                  Processing your loan application with our trust-first algorithm...
                </p>
              </>
            ) : (
              <>
                <h3 style={{ marginTop: 0, color: '#15803d' }}>🎉 Approved!</h3>
                <p style={{ color: '#1f2937', fontSize: '16px', fontWeight: 600, margin: '12px 0' }}>
                  Your loan of ₹{loanAmount.toLocaleString()} has been approved!
                </p>
                <div style={{
                  background: '#f0fdf4',
                  padding: '16px',
                  borderRadius: '8px',
                  marginTop: '16px',
                  border: '1px solid #86efac'
                }}>
                  <p style={{ margin: '0', fontSize: '13px', color: '#166534' }}>
                    Your funds will be disbursed via Direct Bank Transfer within 24 hours.
                  </p>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={handleDisbursal}
                  style={{ marginTop: '16px' }}
                >
                  Confirm & Disburse →
                </button>
              </>
            )}
          </div>
        )}

        {/* STEP 6: DISBURSAL SUCCESS */}
        {currentStep === 6 && disbursalSuccess && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '40px 20px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            textAlign: 'center'
          }}>
            <h3 style={{ marginTop: 0, color: '#15803d' }}>✨ Samruddhih (Prosperity)!</h3>
            <div 
              style={{
                width: '200px',
                height: '200px',
                margin: '24px auto',
                background: '#fef3c7',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '80px'
              }}
            >
              🪔
            </div>
            <p style={{ color: '#1f2937', fontSize: '16px', fontWeight: 600, margin: '12px 0' }}>
              ₹{loanAmount.toLocaleString()} credited to your account!
            </p>
            <div style={{
              background: '#f0fdf4',
              padding: '16px',
              borderRadius: '8px',
              marginTop: '16px',
              marginBottom: '20px',
              border: '1px solid #86efac'
            }}>
              <p style={{ margin: '0', fontSize: '13px', color: '#166534' }}>
                Your journey to financial independence has begun. Next: Set up ViyaStree Ledger to track income and build your credit score.
              </p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setCurrentStep(7)}
            >
              Set Up Ledger →
            </button>
          </div>
        )}

        {/* STEP 7: VIYASTREE LEDGER */}
        {currentStep === 7 && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ marginTop: 0, color: '#1f2937' }}>📊 ViyaStree Income Ledger</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              Track your daily income and expenses. This builds your trust score for future loans.
            </p>

            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: '#e0f2fe',
              borderRadius: '8px',
              border: '1px solid #0ea5e9',
              marginBottom: '20px'
            }}>
              <h5 style={{ margin: '0 0 12px 0', color: '#0c4a6e' }}>🎤 Voice Entry (Easy Method)</h5>
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#0c4a6e' }}>
                Simply say: "Today I earned ₹500 from selling textiles"
              </p>
              <button className="btn btn-primary">
                🎤 Start Voice Entry
              </button>
            </div>

            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: '#f3e8ff',
              borderRadius: '8px',
              border: '1px solid #d8b4fe',
              marginBottom: '20px'
            }}>
              <h5 style={{ margin: '0 0 12px 0', color: '#6b21a8' }}>✍️ Manual Entry (Text)</h5>
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#6b21a8' }}>
                Log income and expenses manually
              </p>
              <button className="btn btn-ghost">
                ✍️ Manual Ledger
              </button>
            </div>

            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: '#fef3c7',
              borderRadius: '8px',
              border: '1px solid #fcd34d'
            }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#92400e' }}>📈 This Week's Summary</h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#92400e', marginBottom: '4px' }}>Income</div>
                  <div style={{ fontSize: '20px', fontWeight: 600, color: '#15803d' }}>₹2,400</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#92400e', marginBottom: '4px' }}>Expenses</div>
                  <div style={{ fontSize: '20px', fontWeight: 600, color: '#dc2626' }}>₹800</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button 
                className="btn btn-ghost"
                onClick={() => setCurrentStep(6)}
              >
                ← Back
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  playVoiceHindi('बहुत अच्छा। अब आपके स्नातक ट्रैकर को देखें।')
                  setCurrentStep(8)
                }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: GRADUATION TRACKER */}
        {currentStep === 8 && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ marginTop: 0, color: '#1f2937' }}>🌟 Graduation Tracker - Next Tier Unlocked</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              You're progressing toward financial independence. Here's what's next.
            </p>

            {/* Current Tier */}
            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              borderRadius: '12px',
              color: 'white',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Current Tier</div>
              <h4 style={{ margin: '0', fontSize: '24px', fontWeight: 600 }}>
                🌱 Seed Support (₹{loanAmount.toLocaleString()})
              </h4>
              <div style={{ marginTop: '8px', fontSize: '13px', opacity: 0.9 }}>
                0% Interest | 12 Month Repayment
              </div>
            </div>

            {/* Repayment Progress */}
            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: '#f0fdf4',
              borderRadius: '12px',
              border: '1px solid #86efac',
              marginBottom: '20px'
            }}>
              <h5 style={{ margin: '0 0 12px 0', color: '#166534' }}>📊 On-Time Repayments</h5>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  flex: 1,
                  background: '#dcfce7',
                  height: '16px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid #86efac'
                }}>
                  <div style={{
                    background: '#15803d',
                    height: '100%',
                    width: `${(repaymentsMade / totalRepaymentTarget) * 100}%`,
                    transition: 'width 0.3s'
                  }} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#15803d' }}>
                  {repaymentsMade}/{totalRepaymentTarget}
                </span>
              </div>
              <p style={{ margin: '0', fontSize: '12px', color: '#166534' }}>
                {repaymentsMade < totalRepaymentTarget 
                  ? `${totalRepaymentTarget - repaymentsMade} more on-time repayments to unlock Growth Tier`
                  : '✓ Ready for Growth Tier!'}
              </p>
            </div>

            {/* Next Tier Preview */}
            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: '#dbeafe',
              borderRadius: '12px',
              border: '1px solid #93c5fd',
              marginBottom: '20px'
            }}>
              <h5 style={{ margin: '0 0 12px 0', color: '#0c4a6e' }}>🚀 Next Tier - Growth Loan</h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#0c4a6e', marginBottom: '4px' }}>Amount</div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: '#0284c7' }}>₹50,000</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#0c4a6e', marginBottom: '4px' }}>Interest</div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: '#0284c7' }}>3-5%</div>
                </div>
              </div>
              <p style={{ margin: '12px 0 0 0', fontSize: '12px', color: '#0c4a6e' }}>
                Available after completing current loan cycle.
              </p>
            </div>

            {/* Government Resource Links */}
            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: '#fef3c7',
              borderRadius: '12px',
              border: '1px solid #fcd34d',
              marginBottom: '20px'
            }}>
              <h5 style={{ margin: '0 0 12px 0', color: '#92400e' }}>🏛️ Government Resources</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                  📱 Udyam Sakhi Portal (MSME Registration)
                </button>
                <button className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                  🏦 Pradhan Mantri Mudra Yojana (PMMY)
                </button>
                <button className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                  🚀 Stand-Up India (₹10L - ₹1Cr Loans)
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-ghost"
                onClick={() => navigate('/samruddhih')}
              >
                Back to Samruddhih
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  playVoiceHindi('बधाई! आप अब वित्तीय स्वतंत्रता की ओर बढ़ रहे हैं।')
                  navigate('/dashboard')
                }}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
