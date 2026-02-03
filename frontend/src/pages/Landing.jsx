import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, BookOpen, Briefcase, ArrowRight } from '../components/Icon'

export default function Landing() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-header-inner">
          <Link to="/" className="landing-brand">
            <img src="/viyastree-logo.png" alt="ViyaStree" />
            <span>ViyaStree</span>
          </Link>
          <nav className="landing-nav">
            <a href="#pillars">Pillars</a>
            <a href="#impact">Impact</a>
            <a href="#how">How It Works</a>
            <Link to="/docs">Docs</Link>
          </nav>
          <div className="landing-actions">
            <Link to="/login" className="landing-link">Sign In</Link>
            <Link to="/signup" className="landing-cta">Create Account</Link>
            <Link to="/dashboard" className="landing-ghost">Open Dashboard</Link>
          </div>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-grid">
          <div className="landing-hero-copy">
            <div className="landing-badge">Government-aligned empowerment platform</div>
            <h1>ViyaStree</h1>
            <div className="landing-hero-subtitle">
              <span style={{ color: 'var(--color-secondary)' }}>शक्तिः</span>
              <span>•</span>
              <span style={{ color: 'var(--color-warning)', fontStyle: 'italic' }}>शिक्षा</span>
              <span>•</span>
              <span style={{ color: '#7c3aed' }}>समृद्धिः</span>
            </div>
            <p className="landing-hero-description">
              A professional, human-centered platform that connects legal safety, skill-building, and livelihood opportunities
              into one trusted journey for women.
            </p>
            <div className="landing-hero-actions">
              <Link to="/signup" className="landing-primary">
                Start Your Journey <ArrowRight size={20} color="white" />
              </Link>
              <Link to="/dashboard" className="landing-secondary">Explore Dashboard</Link>
            </div>
            <div className="landing-hero-metrics">
              <div className="landing-metric">
                <span>Safety First</span>
                <small>RakshaSOS + verified resources</small>
              </div>
              <div className="landing-metric">
                <span>Skills Path</span>
                <small>Practical, accessible learning modules</small>
              </div>
              <div className="landing-metric">
                <span>Livelihood</span>
                <small>Jobs, schemes, and mentorship</small>
              </div>
            </div>
          </div>

          <div className="landing-hero-visual">
            <img src="/hero-women.png" alt="Empowered women illustration" />
          </div>
        </div>
      </section>

      <section className="landing-trust">
        <div className="landing-trust-inner">
          <span className="landing-trust-label">Aligned with</span>
          <div className="landing-trust-logos">
            <span>Digital India</span>
            <span>Skill India</span>
            <span>WCD India</span>
            <span>Mission Shakti</span>
          </div>
        </div>
      </section>

      <section id="pillars" className="landing-pillars">
        <div className="landing-section-head">
          <p className="landing-eyebrow">Three Pillars</p>
          <h2>Built for real-world outcomes</h2>
          <p>Each pillar is designed to be practical, safe, and grounded in community needs.</p>
        </div>

        <div className="landing-pillars-grid">
          <article className="pillar-card">
            <div className="pillar-icon safety">
              <Shield size={28} color="white" />
            </div>
            <h3>Shaktih</h3>
            <p>Safety guidance, SOS response, and legal awareness designed for everyday protection.</p>
            <Link to="/dashboard/shaktih" className="pillar-link">Explore Safety</Link>
          </article>

          <article className="pillar-card">
            <div className="pillar-icon learning">
              <BookOpen size={28} color="white" />
            </div>
            <h3>Shiksha</h3>
            <p>Skill modules that are easy to follow, community-tested, and job-ready.</p>
            <Link to="/dashboard/shiksha" className="pillar-link">Explore Learning</Link>
          </article>

          <article className="pillar-card">
            <div className="pillar-icon livelihood">
              <Briefcase size={28} color="white" />
            </div>
            <h3>Samruddhih</h3>
            <p>Livelihood pathways, verified schemes, and mentorship for financial independence.</p>
            <Link to="/dashboard/samruddhih" className="pillar-link">Explore Livelihood</Link>
          </article>
        </div>
      </section>

      <section id="impact" className="landing-impact">
        <div className="landing-impact-grid">
          <div>
            <p className="landing-eyebrow">Impact Focus</p>
            <h2>Designed for confidence, clarity, and trust</h2>
            <p>
              ViyaStree prioritizes clear guidance, verified resources, and a calm interface so women can move
              from learning to earning with confidence.
            </p>
          </div>
          <div className="landing-impact-cards">
            <div className="impact-card">
              <h4>24/7 Safety Support</h4>
              <p>Immediate access to SOS, helplines, and trusted local resources.</p>
            </div>
            <div className="impact-card">
              <h4>Structured Skill Paths</h4>
              <p>Short, practical modules that build toward real-world opportunities.</p>
            </div>
            <div className="impact-card">
              <h4>Livelihood Enablement</h4>
              <p>Verified opportunities, schemes, and mentorship mapped to your progress.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="landing-steps">
        <div className="landing-section-head">
          <p className="landing-eyebrow">How It Works</p>
          <h2>Your empowerment journey in three steps</h2>
        </div>
        <div className="landing-steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Assess</h3>
            <p>Answer quick check-ins to understand your safety, skill, and livelihood needs.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Learn</h3>
            <p>Complete guided modules and build verified skills with support.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Earn</h3>
            <p>Unlock matching opportunities, schemes, and mentorship tailored to you.</p>
          </div>
        </div>
      </section>

      <section className="landing-cta-panel">
        <div className="landing-cta-inner">
          <h2>Start with safety. Grow with skills. Thrive with support.</h2>
          <p>Join ViyaStree and move forward with a clear, supported path.</p>
          <Link to="/signup" className="landing-primary">Get Started Today</Link>
        </div>
      </section>

      <section id="creator" className="landing-creator">
        <div className="landing-section-head">
          <p className="landing-eyebrow">Meet the Creator</p>
          <h2>Built with passion and purpose</h2>
        </div>
        <div className="landing-creator-card">
          <div className="landing-creator-photo">
            <img src="/palak_profile.jpg" alt="Palak Soni" />
          </div>
          <div className="landing-creator-body">
            <h3>Palak Soni</h3>
            <p className="landing-creator-title">Future Data Scientist • B.Tech @ RGIPT</p>
            <p>
              Palak is an aspiring Data Scientist and <strong>Oracle Certified Data Science Professional</strong> pursuing her B.Tech at
              <strong> RGIPT</strong>. With expertise in <strong>Machine Learning, Generative AI, and MLOps</strong>, she bridges the gap
              between complex technology and real-world impact.
            </p>
            <p>
              An active leader in <strong>Women Techmakers</strong> and <strong>IEEE</strong>, Palak built <strong>ViyaStree</strong> to
              empower women through accessible technology, leveraging her experience from R&amp;D internships and hackathons.
            </p>
            <div className="landing-creator-tags">
              {['Machine Learning', 'Generative AI', 'Cloud Applications', 'Python', 'Social Impact'].map(skill => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
            <a
              href="https://www.linkedin.com/in/palaksoni-292280288"
              target="_blank"
              rel="noopener noreferrer"
              className="landing-creator-link"
            >
              Connect on LinkedIn →
            </a>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <img src="/viyastree-logo.png" alt="ViyaStree" />
            <div>
              <strong>ViyaStree</strong>
              <p>Power, Education, Prosperity — a trusted platform for women’s empowerment.</p>
            </div>
          </div>
          <div className="landing-footer-col">
            <h4>Platform</h4>
            <Link to="/dashboard/shaktih">Shaktih</Link>
            <Link to="/dashboard/shiksha">Shiksha</Link>
            <Link to="/dashboard/samruddhih">Samruddhih</Link>
            <Link to="/docs">Docs</Link>
          </div>
          <div className="landing-footer-col">
            <h4>Access</h4>
            <Link to="/login">Sign In</Link>
            <Link to="/signup">Create Account</Link>
            <Link to="/dashboard">Open Dashboard</Link>
          </div>
        </div>
        <div className="landing-footer-bottom">
          <span>© 2026 ViyaStree. All rights reserved.</span>
          <span>Built for community impact.</span>
        </div>
      </footer>
    </div>
  )
}
