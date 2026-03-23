import { getAuthFromCookies } from "@/lib/auth"
import { errorResponse, successResponse } from "@/lib/api"
import { budgetSuggestionSchema } from "@/lib/validation"

export async function GET(request: Request) {
  try {
    const userId = await getAuthFromCookies()

    if (!userId) {
      return errorResponse("Unauthorized", 401, "unauthorized")
    }

    const { searchParams } = new URL(request.url)
    const parsedQuery = budgetSuggestionSchema.safeParse({
      budget: searchParams.get("budget") ?? undefined,
      type: searchParams.get("type") ?? undefined,
      currency: searchParams.get("currency") ?? undefined,
    })

    if (!parsedQuery.success) {
      return errorResponse(
        parsedQuery.error.issues[0]?.message || "Budget parameter is required",
        400,
        "validation_error",
        parsedQuery.error.flatten()
      )
    }
    const { budget: budgetNum, type: buildingType = "residential", currency = "USD" } = parsedQuery.data

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
    //     inputs: `Generate construction suggestions for a ${buildingType} building with a budget of ${formatCurrency(budgetNum)}.`,
    //   }),
    // });
    // const result = await response.json();

    // For now, we'll generate suggestions based on the budget and building type
    let suggestions = []
    const formattedBudget = formatCurrency(budgetNum)

    if (buildingType === "residential") {
      if (budgetNum < 100000) {
        suggestions = [
          {
            id: 1,
            title: "Budget-Friendly Materials",
            description: `For your ${formattedBudget} budget, consider vinyl siding instead of brick, which can save up to 40% on exterior costs.`,
            icon: "Building2",
          },
          {
            id: 2,
            title: "Energy Efficiency",
            description: `With a limited budget of ${formattedBudget}, focus on insulation and energy-efficient windows for long-term savings.`,
            icon: "Lightbulb",
          },
          {
            id: 3,
            title: "Space Optimization",
            description: `Your ${formattedBudget} budget would be most efficient with an open floor plan to maximize usable space.`,
            icon: "DollarSign",
          },
        ]
      } else if (budgetNum < 300000) {
        suggestions = [
          {
            id: 1,
            title: "Quality Materials",
            description: `Your ${formattedBudget} budget allows for mid-range materials like engineered hardwood and quartz countertops.`,
            icon: "Building2",
          },
          {
            id: 2,
            title: "Smart Home Integration",
            description: `Consider allocating ${formatCurrency(budgetNum * 0.1)} of your ${formattedBudget} budget for smart home features.`,
            icon: "Lightbulb",
          },
          {
            id: 3,
            title: "Outdoor Living",
            description: `With ${formattedBudget}, you can include a modest deck or patio to extend your living space outdoors.`,
            icon: "Users",
          },
        ]
      } else {
        suggestions = [
          {
            id: 1,
            title: "Premium Finishes",
            description: `Your ${formattedBudget} budget supports high-end materials like marble, hardwood, and custom cabinetry.`,
            icon: "Building2",
          },
          {
            id: 2,
            title: "Sustainable Systems",
            description: `Consider allocating ${formatCurrency(budgetNum * 0.15)} of your ${formattedBudget} budget for solar panels and rainwater harvesting.`,
            icon: "Lightbulb",
          },
          {
            id: 3,
            title: "Luxury Amenities",
            description: `With ${formattedBudget}, you can include premium features like a home theater, wine cellar, or indoor spa.`,
            icon: "DollarSign",
          },
        ]
      }
    } else if (buildingType === "commercial") {
      if (budgetNum < 200000) {
        suggestions = [
          {
            id: 1,
            title: "Cost-Effective Design",
            description: `For your ${formattedBudget} commercial budget, focus on an efficient layout to maximize usable square footage.`,
            icon: "Building2",
          },
          {
            id: 2,
            title: "Energy Compliance",
            description: `Allocate at least 15% of your ${formattedBudget} budget to meet commercial energy code requirements.`,
            icon: "Lightbulb",
          },
          {
            id: 3,
            title: "Phased Construction",
            description: `Consider a phased approach with your ${formattedBudget} budget to allow for business growth.`,
            icon: "DollarSign",
          },
        ]
      } else {
        suggestions = [
          {
            id: 1,
            title: "Commercial-Grade Materials",
            description: `Your ${formattedBudget} budget allows for durable commercial-grade flooring and fixtures.`,
            icon: "Building2",
          },
          {
            id: 2,
            title: "Smart Building Systems",
            description: `With ${formattedBudget}, implement automated HVAC and lighting systems for long-term operational savings.`,
            icon: "Lightbulb",
          },
          {
            id: 3,
            title: "Customer Experience",
            description: `Allocate 20% of your ${formattedBudget} budget to customer-facing areas to enhance brand perception.`,
            icon: "Users",
          },
        ]
      }
    } else {
      // Default suggestions for other building types
      suggestions = [
        {
          id: 1,
          title: "Material Selection",
          description: `For your ${formattedBudget} budget, prioritize structural materials over cosmetic finishes.`,
          icon: "Building2",
        },
        {
          id: 2,
          title: "Energy Efficiency",
          description: `Invest 10-15% of your ${formattedBudget} budget in energy-efficient systems for long-term savings.`,
          icon: "Lightbulb",
        },
        {
          id: 3,
          title: "Budget Allocation",
          description: `With ${formattedBudget}, allocate 50% to structure, 30% to systems, and 20% to finishes.`,
          icon: "DollarSign",
        },
      ]
    }

    return successResponse({ suggestions })
  } catch (error) {
    console.error("Error generating suggestions:", error)
    return errorResponse("Internal server error", 500)
  }
}

