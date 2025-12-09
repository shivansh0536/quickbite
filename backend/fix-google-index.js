const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixGoogleIdIndex() {
    try {
        // Connect to MongoDB directly
        const db = prisma.$queryRawUnsafe;

        console.log('Dropping existing googleId index...');
        await prisma.$runCommandRaw({
            dropIndexes: 'User',
            index: 'User_googleId_key'
        }).catch(e => console.log('Index might not exist:', e.message));

        console.log('Creating sparse unique index for googleId...');
        await prisma.$runCommandRaw({
            createIndexes: 'User',
            indexes: [{
                key: { googleId: 1 },
                name: 'User_googleId_key',
                unique: true,
                sparse: true  // This allows multiple null values
            }]
        });

        console.log('✅ Successfully created sparse unique index for googleId');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixGoogleIdIndex();
