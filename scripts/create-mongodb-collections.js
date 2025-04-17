// A simplified script that just defines the MongoDB collections structure
// This can be used as a reference for manually creating collections in MongoDB Atlas

const collections = [
  {
    name: "users",
    indexes: [
      { key: { clerkId: 1 }, options: { unique: true } },
      { key: { email: 1 }, options: {} }
    ]
  },
  {
    name: "projects",
    indexes: [
      { key: { userId: 1 }, options: {} }
    ]
  },
  {
    name: "floorPlans",
    indexes: [
      { key: { projectId: 1 }, options: {} }
    ]
  },
  {
    name: "designers",
    indexes: [
      { key: { "location.country": 1, "location.state": 1, "location.city": 1 }, options: {} }
    ]
  },
  {
    name: "materials",
    indexes: [
      { key: { category: 1 }, options: {} }
    ]
  },
  {
    name: "regions",
    indexes: [
      { key: { country: 1, state: 1, city: 1 }, options: {} }
    ]
  },
  {
    name: "verificationCodes",
    indexes: []
  },
  {
    name: "adminRequests",
    indexes: []
  },
  {
    name: "energyRecommendations",
    indexes: []
  }
];

console.log(`
=== MongoDB Collection Structure ===

This is a reference for the MongoDB collections needed by BuildWise.ai.
You can create these collections manually in MongoDB Atlas.

Database name: buildwise

Collections:
${collections.map(c => `- ${c.name}`).join('\n')}

Indexes:
${collections.map(c => c.indexes.length > 0 ? 
  `Collection: ${c.name}\n${c.indexes.map(idx => 
    `  - Key: ${JSON.stringify(idx.key)}${idx.options.unique ? ' (unique)' : ''}`
  ).join('\n')}` : 
  `Collection: ${c.name}\n  - No indexes`
).join('\n\n')}

=== MongoDB Shell Commands ===

You can use these commands in MongoDB Atlas to create the collections and indexes:

use buildwise

${collections.map(c => `// Create ${c.name} collection
db.createCollection("${c.name}")
${c.indexes.map(idx => 
  `db.${c.name}.createIndex(${JSON.stringify(idx.key)}, ${JSON.stringify(idx.options)})`
).join('\n')}`).join('\n\n')}
`);

// Instructions for MongoDB Atlas
console.log(`
=== Instructions for MongoDB Atlas ===

1. Log in to MongoDB Atlas at https://cloud.mongodb.com
2. Navigate to your cluster
3. Click on "Collections" tab
4. Click "Add My Own Data" or "+" button to create a new database
5. Enter "buildwise" as the database name
6. Create each collection listed above
7. For each collection, create the specified indexes using the "Indexes" tab

Alternatively, you can use MongoDB Compass to connect to your cluster and create the collections and indexes.
`);

// Instructions for MongoDB Compass
console.log(`
=== Instructions for MongoDB Compass ===

1. Download and install MongoDB Compass from https://www.mongodb.com/products/compass
2. Connect to your MongoDB Atlas cluster using the connection string
3. Create a new database named "buildwise"
4. Create each collection listed above
5. For each collection, create the specified indexes
`);

// Instructions for using the application without MongoDB
console.log(`
=== Using the Application Without MongoDB ===

If you're having trouble connecting to MongoDB Atlas, you can modify the application to use a mock database:

1. Edit the file: lib/mongodb.ts
2. Add a fallback mock database implementation in the catch block
3. This will allow the application to run without a real MongoDB connection

Example mock database implementation:

try {
  // MongoDB connection code...
} catch (error) {
  console.error("MongoDB connection error:", error);
  
  // Create a mock database for development
  console.warn("Using mock database as fallback");
  
  return {
    client: null,
    db: {
      collection: (_name) => ({
        find: () => ({ sort: () => ({ toArray: () => Promise.resolve([]) }) }),
        findOne: () => Promise.resolve(null),
        insertOne: () => Promise.resolve({ insertedId: "mock-id" }),
        updateOne: () => Promise.resolve({ modifiedCount: 1 }),
        deleteOne: () => Promise.resolve({ deletedCount: 1 }),
        countDocuments: () => Promise.resolve(0),
        createIndex: () => Promise.resolve(),
        aggregate: () => ({ toArray: () => Promise.resolve([]) }),
      }),
      listCollections: () => ({ toArray: () => Promise.resolve([]) }),
      createCollection: () => Promise.resolve(),
    },
  };
}
`);
