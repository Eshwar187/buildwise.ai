/**
 * Node.js wrapper for the floor_plan_generator.py script
 * This allows the Next.js application to call the Python script
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Process a floor plan image using the Python script
 *
 * @param {Object} options - Processing options
 * @param {string} options.inputPath - Path to the input floor plan image
 * @param {string} options.outputPath - Path to save the enhanced floor plan
 * @param {string} options.colorScheme - Color scheme to use (modern, minimal, colorful, blueprint)
 * @param {boolean} options.generate3D - Whether to generate a 3D visualization
 * @param {boolean} options.exportData - Whether to export floor plan data as JSON
 * @param {string} options.dataPath - Path to save the floor plan data JSON
 * @returns {Promise<Object>} - Result object with paths and status
 */
function processFloorPlan(options) {
  return new Promise((resolve, reject) => {
    const {
      inputPath,
      outputPath,
      colorScheme = 'modern',
      generate3D = false,
      exportData = false,
      dataPath = null,
      showDimensions = true,
      showLabels = true,
      dpi = 300
    } = options;

    // Validate inputs
    if (!inputPath || !fs.existsSync(inputPath)) {
      return reject(new Error('Input file does not exist'));
    }

    if (!outputPath) {
      return reject(new Error('Output path is required'));
    }

    // Build command arguments
    const scriptPath = path.join(__dirname, 'floor_plan_generator.py');
    const args = [scriptPath, inputPath, '-o', outputPath, '-c', colorScheme, '-d', dpi.toString()];

    if (!showDimensions) {
      args.push('--no-dimensions');
    }

    if (!showLabels) {
      args.push('--no-labels');
    }

    if (generate3D) {
      args.push('--3d');
    }

    if (exportData && dataPath) {
      args.push('--export-data', dataPath);
    }

    // Determine the Python executable based on the OS
    const isWindows = process.platform === 'win32';
    const pythonExecutable = isWindows ? 'python' : 'python3';

    // Log the command being executed for debugging
    console.log(`Executing: ${pythonExecutable} ${args.join(' ')}`);

    // Check if the Python script exists
    if (!fs.existsSync(scriptPath)) {
      return reject(new Error(`Python script not found at ${scriptPath}`));
    }

    // Check if the required Python packages are installed
    const checkPackagesProcess = spawn(pythonExecutable, ['-c', 'import cv2, numpy, matplotlib, PIL']);

    checkPackagesProcess.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error('Required Python packages are not installed. Please run: npm run install-python-deps'));
      }

      // Spawn the Python process
      const pythonProcess = spawn(pythonExecutable, args);

      let stdoutData = '';
      let stderrData = '';

      pythonProcess.stdout.on('data', (data) => {
        const output = data.toString();
        stdoutData += output;
        console.log(`Python stdout: ${output.trim()}`);
      });

      pythonProcess.stderr.on('data', (data) => {
        const output = data.toString();
        stderrData += output;
        console.error(`Python stderr: ${output.trim()}`);
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`Python script exited with code ${code}: ${stderrData}`));
        }

        // Prepare result object
        const result = {
          success: true,
          enhancedFloorPlan: outputPath,
          stdout: stdoutData,
          stderr: stderrData
        };

        // Add 3D visualization path if generated
        if (generate3D) {
          const threeDPath = outputPath.replace('.png', '_3d.png');
          if (fs.existsSync(threeDPath)) {
            result.visualization3D = threeDPath;
          }
        }

        // Add data path if exported
        if (exportData && dataPath && fs.existsSync(dataPath)) {
          result.floorPlanData = dataPath;

          // Read the data file and parse it
          try {
            const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
            result.data = data;
          } catch (err) {
            console.error('Error parsing floor plan data:', err);
          }
        }

        resolve(result);
      });

      pythonProcess.on('error', (err) => {
        reject(new Error(`Failed to start Python process: ${err.message}`));
      });
    });

    checkPackagesProcess.on('error', (err) => {
      reject(new Error(`Failed to check Python packages: ${err.message}`));
    });
  });
}

module.exports = { processFloorPlan };

// Example usage:
/*
const { processFloorPlan } = require('./process_floor_plan');

async function example() {
  try {
    const result = await processFloorPlan({
      inputPath: 'path/to/input.png',
      outputPath: 'path/to/output.png',
      colorScheme: 'blueprint',
      generate3D: true,
      exportData: true,
      dataPath: 'path/to/data.json'
    });

    console.log('Processing successful:', result);
  } catch (error) {
    console.error('Processing failed:', error);
  }
}

example();
*/
