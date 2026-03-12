// Shared type definitions for BuildWise.ai
// These types are used across components and API routes

export interface User {
  id: string
  username: string
  email: string
  first_name?: string
  last_name?: string
  is_admin: boolean
  is_approved: boolean
  saved_designers?: string[]
  saved_materials?: string[]
  created_at: string
  updated_at: string
  last_active?: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description: string
  land_dimensions: {
    length: number
    width: number
    totalArea?: number
  }
  land_unit: string
  budget: number
  currency: string
  location: {
    country: string
    state: string
    city: string
    region?: string
  }
  preferences: {
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
    style?: string
    stories: number
    energyEfficient: boolean
    accessibility: boolean
    outdoorSpace: boolean
  }
  status: "Planning" | "In Progress" | "Completed"
  created_at: string
  updated_at: string
}

export interface FloorPlan {
  id?: string
  project_id: string
  user_id: string
  image_url: string
  ai_prompt: string
  description?: string
  generated_by: "gemini" | "groq" | "template"
  dimensions?: {
    width: number
    length: number
    unit: string
  }
  rooms?: {
    name: string
    area: number
    dimensions?: {
      width: number
      length: number
    }
  }[]
  created_at: string
}

export interface Designer {
  id?: string
  // _id alias for legacy component compatibility
  _id?: string
  name: string
  email: string
  phone: string
  website?: string
  // Supports both array and string specialization
  specialization: string[]
  experience: number
  portfolio?: string[]
  rating?: number
  reviews?: {
    user_id: string
    /** @deprecated use user_id */
    userId?: string
    rating: number
    comment: string
    date: string
  }[]
  location: {
    country: string
    state: string
    city: string
    region?: string
  }
  availability?: boolean
  company?: string
  bio?: string
  address?: string
  imageUrl?: string
  mapsUrl?: string
  projects?: number
  created_at?: string
  updated_at?: string
}

export interface Material {
  id?: string
  // _id alias for legacy component compatibility
  _id?: string
  name: string
  category: string
  description: string
  cost_per_unit: number
  /** @deprecated use cost_per_unit */
  costPerUnit?: number
  unit: string
  currency: string
  sustainability: number
  durability: number
  energy_efficiency: number
  /** @deprecated use energy_efficiency */
  energyEfficiency?: number
  locally_available: boolean
  /** @deprecated use locally_available */
  locallyAvailable?: boolean
  image_url?: string
  /** @deprecated use image_url */
  imageUrl?: string
  supplier?: {
    name: string
    contact: string
    website?: string
  }
  created_at?: string
  updated_at?: string
}

export interface EnergyRecommendation {
  id?: string
  // _id alias for legacy component compatibility
  _id?: string
  title: string
  description: string
  savings_estimate: number
  /** @deprecated use savings_estimate */
  savingsEstimate?: number
  implementation_cost: {
    amount: number
    currency: string
    level: "Low" | "Medium" | "High"
  }
  /** @deprecated use implementation_cost */
  implementationCost?: {
    amount: number
    currency: string
    level: "Low" | "Medium" | "High"
  }
  applicable_regions: string[]
  /** @deprecated use applicable_regions */
  applicableRegions?: string[]
  category: "Insulation" | "Solar" | "HVAC" | "Lighting" | "Water" | "Other"
  image_url?: string
  /** @deprecated use image_url */
  imageUrl?: string
  created_at?: string
  updated_at?: string
}

export interface Region {
  id?: string
  country: string
  country_code: string
  state: string
  state_code?: string
  city: string
  region?: string
  zip_code?: string
  local_currency: string
  local_materials?: string[]
  local_designers?: string[]
  building_codes?: {
    code: string
    description: string
    url?: string
  }[]
  created_at?: string
  updated_at?: string
}

/** AuthUser is the Supabase-based authenticated user shape */
export interface AuthUser {
  id: string
  email: string
  username?: string
  firstName?: string
  first_name?: string
  lastName?: string
  last_name?: string
  is_admin?: boolean
  is_approved?: boolean
  saved_designers?: string[]
  saved_materials?: string[]
}
