import { Shield, BookOpen, Briefcase, ArrowRight } from 'lucide-react';
import heroImage from 'figma:asset/67d9bfa235f8533edf0cb52851c65ec10bb47adc.png';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#2c3e50] text-white px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo - Government of India Emblem */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-8 h-8">
                <circle cx="12" cy="12" r="10" fill="#1e40af" />
                <circle cx="12" cy="8" r="2" fill="#fbbf24" />
                <path d="M12 10 L8 16 L16 16 Z" fill="#fbbf24" />
              </svg>
            </div>
          </div>

          {/* Title and Navigation */}
          <div className="flex items-center gap-8">
            <span className="text-sm">
              <span className="font-semibold">ViyaStree</span> – Government Women Empowerment Initiative
            </span>
            <nav className="flex gap-6">
              <a href="#about" className="text-sm hover:text-gray-200 transition-colors">About</a>
              <a href="#programs" className="text-sm hover:text-gray-200 transition-colors">Programs</a>
              <a href="#success" className="text-sm hover:text-gray-200 transition-colors">Success Stories</a>
              <a href="#contact" className="text-sm hover:text-gray-200 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white pt-12 pb-20 px-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-2 h-2 bg-gray-200 rounded-full"></div>
        <div className="absolute top-32 right-32 w-2 h-2 bg-gray-200 rounded-full"></div>
        <div className="absolute top-44 right-24 w-2 h-2 bg-gray-200 rounded-full"></div>
        <div className="absolute bottom-40 left-20 opacity-10">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <path d="M50 10 L20 90 L80 90 Z" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <div className="absolute top-40 left-32 opacity-10">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <path d="M10 40 L70 40 M40 10 L40 70" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center py-8">
            <div className="inline-flex items-center gap-2 bg-[#fef3c7] px-4 py-2 rounded-full mb-6">
              <span className="text-yellow-600 text-2xl">✨</span>
              <span className="text-sm text-gray-800">Empowering Women Everywhere</span>
            </div>

            <h1 className="text-7xl font-bold text-[#2c3e50] mb-4 leading-tight" style={{ fontFamily: 'serif' }}>
              वियाञ्री
            </h1>

            <div className="text-3xl mb-3 flex items-baseline gap-3 flex-wrap">
              <span className="text-[#0f766e] font-semibold">शक्ति:</span>
              <span className="text-[#ea580c] font-semibold">शिक्षा</span>
              <span className="text-[#7c3aed] font-semibold">समृद्धि:</span>
            </div>

            <p className="text-lg text-gray-700 mb-3">(Power, Education, Prosperity)</p>

            <p className="text-base text-gray-600 mb-10 max-w-md leading-relaxed">
              Bridging the gap to financial independence through a holistic approach
            </p>

            <div className="flex items-center gap-6">
              <button className="bg-[#0f766e] text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-[#0d6560] transition-colors">
                Start Your Journey
                <ArrowRight size={20} />
              </button>
              <a href="#login" className="text-gray-700 underline hover:text-gray-900">
                Existing Member?
              </a>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative flex items-center justify-center">
            <img 
              src={heroImage} 
              alt="Empowered women illustration" 
              className="w-full h-auto max-w-xl"
            />
          </div>
        </div>

        {/* Wavy decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-24 opacity-5">
          <svg viewBox="0 0 1200 100" className="w-full h-full">
            <path d="M0 50 Q300 0 600 50 T1200 50 L1200 100 L0 100 Z" fill="currentColor" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6">
          {/* Shaktih Card */}
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-[#0f766e] rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Shaktih</h3>
            <div className="w-12 h-1 bg-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">
              Understanding legal rights and workplace safety
            </p>
          </div>

          {/* Shiksha Card */}
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-[#ea580c] rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Shiksha</h3>
            <div className="w-12 h-1 bg-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">
              Build marketable skills through courses
            </p>
          </div>

          {/* Samruddhih Card */}
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-[#7c3aed] rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Samruddhih</h3>
            <div className="w-12 h-1 bg-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">
              Find opportunities matched to your skills
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#2c3e50] text-white py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of women achieving financial independence
          </p>
          <button className="bg-white text-gray-900 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors">
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2c3e50] text-gray-300 py-8 px-8 border-t border-gray-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex gap-6 text-sm">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#accessibility" className="hover:text-white transition-colors">Accessibility</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4">
                <circle cx="12" cy="12" r="10" fill="#1e40af" />
                <circle cx="12" cy="8" r="1.5" fill="#fbbf24" />
                <path d="M12 9.5 L9 14 L15 14 Z" fill="#fbbf24" />
              </svg>
            </div>
            <span>© 2024 ViyaStree. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}