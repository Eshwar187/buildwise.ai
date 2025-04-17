import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import path from "path"
import fs from "fs"
import os from "os"
import { v4 as uuidv4 } from "uuid"
import { processFloorPlan } from "@/scripts/process_floor_plan"
import { saveImageToPublic } from "@/lib/image-storage"

// POST endpoint to process a floor plan
export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const colorScheme = formData.get("colorScheme") as string || "modern"
    const generate3D = formData.get("generate3D") === "true"
    const exportData = formData.get("exportData") === "true"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Create temp directory for processing
    const tempDir = path.join(os.tmpdir(), "constructhub", userId)
    fs.mkdirSync(tempDir, { recursive: true })

    // Generate unique filenames
    const fileId = uuidv4()
    const inputPath = path.join(tempDir, `${fileId}_input.png`)
    const outputPath = path.join(tempDir, `${fileId}_output.png`)
    const dataPath = path.join(tempDir, `${fileId}_data.json`)

    // Save the uploaded file
    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(inputPath, buffer)

    // Process the floor plan
    let result;
    try {
      result = await processFloorPlan({
        inputPath,
        outputPath,
        colorScheme,
        generate3D,
        exportData,
        dataPath,
      });
    } catch (error: any) {
      console.error('Error in processFloorPlan:', error);
      return NextResponse.json(
        { error: `Error processing floor plan: ${error.message}` },
        { status: 500 }
      );
    }

    // Read the processed files
    const enhancedFloorPlan = fs.readFileSync(outputPath)
    const enhancedFloorPlanBase64 = enhancedFloorPlan.toString("base64")
    const enhancedFloorPlanBase64Url = `data:image/png;base64,${enhancedFloorPlanBase64}`

    // Get project ID from form data
    const projectId = formData.get("projectId") as string
    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    // Save enhanced floor plan to public folder
    console.log("Saving enhanced floor plan to public folder...")
    const enhancedFloorPlanUrl = await saveImageToPublic(enhancedFloorPlanBase64Url, projectId, 'floor-plan')
    console.log("Enhanced floor plan saved to:", enhancedFloorPlanUrl)

    let visualization3DBase64 = null
    let visualization3DUrl = null
    if (generate3D && result.visualization3D) {
      const visualization3D = fs.readFileSync(result.visualization3D)
      visualization3DBase64 = visualization3D.toString("base64")
      const visualization3DBase64Url = `data:image/png;base64,${visualization3DBase64}`

      // Save 3D visualization to public folder
      console.log("Saving 3D visualization to public folder...")
      visualization3DUrl = await saveImageToPublic(visualization3DBase64Url, projectId, '3d-view')
      console.log("3D visualization saved to:", visualization3DUrl)
    }

    let floorPlanData = null
    if (exportData && result.data) {
      floorPlanData = result.data
    }

    // Clean up temp files
    try {
      fs.unlinkSync(inputPath)
      fs.unlinkSync(outputPath)
      if (generate3D && result.visualization3D) {
        fs.unlinkSync(result.visualization3D)
      }
      if (exportData && result.floorPlanData) {
        fs.unlinkSync(result.floorPlanData)
      }
    } catch (error) {
      console.error("Error cleaning up temp files:", error)
    }

    return NextResponse.json({
      success: true,
      enhancedFloorPlan: enhancedFloorPlanBase64Url, // Keep the base64 for immediate display
      enhancedFloorPlanUrl: enhancedFloorPlanUrl,    // Add the URL for storage
      visualization3D: visualization3DBase64 ? `data:image/png;base64,${visualization3DBase64}` : null,
      visualization3DUrl: visualization3DUrl,
      floorPlanData,
    })
  } catch (error: any) {
    console.error("Error processing floor plan:", error)
    return NextResponse.json(
      { error: error.message || "Failed to process floor plan" },
      { status: 500 }
    )
  }
}
