const { MongoClient } = require('mongodb');

const uri = process.env.DATABASE_URL || "mongodb+srv://shivanshupadhayay2024_db_user:s54S0Fqn3MpsEaJu@cluster0.ki7gy1s.mongodb.net/QuickBite?appName=Cluster0";

async function checkIndexes() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('QuickBite');
        const collection = db.collection('User');

        console.log('\n📋 Current indexes on User collection:');
        const indexes = await collection.indexes();

        indexes.forEach(index => {
            console.log('\nIndex:', index.name);
            console.log('  Keys:', JSON.stringify(index.key));
            console.log('  Unique:', index.unique || false);
            console.log('  Sparse:', index.sparse || false);
        });

        const googleIdIndex = indexes.find(idx => idx.name === 'User_googleId_key');

        if (googleIdIndex) {
            console.log('\n✅ googleId index exists!');
            if (googleIdIndex.unique && googleIdIndex.sparse) {
                console.log('✅ Index is both unique AND sparse - Perfect!');
            } else {
                console.log('⚠️  Index exists but missing properties:');
                console.log('   Unique:', googleIdIndex.unique || false);
                console.log('   Sparse:', googleIdIndex.sparse || false);
            }
        } else {
            console.log('\n❌ googleId index NOT found!');
            console.log('You need to create it in MongoDB Atlas.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

checkIndexes();
