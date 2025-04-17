/**
 * Script to install Python dependencies for BuildWise.ai
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to install Python packages
function installPythonPackages() {
  return new Promise((resolve, reject) => {
    // Determine the Python executable based on the OS
    const isWindows = process.platform === 'win32';
    const pythonExecutable = isWindows ? 'python' : 'python3';
    const pipExecutable = isWindows ? 'pip' : 'pip3';
    
    console.log('Installing Python packages...');
    
    const requirementsPath = path.join(__dirname, 'requirements.txt');
    
    if (!fs.existsSync(requirementsPath)) {
      console.error(`Error: requirements.txt not found at ${requirementsPath}`);
      reject(new Error('requirements.txt not found'));
      return;
    }
    
    console.log(`Installing packages from ${requirementsPath}`);
    
    const pipProcess = spawn(pipExecutable, ['install', '-r', requirementsPath]);
    
    pipProcess.stdout.on('data', (data) => {
      console.log(data.toString().trim());
    });
    
    pipProcess.stderr.on('data', (data) => {
      console.error(data.toString().trim());
    });
    
    pipProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Python packages installed successfully');
        resolve();
      } else {
        console.error(`❌ Failed to install Python packages (exit code: ${code})`);
        reject(new Error(`pip exited with code ${code}`));
      }
    });
    
    pipProcess.on('error', (err) => {
      console.error(`❌ Error running pip: ${err.message}`);
      reject(err);
    });
  });
}

// Main function
async function main() {
  console.log('Installing Python dependencies for BuildWise.ai...\n');
  
  try {
    await installPythonPackages();
    console.log('\n✅ All Python dependencies installed successfully');
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    console.error('Please install the Python packages manually:');
    console.error(`pip install -r ${path.join(__dirname, 'requirements.txt')}`);
    process.exit(1);
  }
}

// Run the main function
main();
