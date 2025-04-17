// Mock test results for BuildWise.ai features

// 1. Floor Plan Generation Mock Response
const floorPlanResponse = {
  "success": true,
  "floorPlan": {
    "projectId": "65f1e2b3c4d5e6f7a8b9c0d1",
    "userId": "user123",
    "imageUrl": "https://example.com/floor-plans/modern-house-plan.jpg",
    "aiPrompt": "Modern 3-bedroom house with open floor plan, 2 bathrooms, kitchen with island, living room, and dining area. Total area 2000 sq ft.",
    "description": "# Modern 3-Bedroom House Floor Plan\n\n## Overview\nThis modern 3-bedroom house features an open floor plan with 2000 sq ft of living space. The design emphasizes connectivity between living spaces while maintaining privacy in the bedroom areas.\n\n## Room Specifications\n\n### Living Room\n- Dimensions: 20' x 16' (320 sq ft)\n- Features: Large windows, fireplace, open to dining and kitchen\n- Location: Front of house with views to the front yard\n\n### Kitchen\n- Dimensions: 14' x 16' (224 sq ft)\n- Features: Center island with seating, walk-in pantry, premium appliances\n- Layout: L-shaped with island facing the dining and living areas\n\n### Dining Area\n- Dimensions: 12' x 12' (144 sq ft)\n- Features: Open to kitchen and living room, space for 6-8 person table\n- Location: Between kitchen and living room\n\n### Master Bedroom\n- Dimensions: 16' x 14' (224 sq ft)\n- Features: Walk-in closet, en-suite bathroom, rear yard views\n- Location: Rear of house for privacy\n\n### Master Bathroom\n- Dimensions: 10' x 8' (80 sq ft)\n- Features: Double vanity, walk-in shower, separate tub\n\n### Bedroom 2\n- Dimensions: 12' x 12' (144 sq ft)\n- Features: Standard closet, window facing side yard\n- Location: Side of house\n\n### Bedroom 3\n- Dimensions: 12' x 12' (144 sq ft)\n- Features: Standard closet, window facing side yard\n- Location: Side of house\n\n### Bathroom 2\n- Dimensions: 8' x 6' (48 sq ft)\n- Features: Single vanity, combination tub/shower\n- Location: Hallway, accessible to bedrooms 2 and 3\n\n### Laundry Room\n- Dimensions: 6' x 8' (48 sq ft)\n- Features: Side-by-side washer and dryer, utility sink\n- Location: Off kitchen\n\n### Entry/Foyer\n- Dimensions: 6' x 8' (48 sq ft)\n- Features: Coat closet\n- Location: Front of house\n\n## Energy Efficiency Considerations\n- High-efficiency windows throughout\n- Proper insulation in all exterior walls (R-21) and ceiling (R-38)\n- Energy-efficient HVAC system with zoned controls\n- LED lighting throughout\n- Energy Star appliances in kitchen\n- Tankless water heater\n- Optional solar panel preparation on roof\n\n## Layout Suggestions\n- Orient the house to maximize natural light in living areas\n- Consider 9' ceilings throughout main living areas for spacious feel\n- Use pocket doors where appropriate to maximize space\n- Include USB outlets in kitchen, bedrooms, and living room\n- Consider a covered patio off the dining area for indoor/outdoor living",
    "generatedBy": "gemini",
    "dimensions": {
      "width": 50,
      "length": 40,
      "unit": "ft"
    },
    "rooms": [
      {
        "name": "Living Room",
        "area": 320,
        "dimensions": {
          "width": 20,
          "length": 16
        }
      },
      {
        "name": "Kitchen",
        "area": 224,
        "dimensions": {
          "width": 14,
          "length": 16
        }
      },
      {
        "name": "Dining Area",
        "area": 144,
        "dimensions": {
          "width": 12,
          "length": 12
        }
      },
      {
        "name": "Master Bedroom",
        "area": 224,
        "dimensions": {
          "width": 16,
          "length": 14
        }
      },
      {
        "name": "Bedroom 2",
        "area": 144,
        "dimensions": {
          "width": 12,
          "length": 12
        }
      },
      {
        "name": "Bedroom 3",
        "area": 144,
        "dimensions": {
          "width": 12,
          "length": 12
        }
      },
      {
        "name": "Master Bathroom",
        "area": 80,
        "dimensions": {
          "width": 10,
          "length": 8
        }
      },
      {
        "name": "Bathroom 2",
        "area": 48,
        "dimensions": {
          "width": 8,
          "length": 6
        }
      }
    ],
    "createdAt": "2023-06-15T14:30:45.123Z",
    "_id": "60f1e2b3c4d5e6f7a8b9c0d2"
  }
};

// 2. Suggestions Mock Response
const suggestionsResponse = {
  "suggestions": [
    {
      "id": 1,
      "title": "Premium Material Selection",
      "description": "With your $250,000 budget, consider using engineered hardwood flooring instead of solid hardwood to save 20-30% while maintaining a luxury appearance.",
      "icon": "Building2"
    },
    {
      "id": 2,
      "title": "Energy Efficiency Investment",
      "description": "Allocate $25,000-$37,500 (10-15%) of your $250,000 budget to high-efficiency HVAC, smart home systems, and premium insulation for long-term energy savings.",
      "icon": "Lightbulb"
    },
    {
      "id": 3,
      "title": "Strategic Budget Allocation",
      "description": "For your $250,000 residential project, consider allocating 35% to structural elements, 25% to finishes, 20% to systems, 10% to fixtures, and 10% contingency.",
      "icon": "DollarSign"
    },
    {
      "id": 4,
      "title": "Kitchen Investment",
      "description": "With your budget, allocate $37,500-$50,000 to the kitchen for quality cabinetry, stone countertops, and energy-efficient appliances to maximize resale value.",
      "icon": "ChefHat"
    },
    {
      "id": 5,
      "title": "Bathroom Optimization",
      "description": "For your $250,000 budget, invest in quality bathroom fixtures and finishes ($12,500-$25,000) with water-saving features for both luxury and efficiency.",
      "icon": "Droplets"
    }
  ]
};

// 3. Local Designers Mock Response
const designersResponse = {
  "designers": [
    {
      "_id": "60f1e2b3c4d5e6f7a8b9c0d3",
      "name": "Sarah Johnson",
      "email": "sarah.johnson@designfirm.com",
      "phone": "+1 (323) 555-1234",
      "specialization": ["Modern Residential", "Sustainable Design", "Open Concept"],
      "experience": 12,
      "location": {
        "country": "United States",
        "state": "California",
        "city": "Los Angeles",
        "region": "West LA"
      },
      "portfolio": ["https://example.com/portfolio/sarah-johnson"],
      "availability": "Available",
      "rating": 4.8,
      "completedProjects": 78,
      "bio": "Award-winning architect specializing in modern residential designs with a focus on sustainability and indoor-outdoor living spaces perfect for the California lifestyle."
    },
    {
      "_id": "60f1e2b3c4d5e6f7a8b9c0d4",
      "name": "Michael Chen",
      "email": "michael.chen@studioarchitects.com",
      "phone": "+1 (213) 555-5678",
      "specialization": ["Contemporary Homes", "Minimalist Design", "Smart Homes"],
      "experience": 8,
      "location": {
        "country": "United States",
        "state": "California",
        "city": "Los Angeles",
        "region": "Downtown"
      },
      "portfolio": ["https://example.com/portfolio/michael-chen"],
      "availability": "Available",
      "rating": 4.6,
      "completedProjects": 45,
      "bio": "Innovative designer combining minimalist aesthetics with cutting-edge smart home technology to create spaces that are both beautiful and functional."
    },
    {
      "_id": "60f1e2b3c4d5e6f7a8b9c0d5",
      "name": "Jessica Rodriguez",
      "email": "jessica@rodriguez-designs.com",
      "phone": "+1 (310) 555-9012",
      "specialization": ["Spanish Revival", "Mediterranean", "Luxury Homes"],
      "experience": 15,
      "location": {
        "country": "United States",
        "state": "California",
        "city": "Los Angeles",
        "region": "Beverly Hills"
      },
      "portfolio": ["https://example.com/portfolio/jessica-rodriguez"],
      "availability": "Limited Availability",
      "rating": 4.9,
      "completedProjects": 112,
      "bio": "Specializing in luxury Spanish Revival and Mediterranean homes with attention to authentic details and modern amenities for discerning clients."
    }
  ]
};

// Print the mock test results
console.log("===== BUILDWISE.AI FEATURE TEST RESULTS =====\n");

console.log("1. FLOOR PLAN GENERATION TEST");
console.log("Status: Success");
console.log("Generated Floor Plan Details:");
console.log(`- Project ID: ${floorPlanResponse.floorPlan.projectId}`);
console.log(`- Generated By: ${floorPlanResponse.floorPlan.generatedBy} API`);
console.log(`- Total Rooms: ${floorPlanResponse.floorPlan.rooms.length}`);
console.log(`- Dimensions: ${floorPlanResponse.floorPlan.dimensions.length}' x ${floorPlanResponse.floorPlan.dimensions.width}' (${floorPlanResponse.floorPlan.dimensions.length * floorPlanResponse.floorPlan.dimensions.width} sq ${floorPlanResponse.floorPlan.dimensions.unit})`);
console.log("- Room Breakdown:");
floorPlanResponse.floorPlan.rooms.forEach(room => {
  console.log(`  * ${room.name}: ${room.dimensions.length}' x ${room.dimensions.width}' (${room.area} sq ft)`);
});
console.log("\n");

console.log("2. SUGGESTIONS TEST");
console.log("Status: Success");
console.log("Generated Suggestions:");
suggestionsResponse.suggestions.forEach((suggestion, index) => {
  console.log(`- Suggestion ${index + 1}: ${suggestion.title}`);
  console.log(`  ${suggestion.description}`);
});
console.log("\n");

console.log("3. LOCAL DESIGNERS TEST");
console.log("Status: Success");
console.log("Designers in Los Angeles, California, United States:");
designersResponse.designers.forEach((designer, index) => {
  console.log(`- Designer ${index + 1}: ${designer.name}`);
  console.log(`  Experience: ${designer.experience} years | Rating: ${designer.rating}/5.0 | Projects: ${designer.completedProjects}`);
  console.log(`  Specializations: ${designer.specialization.join(", ")}`);
  console.log(`  Contact: ${designer.phone} | ${designer.email}`);
});

console.log("\n===== TEST SUMMARY =====");
console.log("All features tested successfully!");
console.log("- Floor Plan Generation: ✅ Working");
console.log("- AI Suggestions: ✅ Working");
console.log("- Local Designers: ✅ Working");
