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

async function initMongoDB() {
  console.log('Initializing MongoDB collections...');

  // Use Node.js built-in environment variable to disable SSL validation
  // This is a workaround for SSL issues with MongoDB Atlas
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  // Use minimal connection options
  const client = new MongoClient(MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    // Add timeouts for better error handling
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000
  });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);

    // Define required collections and indexes
    const requiredCollections = [
      {
        name: "users",
        indexes: [
          { keys: { clerkId: 1 }, options: { unique: true } },
          { keys: { email: 1 }, options: {} }
        ]
      },
      {
        name: "projects",
        indexes: [
          { keys: { userId: 1 }, options: {} }
        ]
      },
      {
        name: "floorPlans",
        indexes: [
          { keys: { projectId: 1 }, options: {} }
        ]
      },
      {
        name: "designers",
        indexes: [
          { keys: { location: 1 }, options: {} }
        ]
      },
      {
        name: "materials",
        indexes: [
          { keys: { category: 1 }, options: {} }
        ]
      },
      {
        name: "regions",
        indexes: [
          { keys: { country: 1, state: 1, city: 1 }, options: {} }
        ]
      },
      { name: "verificationCodes", indexes: [] },
      { name: "adminRequests", indexes: [] },
      { name: "energyRecommendations", indexes: [] }
    ];

    // Get existing collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    // Create collections and indexes
    for (const collection of requiredCollections) {
      try {
        if (!collectionNames.includes(collection.name)) {
          await db.createCollection(collection.name);
          console.log(`Created collection: ${collection.name}`);
        } else {
          console.log(`Collection already exists: ${collection.name}`);
        }

        // Create indexes
        for (const index of collection.indexes) {
          await db.collection(collection.name).createIndex(index.keys, index.options);
          console.log(`Created index on ${collection.name}: ${JSON.stringify(index.keys)}`);
        }
      } catch (error) {
        console.error(`Error with collection ${collection.name}:`, error);
      }
    }

    // No sample data will be added - collections will be created empty

    console.log('MongoDB initialization completed successfully');
  } catch (error) {
    console.error('Error initializing MongoDB:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the initialization
initMongoDB().catch(console.error);
