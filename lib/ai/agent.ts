import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

// Define the calculateConstructionCost tool
const calculateConstructionCost = tool(
  async ({ area, floors, quality, region }) => {
    // Simplified cost calculation logic for demonstration purposes
    let baseRate = 180; // $/sqft base
    if (quality === 'premium') baseRate += 100;
    else if (quality === 'luxury') baseRate += 250;
    
    // Adjust by region (mock data)
    let regionMultiplier = 1.0;
    if (region.toLowerCase().includes('new york') || region.toLowerCase().includes('california')) {
      regionMultiplier = 1.3;
    } else if (region.toLowerCase().includes('texas') || region.toLowerCase().includes('florida')) {
      regionMultiplier = 0.9;
    }

    const costPerSqFt = baseRate * regionMultiplier;
    const totalArea = area * floors;
    const estimatedCost = totalArea * costPerSqFt;

    return `Estimated Construction Cost:
- Base Rate for ${quality} quality: $${baseRate}/sqft
- Region Multiplier (${region}): ${regionMultiplier}x
- Total Area (${area} sqft x ${floors} floors): ${totalArea} sqft
- **Total Estimated Cost**: $${estimatedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  },
  {
    name: "calculateConstructionCost",
    description: "Calculates the estimated construction cost for a building based on area, floors, quality, and region.",
    schema: z.object({
      area: z.number().describe("The footprint area of the building in square feet."),
      floors: z.number().describe("The number of floors in the building."),
      quality: z.enum(['standard', 'premium', 'luxury']).describe("The desired quality of materials and finishes."),
      region: z.string().describe("The state or region where the construction will take place."),
    }),
  }
);

// Define searchMaterialPrices tool
const searchMaterialPrices = tool(
  async ({ category, location }) => {
    // Mock response for material prices based on category and location
    const prices: Record<string, string> = {
      'concrete': '$120 - $150 per cubic yard',
      'lumber': '$400 - $600 per 1000 board feet',
      'steel': '$1,000 - $1,200 per ton',
      'glass': '$15 - $25 per square foot',
    };

    const priceRange = prices[category.toLowerCase()] || 'Price data not available for this material.';
    
    return `Estimated Price for ${category} in ${location}: ${priceRange} (Note: This is an estimated range and prices fluctuate).`;
  },
  {
    name: "searchMaterialPrices",
    description: "Searches for the current estimated prices of construction materials in a specific location.",
    schema: z.object({
      category: z.string().describe("The category of the material (e.g., 'concrete', 'lumber', 'steel', 'glass')."),
      location: z.string().describe("The location to find prices for."),
    }),
  }
);

const tools = [calculateConstructionCost, searchMaterialPrices];

const systemPrompt = `You are an expert construction estimator AI agent.
Your task is to provide accurate construction cost estimates and material pricing based on the user's requirements.
Always use the tools provided to calculate costs or look up material prices.
If a user provides a budget, help them understand if their budget is realistic based on the estimated costs.

Be concise, professional, and helpful. Format your financial numbers clearly.`;

export async function runConstructionAgent(userInput: string): Promise<string> {
  // Initialize the language model
  // Note: Ensure OPENAI_API_KEY is set in your environment variables
  const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0,
  });

  // Create the agent
  const app = createReactAgent({
    llm: model,
    tools,
    messageModifier: systemPrompt,
  });

  // Invoke the agent
  const finalState = await app.invoke({
    messages: [
      {
        role: "user",
        content: userInput,
      },
    ],
  });

  // The final message contains the agent's response
  const finalMessage = finalState.messages[finalState.messages.length - 1];
  
  return finalMessage.content as string;
}
