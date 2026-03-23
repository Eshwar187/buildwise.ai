import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

type Template = {
  projectId: string
  name: string
  style: string
  imageUrl: string
  bedrooms: number
  bathrooms: number
}

const STYLE_DEFAULTS: Record<string, { bedrooms: number; bathrooms: number }> = {
  modern: { bedrooms: 3, bathrooms: 2 },
  farmhouse: { bedrooms: 4, bathrooms: 3 },
  cottage: { bedrooms: 2, bathrooms: 1 },
  minimalist: { bedrooms: 2, bathrooms: 2 },
}

function inferStyleFromName(name: string) {
  const n = name.toLowerCase()
  if (n.includes("farmhouse")) return "farmhouse"
  if (n.includes("cottage")) return "cottage"
  if (n.includes("minimal")) return "minimalist"
  return "modern"
}

function makeTemplate(projectId: string, imageUrl: string, baseName: string): Template {
  const style = inferStyleFromName(baseName)
  const defaults = STYLE_DEFAULTS[style] || STYLE_DEFAULTS.modern

  return {
    projectId,
    name: baseName
      .replace(/[-_]/g, " ")
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    style,
    imageUrl,
    bedrooms: defaults.bedrooms,
    bathrooms: defaults.bathrooms,
  }
}

export async function GET() {
  try {
    const templatesDir = path.join(process.cwd(), "public", "uploads", "floor-plans")

    if (!fs.existsSync(templatesDir)) {
      return NextResponse.json({ success: true, templates: [] }, { status: 200 })
    }

    const allTemplates: Template[] = []

    const projectDirs = fs
      .readdirSync(templatesDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)

    for (const projectDir of projectDirs) {
      const projectPath = path.join(templatesDir, projectDir)
      const metadataPath = path.join(projectPath, "metadata.json")

      if (fs.existsSync(metadataPath)) {
        try {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"))
          if (metadata?.imageUrl) {
            allTemplates.push({
              projectId: metadata.projectId || projectDir,
              name: metadata.name || "Floor Plan",
              style: metadata.style || inferStyleFromName(metadata.name || projectDir),
              imageUrl: metadata.imageUrl,
              bedrooms: Number(metadata.bedrooms) || 3,
              bathrooms: Number(metadata.bathrooms) || 2,
            })
          }
        } catch (error) {
          console.error(`Error parsing metadata for ${projectDir}:`, error)
        }
      }

      const imageFiles = fs
        .readdirSync(projectPath)
        .filter((file) => /\.(svg|png|jpg|jpeg)$/i.test(file) && file !== "metadata.json")

      for (const file of imageFiles) {
        const imageUrl = `/uploads/floor-plans/${projectDir}/${file}`
        const projectId = `${projectDir}-${file.replace(/\.[a-z0-9]+$/i, "")}`
        allTemplates.push(makeTemplate(projectId, imageUrl, file))
      }
    }

    const uniqueByImage = new Map<string, Template>()
    for (const t of allTemplates) {
      if (!uniqueByImage.has(t.imageUrl)) {
        uniqueByImage.set(t.imageUrl, t)
      }
    }

    const templates = Array.from(uniqueByImage.values())

    return NextResponse.json(
      { success: true, templates },
      {
        status: 200,
        headers: {
          "Cache-Control": "max-age=60, stale-while-revalidate=300",
        },
      }
    )
  } catch (error: any) {
    console.error("Error fetching floor plan templates:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch floor plan templates",
        templates: [],
      },
      { status: 200 }
    )
  }
}
