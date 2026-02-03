import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/base/PageHeader'
import Badge from '../components/base/Badge'

/**
 * Unnati - Progress Dashboard
 * 
 * Visual brain of ViyaStree ecosystem showing the Holistic Empowerment Loop:
 * - Shiksha Milestones (Learning)
 * - Samruddhih Milestones (Livelihood)
 * - Shaktih Milestones (Safety)
 * 
 * Interactive games:
 * - Bazaar Challenge (Financial Management)
 * - Rights Quest (Legal Awareness)
 * - Scam Spotter (Digital Safety)
 */
export default function Unnati() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const treeRef = useRef(null)

  // Progress state
  const [completedMilestones, setCompletedMilestones] = useState({
    shiksha: [1, 2, 4], // Completed modules
    samruddhih: [1, 2, 3, 5], // Funding steps
    shaktih: [1, 3] // Safety quizzes
  })

  const [activeGame, setActiveGame] = useState(null)
  const [gameProgress, setGameProgress] = useState({
    bazaar: { stock: 50, marketing: 50, score: 0 },
    rightsQuest: { correct: 0, total: 0 },
    scamSpotter: { blocked: 0, total: 0 }
  })

  // Simple scenarios for games
  const rightsScenarios = [
    { text: 'Your employer refuses to give you a written contract.', correct: 'unsafe' },
    { text: 'You receive your salary slip every month with clear details.', correct: 'safe' },
    { text: 'Someone asks you to sign a blank paper for job security.', correct: 'unsafe' }
  ]

  const scamScenarios = [
    { text: 'A message says: "You won a lottery! Send your bank OTP now."', correct: 'scam' },
    { text: 'Bank SMS: "Your account balance is updated."', correct: 'safe' },
    { text: 'Unknown WhatsApp number offers loan with 0% interest if you pay a small fee first.', correct: 'scam' }
  ]

  // Helpers
  const toggleMilestone = (pillar, id) => {
    setCompletedMilestones(prev => {
      const current = prev[pillar] || []
      const exists = current.includes(id)
      const updated = exists ? current.filter(x => x !== id) : [...current, id]
      return {
        ...prev,
        [pillar]: updated
      }
    })
  }

  const handleBazaarAdjust = (field, delta) => {
    setGameProgress(prev => {
      const clamp = value => Math.min(100, Math.max(0, value))
      const stock = field === 'stock' ? clamp(prev.bazaar.stock + delta) : prev.bazaar.stock
      const marketing = field === 'marketing' ? clamp(prev.bazaar.marketing + delta) : prev.bazaar.marketing
      const score = Math.max(0, 100 - Math.abs(stock - 60) - Math.abs(marketing - 40))
      return {
        ...prev,
        bazaar: { stock, marketing, score }
      }
    })
  }

  const handleRightsAnswer = choice => {
    setGameProgress(prev => {
      const index = prev.rightsQuest.total % rightsScenarios.length
      const scenario = rightsScenarios[index]
      const isCorrect = choice === scenario.correct
      return {
        ...prev,
        rightsQuest: {
          correct: prev.rightsQuest.correct + (isCorrect ? 1 : 0),
          total: prev.rightsQuest.total + 1
        }
      }
    })
  }

  const handleScamAnswer = choice => {
    setGameProgress(prev => {
      const index = prev.scamSpotter.total % scamScenarios.length
      const scenario = scamScenarios[index]
      const isScam = scenario.correct === 'scam'
      const userBlocked = choice === 'block'

      return {
        ...prev,
        scamSpotter: {
          blocked: prev.scamSpotter.blocked + (isScam && userBlocked ? 1 : 0),
          total: prev.scamSpotter.total + 1
        }
      }
    })
  }

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

  // Calculate overall completion percentage
  const overallProgress = Math.round(
    (completedMilestones.shiksha.length * 20 +
      completedMilestones.samruddhih.length * 12.5 +
      completedMilestones.shaktih.length * 16.67) / 100 * 100
  ) / 100

  // Milestones data
  const shikshaModules = [
    { id: 1, title: 'Digital Finance 101', icon: '💰', desc: 'Money management basics' },
    { id: 2, title: 'Legal Snippet', icon: '⚖️', desc: 'Know your rights' },
    { id: 3, title: 'Digital Literacy', icon: '📱', desc: 'Tech skills intro' },
    { id: 4, title: 'Safety First', icon: '🛡️', desc: 'Online safety tips' },
    { id: 5, title: 'Entrepreneurship 101', icon: '🚀', desc: 'Start your business' }
  ]

  const samruddhihSteps = [
    { id: 1, title: 'Need Identification', icon: '🎯', desc: 'Purpose Selection' },
    { id: 2, title: 'Eligibility Check', icon: '✅', desc: 'Light-Check' },
    { id: 3, title: 'Literacy Training', icon: '📚', desc: 'Financial Nudge' },
    { id: 4, title: 'Loan Selection', icon: '💰', desc: 'Choose Amount' },
    { id: 5, title: 'Processing', icon: '⚙️', desc: 'Verification' },
    { id: 6, title: 'Disbursal', icon: '🎉', desc: 'Funds Received' },
    { id: 7, title: 'Ledger Setup', icon: '📊', desc: 'Track Income' },
    { id: 8, title: 'Graduation', icon: '🌟', desc: 'Next Tier' }
  ]

  const shaktihQuizzes = [
    { id: 1, title: 'Workplace Rights', icon: '👨‍💼', desc: 'Know your protections' },
    { id: 2, title: 'Digital Safety', icon: '🔐', desc: 'Scam awareness' },
    { id: 3, title: 'Property Rights', icon: '🏠', desc: 'Own your assets' },
    { id: 4, title: 'Health & Wellness', icon: '❤️', desc: 'Wellbeing matters' }
  ]

  // Calculate tree height based on milestones
  const treeHeight = 60 + completedMilestones.shiksha.length * 8 + completedMilestones.samruddhih.length * 6 + completedMilestones.shaktih.length * 7

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <PageHeader
        title="📈 Unnati"
        subtitle="Your Progress Through Empowerment"
        icon="🌳"
      />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        
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
          <button onClick={() => navigate(-1)} className="btn btn-ghost">
            ← Back
          </button>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
            Overall Progress: {Math.round(overallProgress)}% Complete
          </span>
          <button
            onClick={() => playVoiceHindi('आप अपनी प्रगति को ट्रैक कर रहे हैं। बहुत अच्छा काम कर रहे हैं।')}
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

        {/* EMPOWERMENT METER */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          textAlign: 'center'
        }}>
          <h3 style={{ marginTop: 0, color: '#1f2937' }}>🎯 Your Empowerment Meter</h3>
          
          <div style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: `conic-gradient(#14b8a6 0deg ${overallProgress * 3.6}deg, #e2e8f0 ${overallProgress * 3.6}deg)`,
            margin: '20px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '48px', fontWeight: 600, color: '#14b8a6' }}>
                {Math.round(overallProgress)}%
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Growth Cycle Complete
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
            marginTop: '20px'
          }}>
            <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
              <div style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>Shiksha</div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#15803d' }}>
                {completedMilestones.shiksha.length}/5
              </div>
            </div>
            <div style={{ padding: '12px', background: '#dbeafe', borderRadius: '8px', border: '1px solid #93c5fd' }}>
              <div style={{ fontSize: '12px', color: '#0c4a6e', fontWeight: 600 }}>Samruddhih</div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#0284c7' }}>
                {completedMilestones.samruddhih.length}/8
              </div>
            </div>
            <div style={{ padding: '12px', background: '#fce7f3', borderRadius: '8px', border: '1px solid #f472b6' }}>
              <div style={{ fontSize: '12px', color: '#831843', fontWeight: 600 }}>Shaktih</div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#be185d' }}>
                {completedMilestones.shaktih.length}/4
              </div>
            </div>
          </div>
        </div>

        <div
          className="unnati-main-grid"
          style={{ display: 'grid', gap: '24px', marginBottom: '24px' }}
        >
          
          {/* LEFT: VYAPATH ROADMAP */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ marginTop: 0, color: '#1f2937' }}>🗺️ ViyaPath Roadmap</h3>
            
            {/* Shiksha Milestones */}
            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ margin: '0 0 12px 0', color: '#15803d', fontSize: '14px' }}>📚 Shiksha (Learning)</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {shikshaModules.map(module => (
                  <button
                    className="unnati-milestone-btn"
                    key={module.id}
                    onClick={() => {
                      toggleMilestone('shiksha', module.id)
                      playVoiceHindi(module.title)
                    }}
                    style={{
                      padding: '10px 12px',
                      background: completedMilestones.shiksha.includes(module.id) ? '#dcfce7' : '#f1f5f9',
                      border: `2px solid ${completedMilestones.shiksha.includes(module.id) ? '#22c55e' : '#cbd5e1'}`,
                      borderRadius: '6px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{module.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1f2937' }}>{module.title}</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>{module.desc}</div>
                    </div>
                    {completedMilestones.shiksha.includes(module.id) && (
                      <span style={{ fontSize: '16px' }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Samruddhih Milestones */}
            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ margin: '0 0 12px 0', color: '#0284c7', fontSize: '14px' }}>💰 Samruddhih (Livelihood)</h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {samruddhihSteps.map(step => (
                  <button
                    className="unnati-milestone-btn"
                    key={step.id}
                    onClick={() => {
                      toggleMilestone('samruddhih', step.id)
                      playVoiceHindi(step.title)
                    }}
                    style={{
                      padding: '10px 8px',
                      background: completedMilestones.samruddhih.includes(step.id) ? '#dbeafe' : '#f1f5f9',
                      border: `2px solid ${completedMilestones.samruddhih.includes(step.id) ? '#0ea5e9' : '#cbd5e1'}`,
                      borderRadius: '6px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{step.icon}</div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#1f2937', lineHeight: '1.2' }}>
                      {step.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Shaktih Milestones */}
            <div>
              <h5 style={{ margin: '0 0 12px 0', color: '#be185d', fontSize: '14px' }}>🛡️ Shaktih (Safety)</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
                {shaktihQuizzes.map(quiz => (
                  <button
                    className="unnati-milestone-btn"
                    key={quiz.id}
                    onClick={() => {
                      toggleMilestone('shaktih', quiz.id)
                      playVoiceHindi(quiz.title)
                    }}
                    style={{
                      padding: '10px 8px',
                      background: completedMilestones.shaktih.includes(quiz.id) ? '#fce7f3' : '#f1f5f9',
                      border: `2px solid ${completedMilestones.shaktih.includes(quiz.id) ? '#ec4899' : '#cbd5e1'}`,
                      borderRadius: '6px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{quiz.icon}</div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#1f2937', lineHeight: '1.2' }}>
                      {quiz.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: SUCCESS TREE & STATS */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            textAlign: 'center'
          }}>
            <h3 style={{ marginTop: 0, color: '#1f2937' }}>🌳 Your Success Tree</h3>
            
            {/* Tree visualization */}
            <div style={{
              height: `${Math.min(treeHeight, 280)}px`,
              background: 'linear-gradient(to top, #86efac 0%, #dcfce7 50%, #f0fdf4 100%)',
              borderRadius: '8px',
              margin: '16px 0',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              position: 'relative',
              border: '2px solid #22c55e'
            }}>
              <div style={{
                width: '60px',
                height: `${treeHeight * 0.4}px`,
                background: '#8b4513',
                borderRadius: '0 0 4px 4px',
                position: 'relative'
              }}>
                {/* Leaves/Flowers */}
                {[...Array(Math.min(completedMilestones.shiksha.length, 5))].map((_, i) => (
                  <div
                    key={`leaf-${i}`}
                    style={{
                      position: 'absolute',
                      fontSize: '20px',
                      left: Math.cos(i * Math.PI / 3) * 40 - 10 + 'px',
                      top: Math.sin(i * Math.PI / 3) * 40 - 10 + 'px',
                      animation: `float ${2 + i * 0.3}s ease-in-out infinite`
                    }}
                  >
                    🍃
                  </div>
                ))}
                {/* Flowers for income */}
                {[...Array(Math.min(completedMilestones.samruddhih.length, 5))].map((_, i) => (
                  <div
                    key={`flower-${i}`}
                    style={{
                      position: 'absolute',
                      fontSize: '20px',
                      right: Math.cos(i * Math.PI / 2.5) * 50 - 10 + 'px',
                      top: Math.sin(i * Math.PI / 2.5) * 50 - 10 + 'px',
                      animation: `bloom ${2.5 + i * 0.4}s ease-in-out infinite`
                    }}
                  >
                    🌻
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Stats */}
            <div style={{
              background: '#f0fdf4',
              padding: '16px',
              borderRadius: '8px',
              marginTop: '16px',
              border: '1px solid #86efac'
            }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#166534' }}>📊 Your Impact This Month</h5>
              <div style={{ fontSize: '13px', color: '#166534', lineHeight: '1.6' }}>
                ✓ {completedMilestones.shiksha.length} Skills Learned<br/>
                ✓ {completedMilestones.samruddhih.length} Funding Steps Completed<br/>
                ✓ {completedMilestones.shaktih.length} Safety Badges Earned
              </div>
            </div>
          </div>
        </div>

        {/* GAMES SECTION */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h3 style={{ marginTop: 0, color: '#1f2937' }}>🎮 Empowerment Games</h3>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
            Play interactive games to earn badges and deepen your skills!
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            {/* Bazaar Challenge */}
            <div style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: '12px',
              padding: '16px',
              border: '2px solid #fcd34d',
              cursor: 'pointer'
            }}
            onClick={() => {
              setActiveGame('bazaar')
              playVoiceHindi('बाज़ार चुनौती शुरू करें। अपनी दुकान का प्रबंधन करें।')
            }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#92400e' }}>🛒 Bazaar Challenge</h5>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#92400e' }}>
                Manage your virtual stall. Balance stock vs. marketing budget!
              </p>
              <button className="btn btn-primary" style={{ background: '#b45309', border: 'none', color: 'white', width: '100%' }}>
                Play Now
              </button>
            </div>

            {/* Rights Quest */}
            <div style={{
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
              borderRadius: '12px',
              padding: '16px',
              border: '2px solid #93c5fd',
              cursor: 'pointer'
            }}
            onClick={() => {
              setActiveGame('rightsQuest')
              playVoiceHindi('अधिकार क्वेस्ट खेलें। अपने अधिकार सीखें।')
            }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#0c4a6e' }}>⚖️ Rights Quest</h5>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#0c4a6e' }}>
                Learn your rights! Sort scenarios into Safe & Unsafe.
              </p>
              <button className="btn btn-primary" style={{ background: '#0284c7', border: 'none', color: 'white', width: '100%' }}>
                Play Now
              </button>
            </div>

            {/* Scam Spotter */}
            <div style={{
              background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
              borderRadius: '12px',
              padding: '16px',
              border: '2px solid #f472b6',
              cursor: 'pointer'
            }}
            onClick={() => {
              setActiveGame('scamSpotter')
              playVoiceHindi('स्कैम स्पॉटर खेलें। नकली संदेशों को पहचानें।')
            }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#831843' }}>🎣 Scam Spotter</h5>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#831843' }}>
                Identify phishing scams in messages. Block fraudsters!
              </p>
              <button className="btn btn-primary" style={{ background: '#be185d', border: 'none', color: 'white', width: '100%' }}>
                Play Now
              </button>
            </div>
          </div>

          {/* Active game panel */}
          {activeGame && (
            <div style={{
              marginTop: '24px',
              padding: '18px 16px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              background: '#f8fafc'
            }}>
              {activeGame === 'bazaar' && (
                <>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 600, color: '#92400e' }}>
                    🛒 Bazaar Challenge – Balance Your Shop
                  </h4>
                  <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b' }}>
                    Adjust <strong>stock</strong> and <strong>marketing</strong> to reach a healthy balance. Higher balance = better score.
                  </p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ padding: '10px 12px', borderRadius: '10px', background: 'white', border: '1px solid #fde68a' }}>
                      <div style={{ fontSize: '12px', color: '#92400e', marginBottom: '6px', fontWeight: 600 }}>Stock Level</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '20px' }}>📦</span>
                        <span style={{ fontSize: '18px', fontWeight: 700, color: '#92400e' }}>{gameProgress.bazaar.stock}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-ghost"
                          style={{ flex: 1, fontSize: '12px' }}
                          onClick={() => handleBazaarAdjust('stock', -10)}
                        >
                          − Less
                        </button>
                        <button
                          className="btn btn-ghost"
                          style={{ flex: 1, fontSize: '12px' }}
                          onClick={() => handleBazaarAdjust('stock', 10)}
                        >
                          + More
                        </button>
                      </div>
                    </div>

                    <div style={{ padding: '10px 12px', borderRadius: '10px', background: 'white', border: '1px solid #bfdbfe' }}>
                      <div style={{ fontSize: '12px', color: '#0c4a6e', marginBottom: '6px', fontWeight: 600 }}>Marketing</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '20px' }}>📣</span>
                        <span style={{ fontSize: '18px', fontWeight: 700, color: '#0c4a6e' }}>{gameProgress.bazaar.marketing}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-ghost"
                          style={{ flex: 1, fontSize: '12px' }}
                          onClick={() => handleBazaarAdjust('marketing', -10)}
                        >
                          − Less
                        </button>
                        <button
                          className="btn btn-ghost"
                          style={{ flex: 1, fontSize: '12px' }}
                          onClick={() => handleBazaarAdjust('marketing', 10)}
                        >
                          + More
                        </button>
                      </div>
                    </div>
                  </div>
                  <div style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'linear-gradient(90deg, #fef3c7 0%, #fde68a 40%, #fef9c3 100%)',
                    border: '1px solid #facc15',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#92400e', fontWeight: 600, marginBottom: '4px' }}>Bazaar Score</div>
                      <div style={{ fontSize: '13px', color: '#78350f' }}>
                        Aim for score above <strong>70</strong> – that means you are balancing stock and marketing well.
                      </div>
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 700, color: '#92400e' }}>
                      {gameProgress.bazaar.score}
                    </div>
                  </div>
                </>
              )}

              {activeGame === 'rightsQuest' && (
                <>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 600, color: '#0c4a6e' }}>
                    ⚖️ Rights Quest – Safe or Unsafe?
                  </h4>
                  <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#64748b' }}>
                    Read the situation and decide if it is <strong>Safe</strong> or <strong>Unsafe</strong> for you.
                  </p>
                  <div style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'white',
                    border: '1px solid #bfdbfe',
                    marginBottom: '14px'
                  }}>
                    <div style={{ fontSize: '12px', color: '#0c4a6e', fontWeight: 600, marginBottom: '6px' }}>
                      Situation
                    </div>
                    <div style={{ fontSize: '13px', color: '#0f172a', lineHeight: '1.6' }}>
                      {rightsScenarios[gameProgress.rightsQuest.total % rightsScenarios.length].text}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                    <button
                      className="btn btn-primary"
                      style={{ flex: 1, background: '#22c55e', border: 'none' }}
                      onClick={() => handleRightsAnswer('safe')}
                    >
                      ✅ Safe
                    </button>
                    <button
                      className="btn btn-primary"
                      style={{ flex: 1, background: '#ef4444', border: 'none' }}
                      onClick={() => handleRightsAnswer('unsafe')}
                    >
                      ⚠️ Unsafe
                    </button>
                  </div>
                  <div style={{ fontSize: '12px', color: '#0c4a6e' }}>
                    Questions answered:{' '}
                    <strong>{gameProgress.rightsQuest.total}</strong> · Correct:{' '}
                    <strong>{gameProgress.rightsQuest.correct}</strong>{' '}
                    {gameProgress.rightsQuest.total > 0 && (
                      <>
                        · Accuracy:{' '}
                        <strong>
                          {Math.round(
                            (gameProgress.rightsQuest.correct / gameProgress.rightsQuest.total) * 100
                          )}
                          %
                        </strong>
                      </>
                    )}
                  </div>
                </>
              )}

              {activeGame === 'scamSpotter' && (
                <>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 600, color: '#831843' }}>
                    🎣 Scam Spotter – Block or Allow?
                  </h4>
                  <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#64748b' }}>
                    Look at the message and decide if you should <strong>Block</strong> it or <strong>Allow</strong> it.
                  </p>
                  <div style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'white',
                    border: '1px solid #f9a8d4',
                    marginBottom: '14px'
                  }}>
                    <div style={{ fontSize: '12px', color: '#831843', fontWeight: 600, marginBottom: '6px' }}>
                      Message
                    </div>
                    <div style={{ fontSize: '13px', color: '#111827', lineHeight: '1.6' }}>
                      {scamScenarios[gameProgress.scamSpotter.total % scamScenarios.length].text}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                    <button
                      className="btn btn-primary"
                      style={{ flex: 1, background: '#be185d', border: 'none' }}
                      onClick={() => handleScamAnswer('block')}
                    >
                      🚫 Block
                    </button>
                    <button
                      className="btn btn-ghost"
                      style={{ flex: 1, borderColor: '#c4b5fd', color: '#4c1d95' }}
                      onClick={() => handleScamAnswer('allow')}
                    >
                      ✅ Allow
                    </button>
                  </div>
                  <div style={{ fontSize: '12px', color: '#831843' }}>
                    Messages checked:{' '}
                    <strong>{gameProgress.scamSpotter.total}</strong> · Scams blocked:{' '}
                    <strong>{gameProgress.scamSpotter.blocked}</strong>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* COMMUNITY IMPACT */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h3 style={{ marginTop: 0, color: '#1f2937' }}>👥 Community Impact</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              padding: '16px',
              background: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #86efac',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>👩‍👩‍👧‍👦</div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#15803d' }}>2,847</div>
              <div style={{ fontSize: '12px', color: '#166534' }}>Women in your area progressing</div>
            </div>

            <div style={{
              padding: '16px',
              background: '#dbeafe',
              borderRadius: '8px',
              border: '1px solid #93c5fd',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#0284c7' }}>₹2.3 Cr</div>
              <div style={{ fontSize: '12px', color: '#0c4a6e' }}>Disbursed in your region this month</div>
            </div>

            <div style={{
              padding: '16px',
              background: '#fce7f3',
              borderRadius: '8px',
              border: '1px solid #f472b6',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>⭐</div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#be185d' }}>4.8/5</div>
              <div style={{ fontSize: '12px', color: '#831843' }}>Average satisfaction rating</div>
            </div>
          </div>

          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: '#e0f2fe',
            borderRadius: '8px',
            border: '1px solid #0ea5e9',
            fontSize: '13px',
            color: '#0c4a6e',
            textAlign: 'center'
          }}>
            🌍 Join 50,000+ women across India on their empowerment journey!
          </div>
        </div>
      </div>

      <style>{`
        .unnati-main-grid {
          grid-template-columns: minmax(0, 1.7fr) minmax(0, 1.3fr);
          align-items: flex-start;
        }

        @media (max-width: 1024px) {
          .unnati-main-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        .unnati-milestone-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.08);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bloom {
          0% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; }
          100% { opacity: 0.8; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
