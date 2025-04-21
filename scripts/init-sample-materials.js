// Script to initialize sample materials in MongoDB
require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection URI
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/buildwise';

// Sample materials data
const sampleMaterials = [
  {
    name: 'Premium Hardwood Flooring',
    category: 'Flooring',
    description: 'High-quality hardwood flooring with excellent durability and a beautiful finish.',
    costPerUnit: 8.5,
    unit: 'sq ft',
    currency: 'USD',
    sustainability: 7,
    durability: 9,
    energyEfficiency: 6,
    locallyAvailable: true,
    imageUrl: '/images/materials/hardwood-floor.jpg',
    supplier: {
      name: 'Premium Flooring Co.',
      contact: 'contact@premiumflooring.com',
      website: 'https://premiumflooring.example.com'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Energy-Efficient Windows',
    category: 'Windows',
    description: 'Double-glazed windows with excellent insulation properties to reduce energy costs.',
    costPerUnit: 450,
    unit: 'unit',
    currency: 'USD',
    sustainability: 8,
    durability: 8,
    energyEfficiency: 9,
    locallyAvailable: true,
    imageUrl: '/images/materials/window.jpg',
    supplier: {
      name: 'EcoWindows Inc.',
      contact: 'sales@ecowindows.com',
      website: 'https://ecowindows.example.com'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Eco-Friendly Insulation',
    category: 'Insulation',
    description: 'Environmentally friendly insulation made from recycled materials with excellent thermal properties.',
    costPerUnit: 1.2,
    unit: 'sq ft',
    currency: 'USD',
    sustainability: 10,
    durability: 7,
    energyEfficiency: 9,
    locallyAvailable: true,
    imageUrl: '/images/materials/insulation.jpg',
    supplier: {
      name: 'Green Insulation Co.',
      contact: 'info@greeninsulation.com',
      website: 'https://greeninsulation.example.com'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Solar Roof Panels',
    category: 'Roofing',
    description: 'High-efficiency solar panels integrated into roofing materials for energy generation.',
    costPerUnit: 22,
    unit: 'sq ft',
    currency: 'USD',
    sustainability: 10,
    durability: 8,
    energyEfficiency: 10,
    locallyAvailable: false,
    imageUrl: '/images/materials/solar-roof.jpg',
    supplier: {
      name: 'SolarTech Roofing',
      contact: 'sales@solartechroofing.com',
      website: 'https://solartechroofing.example.com'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Reinforced Concrete',
    category: 'Foundation',
    description: 'High-strength reinforced concrete for durable foundations and structural elements.',
    costPerUnit: 125,
    unit: 'cubic yard',
    currency: 'USD',
    sustainability: 5,
    durability: 10,
    energyEfficiency: 7,
    locallyAvailable: true,
    imageUrl: '/images/materials/concrete.jpg',
    supplier: {
      name: 'Strong Foundations Inc.',
      contact: 'info@strongfoundations.com',
      website: 'https://strongfoundations.example.com'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Smart Home Wiring System',
    category: 'Electrical',
    description: 'Comprehensive wiring system designed for smart home integration and energy management.',
    costPerUnit: 3.5,
    unit: 'sq ft',
    currency: 'USD',
    sustainability: 7,
    durability: 8,
    energyEfficiency: 9,
    locallyAvailable: true,
    imageUrl: '/images/materials/wiring.jpg',
    supplier: {
      name: 'Smart Electrical Solutions',
      contact: 'support@smartelectrical.com',
      website: 'https://smartelectrical.example.com'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Bamboo Flooring',
    category: 'Flooring',
    description: 'Sustainable bamboo flooring that is both eco-friendly and stylish.',
    costPerUnit: 5.75,
    unit: 'sq ft',
    currency: 'USD',
    sustainability: 9,
    durability: 7,
    energyEfficiency: 6,
    locallyAvailable: true,
    imageUrl: '/images/materials/hardwood-floor.jpg',
    supplier: {
      name: 'EcoFlooring Solutions',
      contact: 'sales@ecoflooring.com',
      website: 'https://ecoflooring.example.com'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Low-VOC Paint',
    category: 'Finishes',
    description: 'Environmentally friendly paint with low volatile organic compounds for better indoor air quality.',
    costPerUnit: 45,
    unit: 'gallon',
    currency: 'USD',
    sustainability: 9,
    durability: 7,
    energyEfficiency: 5,
    locallyAvailable: true,
    imageUrl: '/images/materials/concrete.jpg',
    supplier: {
      name: 'EcoPaint Inc.',
      contact: 'info@ecopaint.com',
      website: 'https://ecopaint.example.com'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function initializeSampleMaterials() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const materialsCollection = db.collection('materials');

    // Check if materials already exist
    const existingCount = await materialsCollection.countDocuments();
    if (existingCount > 0) {
      console.log(`Materials collection already has ${existingCount} documents. Skipping initialization.`);
      return;
    }

    // Insert sample materials
    const result = await materialsCollection.insertMany(sampleMaterials);
    console.log(`${result.insertedCount} sample materials inserted successfully`);

  } catch (error) {
    console.error('Error initializing sample materials:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the initialization
initializeSampleMaterials().catch(console.error);
