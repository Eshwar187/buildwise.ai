import { ObjectId } from "mongodb"
import { connectToDatabase } from "./mongodb"

// User model
export interface User {
  _id?: ObjectId
  clerkId: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  isAdmin: boolean
  isAdminApproved: boolean
  savedDesigners?: string[] // Array of designer IDs
  savedMaterials?: string[] // Array of material IDs
  createdAt: Date
  updatedAt: Date
  lastActive: Date
}

// Project model
export interface Project {
  _id?: ObjectId
  userId: string
  name: string
  description: string
  landDimensions: {
    length: number
    width: number
    totalArea?: number
  }
  landUnit: string
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
  floorPlans?: FloorPlan[]
  designerRecommendations?: string[] // Array of designer IDs
  materialRecommendations?: string[] // Array of material IDs
  energyRecommendations?: string[] // Array of energy recommendation IDs
  createdAt: Date
  updatedAt: Date
}

// Floor Plan model
export interface FloorPlan {
  _id?: ObjectId
  projectId: string
  userId: string
  imageUrl: string
  aiPrompt: string
  description?: string
  generatedBy: "gemini" | "groq" | "template"
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
  createdAt: Date
}

// Designer model
export interface Designer {
  _id?: ObjectId
  name: string
  email: string
  phone: string
  website?: string
  specialization: string[]
  experience: number // years
  portfolio?: string[] // URLs
  rating?: number
  reviews?: {
    userId: string
    rating: number
    comment: string
    date: Date
  }[]
  location: {
    country: string
    state: string
    city: string
    region?: string
  }
  availability: boolean
  createdAt: Date
  updatedAt: Date
}

// Building Material model
export interface Material {
  _id?: ObjectId
  name: string
  category: string
  description: string
  costPerUnit: number
  unit: string
  currency: string
  sustainability: number // 1-10 rating
  durability: number // 1-10 rating
  energyEfficiency: number // 1-10 rating
  locallyAvailable: boolean
  imageUrl?: string
  supplier?: {
    name: string
    contact: string
    website?: string
  }
  createdAt: Date
  updatedAt: Date
}

// Energy Recommendation model
export interface EnergyRecommendation {
  _id?: ObjectId
  title: string
  description: string
  savingsEstimate: number // percentage
  implementationCost: {
    amount: number
    currency: string
    level: "Low" | "Medium" | "High"
  }
  applicableRegions: string[] // country codes
  category: "Insulation" | "Solar" | "HVAC" | "Lighting" | "Water" | "Other"
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

// Verification Code model
export interface VerificationCode {
  _id?: ObjectId
  userId: string
  email: string
  code: string
  expiresAt: Date
  createdAt: Date
}

// Admin Request model
export interface AdminRequest {
  _id?: ObjectId
  clerkId: string
  username: string
  email: string
  reason: string
  status: "pending" | "approved" | "denied"
  approvalToken: string
  password?: string // Added for storing password hash
  createdAt: Date
  updatedAt: Date
}

// Region model
export interface Region {
  _id?: ObjectId
  country: string
  countryCode: string
  state: string
  stateCode?: string
  city: string
  region?: string
  zipCode?: string
  localCurrency: string
  localMaterials?: string[] // Array of material IDs
  localDesigners?: string[] // Array of designer IDs
  buildingCodes?: {
    code: string
    description: string
    url?: string
  }[]
  climateZone?: string
  createdAt: Date
  updatedAt: Date
}

// User model functions
export async function createUser(userData: Omit<User, "_id" | "createdAt" | "updatedAt" | "lastActive">) {
  const { db } = await connectToDatabase()

  const now = new Date()
  const user = {
    ...userData,
    createdAt: now,
    updatedAt: now,
    lastActive: now,
  }

  const result = await db.collection("users").insertOne(user)
  return { ...user, _id: result.insertedId }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    const { db } = await connectToDatabase()
    return db.collection("users").findOne({ clerkId })
  } catch (error) {
    console.error("Error getting user by clerkId:", error)
    return null
  }
}

export async function updateUserLastActive(clerkId: string) {
  const { db } = await connectToDatabase()
  const now = new Date()

  await db.collection("users").updateOne({ clerkId }, { $set: { lastActive: now, updatedAt: now } })
}

// Project model functions
export async function createProject(projectData: Omit<Project, "_id" | "createdAt" | "updatedAt">) {
  const { db } = await connectToDatabase()

  const now = new Date()
  const project = {
    ...projectData,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection("projects").insertOne(project)
  return { ...project, _id: result.insertedId }
}

export async function getProjectsByUserId(userId: string) {
  try {
    const { db } = await connectToDatabase()
    return db.collection("projects").find({ userId }).sort({ createdAt: -1 }).toArray()
  } catch (error) {
    console.error("Error getting projects by userId:", error)
    return []
  }
}

export async function getProjectById(projectId: string) {
  const { db } = await connectToDatabase()
  try {
    return db.collection("projects").findOne({ _id: new ObjectId(projectId) })
  } catch (error) {
    console.error("Error converting projectId to ObjectId:", error)
    return null
  }
}

export async function getAllProjects() {
  const { db } = await connectToDatabase()
  return db.collection("projects").find().sort({ createdAt: -1 }).toArray()
}

export async function deleteProject(projectId: string) {
  const { db } = await connectToDatabase()
  try {
    return db.collection("projects").deleteOne({ _id: new ObjectId(projectId) })
  } catch (error) {
    console.error("Error converting projectId to ObjectId:", error)
    return { deletedCount: 0 }
  }
}

// Floor Plan model functions
export async function createFloorPlan(floorPlanData: Omit<FloorPlan, "_id" | "createdAt">) {
  const { db } = await connectToDatabase()

  const floorPlan = {
    ...floorPlanData,
    createdAt: new Date(),
  }

  const result = await db.collection("floorPlans").insertOne(floorPlan)

  // Update the project with the new floor plan
  try {
    await db
      .collection("projects")
      .updateOne(
        { _id: new ObjectId(floorPlanData.projectId) },
        { $push: { floorPlans: { ...floorPlan, _id: result.insertedId } } },
      )
  } catch (error) {
    console.error("Error updating project with floor plan:", error)
  }

  return { ...floorPlan, _id: result.insertedId }
}

// Verification Code model functions
export async function createVerificationCode(verificationData: Omit<VerificationCode, "_id" | "createdAt">) {
  const { db } = await connectToDatabase()

  const verificationCode = {
    ...verificationData,
    createdAt: new Date(),
  }

  const result = await db.collection("verificationCodes").insertOne(verificationCode)
  return { ...verificationCode, _id: result.insertedId }
}

export async function getVerificationCode(email: string, code: string) {
  const { db } = await connectToDatabase()
  return db.collection("verificationCodes").findOne({
    email,
    code,
    expiresAt: { $gt: new Date() },
  })
}

// Admin Request model functions
export async function createAdminRequest(requestData: Omit<AdminRequest, "_id" | "createdAt" | "updatedAt">) {
  const { db } = await connectToDatabase()

  const now = new Date()
  const adminRequest = {
    ...requestData,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection("adminRequests").insertOne(adminRequest)
  return { ...adminRequest, _id: result.insertedId }
}

export async function getAdminRequestByToken(approvalToken: string) {
  const { db } = await connectToDatabase()
  return db.collection("adminRequests").findOne({ approvalToken })
}

export async function updateAdminRequestStatus(approvalToken: string, status: "approved" | "denied") {
  const { db } = await connectToDatabase()
  const now = new Date()

  await db.collection("adminRequests").updateOne({ approvalToken }, { $set: { status, updatedAt: now } })

  if (status === "approved") {
    const request = await getAdminRequestByToken(approvalToken)
    if (request) {
      await db
        .collection("users")
        .updateOne({ clerkId: request.clerkId }, { $set: { isAdmin: true, isAdminApproved: true, updatedAt: now } })
    }
  }
}

// Analytics functions
export async function getAnalytics() {
  const { db } = await connectToDatabase()

  const totalUsers = await db.collection("users").countDocuments()
  const totalProjects = await db.collection("projects").countDocuments()
  const totalDesigners = await db.collection("designers").countDocuments()
  const totalMaterials = await db.collection("materials").countDocuments()

  const now = new Date()
  const oneDayAgo = new Date(now)
  oneDayAgo.setDate(now.getDate() - 1)

  const activeToday = await db.collection("users").countDocuments({
    lastActive: { $gte: oneDayAgo },
  })

  const projectsByStatus = await db
    .collection("projects")
    .aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])
    .toArray()

  const projectsByCountry = await db
    .collection("projects")
    .aggregate([{ $group: { _id: "$location.country", count: { $sum: 1 } } }])
    .toArray()

  interface AnalyticsData {
    totalUsers: number
    totalProjects: number
    totalDesigners: number
    totalMaterials: number
    activeToday: number
    projectsByStatus: Record<string, number>
    projectsByCountry: Record<string, number>
  }

  interface GroupCount {
    _id: string
    count: number
  }

  const reduceGroupToRecord = (groups: GroupCount[]) => {
    return groups.reduce(
      (acc: Record<string, number>, curr: GroupCount) => {
        if (curr._id) {
          acc[curr._id] = curr.count
        }
        return acc
      },
      {} as Record<string, number>,
    )
  }

  return {
    totalUsers,
    totalProjects,
    totalDesigners,
    totalMaterials,
    activeToday,
    projectsByStatus: reduceGroupToRecord(projectsByStatus),
    projectsByCountry: reduceGroupToRecord(projectsByCountry),
  } as AnalyticsData
}

// Designer model functions
export async function createDesigner(designerData: Omit<Designer, "_id" | "createdAt" | "updatedAt">) {
  const { db } = await connectToDatabase()

  const now = new Date()
  const designer = {
    ...designerData,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection("designers").insertOne(designer)
  return { ...designer, _id: result.insertedId }
}

export async function getDesignerById(designerId: string) {
  const { db } = await connectToDatabase()
  try {
    return db.collection("designers").findOne({ _id: new ObjectId(designerId) })
  } catch (error) {
    console.error("Error converting designerId to ObjectId:", error)
    return null
  }
}

export async function getDesignersByLocation(country: string, state: string, city?: string) {
  const { db } = await connectToDatabase()

  const query: any = { "location.country": country, "location.state": state }
  if (city) query["location.city"] = city

  return db.collection("designers").find(query).sort({ rating: -1 }).toArray()
}

export async function getAllDesigners() {
  const { db } = await connectToDatabase()
  return db.collection("designers").find().sort({ createdAt: -1 }).toArray()
}

export async function updateDesigner(designerId: string, updateData: Partial<Designer>) {
  const { db } = await connectToDatabase()
  try {
    const now = new Date()
    return db.collection("designers").updateOne(
      { _id: new ObjectId(designerId) },
      { $set: { ...updateData, updatedAt: now } }
    )
  } catch (error) {
    console.error("Error updating designer:", error)
    return { modifiedCount: 0 }
  }
}

export async function deleteDesigner(designerId: string) {
  const { db } = await connectToDatabase()
  try {
    return db.collection("designers").deleteOne({ _id: new ObjectId(designerId) })
  } catch (error) {
    console.error("Error deleting designer:", error)
    return { deletedCount: 0 }
  }
}

// Material model functions
export async function createMaterial(materialData: Omit<Material, "_id" | "createdAt" | "updatedAt">) {
  const { db } = await connectToDatabase()

  const now = new Date()
  const material = {
    ...materialData,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection("materials").insertOne(material)
  return { ...material, _id: result.insertedId }
}

export async function getMaterialById(materialId: string) {
  const { db } = await connectToDatabase()
  try {
    return db.collection("materials").findOne({ _id: new ObjectId(materialId) })
  } catch (error) {
    console.error("Error converting materialId to ObjectId:", error)
    return null
  }
}

export async function getMaterialsByCategory(category: string) {
  const { db } = await connectToDatabase()
  return db.collection("materials").find({ category }).sort({ costPerUnit: 1 }).toArray()
}

export async function getAllMaterials() {
  const { db } = await connectToDatabase()
  return db.collection("materials").find().sort({ createdAt: -1 }).toArray()
}

export async function updateMaterial(materialId: string, updateData: Partial<Material>) {
  const { db } = await connectToDatabase()
  try {
    const now = new Date()
    return db.collection("materials").updateOne(
      { _id: new ObjectId(materialId) },
      { $set: { ...updateData, updatedAt: now } }
    )
  } catch (error) {
    console.error("Error updating material:", error)
    return { modifiedCount: 0 }
  }
}

export async function deleteMaterial(materialId: string) {
  const { db } = await connectToDatabase()
  try {
    return db.collection("materials").deleteOne({ _id: new ObjectId(materialId) })
  } catch (error) {
    console.error("Error deleting material:", error)
    return { deletedCount: 0 }
  }
}

// Energy Recommendation model functions
export async function createEnergyRecommendation(recommendationData: Omit<EnergyRecommendation, "_id" | "createdAt" | "updatedAt">) {
  const { db } = await connectToDatabase()

  const now = new Date()
  const recommendation = {
    ...recommendationData,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection("energyRecommendations").insertOne(recommendation)
  return { ...recommendation, _id: result.insertedId }
}

export async function getEnergyRecommendationById(recommendationId: string) {
  const { db } = await connectToDatabase()
  try {
    return db.collection("energyRecommendations").findOne({ _id: new ObjectId(recommendationId) })
  } catch (error) {
    console.error("Error converting recommendationId to ObjectId:", error)
    return null
  }
}

export async function getEnergyRecommendationsByRegion(countryCode: string) {
  const { db } = await connectToDatabase()
  return db.collection("energyRecommendations")
    .find({ applicableRegions: countryCode })
    .sort({ savingsEstimate: -1 })
    .toArray()
}

export async function getAllEnergyRecommendations() {
  const { db } = await connectToDatabase()
  return db.collection("energyRecommendations").find().sort({ createdAt: -1 }).toArray()
}

// Region model functions
export async function createRegion(regionData: Omit<Region, "_id" | "createdAt" | "updatedAt">) {
  const { db } = await connectToDatabase()

  const now = new Date()
  const region = {
    ...regionData,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection("regions").insertOne(region)
  return { ...region, _id: result.insertedId }
}

export async function getRegionByLocation(country: string, state: string, city?: string) {
  const { db } = await connectToDatabase()

  const query: any = { country, state }
  if (city) query.city = city

  return db.collection("regions").findOne(query)
}

export async function getAllRegions() {
  const { db } = await connectToDatabase()
  return db.collection("regions").find().sort({ country: 1, state: 1, city: 1 }).toArray()
}

export async function getCountries() {
  const { db } = await connectToDatabase()
  return db.collection("regions")
    .aggregate([
      { $group: { _id: { country: "$country", countryCode: "$countryCode" } } },
      { $project: { _id: 0, country: "$_id.country", countryCode: "$_id.countryCode" } },
      { $sort: { country: 1 } }
    ])
    .toArray()
}

export async function getStatesByCountry(country: string) {
  const { db } = await connectToDatabase()
  return db.collection("regions")
    .aggregate([
      { $match: { country } },
      { $group: { _id: { state: "$state", stateCode: "$stateCode" } } },
      { $project: { _id: 0, state: "$_id.state", stateCode: "$_id.stateCode" } },
      { $sort: { state: 1 } }
    ])
    .toArray()
}

export async function getCitiesByState(country: string, state: string) {
  const { db } = await connectToDatabase()
  return db.collection("regions")
    .aggregate([
      { $match: { country, state } },
      { $group: { _id: "$city" } },
      { $project: { _id: 0, city: "$_id" } },
      { $sort: { city: 1 } }
    ])
    .toArray()
}

