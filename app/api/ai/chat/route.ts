import { NextResponse } from 'next/server';
import { runConstructionAgent } from '@/lib/ai/agent';

export async function POST(req: Request) {
  try {
    const { message, budget, buildingType, currency } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Prepare context from budget, building type, and currency
    const context = `
*   **Project type:** ${buildingType || 'Unknown'}
*   **Budget:** ${budget || 'Unknown'} ${currency || 'USD'}
    `;

    // Construct the input query with context
    const inputQuery = `
Given the following context about the user's project:
${context}

User's query: ${message}

Provide a helpful, well-reasoned, and accurate response specifically tailored to their project type and budget considering the above context.
    `.trim();

    console.log("Processing chat request...");
    
    // Run the agent
    const response = await runConstructionAgent(inputQuery);

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('Error in AI chat endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during AI processing' },
      { status: 500 }
    );
  }
}
