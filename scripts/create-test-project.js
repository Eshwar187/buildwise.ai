// Script to create a test project directly in the database
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/buildwise';

// Function to create a test project
async function createTestProject() {
  console.log('Creating test project...');
  
  // Create MongoDB client
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
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    // Get database name from URI or use default
    const dbName = MONGODB_URI.split("/").pop()?.split("?")[0] || "buildwise";
    const db = client.db(dbName);
    
    // Check if projects collection exists
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    if (!collectionNames.includes('projects')) {
      console.log('Creating projects collection...');
      await db.createCollection('projects');
      await db.collection('projects').createIndex({ userId: 1 });
    }
    
    // Get the user ID from the users collection
    const users = await db.collection('users').find({}).toArray();
    
    if (users.length === 0) {
      console.log('No users found in the database. Creating a test user...');
      
      // Create a test user if none exists
      const testUser = {
        clerkId: 'test_user_id',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        isAdmin: false,
        isAdminApproved: false,
        savedDesigners: [],
        savedMaterials: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActive: new Date()
      };
      
      const userResult = await db.collection('users').insertOne(testUser);
      console.log('Created test user with ID:', userResult.insertedId);
      var userId = testUser.clerkId;
    } else {
      console.log('Found users:', users.map(u => ({ id: u._id, clerkId: u.clerkId, email: u.email })));
      var userId = users[0].clerkId;
    }
    
    // Create a test project
    const now = new Date();
    const testProject = {
      userId: userId,
      name: 'Test Project ' + now.toISOString().split('T')[0],
      description: 'This is a test project created by the script',
      landDimensions: {
        length: 40,
        width: 30,
        totalArea: 1200
      },
      landUnit: 'sq ft',
      budget: 150000,
      currency: 'USD',
      location: {
        country: 'United States',
        state: 'California',
        city: 'San Francisco'
      },
      preferences: {
        rooms: {
          bedrooms: 3,
          bathrooms: 2,
          kitchen: true,
          livingRoom: true,
          diningRoom: true,
          study: true,
          garage: true
        },
        style: 'Modern',
        stories: 2,
        energyEfficient: true,
        accessibility: false,
        outdoorSpace: true
      },
      status: 'Planning',
      createdAt: now,
      updatedAt: now
    };
    
    // Insert the test project
    const result = await db.collection('projects').insertOne(testProject);
    console.log('Created test project with ID:', result.insertedId);
    
    // Verify the project was inserted
    const insertedProject = await db.collection('projects').findOne({ _id: result.insertedId });
    if (insertedProject) {
      console.log('Successfully verified project was inserted');
      console.log('Project details:', {
        id: insertedProject._id,
        name: insertedProject.name,
        userId: insertedProject.userId
      });
    } else {
      console.error('Failed to verify project insertion');
    }
    
    // Count projects for this user
    const projectCount = await db.collection('projects').countDocuments({ userId: userId });
    console.log(`User ${userId} now has ${projectCount} projects`);
    
    // List all projects
    const allProjects = await db.collection('projects').find({}).toArray();
    console.log(`Total projects in database: ${allProjects.length}`);
    console.log('All projects:', allProjects.map(p => ({ id: p._id, name: p.name, userId: p.userId })));
    
    // Create a local file with the project data for reference
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(dataDir, 'test-project.json'), 
      JSON.stringify(testProject, null, 2)
    );
    console.log('Saved project data to data/test-project.json');
    
  } catch (error) {
    console.error('Error creating test project:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
createTestProject().catch(console.error);
