import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Get a list of available floor plan templates
 * @returns Array of floor plan template objects
 */
export function getFloorPlanTemplates() {
  try {
    const templatesDir = path.join(process.cwd(), 'public', 'uploads', 'floor-plans');
    
    // Check if directory exists
    if (!fs.existsSync(templatesDir)) {
      console.warn('Floor plan templates directory does not exist');
      return [];
    }
    
    // Get all project directories
    const projectDirs = fs.readdirSync(templatesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    // Collect template data
    const templates = [];
    
    for (const projectDir of projectDirs) {
      const projectPath = path.join(templatesDir, projectDir);
      const metadataPath = path.join(projectPath, 'metadata.json');
      
      // Check if metadata file exists
      if (fs.existsSync(metadataPath)) {
        try {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
          templates.push(metadata);
        } catch (error) {
          console.error(`Error parsing metadata for ${projectDir}:`, error);
        }
      }
    }
    
    return templates;
  } catch (error) {
    console.error('Error getting floor plan templates:', error);
    return [];
  }
}

/**
 * Get a specific floor plan template by ID
 * @param templateId The ID of the template to retrieve
 * @returns The template object or null if not found
 */
export function getFloorPlanTemplate(templateId: string) {
  try {
    const templates = getFloorPlanTemplates();
    return templates.find(template => template.projectId === templateId) || null;
  } catch (error) {
    console.error('Error getting floor plan template:', error);
    return null;
  }
}

/**
 * Copy a floor plan template to a project
 * @param templateId The ID of the template to copy
 * @param projectId The ID of the project to copy to
 * @returns The path to the copied floor plan
 */
export function copyFloorPlanTemplate(templateId: string, projectId: string) {
  try {
    // Get the template
    const template = getFloorPlanTemplate(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }
    
    // Create the project directory if it doesn't exist
    const projectDir = path.join(process.cwd(), 'public', 'uploads', 'floor-plans', projectId);
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }
    
    // Get the template image path
    const templateImagePath = path.join(process.cwd(), 'public', template.imageUrl);
    
    // Generate a new filename
    const filename = `floor-plan-${uuidv4()}${path.extname(templateImagePath)}`;
    const newImagePath = path.join(projectDir, filename);
    
    // Copy the image
    fs.copyFileSync(templateImagePath, newImagePath);
    
    // Create a new metadata file
    const newMetadata = {
      ...template,
      projectId,
      imageUrl: `/uploads/floor-plans/${projectId}/${filename}`,
      createdAt: new Date().toISOString()
    };
    
    // Save the metadata
    fs.writeFileSync(
      path.join(projectDir, 'metadata.json'),
      JSON.stringify(newMetadata, null, 2)
    );
    
    return newMetadata.imageUrl;
  } catch (error) {
    console.error('Error copying floor plan template:', error);
    throw error;
  }
}

/**
 * Get a random floor plan template
 * @returns A random template or null if none are available
 */
export function getRandomFloorPlanTemplate() {
  try {
    const templates = getFloorPlanTemplates();
    if (templates.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * templates.length);
    return templates[randomIndex];
  } catch (error) {
    console.error('Error getting random floor plan template:', error);
    return null;
  }
}
