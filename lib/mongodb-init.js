// This script initializes MongoDB connection settings
// It's imported at the application startup to configure MongoDB connection

// Disable SSL certificate validation for MongoDB connections
// This is a workaround for SSL issues with MongoDB Atlas and newer Node.js versions
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

console.log('MongoDB SSL certificate validation disabled for development');

// Note: In production, you should use proper SSL certificates instead of disabling validation
