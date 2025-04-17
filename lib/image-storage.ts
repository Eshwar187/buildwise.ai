import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';

/**
 * Save an image to the public folder
 * @param imageSource - URL or base64 string of the image
 * @param projectId - ID of the project
 * @param type - Type of image (floor-plan, 3d-view, etc.)
 * @returns The path to the saved image relative to the public folder
 */
export async function saveImageToPublic(
  imageSource: string,
  projectId: string,
  type: 'floor-plan' | '3d-view' | 'material' = 'floor-plan'
): Promise<string> {
  try {
    // Create directory if it doesn't exist
    const dirPath = path.join(process.cwd(), 'public', 'uploads', type, projectId);
    fs.mkdirSync(dirPath, { recursive: true });

    // Generate a unique filename
    const filename = `${type}-${uuidv4()}.png`;
    const filePath = path.join(dirPath, filename);
    
    // The path that will be stored in the database (relative to public)
    const relativePath = `/uploads/${type}/${projectId}/${filename}`;

    // Handle different types of image sources
    if (imageSource.startsWith('data:image')) {
      // Handle base64 image data
      const base64Data = imageSource.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      fs.writeFileSync(filePath, buffer);
    } else if (imageSource.startsWith('http')) {
      // Handle image URL
      const response = await fetch(imageSource);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(filePath, buffer);
    } else {
      throw new Error('Invalid image source format');
    }

    return relativePath;
  } catch (error) {
    console.error('Error saving image to public folder:', error);
    throw error;
  }
}

/**
 * Delete an image from the public folder
 * @param imagePath - Path to the image relative to the public folder
 */
export function deleteImageFromPublic(imagePath: string): void {
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error('Error deleting image from public folder:', error);
  }
}
