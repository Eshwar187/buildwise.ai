const fs = require('fs');
const path = require('path');

// Define the floor plan utilities directly since we can't import TypeScript modules in CommonJS
function getFloorPlanTemplates() {
  try {
    const templatesDir = path.join(process.cwd(), 'public', 'uploads', 'floor-plans');

    // Check if directory exists
    if (!fs.existsSync(templatesDir)) {
      console.warn('Floor plan templates directory does not exist');
      return [];
    }

    // Get all project directories
    const projectDirs = fs.readdirSync(templatesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    // Collect template data
    const templates = [];

    for (const projectDir of projectDirs) {
      const projectPath = path.join(templatesDir, projectDir);
      const metadataPath = path.join(projectPath, 'metadata.json');

      // Check if metadata file exists
      if (fs.existsSync(metadataPath)) {
        try {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
          templates.push(metadata);
        } catch (error) {
          console.error(`Error parsing metadata for ${projectDir}:`, error);
        }
      }
    }

    return templates;
  } catch (error) {
    console.error('Error getting floor plan templates:', error);
    return [];
  }
}

function getFloorPlanTemplate(templateId) {
  try {
    const templates = getFloorPlanTemplates();
    return templates.find(template => template.projectId === templateId) || null;
  } catch (error) {
    console.error('Error getting floor plan template:', error);
    return null;
  }
}

function getRandomFloorPlanTemplate() {
  try {
    const templates = getFloorPlanTemplates();
    if (templates.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * templates.length);
    return templates[randomIndex];
  } catch (error) {
    console.error('Error getting random floor plan template:', error);
    return null;
  }
}

// Test the floor plan utilities
console.log('Testing floor plan utilities...');

// Get all templates
const templates = getFloorPlanTemplates();
console.log(`Found ${templates.length} floor plan templates:`);
templates.forEach((template, index) => {
  console.log(`${index + 1}. ${template.style} (${template.projectId}): ${template.imageUrl}`);
});

// Get a random template
const randomTemplate = getRandomFloorPlanTemplate();
if (randomTemplate) {
  console.log('\nRandom template:');
  console.log(`- Style: ${randomTemplate.style}`);
  console.log(`- Project ID: ${randomTemplate.projectId}`);
  console.log(`- Image URL: ${randomTemplate.imageUrl}`);

  // Check if the image file exists
  const imagePath = path.join(process.cwd(), 'public', randomTemplate.imageUrl);
  const imageExists = fs.existsSync(imagePath);
  console.log(`- Image file exists: ${imageExists}`);

  if (imageExists) {
    // Get image file size
    const stats = fs.statSync(imagePath);
    console.log(`- Image file size: ${(stats.size / 1024).toFixed(2)} KB`);
  }
} else {
  console.log('\nNo random template found.');
}

console.log('\nTest completed.');
