const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/public-connect');
        console.log('Connected to DB');

        const users = await User.find({});
        console.log('--- User List ---');
        users.forEach(u => {
            console.log(`UID: ${u.uid}, Phone: ${u.phone}, Role: ${u.role}, Name: ${u.name}`);
        });
        console.log('-----------------');

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkUsers();
