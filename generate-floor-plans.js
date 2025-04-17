const fs = require('fs');
const path = require('path');

// Function to ensure directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Create base directories
const publicDir = path.join(process.cwd(), 'public');
const uploadsDir = path.join(publicDir, 'uploads');
const floorPlansDir = path.join(uploadsDir, 'floor-plans');

ensureDirectoryExists(publicDir);
ensureDirectoryExists(uploadsDir);
ensureDirectoryExists(floorPlansDir);

// Sample floor plan data
const floorPlans = [
  {
    id: 'project-1',
    name: 'Modern House Floor Plan',
    style: 'modern',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 2200
  },
  {
    id: 'project-2',
    name: 'Farmhouse Floor Plan',
    style: 'farmhouse',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2800
  },
  {
    id: 'project-3',
    name: 'Cottage Floor Plan',
    style: 'cottage',
    bedrooms: 2,
    bathrooms: 1,
    sqft: 1500
  }
];

// Create a simple SVG floor plan
function createFloorPlanSVG(plan) {
  // Create a simple SVG representation of a floor plan
  const width = 800;
  const height = 600;
  
  // Generate a simple house outline based on the style
  let houseShape = '';
  
  if (plan.style === 'modern') {
    // Modern house - rectangular with flat roof
    houseShape = `
      <rect x="100" y="100" width="600" height="400" fill="none" stroke="#333" stroke-width="3" />
      <line x1="100" y1="100" x2="700" y2="100" stroke="#333" stroke-width="5" />
    `;
  } else if (plan.style === 'farmhouse') {
    // Farmhouse - rectangular with pitched roof
    houseShape = `
      <rect x="100" y="150" width="600" height="350" fill="none" stroke="#333" stroke-width="3" />
      <polygon points="100,150 400,50 700,150" fill="none" stroke="#333" stroke-width="3" />
    `;
  } else if (plan.style === 'cottage') {
    // Cottage - smaller with pitched roof
    houseShape = `
      <rect x="150" y="200" width="500" height="300" fill="none" stroke="#333" stroke-width="3" />
      <polygon points="150,200 400,100 650,200" fill="none" stroke="#333" stroke-width="3" />
    `;
  }
  
  // Add some rooms based on the number of bedrooms
  let rooms = '';
  
  // Living area
  rooms += `
    <rect x="120" y="120" width="250" height="200" fill="none" stroke="#666" stroke-width="2" />
    <text x="180" y="220" font-family="Arial" font-size="16">Living Room</text>
  `;
  
  // Kitchen
  rooms += `
    <rect x="370" y="120" width="200" height="150" fill="none" stroke="#666" stroke-width="2" />
    <text x="430" y="195" font-family="Arial" font-size="16">Kitchen</text>
  `;
  
  // Add bedrooms
  for (let i = 0; i < plan.bedrooms; i++) {
    const x = 120 + (i % 2) * 280;
    const y = 320 + Math.floor(i / 2) * 150;
    
    rooms += `
      <rect x="${x}" y="${y}" width="250" height="130" fill="none" stroke="#666" stroke-width="2" />
      <text x="${x + 70}" y="${y + 70}" font-family="Arial" font-size="16">Bedroom ${i + 1}</text>
    `;
  }
  
  // Add bathrooms
  for (let i = 0; i < plan.bathrooms; i++) {
    const x = 570;
    const y = 320 + i * 130;
    
    rooms += `
      <rect x="${x}" y="${y}" width="110" height="110" fill="none" stroke="#666" stroke-width="2" />
      <text x="${x + 20}" y="${y + 60}" font-family="Arial" font-size="14">Bath ${i + 1}</text>
    `;
  }
  
  // Create the complete SVG
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f8f8f8" />
  
  <!-- House outline -->
  ${houseShape}
  
  <!-- Rooms -->
  ${rooms}
  
  <!-- Floor plan title -->
  <text x="400" y="30" font-family="Arial" font-size="20" text-anchor="middle" font-weight="bold">${plan.name}</text>
  <text x="400" y="55" font-family="Arial" font-size="14" text-anchor="middle">${plan.bedrooms} Bedrooms, ${plan.bathrooms} Bathrooms, ${plan.sqft} sq ft</text>
  
  <!-- Scale -->
  <line x1="100" y1="550" x2="300" y2="550" stroke="#333" stroke-width="2" />
  <text x="200" y="570" font-family="Arial" font-size="12" text-anchor="middle">20 ft</text>
</svg>`;
}

// Generate and save floor plans
floorPlans.forEach(plan => {
  // Create project directory
  const projectDir = path.join(floorPlansDir, plan.id);
  ensureDirectoryExists(projectDir);
  
  // Create SVG floor plan
  const svgContent = createFloorPlanSVG(plan);
  const svgFilePath = path.join(projectDir, `${plan.style}-floor-plan.svg`);
  fs.writeFileSync(svgFilePath, svgContent);
  console.log(`Created SVG floor plan: ${svgFilePath}`);
  
  // Create a metadata JSON file
  const metadata = {
    projectId: plan.id,
    name: plan.name,
    style: plan.style,
    imageUrl: `/uploads/floor-plans/${plan.id}/${plan.style}-floor-plan.svg`,
    description: `Floor plan for a ${plan.style} style house with ${plan.bedrooms} bedrooms and ${plan.bathrooms} bathrooms`,
    dimensions: {
      width: 40,
      length: 60,
      unit: 'ft'
    },
    area: plan.sqft,
    bedrooms: plan.bedrooms,
    bathrooms: plan.bathrooms,
    createdAt: new Date().toISOString()
  };
  
  const metadataPath = path.join(projectDir, 'metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`Created metadata: ${metadataPath}`);
});

console.log('\nAll floor plans generated successfully!');
console.log('\nFloor Plan URLs (to be stored in the database):');
floorPlans.forEach(plan => {
  console.log(`- ${plan.id}: /uploads/floor-plans/${plan.id}/${plan.style}-floor-plan.svg`);
});
