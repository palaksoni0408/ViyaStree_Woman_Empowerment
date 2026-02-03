require('dotenv').config()
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')

const KnowledgeBase = require('../models/KnowledgeBase')
const User = require('../models/User')
const Course = require('../models/Course')

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/viyastree'

// --- Course Data ---
// --- Schemes Data ---
const schemes = [
  {
    title: 'Pradhan Mantri Mudra Yojana',
    type: 'Loan/Finance',
    description: 'Loans up to ₹10 Lakhs for non-corporate, non-farm small/micro enterprises. Categories: Shishu (up to ₹50k), Kishore (₹50k-₹5L), Tarun (₹5L-₹10L).',
    eligibility: 'Any Indian citizen involved in non-farm income-generating activities (manufacturing, trading, services).',
    benefits: ['Collateral-free loans', 'Low interest rates', 'Flexible repayment'],
    link: 'https://www.mudra.org.in/'
  },
  {
    title: 'Stand Up India Scheme',
    type: 'Business Loan',
    description: 'Facilitates bank loans between ₹10 Lakh and ₹1 Crore to at least one SC/ST borrower and at least one woman borrower per bank branch for setting up a greenfield enterprise.',
    eligibility: 'SC/ST and/or Woman entrepreneur above 18 years.',
    benefits: ['High value loan', 'Support for greenfield projects'],
    link: 'https://www.standupmitra.in/'
  },
  {
    title: 'Sukanya Samriddhi Yojana',
    type: 'Savings Scheme',
    description: 'A small deposit scheme for the girl child launched as part of the "Beti Bachao Beti Padhao" campaign.',
    eligibility: 'Parents/guardians can open for a girl child below 10 years.',
    benefits: ['High interest rate (approx 8%)', 'Tax benefits (80C)', 'Maturity amount tax-free'],
    link: 'https://www.nsiindia.gov.in/'
  },
  {
    title: 'Mahila E-Haat',
    type: 'Marketing Platform',
    description: 'Online marketing platform for women entrepreneurs to showcase products made/manufactured/sold by them.',
    eligibility: 'Women entrepreneurs, SHGs, NGOs.',
    benefits: ['Free registration', 'Direct access to buyers', '24x7 visibility'],
    link: 'http://mahilaehaat.rmk.nic.in/'
  }
]

// --- Course Data ---
const courses = [
  {
    courseId: 'digital_marketing_basic',
    title: 'Digital Marketing Basics',
    skill: 'Digital Marketing',
    level: 'Beginner',
    provider: 'ViyaStree Academy',
    duration: 5,
    url: 'https://example.com/course/dm-basic',
    syllabus: [
      'Introduction to Digital Marketing',
      'Understanding Social Media Platforms',
      'Creating Engaging Content',
      'Basics of SEO',
      'Running Your First Ad Campaign'
    ],
    estimatedCompletion: '2 weeks',
    description: 'Learn how to promote products and services using digital channels. Perfect for small business owners.'
  },
  {
    courseId: 'financial_literacy_101',
    title: 'Financial Independence 101',
    skill: 'Finance',
    level: 'Beginner',
    provider: 'RBI Initiative',
    duration: 6,
    url: 'https://example.com/course/fin-lit',
    syllabus: [
      'Banking Basics & Savings',
      'Understanding Loans & Interest',
      'Digital Payments (UPI, Wallets)',
      'Avoiding Online Fraud',
      'Investment Basics (FD, RD, Mutual Funds)'
    ],
    estimatedCompletion: '2 weeks',
    description: 'Master your money. Learn how to save, invest safely, and use digital banking without fear.'
  },
  {
    courseId: 'cyber_safety_women',
    title: 'Cyber Safety for Women',
    skill: 'Digital Safety',
    level: 'Beginner',
    provider: 'CyberCell',
    duration: 3,
    url: 'https://example.com/course/cyber-safety',
    syllabus: [
      'Securing Social Media Profiles',
      'Recognizing Phishing & Scams',
      'Safe Online Shopping',
      'Handling Cyber Stalking',
      'Reporting Cyber Crimes'
    ],
    estimatedCompletion: '1 week',
    description: 'Stay safe online. Learn to protect your privacy and handle online harassment.'
  },
  {
    courseId: 'excel_intermediate',
    title: 'Excel for Business',
    skill: 'Data Management',
    level: 'Intermediate',
    provider: 'SkillIndia',
    duration: 8,
    url: 'https://example.com/course/excel-int',
    syllabus: [
      'Advanced Formulas (VLOOKUP, IF)',
      'Pivot Tables and Charts',
      'Data Validation',
      'Budgeting with Excel',
      'Inventory Management'
    ],
    estimatedCompletion: '3 weeks',
    description: 'Master Excel to manage your business finances and inventory efficiently.'
  },
  {
    courseId: 'tailoring_basic',
    title: 'Fundamentals of Tailoring',
    skill: 'Tailoring',
    level: 'Beginner',
    provider: 'Crafts Council',
    duration: 10,
    url: 'https://example.com/course/tailoring-101',
    syllabus: [
      'Understanding Fabrics and Tools',
      'Basic Stitches and Hems',
      'Taking Body Measurements',
      'Cutting Patterns',
      'Stitching a Simple Kurta'
    ],
    estimatedCompletion: '4 weeks',
    description: 'Start your journey as a professional tailor. Learn the basics of cutting and stitching.'
  }
]

// --- Knowledge Base Data ---
const knowledgeBase = [
  {
    intent: 'maternity_benefits',
    keywords: ['maternity', 'leave', 'pregnancy', 'pregnant', 'baby', 'delivery', 'mother'],
    content: 'According to the Maternity Benefit (Amendment) Act 2017, women working in establishments with 10 or more employees are entitled to 26 weeks of paid maternity leave. This applies to your first two children. You are also entitled to medical bonuses and nursing breaks until the child is 15 months old. It is illegal for an employer to fire you because of pregnancy.',
    relatedTopics: ['creche_facility', 'work_from_home']
  },
  {
    intent: 'posh_workplace_harassment',
    keywords: ['harassment', 'sexual', 'touch', 'comment', 'uncomfortable', 'boss', 'colleague', 'posh', 'workplace'],
    content: 'The POSH Act (Prevention of Sexual Harassment) mandates that every workplace with 10+ employees must have an Internal Complaints Committee (ICC). You can file a written complaint to the ICC within 3 months of the incident. Sexual harassment includes physical contact, demand for sexual favors, sexually colored remarks, showing pornography, or unwelcome physical/verbal conduct of a sexual nature.',
    relatedTopics: ['filing_complaint', 'icc_members']
  },
  {
    intent: 'domestic_violence',
    keywords: ['domestic', 'violence', 'husband', 'beat', 'hit', 'abuse', 'torture', 'dowry', 'in-laws', 'safe'],
    content: 'The Protection of Women from Domestic Violence Act, 2005 protects you from physical, emotional, sexual, and economic abuse by any family member. You have the right to a shared household, protection orders, and monetary relief. You can approach a Protection Officer, Police, or Magistrate. Call 181 for immediate help.',
    relatedTopics: ['protection_order', 'womens_helpline']
  },
  {
    intent: 'equal_pay',
    keywords: ['pay', 'salary', 'wages', 'discrimination', 'less', 'money', 'equal'],
    content: 'The Equal Remuneration Act, 1976 prohibits discrimination in payment of remuneration on the basis of gender. You are entitled to the same wages as your male counterparts for the same work or work of a similar nature. Employers also cannot discriminate in recruitment or promotions based on gender.',
    relatedTopics: ['minimum_wages', 'labor_rights']
  },
  {
    intent: 'filing_fir',
    keywords: ['fir', 'police', 'complaint', 'station', 'report', 'crime', 'zero'],
    content: 'You have the right to file an FIR (First Information Report) for any cognizable offense. If a police station refuses to file your complaint due to jurisdiction issues, you can file a "Zero FIR" at ANY police station, which must then be transferred to the correct station. Women can also request to record their statement at home in the presence of a female police officer for certain sensitive crimes.',
    relatedTopics: ['zero_fir', 'legal_aid']
  },
  {
    intent: 'cyber_stalking_harassment',
    keywords: ['cyber', 'stalking', 'online', 'internet', 'message', 'photo', 'fake', 'profile', 'troll'],
    content: 'Cyber stalking and online harassment are punishable offenses under the IT Act (Section 66A, 67) and IPC (Section 354D). This includes monitoring your online activity, sending obscene messages, or using your photos without consent. You can report this to the National Cyber Crime Reporting Portal (cybercrime.gov.in) or your local police station.',
    relatedTopics: ['cyber_crime_portal', 'blocking_reporting']
  },
  {
    intent: 'online_fraud',
    keywords: ['fraud', 'bank', 'money', 'scam', 'otp', 'password', 'hack', 'account'],
    content: 'Never share your OTP, PIN, or passwords with anyone, even if they claim to be from the bank. Banks never ask for this info. If you lose money to online fraud, call 1930 (National Cyber Crime Helpline) immediately to report it. The sooner you report, the higher the chance of freezing the funds.',
    relatedTopics: ['helpline_1930', 'banking_safety']
  }
]

// Define Schema for Schemes (inline for seeding script if not in models)
// Ideally we should have a Model, but for now we can just store them or skip if no model.
// Wait, the plan asked to create a collection. Let's see if we can use a generic 'Resource' model or just print them.
// To make them accessible, we should probably add them to the 'Course' model as a different type OR create a new model.
// For speed, let's create a temporary Schema here or just rely on frontend static data if backend model is hard.
// BETTER: Let's create a simple Scheme model in the backend first in a separate step? 
// Actually, I can just define it here to insert it if I want, but I need the file.
// Let's stick to Courses and KnowledgeBase for now in this file, and I will handle Schemes in frontend static data 
// OR create a model. Given the constraint of "Disruptive", dynamic is better.
// Let's add a Scheme model in the next step. For now, I will seed Courses and KB.
// NOTE: I am NOT seeding schemes here yet because I haven't created the model. I will add that next.

async function seed() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Connected to Mongo for seeding')

    // Seed Knowledge Base
    await KnowledgeBase.deleteMany({})
    await KnowledgeBase.insertMany(knowledgeBase)
    console.log(`Knowledge base seeded with ${knowledgeBase.length} articles`)

    // Seed Courses
    await Course.deleteMany({})
    await Course.insertMany(courses)
    console.log(`Seeded ${courses.length} courses`)

    await mongoose.disconnect()
    console.log('Seed complete')
  } catch (err) {
    console.error('Seeding failed:', err)
    process.exit(1)
  }
}

seed()
