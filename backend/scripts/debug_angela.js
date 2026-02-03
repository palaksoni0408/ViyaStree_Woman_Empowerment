
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/viyastree';

async function debugAngela() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to Mongo');

        const user = await User.findOne({ email: 'angela@gmail.com' });
        if (!user) {
            console.log('User angela not found!');
        } else {
            console.log('User found:', user.email);
            console.log('User ID:', user.userId);
            console.log('Progress:', JSON.stringify(user.progress, null, 2));
            console.log('Saved Opportunities:', user.saved_opportunities);
        }

        mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

debugAngela();
