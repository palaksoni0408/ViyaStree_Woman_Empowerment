import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/base/PageHeader'
import InfoCard from '../components/base/InfoCard'
import Badge from '../components/base/Badge'

/**
 * Shaktih (Safety & Legal) - Final Pillar of ViyaStree
 * 
 * Comprehensive safety ecosystem with:
 * 1. RakshaSOS - Emergency Response (persistent, dominant)
 * 2. Sthaniya Sahay - Nearby Help (map-based local services)
 * 3. Safety Guidance - AI-driven proactive protection
 * 4. Safety Shield Test - Interactive quiz with badge
 * 5. Chatbot - AI-powered legal awareness
 */
export default function Shaktih() {
  const { user } = useAuth()
  const [chatLanguage, setChatLanguage] = useState('hindi')
  const [query, setQuery] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'नमस्ते! मैं ViyaStree सहायक हूँ। आपके कानूनी अधिकारों, कार्यस्थल सुरक्षा, या डिजिटल सुरक्षा के बारे में कोई भी प्रश्न पूछें।' }
  ])
  const [loading, setLoading] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [badgeEarned, setBadgeEarned] = useState(false)

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

  // Emergency number handler with voice
  function dialEmergency(number, name) {
    playVoiceHindi(`${name} को कॉल कर रहे हैं।`)
    window.location.href = `tel:${number}`
  }

  // Chatbot response logic
  async function handleChatSubmit() {
    if (!query.trim()) return

    // Add user message
    const userMessage = { type: 'user', text: query }
    setChatMessages([...chatMessages, userMessage])
    setLoading(true)

    // Simulate bot response (in production, connect to backend)
    const botResponse = generateBotResponse(query.toLowerCase())

    setTimeout(() => {
      setChatMessages(prev => [...prev, { type: 'bot', text: botResponse }])
      setLoading(false)
    }, 800)

    setQuery('')
  }

  // Generate bot responses based on keywords
  function generateBotResponse(query) {
    if (query.includes('अधिकार') || query.includes('rights') || query.includes('कानून')) {
      if (chatLanguage === 'hindi') {
        return 'भारत में महिलाओं के प्रमुख अधिकार:\n\n1️⃣ समान वेतन: एक ही काम के लिए पुरुषों के समान वेतन पाने का अधिकार\n2️⃣ कार्यस्थल सुरक्षा: यौन उत्पीड़न से संरक्षण (POSH Act 2013)\n3️⃣ मातृत्व लाभ: 26 सप्ताह का सशुल्क अवकाश\n4️⃣ संपत्ति अधिकार: अपनी संपत्ति खरीदने और बेचने का अधिकार\n5️⃣ शिक्षा अधिकार: बिना भेदभाव के शिक्षा प्राप्त करना\n\n"यदि आपके अधिकारों का उल्लंघन हो रहा है, तो अपने जिले के DLSA (जिला कानूनी सेवा प्राधिकरण) से संपर्क करें।"'
      } else {
        return 'Key Rights for Women in India:\n\n1️⃣ Equal Pay: Right to receive equal pay for equal work\n2️⃣ Workplace Safety: Protection from sexual harassment (POSH Act 2013)\n3️⃣ Maternity Benefit: 26 weeks paid leave\n4️⃣ Property Rights: Right to buy and sell property\n5️⃣ Education Rights: Right to education without discrimination\n\n"If your rights are being violated, contact your district DLSA (District Legal Services Authority)."'
      }
    }
    if (query.includes('उत्पीड़न') || query.includes('harassment') || query.includes('यौन') || query.includes('sexual')) {
      if (chatLanguage === 'hindi') {
        return '🛡️ यौन उत्पीड़न से सुरक्षा:\n\n✅ कार्यस्थल पर यौन उत्पीड़न अवैध है (POSH Act)\n✅ आपके पास शिकायत दर्ज करने का अधिकार है\n✅ आंतरिक शिकायत समिति (ICC) में रिपोर्ट करें\n✅ पीड़ित को गोपनीयता का अधिकार है\n\n🚨 तुरंत मदद के लिए:\n• Women\'s Helpline: 181\n• National Commission for Women: 7827-170-170\n• Mission Shakhi (One Stop Centre): अपने जिले का नंबर खोजें'
      } else {
        return '🛡️ Protection from Sexual Harassment:\n\n✅ Sexual harassment at workplace is illegal (POSH Act)\n✅ You have the right to file a complaint\n✅ Report to Internal Complaints Committee (ICC)\n✅ Victims have right to confidentiality\n\n🚨 For immediate help:\n• Women\'s Helpline: 181\n• National Commission for Women: 7827-170-170\n• Mission Shakhi (One Stop Centre): Find your district number'
      }
    }
    if (query.includes('डिजिटल') || query.includes('digital') || query.includes('साइबर') || query.includes('cyber')) {
      if (chatLanguage === 'hindi') {
        return '🔐 डिजिटल सुरक्षा टिप्स:\n\n1. कभी भी अपना OTP किसी को न दें\n2. अजनबियों से मिली लिंक पर क्लिक न करें\n3. सार्वजनिक WiFi पर बैंकिंग न करें\n4. मजबूत पासवर्ड रखें (अक्षर + संख्या + प्रतीक)\n5. गोपनीयता सेटिंग्स को नियमित रूप से जांचें\n6. अपने SIM को रजिस्ट्रेशन से जोड़ी रखें\n7. अनजान व्यक्तियों को आर्थिक जानकारी न दें\n\n⚠️ साइबर क्राइम रिपोर्ट: 1930'
      } else {
        return '🔐 Digital Safety Tips:\n\n1. Never share your OTP with anyone\n2. Don\'t click links from strangers\n3. Don\'t do banking on public WiFi\n4. Use strong passwords (letters + numbers + symbols)\n5. Check privacy settings regularly\n6. Keep your SIM registered\n7. Don\'t share financial info with unknown people\n\n⚠️ Report Cyber Crime: 1930'
      }
    }
    if (query.includes('लोन') || query.includes('loan') || query.includes('ऋण')) {
      if (chatLanguage === 'hindi') {
        return '💰 महिलाओं के लिए ऋण योजनाएं:\n\n🏦 Pradhan Mantri Mudra Yojana: ₹10 लाख तक, कोई जमानत नहीं\n🏦 Stand Up India: ₹10L - ₹1Cr, SC/ST और महिलाओं के लिए\n🏦 Sukanya Samriddhi Yojana: बालिकाओं के लिए बचत योजना\n🏦 NRLM (National Rural Livelihood Mission): ग्रामीण महिलाओं के लिए समर्थन\n\n✅ आवश्यक दस्तावेज:\n• आधार कार्ड\n• पैन कार्ड\n• बैंक विवरण\n• व्यवसाय योजना\n\nNearby bank या CSC (Common Service Centre) से मदद लें।'
      } else {
        return '💰 Loan Schemes for Women:\n\n🏦 Pradhan Mantri Mudra Yojana: Up to ₹10 lakhs, no collateral\n🏦 Stand Up India: ₹10L - ₹1Cr, for SC/ST and women\n🏦 Sukanya Samriddhi Yojana: Savings scheme for girl child\n🏦 NRLM (National Rural Livelihood Mission): Support for rural women\n\n✅ Required Documents:\n• Aadhar Card\n• PAN Card\n• Bank Details\n• Business Plan\n\nContact nearby bank or CSC (Common Service Centre) for help.'
      }
    }
    if (query.includes('काम') || query.includes('work') || query.includes('नौकरी') || query.includes('job')) {
      if (chatLanguage === 'hindi') {
        return '💼 कार्यस्थल अधिकार:\n\n✅ न्यूनतम वेतन पाने का अधिकार\n✅ समय पर भुगतान (देरी पर ब्याज)\n✅ सुरक्षित कार्य वातावरण\n✅ अनुचित हटाए जाने से सुरक्षा\n✅ मातृत्व और पितृत्व छुट्टी\n✅ बेरोजगारी बीमा\n✅ चिकित्सा सुविधाएं\n\n🚨 यदि आपके साथ गलत व्यवहार हो रहा है:\n1. लिखित शिकायत दर्ज करें\n2. सहकर्मियों से साक्ष्य एकत्र करें\n3. DLSA या Labor Commissioner से संपर्क करें\n4. महिला हेल्पलाइन 181 कॉल करें'
      } else {
        return '💼 Workplace Rights:\n\n✅ Right to minimum wages\n✅ On-time payment (with interest for delay)\n✅ Safe work environment\n✅ Protection from unfair dismissal\n✅ Maternity and paternity leave\n✅ Unemployment insurance\n✅ Medical facilities\n\n🚨 If you are being treated unfairly:\n1. File a written complaint\n2. Collect evidence from colleagues\n3. Contact DLSA or Labor Commissioner\n4. Call Women\'s Helpline 181'
      }
    }
    if (chatLanguage === 'hindi') {
      return 'मुझे समझ में नहीं आया। कृपया अपने प्रश्न को फिर से पूछें या निम्नलिखित विषयों में से एक चुनें:\n\n• अधिकार (Rights)\n• यौन उत्पीड़न (Sexual Harassment)\n• डिजिटल सुरक्षा (Digital Safety)\n• ऋण योजनाएं (Loan Schemes)\n• कार्यस्थल (Workplace)\n\n🎧 कम साक्षरता वाली महिलाओं के लिए: हमारे हिंदी ऑडियो बटन को दबाएं!'
    } else {
      return 'I didn\'t understand that. Please ask your question again or choose one of the topics below:\n\n• Rights\n• Sexual Harassment\n• Digital Safety\n• Loan Schemes\n• Workplace\n\n🎧 For low-literacy users: Press our audio button for Hindi voice support!'
    }
  }

  // Quiz handler
  function handleQuizAnswer(questionIdx, isCorrect) {
    if (isCorrect) {
      setQuizScore(prev => prev + 1)
      if (quizScore + 1 === 3) {
        setBadgeEarned(true)
        playVoiceHindi('बधाई है! आपने डिजिटल प्रोटेक्टर बैज जीता।')
      }
    }
    setQuizAnswered(true)
  }

  const quizQuestions = [
    {
      q: "यदि कोई अजनबी 'साक्षात्कार पत्र भेजने' के लिए आपका पता मांगे, तो क्या आप तुरंत दे देंगे?",
      options: ['हाँ', 'नहीं'],
      correct: 1,
      explanation: "सही उत्तर: नहीं। यह एक सामान्य फिशिंग तकनीक है। किसी भी अजनबी को आपकी व्यक्तिगत जानकारी न दें।"
    },
    {
      q: "कौन सी सरकारी योजना एक जगह पर 24 घंटे चिकित्सा और कानूनी सहायता प्रदान करती है?",
      options: ['Mission Shakti / Sakhi One Stop Centre', 'Digital India'],
      correct: 0,
      explanation: "सही उत्तर: Mission Shakti (Sakhi One Stop Centre)। यह हिंसा से प्रभावित महिलाओं को समर्थन देता है।"
    },
    {
      q: "क्या नियोक्ता आपसे सोशल मीडिया पासवर्ड मांग सकता है?",
      options: ['हाँ, यह कानूनी है', 'नहीं, यह अवैध है'],
      correct: 1,
      explanation: "सही उत्तर: नहीं। यह आपकी गोपनीयता का उल्लंघन है और भारत में अवैध है।"
    }
  ]

  return (
    <main id="main" className="dashboard shaktih-page">
      <div className="dashboard-shell shaktih-shell">
        {/* Hero Header */}
        <div className="shaktih-hero">
          <div className="shaktih-hero-logo">
            <img src="/shaktih-logo.png" alt="Shaktih Logo" />
          </div>
          <div className="shaktih-hero-content">
            <h1>Shaktih — Safety & Rights</h1>
            <p>Your protective digital infrastructure for awareness and empowerment</p>
          </div>
        </div>

        <div className="shaktih-content">

        {/* 🚨 RAKSHA SOS - EMERGENCY RESPONSE (PERSISTENT, DOMINANT) */}
        <div style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
          borderRadius: '15px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 10px 30px rgba(220, 38, 38, 0.3)',
          position: 'relative',
          border: '3px solid #991b1b',
          animation: 'pulse 2s infinite'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h2 style={{ margin: 0, color: 'white', fontSize: '28px' }}>🚨 RakshaSOS - Emergency Response</h2>
            <button
              onClick={() => playVoiceHindi('आपातकालीन प्रतिक्रिया सक्रिय है। अपने विश्वसनीय संपर्कों को सूचित किया जा रहा है।')}
              style={{
                background: 'white',
                color: '#dc2626',
                border: 'none',
                borderRadius: '50%',
                width: '45px',
                height: '45px',
                fontSize: '22px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              🔊
            </button>
          </div>

          <p style={{ color: 'white', margin: '0 0 20px 0', fontSize: '14px' }}>
            ⚡ One Tap SOS: GPS coordinates sent to trusted contacts + Direct Emergency Dial
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px'
          }}>
            <button
              onClick={() => dialEmergency('112', 'All-in-One Emergency')}
              style={{
                padding: '16px',
                background: 'white',
                color: '#dc2626',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              📞 112<br /><span style={{ fontSize: '12px', fontWeight: 400 }}>All Emergency</span>
            </button>

            <button
              onClick={() => dialEmergency('181', "Women's Helpline")}
              style={{
                padding: '16px',
                background: 'white',
                color: '#dc2626',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              👩‍⚖️ 181<br /><span style={{ fontSize: '12px', fontWeight: 400 }}>Women's Safety</span>
            </button>

            <button
              onClick={() => dialEmergency('1091', "Women's Safety Helpline")}
              style={{
                padding: '16px',
                background: 'white',
                color: '#dc2626',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              🚔 1091<br /><span style={{ fontSize: '12px', fontWeight: 400 }}>Police (Women)</span>
            </button>

            <button
              onClick={() => dialEmergency('1098', 'Child Helpline')}
              style={{
                padding: '16px',
                background: 'white',
                color: '#dc2626',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              👶 1098<br /><span style={{ fontSize: '12px', fontWeight: 400 }}>Child Helpline</span>
            </button>

            <button
              onClick={() => dialEmergency('1930', 'Cyber Crime Helpline')}
              style={{
                padding: '16px',
                background: 'white',
                color: '#dc2626',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              💻 1930<br /><span style={{ fontSize: '12px', fontWeight: 400 }}>Cyber Crime</span>
            </button>
          </div>

          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '12px',
            fontStyle: 'italic'
          }}>
            ℹ️ All services are 24/7, confidential, and free. No caller ID required.
          </div>
        </div>

        {/* 📍 STHANIYA SAHAY - NEARBY HELP */}
        <InfoCard title="📍 Sthaniya Sahay - Nearby Help" style={{ marginBottom: '24px' }}>
          <p style={{ color: '#64748b', marginBottom: '16px' }}>
            Find local support services near you - Police, Hospitals, Legal Aid, and NGO Support Centers
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            <div style={{
              padding: '16px',
              background: '#f0fdf4',
              borderRadius: '8px',
              border: '2px solid #86efac'
            }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#166534' }}>🚔 Police Stations</h5>
              <p style={{ fontSize: '12px', color: '#15803d', margin: 0 }}>Women Help Desks & Beat Offices</p>
            </div>
            <div style={{
              padding: '16px',
              background: '#dbeafe',
              borderRadius: '8px',
              border: '2px solid #93c5fd'
            }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#0c4a6e' }}>🏥 Health Centers</h5>
              <p style={{ fontSize: '12px', color: '#0284c7', margin: 0 }}>Emergency Trauma & Counseling</p>
            </div>
            <div style={{
              padding: '16px',
              background: '#fce7f3',
              borderRadius: '8px',
              border: '2px solid #f472b6'
            }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#831843' }}>⚖️ Legal Aid</h5>
              <p style={{ fontSize: '12px', color: '#be185d', margin: 0 }}>DLSA & Sakhi One Stop Centres</p>
            </div>
            <div style={{
              padding: '16px',
              background: '#fef3c7',
              borderRadius: '8px',
              border: '2px solid #fcd34d'
            }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#92400e' }}>🤝 NGO Support</h5>
              <p style={{ fontSize: '12px', color: '#b45309', margin: 0 }}>Shelter Homes & Crisis Intervention</p>
            </div>
          </div>

          <button
            onClick={() => window.open('https://www.google.com/maps/search/police+station+women+helpline+near+me', '_blank')}
            style={{
              width: '100%',
              marginTop: '16px',
              padding: '12px',
              background: '#14b8a6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            🗺️ View Help Near Me (Google Maps)
          </button>
        </InfoCard>

        {/* 🛡️ SAFETY GUIDANCE */}
        <InfoCard title="🛡️ Safety Guidance - Contextual Alerts" style={{ marginBottom: '24px' }}>
          {/* Shield Animation - Kavach */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto',
              animation: 'glow 2.5s ease-in-out infinite'
            }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                <defs>
                  <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#14b8a6', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#0d9488', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path d="M50 10 L70 25 L70 50 Q50 75 50 75 Q30 75 30 50 L30 25 Z" fill="url(#shieldGrad)" stroke="#14b8a6" strokeWidth="2" />
                <circle cx="50" cy="45" r="8" fill="white" />
                <path d="M50 38 L50 52 M44 45 L56 45" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              padding: '16px',
              background: '#f0f9ff',
              borderRadius: '8px',
              border: 'left 4px solid #0ea5e9'
            }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#0c4a6e' }}>💼 Saved a Job?</h5>
              <p style={{ fontSize: '13px', color: '#0369a1', margin: 0 }}>
                Verify this employer! Here's your safety checklist for independent workers. Check company registration, ask for written offers, never advance payments.
              </p>
            </div>

            <div style={{
              padding: '16px',
              background: '#fef9e7',
              borderRadius: '8px',
              border: 'left 4px solid #f59e0b'
            }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#92400e' }}>🌙 Working Late?</h5>
              <p style={{ fontSize: '13px', color: '#b45309', margin: 0 }}>
                Share your live location with ViyaStree Guardian. Let a trusted contact know when you're heading home.
              </p>
            </div>

            <div style={{
              padding: '16px',
              background: '#f5f3ff',
              borderRadius: '8px',
              border: 'left 4px solid #a855f7'
            }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#6b21a8' }}>💬 Digital Interaction?</h5>
              <p style={{ fontSize: '13px', color: '#7e22ce', margin: 0 }}>
                Beware of phishing! Never share your banking OTP, Aadhaar, or PAN with anyone.
              </p>
            </div>
          </div>
        </InfoCard>

        {/* 🧪 SAFETY SHIELD TEST */}
        <InfoCard title="🧪 Safety Shield Test - Earn Your Badge!" style={{ marginBottom: '24px' }}>
          <p style={{ color: '#64748b', marginBottom: '16px' }}>
            Answer 3 questions correctly to earn your <Badge variant="teal">Digital Protector Badge</Badge>
          </p>

          {quizQuestions.map((q, idx) => (
            <div key={idx} style={{
              padding: '16px',
              background: '#f8fafc',
              borderRadius: '8px',
              marginBottom: '16px',
              border: '1px solid #cbd5e1'
            }}>
              <h5 style={{ margin: '0 0 12px 0', color: '#1f2937' }}>Q{idx + 1}: {q.q}</h5>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {q.options.map((opt, optIdx) => (
                  <button
                    key={optIdx}
                    onClick={() => handleQuizAnswer(idx, optIdx === q.correct)}
                    style={{
                      padding: '10px 16px',
                      background: optIdx === q.correct ? '#22c55e' : '#f1f5f9',
                      color: optIdx === q.correct ? 'white' : '#1f2937',
                      border: `2px solid ${optIdx === q.correct ? '#16a34a' : '#cbd5e1'}`,
                      borderRadius: '6px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {quizAnswered && (
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', fontStyle: 'italic' }}>
                  ℹ️ {q.explanation}
                </p>
              )}
            </div>
          ))}

          {badgeEarned && (
            <div style={{
              padding: '16px',
              background: '#fef3c7',
              borderRadius: '8px',
              border: '2px solid #fcd34d',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0', color: '#92400e', fontSize: '20px' }}>
                🏆 Digital Protector Badge Earned!
              </h3>
              <p style={{ color: '#b45309', margin: '8px 0 0 0' }}>
                You're now certified to recognize safety threats and protect yourself online!
              </p>
            </div>
          )}
        </InfoCard>

        {/* 💬 AI-POWERED CHATBOT */}
        <InfoCard title="💬 Ask ViyaStree Assistant - AI Legal Chat" style={{ marginBottom: '24px' }}>
          {/* Language Toggle */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '16px',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Language:</span>
            <button
              onClick={() => {
                setChatLanguage('hindi')
                setChatMessages([{ type: 'bot', text: 'नमस्ते! मैं ViyaStree सहायक हूँ। आपके कानूनी अधिकारों, कार्यस्थल सुरक्षा, या डिजिटल सुरक्षा के बारे में कोई भी प्रश्न पूछें।' }])
              }}
              style={{
                padding: '8px 16px',
                background: chatLanguage === 'hindi' ? '#14b8a6' : '#e2e8f0',
                color: chatLanguage === 'hindi' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              हिंदी (Hindi)
            </button>
            <button
              onClick={() => {
                setChatLanguage('english')
                setChatMessages([{ type: 'bot', text: 'Hello! I am ViyaStree Assistant. Ask me about your legal rights, workplace safety, or digital security.' }])
              }}
              style={{
                padding: '8px 16px',
                background: chatLanguage === 'english' ? '#14b8a6' : '#e2e8f0',
                color: chatLanguage === 'english' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              English
            </button>
          </div>
          <div style={{
            background: '#f8fafc',
            borderRadius: '8px',
            padding: '16px',
            minHeight: '300px',
            maxHeight: '400px',
            overflowY: 'auto',
            marginBottom: '16px',
            border: '1px solid #cbd5e1'
          }}>
            {chatMessages.map((msg, idx) => (
              <div key={idx} style={{
                marginBottom: '12px',
                display: 'flex',
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '12px',
                  borderRadius: '8px',
                  background: msg.type === 'user' ? '#14b8a6' : '#e2e8f0',
                  color: msg.type === 'user' ? 'white' : '#1f2937',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>
                🤖 Typing...
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
              placeholder={chatLanguage === 'hindi' ? "अधिकार, सुरक्षा, कार्यस्थल, ऋण के बारे में पूछें..." : "Ask about rights, safety, workplace, loans..."}
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <button
              onClick={handleChatSubmit}
              disabled={loading}
              style={{
                padding: '12px 20px',
                background: '#14b8a6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {chatLanguage === 'hindi' ? (loading ? 'भेज रहे हैं...' : 'भेजें') : (loading ? 'Sending...' : 'Send')}
            </button>
          </div>

          <div style={{ marginTop: '12px', padding: '12px', background: '#f0fdf4', borderRadius: '6px', fontSize: '12px', color: '#166534' }}>
            {chatLanguage === 'hindi' ? (
              <>💡 <strong>आप इन विषयों के बारे में पूछ सकते हैं:</strong> अधिकार, यौन उत्पीड़न, डिजिटल सुरक्षा, ऋण योजनाएं, कार्यस्थल, संपत्ति</>
            ) : (
              <>💡 <strong>Topics you can ask about:</strong> Rights, Sexual Harassment, Digital Safety, Loan Schemes, Workplace, Property</>
            )}
          </div>
        </InfoCard>

        {/* RESOURCES SECTION */}
        <InfoCard title="📚 Government Resources & External Links">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            <a
              href="https://www.cybersafeindia.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '16px',
                background: '#dbeafe',
                borderRadius: '8px',
                border: '2px solid #93c5fd',
                textDecoration: 'none',
                color: '#0c4a6e',
                fontWeight: 600,
                textAlign: 'center'
              }}
            >
              🔐 CyberSafe India
            </a>
            <a
              href="https://ncw.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '16px',
                background: '#fce7f3',
                borderRadius: '8px',
                border: '2px solid #f472b6',
                textDecoration: 'none',
                color: '#831843',
                fontWeight: 600,
                textAlign: 'center'
              }}
            >
              ⚖️ National Commission for Women
            </a>
            <a
              href="https://www.ncrb.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '16px',
                background: '#f0fdf4',
                borderRadius: '8px',
                border: '2px solid #86efac',
                textDecoration: 'none',
                color: '#166534',
                fontWeight: 600,
                textAlign: 'center'
              }}
            >
              📋 Report Crime (NCRB)
            </a>
            <a
              href="https://missionshakti.in/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '16px',
                background: '#fef3c7',
                borderRadius: '8px',
                border: '2px solid #fcd34d',
                textDecoration: 'none',
                color: '#92400e',
                fontWeight: 600,
                textAlign: 'center'
              }}
            >
              🏛️ Mission Shakti (Sakhi)
            </a>
          </div>
        </InfoCard>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
          50% { box-shadow: 0 0 0 15px rgba(220, 38, 38, 0); }
        }
        @keyframes glow {
          0%, 100% { 
            filter: brightness(1) drop-shadow(0 0 8px rgba(20, 184, 166, 0.6)); 
            transform: scale(1);
          }
          50% { 
            filter: brightness(1.2) drop-shadow(0 0 20px rgba(20, 184, 166, 0.9)); 
            transform: scale(1.05);
          }
        }
      `}</style>
    </main>
  )
}
