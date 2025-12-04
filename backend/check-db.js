require('dotenv').config();
const prisma = require('./src/utils/prisma');

async function check() {
    try {
        console.log('Attempting to connect to the database...');
        await prisma.$connect();
        console.log('SUCCESS: Connected to the database successfully!');
    } catch (e) {
        console.error('FAILURE: Could not connect to the database.');
        console.error('Error details:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
