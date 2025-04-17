// Script to test MongoDB connection
const { MongoClient } = require('mongodb');
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

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

// Try different connection options
async function testConnection() {
  console.log('Testing MongoDB connection...');

  // Connection options to try
  const connectionOptions = [
    {
      name: 'Default options',
      options: {}
    },
    {
      name: 'Basic SSL',
      options: {
        ssl: true
      }
    },
    {
      name: 'SSL with allowInvalidCertificates',
      options: {
        ssl: true,
        tlsAllowInvalidCertificates: true
      }
    },
    {
      name: 'SSL with allowInvalidHostnames',
      options: {
        ssl: true,
        tlsAllowInvalidHostnames: true
      }
    },
    {
      name: 'SSL with insecure',
      options: {
        tlsInsecure: true
      }
    },
    {
      name: 'Direct connection',
      options: {
        directConnection: true
      }
    },
    {
      name: 'No SSL verification',
      options: {
        ssl: false
      }
    },
    {
      name: 'Server API only',
      options: {
        serverApi: {
          version: '1',
          strict: true,
          deprecationErrors: true
        }
      }
    },
    {
      name: 'Connection with timeout',
      options: {
        connectTimeoutMS: 30000,
        socketTimeoutMS: 30000
      }
    },
    {
      name: 'Connection with auth source',
      options: {
        authSource: 'admin'
      }
    }
  ];

  // Try each connection option
  for (const config of connectionOptions) {
    console.log(`\nTrying connection with: ${config.name}`);

    try {
      const client = new MongoClient(MONGODB_URI, config.options);
      await client.connect();

      console.log('✅ Connected successfully!');

      // List databases to verify connection
      const adminDb = client.db().admin();
      const dbs = await adminDb.listDatabases();
      console.log('Available databases:');
      dbs.databases.forEach(db => {
        console.log(`- ${db.name}`);
      });

      // Close connection
      await client.close();
      console.log('Connection closed');

      // If successful, save the working options
      console.log('\n✅ WORKING CONNECTION OPTIONS:');
      console.log(JSON.stringify(config.options, null, 2));

      return config.options;
    } catch (error) {
      console.error(`❌ Connection failed with ${config.name}:`);
      console.error(error.message);
    }
  }

  console.error('\n❌ All connection attempts failed');
  return null;
}

// Run the test
testConnection()
  .then(workingOptions => {
    if (workingOptions) {
      console.log('\nUse these options in your MongoDB connection code:');
      console.log(JSON.stringify(workingOptions, null, 2));
    }
  })
  .catch(console.error);
