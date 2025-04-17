const fetch = require('node-fetch');

async function testFloorPlanGeneration() {
  console.log('Testing Floor Plan Generation...');
  try {
    const response = await fetch('http://localhost:3000/api/floor-plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId: '65f1e2b3c4d5e6f7a8b9c0d1',
        prompt: 'Modern 3-bedroom house with open floor plan, 2 bathrooms, kitchen with island, living room, and dining area. Total area 2000 sq ft.'
      }),
    });
    
    const data = await response.json();
    console.log('Floor Plan Generation Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error testing floor plan generation:', error);
  }
}

async function testSuggestions() {
  console.log('Testing Suggestions...');
  try {
    const response = await fetch('http://localhost:3000/api/ai/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        buildingType: 'residential',
        budget: '250000',
        currency: 'USD'
      }),
    });
    
    const data = await response.json();
    console.log('Suggestions Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error testing suggestions:', error);
  }
}

async function testLocalDesigners() {
  console.log('Testing Local Designers...');
  try {
    const response = await fetch('http://localhost:3000/api/designers?country=United%20States&state=California&city=Los%20Angeles', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const data = await response.json();
    console.log('Local Designers Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error testing local designers:', error);
  }
}

async function runTests() {
  await testFloorPlanGeneration();
  await testSuggestions();
  await testLocalDesigners();
}

runTests();
