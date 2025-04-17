"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIChatbotProps {
  budget?: number
  buildingType?: string
}

export function AIChatbot({ budget = 100000, buildingType = "residential" }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currency, setCurrency] = useState("USD")
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  // Initialize chat with welcome message
  useEffect(() => {
    const formattedBudget = formatCurrency(budget)
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: `Hi there! I'm your AI construction assistant. I see you have a budget of ${formattedBudget} for your ${buildingType} project. How can I help you today?`,
        timestamp: new Date(),
      },
    ])
  }, [budget, buildingType, currency])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // In a production environment, we would call an API here
    // try {
    //   const response = await fetch('/api/ai/chat', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       message: input,
    //       budget,
    //       buildingType,
    //       currency
    //     }),
    //   });
    //
    //   if (!response.ok) {
    //     throw new Error('Failed to get AI response');
    //   }
    //
    //   const data = await response.json();
    //
    //   const aiMessage: Message = {
    //     id: Date.now().toString(),
    //     role: "assistant",
    //     content: data.response,
    //     timestamp: new Date(),
    //   };
    //
    //   setMessages((prev) => [...prev, aiMessage]);
    // } catch (error) {
    //   console.error('Error getting AI response:', error);
    //   // Fallback response
    //   // ...
    // } finally {
    //   setIsLoading(false);
    // }

    // Simulate AI response based on user input and budget
    setTimeout(() => {
      let response = ""
      const userInput = input.toLowerCase()
      const formattedBudget = formatCurrency(budget)

      if (userInput.includes("material") || userInput.includes("recommend")) {
        if (budget < 100000) {
          response = `For a ${buildingType} project with your budget of ${formattedBudget}, I recommend focusing on durable but cost-effective materials. Consider vinyl siding, laminate flooring, and stock cabinetry to maximize your budget.`
        } else if (budget < 300000) {
          response = `With your budget of ${formattedBudget}, you can use mid-range materials for your ${buildingType} project. Consider fiber cement siding, engineered hardwood, and semi-custom cabinetry for a good balance of quality and cost.`
        } else {
          response = `Your generous budget of ${formattedBudget} allows for premium materials in your ${buildingType} project. Consider natural stone, solid hardwood flooring, and custom cabinetry for a high-end finish.`
        }
      } else if (userInput.includes("cost") || userInput.includes("price") || userInput.includes("expensive")) {
        response = `For a typical ${buildingType} project with your budget of ${formattedBudget}, you can expect to spend about 40% on structural elements, 30% on systems (electrical, plumbing, HVAC), and 30% on finishes. Would you like a more detailed breakdown for a specific area?`
      } else if (userInput.includes("time") || userInput.includes("schedule") || userInput.includes("long")) {
        response = `A ${buildingType} project with your scope and budget of ${formattedBudget} typically takes 6-12 months from design to completion. The design phase usually takes 2-3 months, permitting 1-2 months, and construction 3-7 months depending on complexity and size.`
      } else if (userInput.includes("energy") || userInput.includes("efficient") || userInput.includes("sustainable")) {
        if (budget < 200000) {
          response = `With your budget of ${formattedBudget}, focus on basic energy efficiency measures like good insulation, Energy Star appliances, and LED lighting. These have the best ROI for energy savings.`
        } else {
          response = `Your budget of ${formattedBudget} allows for significant energy efficiency investments. Consider high-efficiency HVAC, enhanced insulation, triple-pane windows, and possibly solar panels depending on your location.`
        }
      } else if (userInput.includes("inr") || userInput.includes("rupees") || userInput.includes("indian")) {
        const inrBudget = formatCurrency(budget)
        response = `I've updated the currency to Indian Rupees. Your budget of ${inrBudget} would be sufficient for a ${buildingType} project of approximately ${Math.floor(budget / 1500)} square meters in most Indian cities. Construction costs vary significantly between metro and non-metro areas in India.`
      } else {
        const responses = [
          `Based on your ${buildingType} project and budget of ${formattedBudget}, I'd recommend starting with a detailed design phase to maximize value.`,
          `For a ${buildingType} project with your budget of ${formattedBudget}, it's important to prioritize structural integrity and systems before cosmetic finishes.`,
          `With a budget of ${formattedBudget} for your ${buildingType} project, you should allocate about 10-15% for unexpected costs and changes during construction.`,
          `Your ${buildingType} project budget of ${formattedBudget} is in line with typical costs for this type of construction. Would you like specific recommendations for materials or design approaches?`,
        ]
        response = responses[Math.floor(Math.random() * responses.length)]
      }

      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[600px] rounded-md border border-slate-700 bg-slate-900">
      <div className="border-b border-slate-700 p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-medium">AI Construction Assistant</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-400">Currency:</span>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-24 h-8 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="INR">INR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 mb-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <Avatar className={`h-8 w-8 ${message.role === "user" ? "ml-2" : "mr-2"}`}>
                  {message.role === "assistant" ? (
                    <>
                      <AvatarImage src="/placeholder.svg?height=32&width=32&text=AI" />
                      <AvatarFallback className="bg-cyan-900 text-cyan-50">
                        <Bot size={16} />
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="/placeholder.svg?height=32&width=32&text=You" />
                      <AvatarFallback className="bg-slate-700 text-slate-50">
                        <User size={16} />
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.role === "user" ? "bg-cyan-600 text-white" : "bg-slate-700 text-slate-50"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex flex-row">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg?height=32&width=32&text=AI" />
                  <AvatarFallback className="bg-cyan-900 text-cyan-50">
                    <Bot size={16} />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg px-4 py-2 bg-slate-700 text-slate-50">
                  <div className="flex space-x-2">
                    <div
                      className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: "600ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-slate-700 p-4">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about materials, costs, regulations..."
            className="bg-slate-700 border-slate-600 text-white"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Send size={18} />
          </Button>
        </div>
        <div className="mt-2 text-xs text-slate-400">
          <p>
            Suggested questions: "What materials are best for my budget?", "How long will construction take?", "Show
            costs in INR"
          </p>
        </div>
      </div>
    </div>
  )
}

