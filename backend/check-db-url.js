require('dotenv').config();

console.log('=== DATABASE CONNECTION DIAGNOSTICS ===\n');

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.log('❌ ERROR: DATABASE_URL is not set in .env file');
    process.exit(1);
}

// Parse the connection string
console.log('Connection String Analysis:');
console.log('Full URL (masked):', dbUrl.replace(/:[^:@]+@/, ':****@'));

// Extract database name
const match = dbUrl.match(/\.net\/([^?]+)/);
if (match && match[1]) {
    console.log('✅ Database name found:', match[1]);
} else {
    console.log('❌ ERROR: No database name found in connection string!');
    console.log('\nYour connection string should look like:');
    console.log('mongodb+srv://user:pass@cluster.mongodb.net/DATABASE_NAME?options');
    console.log('                                                ↑↑↑↑↑↑↑↑↑↑↑↑↑');
    console.log('                                                Add this part!');
    process.exit(1);
}

console.log('\n✅ Connection string format looks correct!');
console.log('If you still get errors, the database name might be empty or invalid.');
