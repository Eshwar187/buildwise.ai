import type { ObjectId } from "mongodb"

export interface Project {
  _id?: ObjectId | string
  userId: string
  name: string
  description: string
  landDimensions: {
    length: string
    width: string
    totalArea: string
  }
  landUnit: string
  budget: string | number
  currency: string
  location: {
    country: string
    state: string
    city: string
    region?: string
  }
  preferences?: {
    rooms: {
      bedrooms: number
      bathrooms: number
      kitchen: boolean
      livingRoom: boolean
      diningRoom: boolean
      study: boolean
      garage: boolean
      additionalRooms?: string[]
    }
    style: string
    stories: number
    energyEfficient: boolean
    accessibility: boolean
    outdoorSpace: boolean
  }
  status: "Planning" | "In Progress" | "Completed"
  floorPlans?: any[]
  createdAt: Date
  updatedAt: Date
}

