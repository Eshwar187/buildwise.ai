import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { prompt, budget, currency = "USD" } = body

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Format currency based on selected currency
    const formatCurrency = (value: number) => {
      if (currency === "INR") {
        // Convert USD to INR (approximate exchange rate)
        const inrValue = value * 75
        return new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(inrValue)
      } else {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(value)
      }
    }

    // In a production environment, we would call Hugging Face API here
    // const response = await fetch('https://api-inference.huggingface.co/models/your-model', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     inputs: `Generate material recommendations for the following construction project with a budget of ${formatCurrency(budget)}: ${prompt}`,
    //   }),
    // });
    // const result = await response.json();

    // For now, we'll generate a response based on the prompt and budget
    const budgetNum = Number.parseInt(budget) || 100000
    const lowRange = Math.floor(budgetNum * 0.85)
    const highRange = Math.floor(budgetNum * 1.1)

    // Extract some keywords from the prompt to personalize the response
    const hasModern = prompt.toLowerCase().includes("modern")
    const hasEcoFriendly = prompt.toLowerCase().includes("eco") || prompt.toLowerCase().includes("sustainable")
    const hasLuxury = prompt.toLowerCase().includes("luxury") || prompt.toLowerCase().includes("high-end")
    const sqFootage = prompt.match(/(\d+)\s*sq\s*ft/i)
    const footage = sqFootage ? Number.parseInt(sqFootage[1]) : 2000

    let result = `Based on your project description and budget of ${formatCurrency(budgetNum)}, here are the recommended materials:\n\n`

    // Foundation
    result += `Foundation:\n`
    result += `- Reinforced concrete (${hasLuxury ? "5000" : "4000"} PSI)\n`
    result += `- ${hasEcoFriendly ? "Eco-friendly " : ""}Waterproofing membrane\n`
    result += `- Drainage system with ${hasLuxury ? "premium" : "standard"} gravel\n\n`

    // Structural
    result += `Structural:\n`
    if (budgetNum > 300000 || hasLuxury) {
      result += `- Steel I-beams (ASTM A992)\n`
      result += `- Engineered wood joists\n`
      result += `- Insulated concrete forms (ICF)\n\n`
    } else {
      result += `- Wood framing (${hasEcoFriendly ? "FSC-certified" : "standard"} lumber)\n`
      result += `- Engineered floor joists\n`
      result += `- Concrete masonry units\n\n`
    }

    // Exterior
    result += `Exterior:\n`
    if (hasModern) {
      result += `- Fiber cement siding with modern profile\n`
      result += `- Large format windows with minimal frames\n`
      result += `- ${budgetNum > 200000 ? "Standing seam metal" : "Architectural shingle"} roofing\n\n`
    } else if (hasLuxury) {
      result += `- Natural stone veneer\n`
      result += `- Custom wood or aluminum-clad windows\n`
      result += `- Slate or clay tile roofing\n\n`
    } else {
      result += `- ${hasEcoFriendly ? "Recycled content" : "Vinyl"} siding\n`
      result += `- Energy-efficient double-glazed windows\n`
      result += `- Asphalt shingle roofing\n\n`
    }

    // Interior
    result += `Interior:\n`
    if (hasLuxury) {
      result += `- Custom drywall finishes\n`
      result += `- Solid hardwood flooring\n`
      result += `- Natural stone tile (bathrooms)\n`
      result += `- Custom cabinetry\n\n`
    } else if (hasModern) {
      result += `- Smooth-finish drywall\n`
      result += `- Engineered hardwood or luxury vinyl plank flooring\n`
      result += `- Large format porcelain tile (bathrooms)\n`
      result += `- Frameless cabinetry\n\n`
    } else {
      result += `- Standard drywall (5/8" fire-rated where required)\n`
      result += `- ${hasEcoFriendly ? "Bamboo or cork" : "Laminate or vinyl"} flooring\n`
      result += `- Ceramic tile (bathrooms)\n`
      result += `- Semi-custom cabinetry\n\n`
    }

    // Systems
    result += `Systems:\n`
    if (budgetNum > 300000 || hasEcoFriendly) {
      result += `- High-efficiency HVAC with zoning\n`
      result += `- ${hasEcoFriendly ? "Solar-ready" : "Smart"} electrical system\n`
      result += `- Water-saving plumbing fixtures\n\n`
    } else {
      result += `- Standard efficiency HVAC system\n`
      result += `- Code-compliant electrical system\n`
      result += `- Standard plumbing fixtures\n\n`
    }

    // Cost estimate
    const costPerSqFt = hasLuxury ? 250 : hasModern ? 200 : 150
    const estimatedCost = footage * costPerSqFt
    const adjustedLow = Math.min(lowRange, estimatedCost * 0.9)
    const adjustedHigh = Math.max(highRange, estimatedCost * 1.1)

    result += `Estimated total cost: ${formatCurrency(adjustedLow)} - ${formatCurrency(adjustedHigh)}\n`

    if (adjustedHigh > budgetNum) {
      result += `\nNote: This estimate exceeds your budget by approximately ${formatCurrency(adjustedHigh - budgetNum)}. Consider reducing the square footage or selecting more economical finishes to align with your budget.`
    } else if (adjustedHigh < budgetNum * 0.9) {
      result += `\nNote: This estimate is below your stated budget. You may consider upgrading certain materials or adding features like ${hasModern ? "smart home technology" : hasEcoFriendly ? "solar panels" : "higher-end finishes"}.`
    }

    // Add currency-specific notes
    if (currency === "INR") {
      result += `\n\nNote for Indian market: Prices may vary significantly between metro and non-metro areas. Labor costs in India typically account for 30-40% of the total budget, compared to 50-60% in the US market.`
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error("Error generating materials:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

