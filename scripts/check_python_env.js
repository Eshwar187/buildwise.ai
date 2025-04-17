/**
 * Script to check if the Python environment is properly set up
 * This script checks if Python is installed and if the required packages are available
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to check if Python is installed
function checkPythonInstallation() {
  return new Promise((resolve, reject) => {
    // Determine the Python executable based on the OS
    const isWindows = process.platform === 'win32';
    const pythonExecutable = isWindows ? 'python' : 'python3';

    console.log(`Checking for ${pythonExecutable} installation...`);

    const pythonProcess = spawn(pythonExecutable, ['--version']);

    let stdoutData = '';
    let stderrData = '';

    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        const version = stdoutData.trim() || stderrData.trim();
        console.log(`✅ Python is installed: ${version}`);
        resolve(true);
      } else {
        console.error(`❌ Python is not installed or not in PATH`);
        console.error(`Please install Python and make sure it's in your PATH`);
        resolve(false);
      }
    });

    pythonProcess.on('error', (err) => {
      console.error(`❌ Error checking Python installation: ${err.message}`);
      resolve(false);
    });
  });
}

// Function to check if required packages are installed
function checkRequiredPackages() {
  return new Promise((resolve, reject) => {
    // Determine the Python executable based on the OS
    const isWindows = process.platform === 'win32';
    const pythonExecutable = isWindows ? 'python' : 'python3';

    console.log('Checking for required Python packages...');

    const checkScriptPath = path.join(__dirname, 'check_packages.py');

    if (!fs.existsSync(checkScriptPath)) {
      console.error(`❌ Check packages script not found at: ${checkScriptPath}`);
      return resolve(false);
    }

    const pythonProcess = spawn(pythonExecutable, [checkScriptPath]);

    let stdoutData = '';
    let stderrData = '';

    pythonProcess.stdout.on('data', (data) => {
      const output = data.toString();
      stdoutData += output;
      console.log(output.trim());
    });

    pythonProcess.stderr.on('data', (data) => {
      const output = data.toString();
      stderrData += output;
      console.error(output.trim());
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(true);
      } else {
        console.error(`\n❌ Some required packages are missing`);
        console.error(`Please install the missing packages using pip:`);
        console.error(`pip install -r ${path.join(__dirname, 'requirements.txt')}`);
        resolve(false);
      }
    });

    pythonProcess.on('error', (err) => {
      console.error(`❌ Error checking required packages: ${err.message}`);
      resolve(false);
    });
  });
}

// Function to check if the floor plan generator script exists
function checkFloorPlanGeneratorScript() {
  const scriptPath = path.join(__dirname, 'floor_plan_generator.py');

  if (fs.existsSync(scriptPath)) {
    console.log(`✅ Floor plan generator script found at: ${scriptPath}`);
    return true;
  } else {
    console.error(`❌ Floor plan generator script not found at: ${scriptPath}`);
    return false;
  }
}

// Main function to run all checks
async function runChecks() {
  console.log('Checking Python environment for BuildWise.ai floor plan processing...\n');

  const pythonInstalled = await checkPythonInstallation();

  if (!pythonInstalled) {
    console.error('\n❌ Python environment check failed: Python is not installed');
    process.exit(1);
  }

  const scriptExists = checkFloorPlanGeneratorScript();

  if (!scriptExists) {
    console.error('\n❌ Python environment check failed: Floor plan generator script not found');
    process.exit(1);
  }

  const packagesInstalled = await checkRequiredPackages();

  if (!packagesInstalled) {
    console.error('\n❌ Python environment check failed: Missing required packages');
    process.exit(1);
  }

  console.log('\n✅ Python environment check passed: All requirements are met');
}

// Run the checks
runChecks();
