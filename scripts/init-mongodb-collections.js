// Script to initialize MongoDB collections
const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Read .env.local file manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

// Parse environment variables
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    env[key] = value;
    process.env[key] = value;
  }
});

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'buildwise';

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

async function initMongoDBCollections() {
  console.log('Initializing MongoDB collections...');
  console.log(`URI: ${MONGODB_URI.substring(0, 20)}...`);
  console.log(`Database: ${DB_NAME}`);

  // Use minimal connection options
  const client = new MongoClient(MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000
  });

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');

    const db = client.db(DB_NAME);
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('\nExisting collections:');
    if (collections.length === 0) {
      console.log('No collections found. Database may be empty.');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }

    // Define required collections
    const requiredCollections = [
      { name: "users", indexes: [{ key: { clerkId: 1 }, options: { unique: true } }] },
      { name: "projects", indexes: [{ key: { userId: 1 }, options: {} }] },
      { name: "floorPlans", indexes: [{ key: { projectId: 1 }, options: {} }] },
      { name: "designers", indexes: [{ key: { location: 1 }, options: {} }] },
      { name: "materials", indexes: [{ key: { category: 1 }, options: {} }] },
      { name: "regions", indexes: [{ key: { country: 1, state: 1, city: 1 }, options: {} }] },
      { name: "verificationCodes", indexes: [] },
      { name: "adminRequests", indexes: [] },
      { name: "energyRecommendations", indexes: [] }
    ];

    // Create collections if they don't exist
    console.log('\nCreating required collections:');
    for (const collection of requiredCollections) {
      try {
        if (!collections.some(c => c.name === collection.name)) {
          await db.createCollection(collection.name);
          console.log(`✅ Created collection: ${collection.name}`);
        } else {
          console.log(`ℹ️ Collection already exists: ${collection.name}`);
        }

        // Create indexes
        for (const index of collection.indexes) {
          await db.collection(collection.name).createIndex(index.key, index.options);
          console.log(`  ✅ Created index on ${collection.name}: ${JSON.stringify(index.key)}`);
        }
      } catch (error) {
        console.error(`❌ Error with collection ${collection.name}:`, error);
      }
    }

    // Create a test document in each collection
    console.log('\nCreating test documents in each collection:');
    for (const collection of requiredCollections) {
      try {
        const testDoc = {
          test: true,
          message: `Test document for ${collection.name}`,
          timestamp: new Date()
        };
        
        // Add specific fields based on collection type
        if (collection.name === 'users') {
          testDoc.clerkId = 'test_clerk_id_' + Date.now();
          testDoc.email = 'test@example.com';
          testDoc.username = 'testuser';
          testDoc.isAdmin = false;
          testDoc.isAdminApproved = false;
        } else if (collection.name === 'projects') {
          testDoc.userId = 'test_user_id';
          testDoc.name = 'Test Project';
          testDoc.description = 'Test project description';
          testDoc.status = 'Planning';
        }
        
        const result = await db.collection(collection.name).insertOne(testDoc);
        console.log(`✅ Created test document in ${collection.name} with ID: ${result.insertedId}`);
        
        // Clean up test document
        await db.collection(collection.name).deleteOne({ _id: result.insertedId });
        console.log(`  ✅ Cleaned up test document from ${collection.name}`);
      } catch (error) {
        console.error(`❌ Error creating test document in ${collection.name}:`, error);
      }
    }

    console.log('\n✅ MongoDB collections initialization completed successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the initialization
initMongoDBCollections().catch(console.error);
