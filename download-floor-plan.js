const fs = require('fs');
const path = require('path');
const https = require('https');

// Function to download an image from a URL and save it to a file
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    // Create directory if it doesn't exist
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      // Check if the request was successful
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode} ${response.statusMessage}`));
        return;
      }
      
      // Pipe the image data to the file
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Image downloaded and saved to: ${filepath}`);
        resolve(filepath);
      });
    }).on('error', (err) => {
      // Delete the file if there was an error
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Sample floor plan images to download
const floorPlanImages = [
  {
    url: 'https://cdn.houseplansservices.com/content/o2jdkacgvvh6ssc99jvs7agdpj/w991x660.jpg',
    filename: 'modern-house-floor-plan.jpg'
  },
  {
    url: 'https://cdn.houseplansservices.com/content/gr8du0ksgkb2ahh8f5cn3731i7/w991x660.jpg',
    filename: 'farmhouse-floor-plan.jpg'
  },
  {
    url: 'https://cdn.houseplansservices.com/content/ojlh8ghmqf7srtd7dhk2agc318/w991x660.jpg',
    filename: 'cottage-floor-plan.jpg'
  }
];

// Create a project directory for each floor plan
async function downloadFloorPlans() {
  try {
    for (let i = 0; i < floorPlanImages.length; i++) {
      const image = floorPlanImages[i];
      const projectId = `project-${i + 1}`;
      const projectDir = path.join(process.cwd(), 'public', 'uploads', 'floor-plans', projectId);
      
      // Create project directory
      if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir, { recursive: true });
      }
      
      // Download the image
      const filepath = path.join(projectDir, image.filename);
      await downloadImage(image.url, filepath);
      
      // Create a JSON file with metadata
      const metadata = {
        projectId,
        imageUrl: `/uploads/floor-plans/${projectId}/${image.filename}`,
        description: `Floor plan for ${image.filename.replace('.jpg', '')}`,
        dimensions: {
          width: 50,
          length: 40,
          unit: 'ft'
        },
        rooms: [
          { name: 'Living Room', area: 320, dimensions: { width: 20, length: 16 } },
          { name: 'Kitchen', area: 224, dimensions: { width: 14, length: 16 } },
          { name: 'Dining Area', area: 144, dimensions: { width: 12, length: 12 } },
          { name: 'Master Bedroom', area: 224, dimensions: { width: 16, length: 14 } },
          { name: 'Bedroom 2', area: 144, dimensions: { width: 12, length: 12 } },
          { name: 'Bedroom 3', area: 144, dimensions: { width: 12, length: 12 } },
          { name: 'Master Bathroom', area: 80, dimensions: { width: 10, length: 8 } },
          { name: 'Bathroom 2', area: 48, dimensions: { width: 8, length: 6 } }
        ],
        createdAt: new Date().toISOString()
      };
      
      fs.writeFileSync(
        path.join(projectDir, 'metadata.json'), 
        JSON.stringify(metadata, null, 2)
      );
      
      console.log(`Created metadata for ${projectId}`);
    }
    
    console.log('All floor plans downloaded successfully!');
    
    // Print the URLs that would be stored in the database
    console.log('\nFloor Plan URLs (to be stored in the database):');
    floorPlanImages.forEach((image, index) => {
      const projectId = `project-${index + 1}`;
      console.log(`${index + 1}. /uploads/floor-plans/${projectId}/${image.filename}`);
    });
    
  } catch (error) {
    console.error('Error downloading floor plans:', error);
  }
}

// Run the download function
downloadFloorPlans();
