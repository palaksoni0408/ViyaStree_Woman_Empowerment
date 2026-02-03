import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/base/PageHeader'
import InfoCard from '../components/base/InfoCard'
import Badge from '../components/base/Badge'

// ViyaStree Color Palette - Professional & Trustworthy
const COLORS = {
  primary: '#0f766e',       // Deep teal for authority
  secondary: '#c2410c',     // Burnt orange for actions
  accent: '#0891b2',        // Cyan accent
  success: '#15803d',       // Professional green
  warning: '#ca8a04',       // Muted gold
  background: '#f8fafc',    // Off-white background
  surface: '#ffffff',       // Pure white for cards
  textPrimary: '#1e293b',   // Dark slate for text
  textSecondary: '#64748b', // Gray for secondary text
  border: '#e2e8f0'         // Light border color
}

// Breathing Guide Component
function BreathingGuide() {
  const [phase, setPhase] = useState('inhale') // inhale, hold, exhale
  const [cycleCount, setCycleCount] = useState(0)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (!isActive) return

    const phaseTimings = {
      inhale: 4000,  // 4 seconds
      hold: 4000,    // 4 seconds  
      exhale: 4000   // 4 seconds
    }

    const timer = setTimeout(() => {
      if (phase === 'inhale') {
        setPhase('hold')
      } else if (phase === 'hold') {
        setPhase('exhale')
      } else {
        setPhase('inhale')
        setCycleCount(prev => prev + 1)
      }
    }, phaseTimings[phase])

    return () => clearTimeout(timer)
  }, [phase, isActive])

  const handleStart = () => {
    setIsActive(true)
    setPhase('inhale')
    setCycleCount(0)
  }

  const handleStop = () => {
    setIsActive(false)
    setPhase('inhale')
  }

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In...'
      case 'hold': return 'Hold...'
      case 'exhale': return 'Breathe Out...'
      default: return ''
    }
  }

  const getCircleSize = () => {
    switch (phase) {
      case 'inhale': return '200px'
      case 'hold': return '200px'
      case 'exhale': return '120px'
      default: return '120px'
    }
  }

  const getCircleColor = () => {
    switch (phase) {
      case 'inhale': return '#86efac'  // Mint for inhale
      case 'hold': return '#7dd3fc'    // Aqua for hold
      case 'exhale': return '#c084fc'  // Purple for exhale
      default: return '#86efac'
    }
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{
        width: '300px',
        height: '300px',
        margin: '20px auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div style={{
          width: isActive ? getCircleSize() : '120px',
          height: isActive ? getCircleSize() : '120px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${getCircleColor()}, ${getCircleColor()}88)`,
          transition: phase === 'inhale' ? 'all 4s ease-in' : phase === 'exhale' ? 'all 4s ease-out' : 'all 0.5s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 40px ${getCircleColor()}66`,
          fontSize: '48px'
        }}>
          🫁
        </div>
      </div>

      <div style={{
        fontSize: '28px',
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: '16px',
        minHeight: '40px'
      }}>
        {isActive ? getPhaseText() : 'Ready to begin?'}
      </div>

      <div style={{
        fontSize: '16px',
        color: COLORS.textSecondary,
        marginBottom: '24px'
      }}>
        {isActive ? `Cycle ${cycleCount + 1} of 5` : 'Follow the circle as it guides your breathing'}
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        {!isActive ? (
          <button
            onClick={handleStart}
            style={{
              background: COLORS.success,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Start Breathing Exercise
          </button>
        ) : (
          <button
            onClick={handleStop}
            style={{
              background: COLORS.textSecondary,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Stop Exercise
          </button>
        )}
      </div>

      {cycleCount >= 5 && isActive && (
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: `${COLORS.success}15`,
          borderRadius: '12px',
          color: COLORS.success,
          fontWeight: '600',
          fontSize: '16px'
        }}>
          🎉 Great job! You've completed 5 breathing cycles. Feel free to continue or close this window.
        </div>
      )}
    </div>
  )
}

// Quiz Data
const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'Is it safe to share your OTP with a "bank officer" over the phone?',
    options: [
      { value: 'yes', label: '🔴 Yes' },
      { value: 'no', label: '🟢 No' }
    ],
    correctAnswer: 'no'
  },
  {
    id: 'q2',
    question: 'Where do you securely store government documents?',
    options: [
      { value: 'digilocker', label: '📁 DigiLocker' },
      { value: 'facebook', label: '📁 Facebook' }
    ],
    correctAnswer: 'digilocker'
  },
  {
    id: 'q3',
    question: 'Which is a strong password?',
    options: [
      { value: 'weak', label: '🔓 password123' },
      { value: 'strong', label: '🔒 P@ssw0rd$2024' }
    ],
    correctAnswer: 'strong'
  },
  {
    id: 'q4',
    question: 'You receive a "Lottery Winner" SMS asking for bank details. What do you do?',
    options: [
      { value: 'reply', label: '💸 Reply immediately' },
      { value: 'block', label: '🚫 Ignore and Block' }
    ],
    correctAnswer: 'block'
  }
]


// Prerna Kendra Data
const PRERNA_VIDEOS = [
  { id: 'v1', title: 'Women and Financial Independence', source: 'TEDx | CA Rachana Ranade', thumbnail: 'https://img.youtube.com/vi/A7r2vCxa3pI/hqdefault.jpg', url: 'https://www.youtube.com/watch?v=A7r2vCxa3pI' },
  { id: 'v2', title: 'Life Lessons & Success Mantras', source: 'Sudha Murty | The Ranveer Show', thumbnail: 'https://img.youtube.com/vi/f0WjCARQiBw/hqdefault.jpg', url: 'https://www.youtube.com/watch?v=f0WjCARQiBw' },
  { id: 'v3', title: '6 Behaviors to Increase Confidence', source: 'TEDxReno | Emily Jaenson', thumbnail: 'https://img.youtube.com/vi/IitIl2C3Iy8/hqdefault.jpg', url: 'https://www.youtube.com/watch?v=IitIl2C3Iy8' }
]

const SASHAKT_ANTHEMS = [
  { id: 's1', title: 'Aashaayein (Hope)', artist: 'KK', mood: 'Uplifting', url: '/songs/aashaayein.mp3' },
  { id: 's2', title: 'Badal Pe Paon', artist: 'Hema Sardesai', mood: 'Energetic', url: '/songs/badal_pe_paon.mp3' },
  { id: 's3', title: 'Jeete Hain Chal', artist: 'Kavita Seth', mood: 'Resilient', url: '/songs/jeete_hain_chal.mp3' }
]

const VIYA_PODCASTS = [
  { id: 'p1', title: 'Self Confidence & Success', host: 'The Ranveer Show', duration: '45m', thumbnail: 'https://img.youtube.com/vi/OcISVEh1jyw/hqdefault.jpg', url: 'https://www.youtube.com/watch?v=OcISVEh1jyw' },
  { id: 'p2', title: 'Impact Of P2P Lending In India', host: 'Chai with Lakshmi', duration: '30m', thumbnail: 'https://img.youtube.com/vi/3J_QDPwstSk/hqdefault.jpg', url: 'https://www.youtube.com/watch?v=3J_QDPwstSk' },
  { id: 'p3', title: '#1 Sales Tactic (Money!)', host: 'Financial Freedom', duration: '25m', thumbnail: 'https://img.youtube.com/vi/5RTFMlvbOG0/hqdefault.jpg', url: 'https://www.youtube.com/watch?v=5RTFMlvbOG0' }
]

// Granthalaya Data
const BOOKS_DATA = [
  { id: 'b1', title: 'I Am Malala', author: 'Malala Yousafzai', category: 'Rights', desc: 'Symbol for the right to education.', url: 'https://youtube.com/playlist?list=PLqeTYg0r_zKd8eHWBaSlWQa14xpJib16v&si=IBhjqm68Xf9a-KLU' },
  { id: 'b2', title: 'My Life in Full', author: 'Indra Nooyi', category: 'Leadership', desc: 'Balancing career and family.', url: 'https://youtu.be/xLPRVJWjEzE?si=65XKFMabJOehVDxZ' },
  { id: 'b3', title: 'Lean In', author: 'Sheryl Sandberg', category: 'Career', desc: 'Women, work, and the will to lead.', url: 'https://youtu.be/YH4vnBVVSNc?si=zrmW_xS8oaN0TvqO' },
  { id: 'b4', title: '48 Laws of Power', author: 'Robert Greene', category: 'Strategy', desc: 'Laws for success and power.', url: 'https://youtu.be/_pd6H5ogkug?si=WTfiL2LAX2NwBNgm' }
]

const MAGAZINES_DATA = [
  { id: 'm1', title: 'Femina', issue: 'Latest Issue', tag: 'Lifestyle', cover: '/magazines/femina_cover.jpg', url: 'https://www.femina.in/' },
  { id: 'm2', title: 'Forbes Women', issue: 'Special Edition', tag: 'Business', cover: '/magazines/forbes_cover.png', url: 'https://www.forbes.com/forbeswomen/' },
  { id: 'm3', title: 'Womens Era', issue: 'This Month', tag: 'Health/Family', cover: '/magazines/womans_era_cover.jpg', url: 'https://www.womansera.com/' }
]

export default function Shiksha() {
  const { user, completeCourse } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const [activeCourse, setActiveCourse] = useState(null)
  const [activeTab, setActiveTab] = useState('modules') // 'modules', 'prerna', 'grantha'

  const [modalOpen, setModalOpen] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [msg, setMsg] = useState('')

  const [error, setError] = useState(null)
  const speechRef = useRef(null)
  const lottieRef = useRef(null)
  const shikshaAnimRef = useRef(null)
  const [infoModal, setInfoModal] = useState(null)
  const [legalModal, setLegalModal] = useState(null)
  const [viyaModal, setViyaModal] = useState(null)
  const [manasModal, setManasModal] = useState(null)
  const [guruModal, setGuruModal] = useState(null)

  const [answers, setAnswers] = useState({})
  const [quizResult, setQuizResult] = useState(null)

  // Audio State
  const [currentSong, setCurrentSong] = useState(null)
  const audioRef = useRef(null)

  const completedSkills = (user?.progress?.completed_skills || []).map(s => s.toLowerCase())
  const hasSkill = (keyword) => completedSkills.some(s => s.includes(keyword))
  const hasExcel = hasSkill('excel')
  const hasTyping = hasSkill('typing')
  const hasContent = hasSkill('content')
  const hasMarketing = hasSkill('marketing') || hasSkill('social')
  const hasTailoring = hasSkill('tailoring') || hasSkill('handicraft') || hasSkill('craft')
  const hasGovBasics = hasSkill('gem') || hasSkill('contract') || hasSkill('government')
  const dataEntryFullMatch = hasExcel && hasTyping
  const contentFullMatch = hasContent && hasMarketing
  const gemFullMatch = hasTailoring && hasGovBasics

  function openMaps(query) {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function playSong(url, id) {
    if (currentSong === id) {
      // Toggle stop
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      setCurrentSong(null)
      return
    }

    // Stop existing
    if (audioRef.current) {
      audioRef.current.pause()
    }

    const audio = new Audio(url)
    audio.play().catch(e => console.warn("Audio play failed", e))
    audioRef.current = audio
    setCurrentSong(id)

    // Reset when done
    audio.onended = () => {
      setCurrentSong(null)
      audioRef.current = null
    }
  }

  useEffect(() => {
    fetch('/api/v1/shiksha/courses')
      .then(r => {
        if (!r.ok) throw new Error('Network response was not ok')
        return r.json()
      })
      .then(d => {
        if (d.courses && d.courses.length > 0) {
          setCourses(d.courses)
          setError(null)
        } else {
          setError('No courses found in database')
        }
        setLoading(false)
      })
      .catch(e => {
        console.error("Fetch error:", e)
        setError(`Failed to load courses: ${e.message}`)
        setLoading(false)
      })
  }, [])

  function hasCompleted(courseId) {
    return user?.progress?.completed_skills?.includes(courseId)
  }

  function handleStart(course) {
    if (hasCompleted(course.courseId)) return
    // enrich course with animation and hindi narration depending on skill/title
    const lower = (course.skill || course.title || '').toLowerCase()
    const animationMap = {
      'digital finance': 'https://assets6.lottiefiles.com/packages/lf20_touohxv0.json',
      'digital marketing': 'https://assets2.lottiefiles.com/packages/lf20_8sum1a5m.json',
      'smartphone': 'https://assets2.lottiefiles.com/packages/lf20_8sum1a5m.json',
      'legal': 'https://assets1.lottiefiles.com/packages/lf20_jbrw3hcz.json',
    }
    let animationUrl = null
    Object.keys(animationMap).forEach(k => { if (lower.includes(k)) animationUrl = animationMap[k] })

    const hindiText = course.title.includes('Digital') ?
      'यह कोर्स डिजिटल फाइनेंस की मूल बातें सिखाता है, जैसे यूपीआई, सुरक्षित बैंकिंग और ऑनलाइन धोखाधड़ी से कैसे बचें।' :
      `यह पाठ ${course.title} के बारे में जानकारी देता है।`

    setActiveCourse({ ...course, animationUrl, hindiText })
    setModalOpen(true)
    setMsg('')
  }

  // When modal opens, load lottie animation for the activeCourse
  useEffect(() => {
    if (modalOpen && activeCourse && lottieRef.current) {
      const url = activeCourse.animationUrl
      if (url) loadLottieAnimation(lottieRef.current, url)
    }
    // cleanup: stop any lottie when modal closes
    return () => {
      if (!modalOpen && lottieRef.current) lottieRef.current.innerHTML = ''
    }
  }, [modalOpen, activeCourse])

  // Load Shiksha header animation (Diya/Growing Tree) on component mount
  useEffect(() => {
    if (shikshaAnimRef.current) {
      // Use a growing tree animation to symbolize knowledge growth
      loadLottieAnimation(shikshaAnimRef.current, 'https://assets1.lottiefiles.com/packages/lf20_u7m4kd0r.json')
    }
  }, [])

  async function finishCourse() {
    if (!activeCourse) return
    setProcessing(true)
    // Simulate quiz taking then completing
    const res = await completeCourse(activeCourse.courseId, 90)
    setProcessing(false)
    if (res?.pointsEarned) {
      setMsg(`CONGRATULATIONS! You completed ${activeCourse.title} and earned ${res.pointsEarned} points.`)
      setTimeout(() => {
        setModalOpen(false)
        setActiveCourse(null)
        setMsg('')
      }, 3000)
    } else {
      setMsg('Error completing course')
    }
  }

  function playVoice(text) {
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
        const utter = new SpeechSynthesisUtterance(text)
        utter.rate = 0.95
        window.speechSynthesis.speak(utter)
      }
    } catch (e) {
      console.warn('Voice not supported', e)
    }
  }

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

  // Load lottie-web from CDN if not present, then render animation JSON into container
  async function loadLottieAnimation(container, jsonUrl) {
    if (!container) return
    // ensure lottie lib
    if (!window.lottie) {
      await new Promise((res, rej) => {
        const s = document.createElement('script')
        s.src = 'https://unpkg.com/lottie-web/build/player/lottie.min.js'
        s.onload = res
        s.onerror = rej
        document.head.appendChild(s)
      }).catch(() => { console.warn('Failed to load lottie library') })
    }

    try {
      const r = await fetch(jsonUrl)
      const data = await r.json()
      // clear container
      container.innerHTML = ''
      window.lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: data
      })
    } catch (e) {
      console.warn('Failed to load lottie json', e)
    }
  }

  // Add styles for animations
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes pulseGlow {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      .pulse-glow { animation: pulseGlow 2s infinite; }
      .card-vibrant {
        border-left: 5px solid ${COLORS.secondary};
        box-shadow: 0 4px 12px rgba(194, 65, 12, 0.15);
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .card-vibrant:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(194, 65, 12, 0.25);
      }
      
      @keyframes breathe {
        0%, 100% { 
          transform: scale(1);
          opacity: 0.9;
        }
        50% { 
          transform: scale(1.15);
          opacity: 1;
        }
      }
      .breathing-animation {
        animation: breathe 4s ease-in-out infinite;
      }
    `
    document.head.appendChild(style)
  }, [])

  function submitQuiz() {
    let score = 0
    QUIZ_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        score += 1
      }
    })
    setQuizResult({ score, total: QUIZ_QUESTIONS.length })
  }

  const renderPrernaKendra = () => (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ color: COLORS.secondary, marginBottom: '24px', fontSize: '22px', fontWeight: '700' }}>🌟 Prerna Kendra — Motivational Hub</h3>

      {/* Prerna Chitra - Videos */}
      <h4 style={{ color: COLORS.textSecondary, marginBottom: '16px', fontSize: '16px', fontWeight: '600', textTransform: 'uppercase' }}>🎬 Prerna Chitra (Inspiring Stories)</h4>
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {PRERNA_VIDEOS.map(video => (
          <div key={video.id} className="card-vibrant" style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
            <div style={{ height: '160px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', position: 'relative' }}>
              {video.thumbnail.startsWith('http') ? (
                <img src={video.thumbnail} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : video.thumbnail}
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: COLORS.warning, textTransform: 'uppercase', marginBottom: '4px' }}>{video.source}</div>
              <h5 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: COLORS.textPrimary }}>{video.title}</h5>
              <button
                className="btn"
                onClick={() => window.open(video.url, '_blank')}
                style={{ width: '100%', background: COLORS.secondary, color: 'white', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', marginTop: '8px' }}>
                ▶ Watch Video
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sashakt Geet - Anthems */}
      <h4 style={{ color: COLORS.textSecondary, marginBottom: '16px', fontSize: '16px', fontWeight: '600', textTransform: 'uppercase' }}>🎵 Sashakt Geet (Power Anthems)</h4>
      <div style={{ marginBottom: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {SASHAKT_ANTHEMS.map(song => (
          <div key={song.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: currentSong === song.id ? `${COLORS.secondary}15` : 'white', borderRadius: '12px', border: currentSong === song.id ? `1px solid ${COLORS.secondary}` : `1px solid ${COLORS.border}`, boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'all 0.3s' }}>
            <div style={{ padding: '10px', background: currentSong === song.id ? COLORS.secondary : '#ecfccb', borderRadius: '50%', fontSize: '20px', color: currentSong === song.id ? 'white' : 'inherit' }}>
              {currentSong === song.id ? '🔊' : '🎵'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', color: COLORS.textPrimary }}>{song.title}</div>
              <div style={{ fontSize: '13px', color: COLORS.textSecondary }}>{song.artist} • {song.mood}</div>
            </div>
            <button
              onClick={() => playSong(song.url, song.id)}
              style={{ background: 'transparent', border: `1px solid ${currentSong === song.id ? COLORS.secondary : COLORS.primary}`, borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: currentSong === song.id ? COLORS.secondary : COLORS.primary }}>
              {currentSong === song.id ? '⏸' : '▶'}
            </button>
          </div>
        ))}
      </div>

      {/* Viya Vani - Podcasts */}
      <h4 style={{ color: COLORS.textSecondary, marginBottom: '16px', fontSize: '16px', fontWeight: '600', textTransform: 'uppercase' }}>🎙️ Viya Vani (Podcasts)</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {VIYA_PODCASTS.map(pod => (
          <div key={pod.id} style={{ padding: '20px', background: '#f0f9ff', borderRadius: '16px', border: `1px solid #bae6fd`, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
              {pod.thumbnail ? (
                <img src={pod.thumbnail} alt={pod.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🎙️</div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h5 style={{ margin: 0, fontWeight: '700', color: '#0369a1', fontSize: '15px' }}>{pod.title}</h5>
              <div style={{ fontSize: '12px', color: '#0ea5e9', marginTop: '4px' }}>Host: {pod.host} • {pod.duration}</div>
            </div>
            <button className="btn" onClick={() => window.open(pod.url, '_blank')} style={{ background: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' }}>
              ▶ Listen
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  const renderGranthalaya = () => (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ color: COLORS.primary, marginBottom: '24px', fontSize: '22px', fontWeight: '700' }}>📚 Granthalaya — Book & Magazine Hub</h3>

      {/* Audio Books */}
      <h4 style={{ color: COLORS.textSecondary, marginBottom: '16px', fontSize: '16px', fontWeight: '600', textTransform: 'uppercase' }}>🎧 Audio-First Library</h4>
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {BOOKS_DATA.map(book => (
          <div key={book.id} style={{ padding: '20px', background: 'white', borderRadius: '12px', border: `1px solid ${COLORS.border}`, boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', gap: '16px' }}>
            <div style={{ width: '80px', height: '100px', background: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📘</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: COLORS.primary, fontWeight: '600', textTransform: 'uppercase' }}>{book.category}</div>
              <h5 style={{ margin: '4px 0', fontSize: '16px', fontWeight: '700', color: COLORS.textPrimary }}>{book.title}</h5>
              <div style={{ fontSize: '13px', color: COLORS.textSecondary, marginBottom: '12px' }}>by {book.author}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => playVoice(`Summary of ${book.title}. ${book.desc}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: `${COLORS.primary}15`, color: COLORS.primary, border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                  <span>🔊</span> Summary
                </button>
                {book.url && (
                  <button
                    onClick={() => window.open(book.url, '_blank')}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: COLORS.primary, color: 'white', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                    <span>🎧</span> Audiobook
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Magazines */}
      <h4 style={{ color: COLORS.textSecondary, marginBottom: '16px', fontSize: '16px', fontWeight: '600', textTransform: 'uppercase' }}>📰 Digital Magazines</h4>
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {MAGAZINES_DATA.map(mag => (
          <div
            key={mag.id}
            onClick={() => window.open(mag.url, '_blank')}
            style={{ position: 'relative', height: '300px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s', border: `1px solid ${COLORS.border}` }}
            className="card-vibrant"
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <img src={mag.cover} alt={mag.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', padding: '20px', color: 'white' }}>
              <div style={{ fontWeight: '700', fontSize: '18px', marginBottom: '4px' }}>{mag.title}</div>
              <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '8px' }}>{mag.issue}</div>
              <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.2)', borderRadius: '20px', fontSize: '11px', backdropFilter: 'blur(4px)' }}>{mag.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <main id="main" className="dashboard shiksha-page">
      <div className="dashboard-shell shiksha-shell">

        {/* Hero Header */}
        <div className="shiksha-hero">
          <div className="shiksha-hero-logo">
            <img src="/assets/shiksha-logo.jpg" alt="Shiksha Logo" />
          </div>
          <div className="shiksha-hero-content">
            <h1>Shiksha — Your Learning Hub</h1>
            <p>Transform skills into financial independence</p>
          </div>
        </div>

        {/* Completed Skills Summary */}
        <InfoCard title="✨ Your Completed Skills" className="dashboard-card shiksha-card" style={{ marginBottom: '32px', background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '12px' }}>
          <div className="flex flex-wrap gap-sm" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {user?.progress?.completed_skills && user.progress.completed_skills.length > 0 ? (
              user.progress.completed_skills.map(skill => (
                <Badge key={skill} style={{
                  background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
                  color: 'white',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '500',
                  border: 'none'
                }}>
                  🏆 {skill.replace(/_/g, ' ')}
                </Badge>
              ))
            ) : (
              <span style={{ color: COLORS.textSecondary, fontSize: '14px' }}>🌱 Complete courses below to earn skills and unlock opportunities</span>
            )}
          </div>
        </InfoCard>

        {/* Navigation Tabs */}
        <div className="shiksha-tabs">
          <button
            onClick={() => setActiveTab('modules')}
            className={`shiksha-tab ${activeTab === 'modules' ? 'is-active is-modules' : ''}`}
          >
            🎓 Modules
          </button>
          <button
            onClick={() => setActiveTab('prerna')}
            className={`shiksha-tab ${activeTab === 'prerna' ? 'is-active is-prerna' : ''}`}
          >
            🌟 Prerna Kendra
          </button>
          <button
            onClick={() => setActiveTab('grantha')}
            className={`shiksha-tab ${activeTab === 'grantha' ? 'is-active is-grantha' : ''}`}
          >
            📚 Granthalaya
          </button>
        </div>

        {/* LEARNING MODULES SECTION */}
        {activeTab === 'modules' && (
          <>
            <div style={{ marginTop: '12px' }}>
              <h2 style={{ color: COLORS.textPrimary, marginBottom: '20px', fontSize: '24px', fontWeight: '600', letterSpacing: '-0.3px' }}>Knowledge Hub — Learning Modules</h2>
              <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>

                {/* Digital Finance 101 */}
                <div style={{ padding: '24px', borderRadius: '12px', background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderTop: `3px solid ${COLORS.secondary}`, position: 'relative', transition: 'all 0.3s ease', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <h3 style={{ color: COLORS.secondary, marginTop: 0, marginBottom: '12px', fontSize: '18px', fontWeight: '600' }}>💰 Digital Finance 101</h3>
                  <p style={{ color: COLORS.textSecondary, marginBottom: '16px', fontSize: '14px', lineHeight: '1.6' }}>Master UPI, secure banking, and protect yourself from online fraud</p>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setInfoModal({
                      title: '💰 Digital Finance 101',
                      body: 'Learn secure digital payments: UPI transactions at local markets, bank account safety, OTP protection, and fraud prevention. Real-world examples for low-literacy users.',
                      quickRead: [
                        'Never share OTP or UPI PIN.',
                        'Verify payee name before sending money.',
                        'Use official apps; avoid unknown links.',
                        'Enable SMS alerts for transactions.'
                      ],
                      gov: 'Digital India Learning Platform',
                      govLink: 'https://www.digitalindia.gov.in/initiative/lms/'
                    })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setInfoModal({
                          title: '💰 Digital Finance 101',
                          body: 'Learn secure digital payments: UPI transactions at local markets, bank account safety, OTP protection, and fraud prevention. Real-world examples for low-literacy users.',
                          quickRead: [
                            'Never share OTP or UPI PIN.',
                            'Verify payee name before sending money.',
                            'Use official apps; avoid unknown links.',
                            'Enable SMS alerts for transactions.'
                          ],
                          gov: 'Digital India Learning Platform',
                          govLink: 'https://www.digitalindia.gov.in/initiative/lms/'
                        })
                      }
                    }}
                    style={{
                      background: `${COLORS.accent}15`,
                      color: COLORS.accent,
                      padding: '10px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      marginBottom: '10px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: '700', marginBottom: '6px' }}>🃏 Flash Card</div>
                    <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.5' }}>
                      <li>Never share OTP or UPI PIN.</li>
                      <li>Verify payee name before sending money.</li>
                      <li>Use official apps; avoid unknown links.</li>
                      <li>Enable SMS alerts for transactions.</li>
                    </ul>
                  </div>
                  <a
                    href="https://www.digitalindia.gov.in/initiative/lms/"
                    target="_blank"
                    rel="noreferrer"
                    style={{ background: `${COLORS.warning}15`, padding: '10px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '16px', color: COLORS.warning, fontWeight: '500', display: 'block', textDecoration: 'none' }}
                  >
                    🏛️ Gov: Digital India Learning Platform
                  </a>
                  <div className="flex gap-2" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button className="btn btn-ghost" style={{ background: 'transparent', border: `1px solid ${COLORS.border}`, color: COLORS.textSecondary, borderRadius: '8px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer' }} onClick={() => playVoice('Digital Finance 101 teaches UPI basics, secure banking, and online fraud prevention')}>🔊 Listen</button>
                    <button
                      className="btn"
                      style={{ background: COLORS.secondary, color: 'white', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
                      onClick={() => setInfoModal({
                        title: '💰 Digital Finance 101',
                        body: 'Learn secure digital payments: UPI transactions at local markets, bank account safety, OTP protection, and fraud prevention. Real-world examples for low-literacy users.',
                        quickRead: [
                          'Never share OTP or UPI PIN.',
                          'Verify payee name before sending money.',
                          'Use official apps; avoid unknown links.',
                          'Enable SMS alerts for transactions.'
                        ],
                        gov: 'Digital India Learning Platform',
                        govLink: 'https://www.digitalindia.gov.in/initiative/lms/'
                      })}
                    >
                      Learn More
                    </button>
                  </div>
                </div>

                {/* Know Your Workplace Rights */}
                <div style={{ padding: '24px', borderRadius: '12px', background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderTop: `3px solid ${COLORS.success}`, position: 'relative', transition: 'all 0.3s ease', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <h3 style={{ color: COLORS.success, marginTop: 0, marginBottom: '12px', fontSize: '18px', fontWeight: '600' }}>⚖️ Know Your Workplace Rights</h3>
                  <p style={{ color: COLORS.textSecondary, marginBottom: '16px', fontSize: '14px', lineHeight: '1.6' }}>Understand POSH Act, equal pay, and workplace safety regulations</p>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setLegalModal({
                      title: '⚖️ Know Your Workplace Rights',
                      body: 'POSH (Prevention of Sexual Harassment) Act, equal pay regulations, safe working environment. Know your rights and report violations safely.',
                      quickRead: [
                        'POSH Act protects you from harassment.',
                        'Equal pay for equal work is your right.',
                        'Report issues to the Internal Committee (IC).',
                        'Keep records of incidents and witnesses.'
                      ],
                      gov: 'Ministry of Women & Child Development',
                      govLink: 'https://wcd.gov.in/'
                    })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setLegalModal({
                          title: '⚖️ Know Your Workplace Rights',
                          body: 'POSH (Prevention of Sexual Harassment) Act, equal pay regulations, safe working environment. Know your rights and report violations safely.',
                          quickRead: [
                            'POSH Act protects you from harassment.',
                            'Equal pay for equal work is your right.',
                            'Report issues to the Internal Committee (IC).',
                            'Keep records of incidents and witnesses.'
                          ],
                          gov: 'Ministry of Women & Child Development',
                          govLink: 'https://wcd.gov.in/'
                        })
                      }
                    }}
                    style={{
                      background: `${COLORS.success}15`,
                      color: COLORS.success,
                      padding: '10px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      marginBottom: '10px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: '700', marginBottom: '6px' }}>🃏 Flash Card</div>
                    <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.5' }}>
                      <li>POSH Act protects you from harassment.</li>
                      <li>Equal pay for equal work is your right.</li>
                      <li>Report issues to the Internal Committee (IC).</li>
                      <li>Keep records of incidents and witnesses.</li>
                    </ul>
                  </div>
                  <a
                    href="https://wcd.gov.in/"
                    target="_blank"
                    rel="noreferrer"
                    style={{ background: `${COLORS.warning}15`, padding: '10px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '16px', color: COLORS.warning, fontWeight: '500', display: 'block', textDecoration: 'none' }}
                  >
                    🏛️ Gov: Ministry of Women & Child Development
                  </a>
                  <div className="flex gap-2" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button className="btn btn-ghost" style={{ background: 'transparent', border: `1px solid ${COLORS.border}`, color: COLORS.textSecondary, borderRadius: '8px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer' }} onClick={() => playVoiceHindi('अपने कार्यस्थल पर अपने अधिकार जानें: POSH अधिनियम, समान वेतन, और सुरक्षा नियम')}>🔊 सुनें</button>
                    <button
                      className="btn"
                      style={{ background: COLORS.success, color: 'white', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
                      onClick={() => setLegalModal({
                        title: '⚖️ Know Your Workplace Rights',
                        body: 'POSH (Prevention of Sexual Harassment) Act, equal pay regulations, safe working environment. Know your rights and report violations safely.',
                        quickRead: [
                          'POSH Act protects you from harassment.',
                          'Equal pay for equal work is your right.',
                          'Report issues to the Internal Committee (IC).',
                          'Keep records of incidents and witnesses.'
                        ],
                        gov: 'Ministry of Women & Child Development',
                        govLink: 'https://wcd.gov.in/'
                      })}
                    >
                      Learn More
                    </button>
                  </div>
                </div>

                {/* Smartphone for Business */}
                <div style={{ padding: '24px', borderRadius: '12px', background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderTop: `3px solid ${COLORS.primary}`, position: 'relative', transition: 'all 0.3s ease', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <h3 style={{ color: COLORS.primary, marginTop: 0, marginBottom: '12px', fontSize: '18px', fontWeight: '600' }}>📱 Smartphone for Business</h3>
                  <p style={{ color: COLORS.textSecondary, marginBottom: '16px', fontSize: '14px', lineHeight: '1.6' }}>WhatsApp Business catalog, social media marketing, digital presence</p>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setInfoModal({
                      title: '📱 Smartphone for Business',
                      body: 'Set up WhatsApp Business catalog for your shop, use Instagram/Facebook for marketing, track sales digitally. Real example: Tailoring shop with online orders.',
                      quickRead: [
                        'Create a WhatsApp Business profile + catalog.',
                        'Post products regularly on social media.',
                        'Use digital payments and track orders.',
                        'Reply quickly to build customer trust.'
                      ],
                      gov: 'Skill India Digital',
                      govLink: 'https://www.skillindiadigital.gov.in/home'
                    })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setInfoModal({
                          title: '📱 Smartphone for Business',
                          body: 'Set up WhatsApp Business catalog for your shop, use Instagram/Facebook for marketing, track sales digitally. Real example: Tailoring shop with online orders.',
                          quickRead: [
                            'Create a WhatsApp Business profile + catalog.',
                            'Post products regularly on social media.',
                            'Use digital payments and track orders.',
                            'Reply quickly to build customer trust.'
                          ],
                          gov: 'Skill India Digital',
                          govLink: 'https://www.skillindiadigital.gov.in/home'
                        })
                      }
                    }}
                    style={{
                      background: `${COLORS.accent}15`,
                      color: COLORS.accent,
                      padding: '10px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      marginBottom: '10px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: '700', marginBottom: '6px' }}>🃏 Flash Card</div>
                    <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.5' }}>
                      <li>Create a WhatsApp Business profile + catalog.</li>
                      <li>Post products regularly on social media.</li>
                      <li>Use digital payments and track orders.</li>
                      <li>Reply quickly to build customer trust.</li>
                    </ul>
                  </div>
                  <a
                    href="https://www.skillindiadigital.gov.in/home"
                    target="_blank"
                    rel="noreferrer"
                    style={{ background: `${COLORS.warning}15`, padding: '10px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '16px', color: COLORS.warning, fontWeight: '500', display: 'block', textDecoration: 'none' }}
                  >
                    🏛️ Gov: Skill India Digital
                  </a>
                  <div className="flex gap-2" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button className="btn btn-ghost" style={{ background: 'transparent', border: `1px solid ${COLORS.border}`, color: COLORS.textSecondary, borderRadius: '8px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer' }} onClick={() => playVoice('Smartphone for business: WhatsApp Business catalog, Instagram marketing, reaching customers online')}>🔊 Listen</button>
                    <button
                      className="btn"
                      style={{ background: COLORS.primary, color: 'white', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
                      onClick={() => setInfoModal({
                        title: '📱 Smartphone for Business',
                        body: 'Set up WhatsApp Business catalog for your shop, use Instagram/Facebook for marketing, track sales digitally. Real example: Tailoring shop with online orders.',
                        quickRead: [
                          'Create a WhatsApp Business profile + catalog.',
                          'Post products regularly on social media.',
                          'Use digital payments and track orders.',
                          'Reply quickly to build customer trust.'
                        ],
                        gov: 'Skill India Digital',
                        govLink: 'https://www.skillindiadigital.gov.in/home'
                      })}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>


            {/* DIGITAL SAFETY CHECKPOINT */}
            <div style={{ marginTop: '32px', padding: '28px', background: COLORS.surface, borderRadius: '16px', border: `1px solid ${COLORS.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ color: COLORS.textPrimary, marginTop: 0, marginBottom: '8px', fontSize: '22px', fontWeight: '600' }}>Quick Quiz: Digital Safety Checkpoint</h3>
              <p style={{ color: COLORS.textSecondary, marginBottom: '20px', fontSize: '14px' }}>Test your knowledge on digital security!</p>

              <div style={{ marginTop: '20px' }}>
                {QUIZ_QUESTIONS.map((q) => {
                  const userAnswer = answers[q.id];
                  const isCorrect = userAnswer === q.correctAnswer;

                  return (
                    <div key={q.id} style={{ marginBottom: '20px', padding: '16px', background: `${COLORS.accent}08`, borderRadius: '10px', border: `1px solid ${COLORS.border}` }}>
                      <div style={{ fontWeight: 600, marginBottom: '12px', color: COLORS.textPrimary, fontSize: '15px' }}>❓ {q.question}</div>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {q.options.map((opt) => {
                          let bgColor = COLORS.border;
                          let textColor = COLORS.textSecondary;

                          // If user selected this option
                          if (userAnswer === opt.value) {
                            // If we are showing results (quizResult is not null), show correct/wrong colors
                            if (quizResult) {
                              bgColor = isCorrect ? COLORS.success : '#ef4444';
                              textColor = 'white';
                            } else {
                              // Just show selection state before submission
                              bgColor = COLORS.primary;
                              textColor = 'white';
                            }
                          }
                          // If we are showing results and this is the correct option (but user picked something else)
                          else if (quizResult && opt.value === q.correctAnswer) {
                            bgColor = COLORS.success;
                            textColor = 'white';
                          }


                          return (
                            <button
                              key={opt.value}
                              className="btn"
                              style={{
                                background: bgColor,
                                color: textColor,
                                border: 'none',
                                borderRadius: '8px',
                                padding: '10px 18px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                              }}
                              onClick={() => !quizResult && setAnswers(prev => ({ ...prev, [q.id]: opt.value }))}
                              disabled={!!quizResult}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {!quizResult ? (
                  <button
                    className="btn"
                    style={{ background: COLORS.primary, color: 'white', border: 'none', borderRadius: '8px', padding: '12px 24px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', transition: 'all 0.2s' }}
                    onClick={submitQuiz}
                    disabled={Object.keys(answers).length < QUIZ_QUESTIONS.length}
                  >
                    ✓ Check Your Score
                  </button>
                ) : (
                  <button
                    className="btn"
                    style={{ background: COLORS.secondary, color: 'white', border: 'none', borderRadius: '8px', padding: '12px 24px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', transition: 'all 0.2s' }}
                    onClick={() => {
                      setAnswers({});
                      setQuizResult(null);
                    }}
                  >
                    🔄 Retry Quiz
                  </button>
                )}

                {quizResult && (
                  <div style={{ marginTop: '16px', padding: '16px', background: quizResult.score === quizResult.total ? `${COLORS.success}15` : `${COLORS.warning}15`, borderRadius: '10px', borderLeft: `4px solid ${quizResult.score === quizResult.total ? COLORS.success : COLORS.warning}` }}>
                    {quizResult.score === quizResult.total ? (
                      <div style={{ color: COLORS.success, fontWeight: 600, fontSize: '15px' }}>🎉 Perfect Score! You're a Digital Safety Expert!</div>
                    ) : (
                      <div style={{ color: COLORS.warning, fontWeight: 600, fontSize: '15px' }}>📚 Keep learning! Score: {quizResult.score}/{quizResult.total}</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 🧑‍🏫 GURUSAKHI - AI MENTOR SECTION */}
            <div style={{ marginTop: '48px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ padding: '10px', background: `${COLORS.primary}15`, borderRadius: '12px', fontSize: '24px' }}>🧑‍🏫</div>
                <div>
                  <h2 style={{ color: COLORS.textPrimary, margin: 0, fontSize: '24px', fontWeight: '700' }}>GuruSakhi — Your AI Mentor</h2>
                  <p style={{ margin: '4px 0 0 0', color: COLORS.textSecondary, fontSize: '14px' }}>Expert guidance for your career, legal rights, and professional growth</p>
                </div>
              </div>

              <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>

                {/* Career Sakhi */}
                <div className="card-vibrant" style={{
                  padding: '28px',
                  borderRadius: '20px',
                  background: 'linear-gradient(145deg, #ffffff 0%, #fefce8 100%)',
                  border: '1px solid #fde047',
                  boxShadow: '0 4px 20px rgba(234, 179, 8, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Decorative Circle */}
                  <div style={{ position: 'absolute', top: -20, right: -20, width: '100px', height: '100px', background: 'radial-gradient(circle, #fde04740 0%, transparent 70%)', borderRadius: '50%' }}></div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ background: '#fef9c3', padding: '12px', borderRadius: '14px', fontSize: '28px', color: '#ca8a04' }}>💼</div>
                    <div style={{ padding: '6px 12px', background: '#ca8a04', color: 'white', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Job Ready</div>
                  </div>

                  <h3 style={{ color: '#854d0e', margin: '0 0 8px 0', fontSize: '22px', fontWeight: '700' }}>Career Sakhi</h3>
                  <p style={{ color: '#713f12', marginBottom: '24px', fontSize: '15px', lineHeight: '1.6' }}>Build a winning resume, prepare for interviews, and get guidance for your first job.</p>

                  <div style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #fde047', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#a16207', marginBottom: '8px', textTransform: 'uppercase' }}>📹 Featured Video</div>
                    <div
                      onClick={() => window.open('https://youtu.be/mmQcX6HpCGs?si=5z_mLkOnNGqQyR6M', '_blank')}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#854d0e', fontWeight: '500', fontSize: '14px', cursor: 'pointer' }}>
                      <span>▶️</span> <span style={{ textDecoration: 'underline' }}>"How to Ace Your First Interview"</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => setGuruModal({ type: 'career', title: '💼 Career Sakhi - AI Mentor', body: 'Career guidance from resume building to interview prep. Learn how to present your skills confidently. Get matched with local mentors.', resources: ['YouTube: NCS India - Career Counseling & Interview Tips', 'Free resume templates from National Career Service'] })}
                      style={{ flex: 1, background: '#ca8a04', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', boxShadow: '0 4px 12px rgba(202, 138, 4, 0.3)' }}
                    >
                      Ask Question
                    </button>
                    <button
                      onClick={() => playVoiceHindi('करियर सखी आपको रिज़्यूम बनाने में, इंटरव्यू की तैयारी में और पहली नौकरी के लिए आवेदन करने में मदद करती है।')}
                      style={{ width: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fefce8', border: '1px solid #ca8a04', borderRadius: '10px', cursor: 'pointer', fontSize: '20px' }}
                    >
                      🔊
                    </button>
                  </div>
                </div>

                {/* Legal Sakhi */}
                <div className="card-vibrant" style={{
                  padding: '28px',
                  borderRadius: '20px',
                  background: 'linear-gradient(145deg, #ffffff 0%, #fff7ed 100%)',
                  border: '1px solid #fdba74',
                  boxShadow: '0 4px 20px rgba(249, 115, 22, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: -20, right: -20, width: '100px', height: '100px', background: 'radial-gradient(circle, #fdba7440 0%, transparent 70%)', borderRadius: '50%' }}></div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ background: '#ffedd5', padding: '12px', borderRadius: '14px', fontSize: '28px', color: '#c2410c' }}>⚖️</div>
                    <div style={{ padding: '6px 12px', background: '#ea580c', color: 'white', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Legal Aid</div>
                  </div>

                  <h3 style={{ color: '#9a3412', margin: '0 0 8px 0', fontSize: '22px', fontWeight: '700' }}>Legal Sakhi</h3>
                  <p style={{ color: '#7c2d12', marginBottom: '24px', fontSize: '15px', lineHeight: '1.6' }}>Guidance on property rights, POSH, and domestic concerns. Know your rights.</p>

                  <div style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #fdba74', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#c2410c' }}>☎️ HELPLINE</span>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#16a34a' }}>● Available Now</span>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#9a3412' }}>1800-LEGAL-HELP</div>
                    <div style={{ fontSize: '12px', color: '#c2410c', marginTop: '4px' }}>Mon-Fri, 10 AM - 6 PM</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <button
                      onClick={() => setGuruModal({ type: 'legal', title: '⚖️ Legal Sakhi - Schedule Call', body: 'Legal guidance on property rights, workplace harassment (POSH), domestic concerns. Connect with trained legal advisors anonymously.', phone: '+91-1800-LEGAL-HELP' })}
                      style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #c2410c', borderRadius: '10px', padding: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
                    >
                      Schedule Call
                    </button>
                    <button
                      onClick={() => setGuruModal({ type: 'legal-urgent', title: '⚖️ Legal Sakhi - Emergency Help', body: 'Immediate legal support for urgent situations. Connect now with trained advisors.', phone: '+91-1800-111-222' })}
                      style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}
                    >
                      Emergency 🆘
                    </button>
                  </div>
                </div>

                {/* Mentorship Connect */}
                <div className="card-vibrant" style={{
                  padding: '28px',
                  borderRadius: '20px',
                  background: 'linear-gradient(145deg, #ffffff 0%, #ecfeff 100%)',
                  border: '1px solid #67e8f9',
                  boxShadow: '0 4px 20px rgba(6, 182, 212, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: -20, right: -20, width: '100px', height: '100px', background: 'radial-gradient(circle, #67e8f940 0%, transparent 70%)', borderRadius: '50%' }}></div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ background: '#cffafe', padding: '12px', borderRadius: '14px', fontSize: '28px', color: '#0891b2' }}>🤝</div>
                    <div style={{ padding: '6px 12px', background: '#0891b2', color: 'white', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Community</div>
                  </div>

                  <h3 style={{ color: '#155e75', margin: '0 0 8px 0', fontSize: '22px', fontWeight: '700' }}>Mentorship Connect</h3>
                  <p style={{ color: '#164e63', marginBottom: '24px', fontSize: '15px', lineHeight: '1.6' }}>Match with experienced women mentors in your field. 1-on-1 sessions.</p>

                  <div style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #67e8f9', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', marginLeft: '10px' }}>
                        {[1, 2, 3].map(i => (
                          <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0891b2', border: '2px solid white', marginLeft: '-10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px' }}>👩</div>
                        ))}
                      </div>
                      <div style={{ fontSize: '13px', color: '#155e75', fontWeight: '500' }}>
                        150+ Mentors Online
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => setGuruModal({ type: 'mentor', title: '🤝 Find Your Mentor', body: 'Connect with experienced women professionals. Share goals, get guidance, build confidence.', availability: 'Mon-Sun, 6 PM - 10 PM' })}
                      style={{ flex: 1, background: '#0891b2', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', boxShadow: '0 4px 12px rgba(8, 145, 178, 0.3)' }}
                    >
                      Find Mentor
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* 🧠 MANASSAKHI - MENTAL HEALTH SECTION */}
            <div style={{ marginTop: '24px', padding: '20px', background: `linear-gradient(135deg, ${COLORS.aqua}20 0%, ${COLORS.mint}20 100%)`, borderRadius: '12px', border: `2px solid ${COLORS.aqua}` }}>
              <h2 style={{ color: COLORS.darkTeal, marginTop: 0, marginBottom: '12px' }}>🧠 ManasSakhi — Mental Health Safe Space</h2>
              <p style={{ color: '#475569' }}>Your emotional well-being matters. Access free, confidential, and trauma-informed counseling.</p>

              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginTop: '16px' }}>
                {/* Breathing Exercise */}
                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <div className="breathing-animation" style={{ width: '100px', height: '100px', margin: '0 auto 12px', background: `${COLORS.mint}30`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                    🫁
                  </div>
                  <h4 style={{ marginTop: 0 }}>Breathing Exercises</h4>
                  <p style={{ fontSize: '13px', color: '#475569' }}>Guided breathing to reduce stress and anxiety</p>
                  <button className="btn" style={{ background: COLORS.mint, color: '#166534', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer' }} onClick={() => setManasModal({ type: 'breathing', title: '🫁 Guided Breathing Exercise', body: 'Follow along: Inhale for 4 seconds, hold for 4, exhale for 4. Repeat 5 times. This technique reduces anxiety and stress.' })}>Start Now</button>
                </div>

                {/* Talk to Counselor */}
                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <div style={{ width: '100px', height: '100px', margin: '0 auto 12px', background: `${COLORS.aqua}30`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                    💬
                  </div>
                  <h4 style={{ marginTop: 0 }}>Talk Now</h4>
                  <p style={{ fontSize: '13px', color: '#475569' }}>Connect with trained counselors anonymously</p>
                  <button className="btn" style={{ background: COLORS.aqua, color: '#0369a1', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer' }} onClick={() => setManasModal({ type: 'counselor', title: '💬 Talk to a Counselor', body: 'Trained counselors available 24/7. Share your concerns about stress, anxiety, relationships, or work. All conversations are completely confidential.', helplines: ['+91-1800-599-0019 (Kiran - Toll Free)', '+91-8376-804-800 (Tele-MANAS)', '+91-9152987821 (iCall)'] })}>Connect Now</button>
                </div>

                {/* Emergency Support */}
                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <div style={{ width: '100px', height: '100px', margin: '0 auto 12px', background: '#fecaca', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                    🆘
                  </div>
                  <h4 style={{ marginTop: 0 }}>Emergency Support</h4>
                  <p style={{ fontSize: '13px', color: '#475569' }}>Crisis helplines available 24/7</p>
                  <button className="btn" style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer' }} onClick={() => setManasModal({ type: 'emergency', title: '🆘 Mental Health Crisis Support', body: 'Available 24/7 for mental health emergencies and suicide prevention. All services are free and confidential.', helplines: ['Kiran: 1800-599-0019 (toll-free)', 'Tele-MANAS: +91-8376-804-800', 'AASRA: +91-2275-46669 (suicide prevention)'] })}>Call Now</button>
                </div>
              </div>

              <button className="btn btn-ghost" style={{ marginTop: '16px', borderRadius: '6px' }} onClick={() => playVoiceHindi('मानस सखी आपके भावनात्मक स्वास्थ्य के लिए एक सुरक्षित स्थान है। आप गोपनीयता के साथ किसी प्रशिक्षित परामर्शदाता से बात कर सकती हैं।')}>🔊 सुनें (हिंदी)</button>
            </div>

            {/* 💼 VIYAKAUSHAL - LEARN TO EARN HUB */}
            <div style={{ marginTop: '48px', marginBottom: '60px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ padding: '10px', background: `${COLORS.primary}15`, borderRadius: '12px', fontSize: '24px' }}>💼</div>
                <div>
                  <h2 style={{ color: COLORS.textPrimary, margin: 0, fontSize: '24px', fontWeight: '700' }}>ViyaKaushal — The Learn to Earn Hub</h2>
                  <p style={{ margin: '4px 0 0 0', color: COLORS.textSecondary, fontSize: '14px' }}>
                    Match your completed skills to real-world earning opportunities. The economic engine of your independence.
                  </p>
                </div>
              </div>

              <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>

                {/* Data Entry Expert */}
                <div className="card-vibrant" style={{
                  padding: '24px',
                  borderRadius: '20px',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>📊 Data Entry Expert</h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                        Ideal for those who completed <strong>Excel for Business</strong> in Shiksha.
                      </p>
                    </div>
                    {dataEntryFullMatch && (
                      <div className="match-badge match-animate">✨ Match!</div>
                    )}
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#0f766e', marginBottom: '6px' }}>Task Scope</div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
                      <li>Organize Excel spreadsheets</li>
                      <li>Validate data for local businesses</li>
                      <li>Accurate digitizing of records</li>
                    </ul>
                  </div>

                  <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', marginBottom: '6px' }}>Skill Match Logic</div>
                    <div style={{ fontSize: '13px', color: '#1f2937', marginBottom: '4px' }}>
                      Excel Intermediate: {hasExcel ? '🟢 Matches your Shiksha badge!' : '🟡 Complete "Excel for Business"'}
                    </div>
                    <div style={{ fontSize: '13px', color: '#1f2937' }}>
                      Typing Speed: {hasTyping ? '🟢 Ready for payout' : '🟡 Practice more in Unnati Games'}
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px' }}>Income</div>
                    <div style={{ fontSize: '16px', color: '#0f766e', fontWeight: '700' }}>₹100-200/hour · Remote or Local</div>
                  </div>

                  <a
                    href="https://eshram.gov.in/"
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#1d4ed8', textDecoration: 'underline', fontWeight: '600', marginBottom: '16px' }}
                  >
                    🏛️ Government Resource: eShram Portal
                  </a>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      className="btn"
                      style={{ background: 'white', border: `1px solid ${COLORS.border}`, color: COLORS.textSecondary, borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                      onClick={() => playVoiceHindi('डेटा एंट्री एक्सपर्ट: एक्सेल शीट्स व्यवस्थित करें, डेटा सत्यापन करें और रिकॉर्ड्स को सही तरीके से डिजिटल बनाएं।')}
                    >
                      🔊 सुनें
                    </button>
                    <button
                      className="btn"
                      style={{ background: dataEntryFullMatch ? '#166534' : '#0f172a', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
                      onClick={() => {
                        if (dataEntryFullMatch) {
                          openMaps('data entry jobs near me')
                        } else {
                          setViyaModal({
                            type: 'data-entry',
                            title: '📊 Data Entry Expert',
                            body: 'Organize Excel spreadsheets, validate data for local businesses, and digitize records accurately. Ideal after Excel for Business.',
                            role: 'Data Entry Specialist',
                            earnings: '₹100-200 / hour',
                            difficulty: 'Beginner Friendly',
                            roadmap: [
                              'Complete Excel for Business module',
                              'Practice typing speed in Unnati Games',
                              'Create a simple work portfolio (2 sample sheets)',
                              'Apply to nearby offices or remote gigs'
                            ],
                            skills: ['Excel Intermediate', 'Typing Speed', 'Accuracy'],
                            tools: ['Laptop/Desktop', 'MS Excel', 'Google Sheets']
                          })
                        }
                      }}
                    >
                      {dataEntryFullMatch ? 'View Opportunities' : 'Start Learning Path'}
                    </button>
                  </div>

                  {!dataEntryFullMatch && (
                    <div style={{ marginTop: '12px', padding: '10px 12px', background: '#fef3c7', borderRadius: '10px', fontSize: '12px', color: '#92400e', border: '1px solid #fde68a' }}>
                      Need a laptop for this job?{' '}
                      <Link to="/dashboard/samruddhih" style={{ color: '#b45309', fontWeight: 600 }}>
                        Apply for a Growth Loan in UdyamSakhi →
                      </Link>
                    </div>
                  )}
                </div>

                {/* Content Creator */}
                <div className="card-vibrant" style={{
                  padding: '24px',
                  borderRadius: '20px',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>✍️ Content Creator</h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                        For users who mastered <strong>Digital Marketing Basics</strong> &amp; <strong>Social Media for Business</strong>.
                      </p>
                    </div>
                    {contentFullMatch && (
                      <div className="match-badge match-animate">✨ Match!</div>
                    )}
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#86198f', marginBottom: '6px' }}>Task Scope</div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
                      <li>Write product descriptions for local artisans</li>
                      <li>Create social media posts and captions</li>
                      <li>Craft marketing copy for small brands</li>
                    </ul>
                  </div>

                  <div style={{ background: '#faf5ff', borderRadius: '12px', padding: '14px', border: '1px solid #f0abfc', marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#86198f', marginBottom: '6px' }}>Skill Match Logic</div>
                    <div style={{ fontSize: '13px', color: '#1f2937', marginBottom: '4px' }}>
                      Content Writing: {hasContent ? '🟢 Matches your Shiksha badge!' : '🟡 Complete "Content Writing" module'}
                    </div>
                    <div style={{ fontSize: '13px', color: '#1f2937' }}>
                      Social Media Management: {hasMarketing ? '🟢 Matches your Shiksha badge!' : '🟡 Practice with Social Media for Business'}
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#86198f', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px' }}>Income</div>
                    <div style={{ fontSize: '16px', color: '#86198f', fontWeight: '700' }}>₹50-100/post · Remote Only</div>
                    <div style={{ fontSize: '12px', color: '#7c2d12', marginTop: '6px' }}>
                      Outcome: Direct financial independence through the gig economy.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      className="btn"
                      style={{ background: 'white', border: `1px solid ${COLORS.border}`, color: COLORS.textSecondary, borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                      onClick={() => playVoiceHindi('कंटेंट क्रिएटर: प्रोडक्ट विवरण लिखें, सोशल मीडिया पोस्ट तैयार करें और छोटे ब्रांड्स के लिए मार्केटिंग कॉपी बनाएं।')}
                    >
                      🔊 सुनें
                    </button>
                    <button
                      className="btn"
                      style={{ background: contentFullMatch ? '#166534' : '#0f172a', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
                      onClick={() => {
                        if (contentFullMatch) {
                          window.open('https://www.google.com/search?q=content+writing+gigs+remote', '_blank', 'noopener,noreferrer')
                        } else {
                          setViyaModal({
                            type: 'content',
                            title: '✍️ Content Creator',
                            body: 'Write product descriptions, social posts, and marketing copy for local brands. A remote, flexible gig pathway.',
                            role: 'Content Creator / Writer',
                            earnings: '₹50-100 / post',
                            difficulty: 'Intermediate',
                            roadmap: [
                              'Complete Digital Marketing Basics',
                              'Finish Social Media for Business module',
                              'Create 3 sample posts for your portfolio',
                              'Pitch to local artisans or small businesses'
                            ],
                            skills: ['Content Writing', 'Social Media Management'],
                            tools: ['Google Docs', 'Canva', 'Grammarly']
                          })
                        }
                      }}
                    >
                      {contentFullMatch ? 'View Opportunities' : 'Start Learning Path'}
                    </button>
                  </div>

                  {!contentFullMatch && (
                    <div style={{ marginTop: '12px', padding: '10px 12px', background: '#fef3c7', borderRadius: '10px', fontSize: '12px', color: '#92400e', border: '1px solid #fde68a' }}>
                      Need a laptop for this job?{' '}
                      <Link to="/dashboard/samruddhih" style={{ color: '#b45309', fontWeight: 600 }}>
                        Apply for a Growth Loan in UdyamSakhi →
                      </Link>
                    </div>
                  )}
                </div>

                {/* GeM Womaniya Marketplace */}
                <div className="card-vibrant" style={{
                  padding: '24px',
                  borderRadius: '20px',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>🛍️ Sell on GeM Marketplace (Womaniya)</h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                        Scalable pathway for women entrepreneurs &amp; SHGs to reach government buyers.
                      </p>
                    </div>
                    {gemFullMatch && (
                      <div className="match-badge match-animate">✨ Match!</div>
                    )}
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#9a3412', marginBottom: '6px' }}>Task Scope</div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
                      <li>List handmade handicrafts, textiles, or food products</li>
                      <li>Upload product catalog &amp; pricing</li>
                      <li>Serve government buyers via GeM</li>
                    </ul>
                  </div>

                  <div style={{ background: '#fff7ed', borderRadius: '12px', padding: '14px', border: '1px solid #fdba74', marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#9a3412', marginBottom: '6px' }}>Skill Match Logic</div>
                    <div style={{ fontSize: '13px', color: '#1f2937', marginBottom: '4px' }}>
                      Handicrafts/Tailoring: {hasTailoring ? '🟢 Matches your Shiksha badge!' : '🟡 Complete Handicrafts/Tailoring module'}
                    </div>
                    <div style={{ fontSize: '13px', color: '#1f2937' }}>
                      Government Contract Basics: {hasGovBasics ? '🟢 Ready to list' : '🟡 Take the 5-min GeM tutorial in Shiksha'}
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#9a3412', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px' }}>Income</div>
                    <div style={{ fontSize: '16px', color: '#ea580c', fontWeight: '700' }}>Scale Unlimited · Government Buyers</div>
                  </div>

                  <a
                    href="https://gem.gov.in/womaniya"
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#1d4ed8', textDecoration: 'underline', fontWeight: '600', marginBottom: '16px' }}
                  >
                    🏛️ Government Resource: GeM Womaniya Marketplace
                  </a>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      className="btn"
                      style={{ background: 'white', border: `1px solid ${COLORS.border}`, color: COLORS.textSecondary, borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                      onClick={() => playVoiceHindi('GeM Womaniya: सरकारी खरीदारों तक अपने उत्पाद पहुंचाएं, कैटलॉग बनाएं और सरकारी टेंडर में शामिल हों।')}
                    >
                      🔊 सुनें
                    </button>
                    <button
                      className="btn"
                      style={{ background: '#ea580c', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
                      onClick={() => window.open('https://gem.gov.in/womaniya', '_blank', 'noopener,noreferrer')}
                    >
                      Open GeM Womaniya
                    </button>
                  </div>

                  {!gemFullMatch && (
                    <div style={{ marginTop: '12px', padding: '10px 12px', background: '#fef3c7', borderRadius: '10px', fontSize: '12px', color: '#92400e', border: '1px solid #fde68a' }}>
                      Need working capital?{' '}
                      <Link to="/dashboard/samruddhih" style={{ color: '#b45309', fontWeight: 600 }}>
                        Apply for a Growth Loan in UdyamSakhi →
                      </Link>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </>
        )}

        {/* PRERNA KENDRA SECTION */}
        {activeTab === 'prerna' && renderPrernaKendra()}

        {/* GRANTHALAYA SECTION */}
        {activeTab === 'grantha' && renderGranthalaya()}

        {/* Simple Course Modal */}
        {modalOpen && activeCourse && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{
              backgroundColor: 'white', borderRadius: '12px',
              width: '90%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto',
              padding: '32px', position: 'relative'
            }}>
              <button
                onClick={() => setModalOpen(false)}
                style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', fontSize: '24px', cursor: 'pointer' }}
              >
                ×
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#1E2A38' }}>{activeCourse.title}</h2>
                <div>
                  <button className="btn btn-ghost" onClick={() => playVoiceHindi(activeCourse.hindiText || (activeCourse.title + ' के बारे में जानकारी'))}>🔊 सुनें (हिंदी)</button>
                </div>
              </div>
              {activeCourse.hindiText && (<div style={{ color: '#475569', marginBottom: '12px' }}>{activeCourse.hindiText}</div>)}

              {msg ? (
                <div style={{ padding: '20px', background: '#dcfce7', color: '#166534', borderRadius: '8px', textAlign: 'center' }}>
                  {msg}
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ width: '100%', height: '200px', borderRadius: '8px', marginBottom: '16px', color: '#64748b', overflow: 'hidden', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div ref={lottieRef} style={{ width: '100%', height: '100%' }} />
                      {!activeCourse?.animationUrl && (
                        <div style={{ position: 'absolute', color: '#64748b' }}>[Video Player Placeholder]</div>
                      )}
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Course Syllabus</h3>
                    <ul style={{ paddingLeft: '20px', color: '#334155', lineHeight: '1.6' }}>
                      {activeCourse.syllabus && activeCourse.syllabus.map((topic, i) => (
                        <li key={i}>{topic}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-primary"
                      onClick={finishCourse}
                      disabled={processing}
                      style={{ width: '100%' }}
                    >
                      {processing ? 'Submitting...' : 'Complete Course & Take Quiz'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Info Modal */}
        {infoModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: 20, borderRadius: 10, maxWidth: 640, width: '95%' }}>
              <button onClick={() => setInfoModal(null)} style={{ float: 'right', border: 'none', background: 'transparent', fontSize: 20 }}>×</button>
              <h3 style={{ marginTop: 0 }}>{infoModal.title}</h3>
              <div style={{ color: '#334155' }}>{infoModal.body}</div>
              <div style={{ marginTop: 12, color: '#666' }}>
                {infoModal.quickRead && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>🃏 Quick Read</div>
                    <ul style={{ margin: 0, paddingLeft: 18, color: '#475569' }}>
                      {infoModal.quickRead.map((item, idx) => (
                        <li key={`${infoModal.title}-qr-${idx}`} style={{ marginBottom: 4 }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {infoModal.gov && (
                  <div style={{ marginTop: 8 }}>
                    🏛️ {infoModal.govLink ? (
                      <a href={infoModal.govLink} target="_blank" rel="noreferrer" style={{ color: COLORS.secondary, textDecoration: 'underline' }}>
                        {infoModal.gov}
                      </a>
                    ) : (
                      infoModal.gov
                    )}
                  </div>
                )}
              </div>
              <div style={{ marginTop: 12, textAlign: 'right' }}>
                <button className="btn btn-primary" style={{ background: COLORS.saffron, color: 'white', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer' }} onClick={() => setInfoModal(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Legal Modal */}
        {legalModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: 20, borderRadius: 10, maxWidth: 640, width: '95%' }}>
              <button onClick={() => setLegalModal(null)} style={{ float: 'right', border: 'none', background: 'transparent', fontSize: 20 }}>×</button>
              <h3 style={{ marginTop: 0 }}>{legalModal.title}</h3>
              <div style={{ color: '#334155' }}>{legalModal.body}</div>
              <div style={{ marginTop: 12, color: '#666' }}>
                {legalModal.quickRead && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>🃏 Quick Read</div>
                    <ul style={{ margin: 0, paddingLeft: 18, color: '#475569' }}>
                      {legalModal.quickRead.map((item, idx) => (
                        <li key={`${legalModal.title}-qr-${idx}`} style={{ marginBottom: 4 }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {legalModal.gov && (
                  <div style={{ marginTop: 8 }}>
                    🏛️ {legalModal.govLink ? (
                      <a href={legalModal.govLink} target="_blank" rel="noreferrer" style={{ color: COLORS.secondary, textDecoration: 'underline' }}>
                        {legalModal.gov}
                      </a>
                    ) : (
                      legalModal.gov
                    )}
                  </div>
                )}
              </div>
              <div style={{ marginTop: 12, textAlign: 'right' }}>
                <button className="btn btn-primary" style={{ background: COLORS.marigold, color: 'white', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer' }} onClick={() => setLegalModal(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Guru Modal */}
        {guruModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: 20, borderRadius: 10, maxWidth: 640, width: '95%', maxHeight: '80vh', overflowY: 'auto' }}>
              <button onClick={() => setGuruModal(null)} style={{ float: 'right', border: 'none', background: 'transparent', fontSize: 20 }}>×</button>
              <h3 style={{ marginTop: 0 }}>{guruModal.title}</h3>
              <div style={{ color: '#334155', marginBottom: 12 }}>{guruModal.body}</div>
              {guruModal.resources && (
                <div style={{ marginTop: 12, color: '#666' }}>
                  {guruModal.resources.map((r, i) => <div key={i} style={{ marginBottom: 6 }}>✓ {r}</div>)}
                </div>
              )}
              {guruModal.phone && <div style={{ marginTop: 12, color: '#334155' }}>📞 {guruModal.phone}</div>}
              {guruModal.availability && <div style={{ marginTop: 8, color: '#334155' }}>⏱️ {guruModal.availability}</div>}
              <div style={{ marginTop: 12, textAlign: 'right' }}>
                <button className="btn btn-primary" style={{ background: COLORS.teal, color: 'white', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer' }} onClick={() => setGuruModal(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Viya Modal - Enhanced with Roadmap & Details */}
        {viyaModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: 0, borderRadius: '16px', maxWidth: '600px', width: '95%', maxHeight: '85vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>

              {/* Success State */}
              {viyaModal.status === 'success' ? (
                <div style={{ padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                  <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎉</div>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '24px', color: COLORS.darkTeal }}>All the best!</h3>
                  <p style={{ margin: '0 0 24px 0', color: '#475569', fontSize: '16px' }}>
                    You've started <strong>{viyaModal.role}</strong>.<br />
                    This opportunity has been saved to your dashboard.
                  </p>
                  <button
                    className="btn"
                    style={{ background: COLORS.primary, color: 'white', border: 'none', borderRadius: '8px', padding: '12px 32px', cursor: 'pointer', fontWeight: '600', fontSize: '16px' }}
                    onClick={() => setViyaModal(null)}
                  >
                    Go to Dashboard
                  </button>
                </div>
              ) : (
                <>
                  {/* Modal Header */}
                  <div style={{ padding: '24px 24px 16px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '20px', color: COLORS.textPrimary }}>{viyaModal.title}</h3>
                      <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                        {viyaModal.earnings && <Badge style={{ background: '#dcfce7', color: '#166534' }}>💰 {viyaModal.earnings}</Badge>}
                        {viyaModal.difficulty && <Badge style={{ background: '#f1f5f9', color: '#475569' }}>📉 {viyaModal.difficulty}</Badge>}
                      </div>
                    </div>
                    <button onClick={() => setViyaModal(null)} style={{ border: 'none', background: 'transparent', fontSize: '24px', cursor: 'pointer', color: COLORS.textSecondary }}>×</button>
                  </div>

                  {/* Modal Body */}
                  <div style={{ padding: '24px', overflowY: 'auto' }}>

                    {/* Description */}
                    <div style={{ marginBottom: '24px', color: '#334155', lineHeight: '1.6' }}>
                      {viyaModal.body}
                    </div>

                    {/* Roadmap Section */}
                    {viyaModal.roadmap && (
                      <div style={{ marginBottom: '24px', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
                        <h4 style={{ margin: '0 0 16px 0', color: COLORS.darkTeal, fontSize: '16px' }}>🗺️ Your Roadmap to Success</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {viyaModal.roadmap.map((step, index) => (
                            <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                              <div style={{
                                minWidth: '24px', height: '24px', borderRadius: '50%', background: COLORS.primary, color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', marginTop: '2px'
                              }}>
                                {index + 1}
                              </div>
                              <div style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5' }}>{step}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills & Tools */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      {viyaModal.skills && (
                        <div>
                          <h5 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Required Skills</h5>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {viyaModal.skills.map(s => <Badge key={s} style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>{s}</Badge>)}
                          </div>
                        </div>
                      )}
                      {viyaModal.tools && (
                        <div>
                          <h5 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Tools Used</h5>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {viyaModal.tools.map(t => <Badge key={t} style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>{t}</Badge>)}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Modal Footer */}
                  <div style={{ padding: '16px 24px', borderTop: `1px solid ${COLORS.border}`, background: '#f8fafc', borderRadius: '0 0 16px 16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button className="btn" style={{ background: 'white', border: `1px solid ${COLORS.border}`, color: COLORS.textSecondary, borderRadius: '8px', padding: '10px 20px', cursor: 'pointer' }} onClick={() => setViyaModal(null)}>Close</button>
                    <button className="btn" style={{ background: COLORS.primary, color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontWeight: '600' }} onClick={() => setViyaModal({ ...viyaModal, status: 'success' })}>
                      🚀 Start Now
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Manas Modal - Enhanced with Breathing Animation */}
        {manasModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: 20, borderRadius: 10, maxWidth: 640, width: '95%', maxHeight: '80vh', overflowY: 'auto' }}>
              <button onClick={() => setManasModal(null)} style={{ float: 'right', border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer' }}>×</button>
              <h3 style={{ marginTop: 0 }}>{manasModal.title}</h3>

              {/* Breathing Exercise Interactive Animation */}
              {manasModal.type === 'breathing' ? (
                <BreathingGuide />
              ) : manasModal.type === 'counselor' ? (
                /* Show Counselor Profiles */
                <div>
                  <div style={{ color: COLORS.textSecondary, marginBottom: 20, fontSize: '14px' }}>
                    Connect with trained counselors anonymously. All conversations are completely confidential.
                  </div>

                  {/* Available Counselors */}
                  <div style={{ marginBottom: 20 }}>
                    <h4 style={{ color: COLORS.textPrimary, marginBottom: 16, fontSize: '16px', fontWeight: '600' }}>Available Counselors</h4>

                    {/* Counselor 1 */}
                    <div style={{
                      padding: '16px',
                      marginBottom: '12px',
                      background: `${COLORS.accent}08`,
                      borderRadius: '10px',
                      border: `1px solid ${COLORS.border}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = `${COLORS.accent}15`}
                      onMouseLeave={(e) => e.currentTarget.style.background = `${COLORS.accent}08`}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', color: COLORS.textPrimary, fontSize: '15px', marginBottom: '4px' }}>
                            Dr. Priya Sharma
                          </div>
                          <div style={{ fontSize: '13px', color: COLORS.textSecondary, marginBottom: '6px' }}>
                            Clinical Psychologist • 8 years experience
                          </div>
                          <div style={{ fontSize: '12px', color: COLORS.accent, fontWeight: '500' }}>
                            Specializes in: Anxiety, Depression, Work Stress
                          </div>
                        </div>
                        <div style={{
                          background: COLORS.success,
                          color: 'white',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          Available Now
                        </div>
                      </div>
                    </div>

                    {/* Counselor 2 */}
                    <div style={{
                      padding: '16px',
                      marginBottom: '12px',
                      background: `${COLORS.accent}08`,
                      borderRadius: '10px',
                      border: `1px solid ${COLORS.border}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = `${COLORS.accent}15`}
                      onMouseLeave={(e) => e.currentTarget.style.background = `${COLORS.accent}08`}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', color: COLORS.textPrimary, fontSize: '15px', marginBottom: '4px' }}>
                            Ms. Anjali Mehta
                          </div>
                          <div style={{ fontSize: '13px', color: COLORS.textSecondary, marginBottom: '6px' }}>
                            Licensed Counselor • 5 years experience
                          </div>
                          <div style={{ fontSize: '12px', color: COLORS.accent, fontWeight: '500' }}>
                            Specializes in: Relationships, Family Issues, Self-esteem
                          </div>
                        </div>
                        <div style={{
                          background: COLORS.success,
                          color: 'white',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          Available Now
                        </div>
                      </div>
                    </div>

                    {/* Counselor 3 */}
                    <div style={{
                      padding: '16px',
                      marginBottom: '12px',
                      background: `${COLORS.accent}08`,
                      borderRadius: '10px',
                      border: `1px solid ${COLORS.border}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = `${COLORS.accent}15`}
                      onMouseLeave={(e) => e.currentTarget.style.background = `${COLORS.accent}08`}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', color: COLORS.textPrimary, fontSize: '15px', marginBottom: '4px' }}>
                            Dr. Kavita Singh
                          </div>
                          <div style={{ fontSize: '13px', color: COLORS.textSecondary, marginBottom: '6px' }}>
                            Clinical Psychologist • 12 years experience
                          </div>
                          <div style={{ fontSize: '12px', color: COLORS.accent, fontWeight: '500' }}>
                            Specializes in: Trauma, PTSD, Women's Mental Health
                          </div>
                        </div>
                        <div style={{
                          background: COLORS.warning,
                          color: 'white',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          Busy
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Helplines Section */}
                  <div style={{
                    padding: '14px',
                    background: `${COLORS.primary}10`,
                    borderRadius: '10px',
                    marginBottom: '16px',
                    borderLeft: `4px solid ${COLORS.primary}`
                  }}>
                    <div style={{ fontWeight: '600', color: COLORS.textPrimary, fontSize: '14px', marginBottom: '10px' }}>
                      📞 24/7 Helplines
                    </div>
                    {manasModal.helplines && manasModal.helplines.map((h, i) => (
                      <div key={i} style={{
                        fontSize: '13px',
                        color: COLORS.textSecondary,
                        marginBottom: '4px',
                        paddingLeft: '4px'
                      }}>
                        • {h}
                      </div>
                    ))}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-primary"
                      style={{
                        background: COLORS.accent,
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}
                      onClick={() => setManasModal(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ color: '#334155', marginBottom: 12 }}>{manasModal.body}</div>
                  {manasModal.helplines && (
                    <div style={{ marginTop: 12, color: '#334155' }}>
                      {manasModal.helplines.map((h, i) => <div key={i} style={{ marginBottom: 6 }}>📞 {h}</div>)}
                    </div>
                  )}
                  <div style={{ marginTop: 12, textAlign: 'right' }}>
                    <button className="btn btn-primary" style={{ background: COLORS.mint, color: '#166534', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer' }} onClick={() => setManasModal(null)}>Close</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
