
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Configuration
const BASE_URL = 'http://localhost:5001/api/v1';
const TEST_USER = {
    name: 'Verification Bot',
    email: `verify_${Date.now()}@example.com`,
    password: 'password123',
    location: 'Cyber City'
};

let TOKEN = '';
let USER_ID = '';

async function runTest() {
    console.log('🚀 Starting Full System Verification...\n');

    try {
        // --- 1. AUTHENTICATION ---
        console.log('1️⃣  Testing Authentication...');

        // Signup
        const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_USER)
        });
        const signupData = await signupRes.json();

        if (!signupRes.ok) throw new Error(`Signup Failed: ${signupData.error}`);
        console.log('   ✅ Signup successful');

        // Login
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: TEST_USER.email, password: TEST_USER.password })
        });
        const loginData = await loginRes.json();

        if (!loginRes.ok) throw new Error(`Login Failed: ${loginData.error}`);
        TOKEN = loginData.token;
        USER_ID = loginData.user.userId;
        console.log('   ✅ Login successful');
        console.log(`   ℹ️  User ID: ${USER_ID}`);


        // --- 2. PROFILE UPDATE ---
        console.log('\n2️⃣  Testing Profile Update...');
        const profileUpdateRes = await fetch(`${BASE_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Verified User',
                location: 'Test Lab',
                avatar: '/uploads/simulated_avatar.jpg' // Simulating a path provided by frontend
            })
        });
        const profileData = await profileUpdateRes.json();

        if (!profileUpdateRes.ok) throw new Error('Profile Update Failed');
        if (profileData.user.profile.avatar !== '/uploads/simulated_avatar.jpg') throw new Error('Avatar not persisted');
        console.log('   ✅ Profile updated & Avatar persisted');


        // --- 3. SHIKSHA (Education) ---
        console.log('\n3️⃣  Testing Shiksha (Course Completion)...');
        const courseRes = await fetch(`${BASE_URL}/shiksha/update-progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: USER_ID,
                courseId: 'financial_literacy_101',
                action: 'complete',
                quizScore: 90
            })
        });
        const courseData = await courseRes.json();

        if (courseData.pointsEarned !== 50) throw new Error('Incorrect points awarded');
        console.log('   ✅ Course completed. Points earned: ' + courseData.pointsEarned);


        // --- 4. SAMRUDDHIH (Livelihood) ---
        console.log('\n4️⃣  Testing Samruddhih (Save Opportunity)...');
        const oppRes = await fetch(`${BASE_URL}/samruddhih/save-opportunity`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: USER_ID,
                opportunityId: 'opp_test_123'
            })
        });
        const oppData = await oppRes.json();

        if (oppData.saved !== true) throw new Error('Opportunity save reported failure');
        console.log('   ✅ Opportunity saved successfully (Total: ' + oppData.totalSaved + ')');


        // --- 5. SHAKTIH (Safety) ---
        console.log('\n5️⃣  Testing Shaktih (Legal Query)...');
        const queryRes = await fetch(`${BASE_URL}/shaktih/legal-query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: USER_ID,
                query: 'maternity leave'
            })
        });
        const queryData = await queryRes.json();

        if (!queryData.response) throw new Error('No response from legal KB');
        console.log('   ✅ Legal query processed. Intent: ' + (queryData.intent || 'N/A'));


        // --- 6. DASHBOARD ORCHESTRATION ---
        console.log('\n6️⃣  Testing Dashboard Aggregation...');
        const dashRes = await fetch(`${BASE_URL}/orchestration/dashboard?userId=${USER_ID}`);
        const dashData = await dashRes.json();

        if (dashData.empowermentScore <= 0) throw new Error('Empowerment score did not update (remain 0)');
        console.log(`   ✅ Dashboard updated. Score: ${dashData.empowermentScore}/100`);
        console.log(`   ✅ Recommendations: ${dashData.recommendations.length} items`);


        console.log('\n✨✨✨ ALL SYSTEMS VERIFIED & PASSING ✨✨✨\n');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ VERIFICATION FAILED');
        console.error(error.message);
        process.exit(1);
    }
}

runTest();
