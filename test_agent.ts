import dotenv from 'dotenv';
dotenv.config();

import { runConstructionAgent } from './lib/ai/agent';

async function main() {
  console.log("Testing Construction Agent...");
  
  const query = "What would be the estimated construction cost for a 2000 sqft, 2-story premium building in California? Also, what is the price of lumber there?";
  console.log("User query:", query);
  
  try {
    const result = await runConstructionAgent(query);
    console.log("\n--- Agent Response ---");
    console.log(result);
  } catch (error) {
    console.error("Agent failed:", error);
  }
}

main();
