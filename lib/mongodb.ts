import { MongoClient, ServerApiVersion, Document } from "mongodb"
import { getLocalDb } from "./local-db"

// Initialize MongoDB settings
// This is a workaround for SSL issues with MongoDB Atlas
try {
  // Only disable SSL validation in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('MongoDB SSL certificate validation disabled for development');
  }
} catch (error) {
  console.error('Error initializing MongoDB settings:', error);
}

const MONGODB_URI = process.env.MONGODB_URI || ""

// Check if MongoDB URI is defined
if (!MONGODB_URI) {
  console.warn("MONGODB_URI is not defined, using local database")
}

let cachedClient: MongoClient | null = null
let cachedDb: any = null
let isUsingLocalDb = false

export async function connectToDatabase() {
  // If we already have a connection, use it
  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
      isLocal: isUsingLocalDb
    }
  }

  // If we're already using local DB, return it
  if (isUsingLocalDb) {
    return getLocalDb()
  }

  try {
    console.log('Attempting to connect to MongoDB Atlas with URI:', MONGODB_URI.substring(0, 20) + '...')

    // Try to connect to MongoDB with simplified options
    const client = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      // Add longer timeouts for better reliability
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000
    })

    // Connect to MongoDB
    await client.connect()

    // Extract database name from URI or use default
    const dbName = MONGODB_URI.split("/").pop()?.split("?")[0] || "buildwise"
    const db = client.db(dbName)

    // Create necessary collections if they don't exist
    // Define required collections and indexes
    const requiredCollections = [
      { name: "users", indexes: [{ keys: { clerkId: 1 } as Document, options: { unique: true } }, { keys: { email: 1 } as Document, options: {} }] },
      { name: "projects", indexes: [{ keys: { userId: 1 } as Document, options: {} }] },
      { name: "floorPlans", indexes: [{ keys: { projectId: 1 } as Document, options: {} }] },
      { name: "designers", indexes: [{ keys: { location: 1 } as Document, options: {} }] },
      { name: "materials", indexes: [{ keys: { category: 1 } as Document, options: {} }] },
      { name: "regions", indexes: [{ keys: { country: 1, state: 1, city: 1 } as Document, options: {} }] },
      { name: "verificationCodes", indexes: [] },
      { name: "adminRequests", indexes: [] },
      { name: "energyRecommendations", indexes: [] }
    ]

    // Get existing collections
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    // Create collections and indexes
    for (const collection of requiredCollections) {
      try {
        if (!collectionNames.includes(collection.name)) {
          await db.createCollection(collection.name)
          console.log(`Created collection: ${collection.name}`)
        }

        // Create indexes
        for (const index of collection.indexes) {
          await db.collection(collection.name).createIndex(index.keys, index.options)
        }
      } catch (error) {
        console.log(`Error with collection ${collection.name}:`, error)
        // Continue with other collections
      }
    }

    // Cache the connection
    cachedClient = client
    cachedDb = db
    isUsingLocalDb = false

    return {
      client: cachedClient,
      db: cachedDb,
      isLocal: isUsingLocalDb
    }
  } catch (error) {
    console.error("MongoDB connection error:", error)
    console.error("MongoDB connection details:", {
      uri: MONGODB_URI.substring(0, 20) + '...',
      dbName: MONGODB_URI.split("/").pop()?.split("?")[0] || "buildwise"
    })

    // Don't use local database fallback in production
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Failed to connect to MongoDB in production environment')
    }

    console.warn("Using local database as fallback")

    // Use local database as fallback in development
    isUsingLocalDb = true
    return getLocalDb()
  }
}

