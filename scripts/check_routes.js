/**
 * Script to check for 404 errors in the application
 * This script checks if all API routes are working properly
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Function to check if a URL returns a 404 error
function checkUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const req = protocol.get(url, (res) => {
      const { statusCode } = res;

      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          url,
          statusCode,
          data: statusCode >= 400 ? data : null
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        url,
        statusCode: -1,
        error: err.message
      });
    });

    req.end();
  });
}

// Function to find all API routes in the application
function findApiRoutes() {
  const apiDir = path.join(__dirname, '..', 'app', 'api');
  const routes = [];

  function scanDir(dir, basePath = '/api') {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        scanDir(filePath, `${basePath}/${file}`);
      } else if (file === 'route.ts' || file === 'route.js') {
        routes.push(basePath);
      }
    }
  }

  scanDir(apiDir);
  return routes;
}

// Function to check all API routes
async function checkApiRoutes(baseUrl = 'http://localhost:3000') {
  console.log('Finding API routes...');
  const routes = findApiRoutes();
  console.log(`Found ${routes.length} API routes`);

  console.log('Checking API routes...');
  const results = [];

  for (const route of routes) {
    const url = `${baseUrl}${route}`;
    console.log(`Checking ${url}...`);
    const result = await checkUrl(url);
    results.push(result);
  }

  return results;
}

// Function to check all pages in the application
async function checkPages(baseUrl = 'http://localhost:3000') {
  console.log('Checking main pages...');

  const pages = [
    '/',
    '/dashboard',
    '/dashboard/projects',
    '/dashboard/floor-plans',
    '/dashboard/settings',
    '/dashboard/admin',
    '/sign-in',
    '/sign-up',
    '/forgot-password'
  ];

  const results = [];

  for (const page of pages) {
    const url = `${baseUrl}${page}`;
    console.log(`Checking ${url}...`);
    const result = await checkUrl(url);
    results.push(result);
  }

  return results;
}

// Function to check if the server is running
async function isServerRunning(baseUrl) {
  try {
    const result = await checkUrl(baseUrl);
    return result.statusCode !== -1;
  } catch (error) {
    return false;
  }
}

// Main function to run all checks
async function runChecks() {
  console.log('Checking for 404 errors in the application...\n');

  const baseUrl = process.argv[2] || 'http://localhost:3000';
  console.log(`Using base URL: ${baseUrl}\n`);

  // Check if the server is running
  const serverRunning = await isServerRunning(baseUrl);

  if (!serverRunning) {
    console.error(`❌ Error: Server is not running at ${baseUrl}`);
    console.error('Please start the server with: npm run dev');
    process.exit(1);
    return;
  }

  // Check API routes
  const apiResults = await checkApiRoutes(baseUrl);

  // Check pages
  const pageResults = await checkPages(baseUrl);

  // Combine results
  const results = [...apiResults, ...pageResults];

  // Print results
  console.log('\nResults:');
  console.log('========\n');

  let hasErrors = false;

  for (const result of results) {
    if (result.statusCode >= 400 || result.statusCode === -1) {
      hasErrors = true;
      console.log(`❌ ${result.url}: ${result.statusCode === -1 ? 'Error: ' + result.error : 'Status ' + result.statusCode}`);
    } else {
      console.log(`✅ ${result.url}: Status ${result.statusCode}`);
    }
  }

  console.log('\nSummary:');
  console.log('========\n');

  const errorCount = results.filter(r => r.statusCode >= 400 || r.statusCode === -1).length;
  console.log(`Total URLs checked: ${results.length}`);
  console.log(`URLs with errors: ${errorCount}`);

  if (hasErrors) {
    console.log('\n❌ Some URLs returned errors. Please check the application.');
    process.exit(1);
  } else {
    console.log('\n✅ All URLs are working properly.');
    process.exit(0);
  }
}

// Run the checks
runChecks();
