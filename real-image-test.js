const fs = require('fs');
const path = require('path');
const https = require('https');
const { v4: uuidv4 } = require('uuid');

// Create a real test that downloads an image and saves it to the public folder
async function downloadAndSaveImage() {
  return new Promise((resolve, reject) => {
    // Sample project ID (in a real app this would come from the database)
    const projectId = uuidv4();
    
    // Create the project directory if it doesn't exist
    const projectDir = path.join(process.cwd(), 'public', 'uploads', 'floor-plan', projectId);
    fs.mkdirSync(projectDir, { recursive: true });
    
    // Generate a unique filename
    const filename = `floor-plan-${uuidv4()}.jpg`;
    const filePath = path.join(projectDir, filename);
    
    // The URL path that would be stored in the database
    const urlPath = `/uploads/floor-plan/${projectId}/${filename}`;
    
    console.log('Downloading sample floor plan image...');
    
    // Download a sample floor plan image from a public URL
    // Using a sample floor plan image from a public domain source
    const imageUrl = 'https://www.houseplans.net/news/wp-content/uploads/2020/01/Cottage_1_floorplan.jpg';
    
    const file = fs.createWriteStream(filePath);
    https.get(imageUrl, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Image downloaded and saved to: ${filePath}`);
        console.log(`URL path for database: ${urlPath}`);
        
        // Check if the file exists and get its size
        const stats = fs.statSync(filePath);
        console.log(`File size: ${stats.size} bytes`);
        
        resolve({
          success: true,
          projectId,
          filePath,
          urlPath,
          fileSize: stats.size
        });
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there was an error
      console.error('Error downloading image:', err.message);
      reject(err);
    });
  });
}

// Function to test the floor plan generation with real image
async function testFloorPlanWithRealImage() {
  console.log('\n===== TESTING FLOOR PLAN WITH REAL IMAGE =====');
  
  try {
    // Download and save a real image
    const imageResult = await downloadAndSaveImage();
    
    if (imageResult.success) {
      console.log('\nFloor Plan Image Successfully Saved:');
      console.log(`- Project ID: ${imageResult.projectId}`);
      console.log(`- File Path: ${imageResult.filePath}`);
      console.log(`- URL Path: ${imageResult.urlPath}`);
      console.log(`- File Size: ${imageResult.fileSize} bytes`);
      
      // Create a simulated floor plan object that would be stored in the database
      const floorPlan = {
        _id: uuidv4(),
        projectId: imageResult.projectId,
        userId: 'user123',
        imageUrl: imageResult.urlPath, // This is the URL path that would be stored in the database
        aiPrompt: 'Modern 3-bedroom house with open floor plan, 2 bathrooms, kitchen with island, living room, and dining area.',
        description: 'A beautiful modern home with open concept living...',
        generatedBy: 'gemini',
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
        createdAt: new Date()
      };
      
      console.log('\nFloor Plan Object (would be stored in MongoDB):');
      console.log(JSON.stringify(floorPlan, null, 2));
      
      return {
        success: true,
        floorPlan,
        imageResult
      };
    } else {
      console.log('❌ Failed to save image');
      return { success: false };
    }
  } catch (error) {
    console.error('Error in test:', error);
    return { success: false, error };
  }
}

// Run the test
testFloorPlanWithRealImage().then(result => {
  if (result.success) {
    console.log('\n===== TEST SUMMARY =====');
    console.log('✅ Real image successfully downloaded and saved to public folder');
    console.log('✅ Floor plan object created with correct image URL');
    console.log('\nTo view the image, you can open this URL in your browser:');
    console.log(`http://localhost:3000${result.imageResult.urlPath}`);
  } else {
    console.log('\n===== TEST SUMMARY =====');
    console.log('❌ Test failed');
  }
});
