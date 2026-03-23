import fs from "fs"
import path from "path"
import { randomUUID } from "crypto"

type StoredProject = {
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
  preferences: Record<string, unknown>
  status: "Planning" | "In Progress" | "Completed"
  created_at: string
  updated_at: string
  designer_recommendations?: string[]
  material_recommendations?: string[]
  energy_recommendations?: string[]
}

const FILE_PATH = path.join(process.cwd(), "data", "projects-fallback.json")

function readAll(): StoredProject[] {
  try {
    if (!fs.existsSync(FILE_PATH)) {
      return []
    }
    const raw = fs.readFileSync(FILE_PATH, "utf8")
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(projects: StoredProject[]) {
  const dir = path.dirname(FILE_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(FILE_PATH, JSON.stringify(projects, null, 2), "utf8")
}

export function listUserProjects(userId: string): StoredProject[] {
  return readAll()
    .filter((p) => p.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function getUserProject(userId: string, projectId: string): StoredProject | null {
  return readAll().find((p) => p.id === projectId && p.user_id === userId) ?? null
}

export function createUserProject(
  userId: string,
  payload: Omit<StoredProject, "id" | "user_id" | "created_at" | "updated_at">
): StoredProject {
  const now = new Date().toISOString()
  const project: StoredProject = {
    ...payload,
    id: randomUUID(),
    user_id: userId,
    created_at: now,
    updated_at: now,
  }
  const projects = readAll()
  projects.push(project)
  writeAll(projects)
  return project
}

export function deleteUserProject(userId: string, projectId: string): boolean {
  const projects = readAll()
  const initialLength = projects.length
  const filtered = projects.filter((p) => !(p.id === projectId && p.user_id === userId))
  if (filtered.length === initialLength) return false
  writeAll(filtered)
  return true
}

