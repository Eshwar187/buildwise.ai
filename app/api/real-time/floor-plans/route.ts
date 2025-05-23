import { NextRequest, NextResponse } from "next/server"
import { saveImageToPublic } from "@/lib/image-storage"
import fs from "fs"
import path from "path"

// Function to generate floor plan description (mock data for testing)
async function generateFloorPlanDescription(projectData: any) {
  try {
    console.log('Generating floor plan description for:', projectData.preferences.style);

    // Generate a description based on the project data
    const bedrooms = projectData.preferences.rooms.bedrooms;
    const bathrooms = projectData.preferences.rooms.bathrooms;
    const style = projectData.preferences.style;
    const stories = projectData.preferences.stories;
    const hasStudy = projectData.preferences.rooms.study;
    const hasGarage = projectData.preferences.rooms.garage;
    const isEnergyEfficient = projectData.preferences.energyEfficient;
    const hasAccessibility = projectData.preferences.accessibility;
    const hasOutdoorSpace = projectData.preferences.outdoorSpace;

    // Create a description based on the project data
    let description = `# ${style} Style Floor Plan

`;

    description += `## Overview
This ${style.toLowerCase()} style home features ${bedrooms} bedrooms, ${bathrooms} bathrooms, and ${stories} ${stories === 1 ? 'story' : 'stories'}. `;
    description += `The design emphasizes ${style === 'Modern' ? 'clean lines and open spaces' : style === 'Traditional' ? 'classic elements and defined rooms' : style === 'Contemporary' ? 'current trends and flexible spaces' : style === 'Minimalist' ? 'simplicity and functionality' : style === 'Industrial' ? 'raw materials and open layouts' : style === 'Farmhouse' ? 'rustic charm and comfort' : style === 'Mediterranean' ? 'warm colors and outdoor living' : 'elegant proportions and symmetry'}. `;

    if (isEnergyEfficient) {
      description += `Energy-efficient features include high-performance insulation, energy-efficient windows, and smart home technology. `;
    }

    if (hasAccessibility) {
      description += `Accessibility features include wider doorways, zero-step entries, and accessible bathroom fixtures. `;
    }

    description += `\n## First Floor\n`;
    description += `- **Entryway**: Welcoming entrance with coat closet\n`;
    description += `- **Living Room**: Spacious area (${15 + Math.floor(Math.random() * 5)}' x ${18 + Math.floor(Math.random() * 5)}') with ${style === 'Modern' || style === 'Contemporary' ? 'large windows and minimalist design' : style === 'Traditional' || style === 'Colonial' ? 'classic moldings and fireplace' : 'comfortable seating area'}\n`;
    description += `- **Kitchen**: ${style === 'Modern' || style === 'Contemporary' ? 'Open concept' : 'Well-appointed'} kitchen (${12 + Math.floor(Math.random() * 4)}' x ${14 + Math.floor(Math.random() * 4)}') with ${style === 'Modern' ? 'sleek cabinetry and integrated appliances' : style === 'Farmhouse' ? 'farmhouse sink and open shelving' : style === 'Traditional' ? 'classic cabinetry and stone countertops' : 'ample counter space and storage'}\n`;
    description += `- **Dining Area**: ${style === 'Modern' || style === 'Contemporary' ? 'Connected to kitchen' : 'Separate'} dining space (${10 + Math.floor(Math.random() * 4)}' x ${12 + Math.floor(Math.random() * 4)}')\n`;

    if (hasStudy) {
      description += `- **Study/Office**: Private workspace (${10 + Math.floor(Math.random() * 3)}' x ${10 + Math.floor(Math.random() * 3)}') with built-in shelving\n`;
    }

    if (hasGarage) {
      description += `- **Garage**: ${Math.floor(Math.random() * 2) + 2}-car garage with storage space\n`;
    }

    if (stories > 1) {
      description += `\n## Second Floor\n`;
      description += `- **Master Bedroom**: Spacious primary suite (${14 + Math.floor(Math.random() * 4)}' x ${16 + Math.floor(Math.random() * 4)}') with walk-in closet\n`;
      description += `- **Master Bathroom**: En-suite bathroom with ${bathrooms > 2 ? 'double vanity, soaking tub, and separate shower' : 'shower/tub combo and vanity'}\n`;

      const remainingBedrooms = bedrooms - 1;
      if (remainingBedrooms > 0) {
        description += `- **Additional Bedrooms**: ${remainingBedrooms} additional bedroom${remainingBedrooms > 1 ? 's' : ''} (approx. ${12 + Math.floor(Math.random() * 3)}' x ${12 + Math.floor(Math.random() * 3)}' each)\n`;
      }

      const remainingBathrooms = bathrooms - 1;
      if (remainingBathrooms > 0) {
        description += `- **Additional Bathroom${remainingBathrooms > 1 ? 's' : ''}**: ${remainingBathrooms} additional bathroom${remainingBathrooms > 1 ? 's' : ''} serving the bedrooms\n`;
      }
    } else {
      // Single story home
      description += `- **Master Bedroom**: Primary suite (${14 + Math.floor(Math.random() * 4)}' x ${16 + Math.floor(Math.random() * 4)}') with walk-in closet\n`;
      description += `- **Master Bathroom**: En-suite bathroom with ${bathrooms > 2 ? 'double vanity, soaking tub, and separate shower' : 'shower/tub combo and vanity'}\n`;

      const remainingBedrooms = bedrooms - 1;
      if (remainingBedrooms > 0) {
        description += `- **Additional Bedrooms**: ${remainingBedrooms} additional bedroom${remainingBedrooms > 1 ? 's' : ''} (approx. ${12 + Math.floor(Math.random() * 3)}' x ${12 + Math.floor(Math.random() * 3)}' each)\n`;
      }

      const remainingBathrooms = bathrooms - 1;
      if (remainingBathrooms > 0) {
        description += `- **Additional Bathroom${remainingBathrooms > 1 ? 's' : ''}**: ${remainingBathrooms} additional bathroom${remainingBathrooms > 1 ? 's' : ''} serving the bedrooms\n`;
      }
    }

    if (hasOutdoorSpace) {
      description += `\n## Outdoor Space\n`;
      description += `- **Patio/Deck**: ${style === 'Modern' ? 'Sleek outdoor entertaining area' : style === 'Farmhouse' ? 'Charming covered porch' : style === 'Mediterranean' ? 'Terracotta-tiled patio' : 'Comfortable outdoor living space'}\n`;
      description += `- **Landscaping**: ${style === 'Modern' ? 'Minimalist landscaping with architectural plants' : style === 'Farmhouse' ? 'Cottage garden with native plants' : style === 'Traditional' ? 'Classic landscaping with defined garden beds' : 'Thoughtfully designed outdoor areas'}\n`;
    }

    return description;
  } catch (error) {
    console.error("Error generating floor plan description:", error);
    throw error;
  }
}

// Function to generate floor plan image URL (using dynamic SVG generation)
async function generateFloorPlanImage(description: string, style: string, projectData?: any) {
  try {
    console.log('Generating floor plan image for style:', style);

    // Generate a unique ID for this floor plan
    const floorPlanId = Math.random().toString(36).substring(2, 15);

    // Create a dynamic SVG based on the style and description
    let svgContent = '';
    const roomColors: Record<string, string> = {
      'bedroom': '#B3E5FC',
      'bathroom': '#B2DFDB',
      'kitchen': '#FFECB3',
      'living': '#FFCCBC',
      'dining': '#D7CCC8',
      'study': '#C5CAE9',
      'garage': '#CFD8DC',
      'hallway': '#F5F5F5',
      'entrance': '#E1BEE7',
      'outdoor': '#C8E6C9'
    };

    // Extract some details from the description
    const hasMasterBedroom = description.toLowerCase().includes('master bedroom');
    const numBedrooms = (description.match(/bedroom/gi) || []).length || 2;
    const numBathrooms = (description.match(/bathroom/gi) || []).length || 1;
    const hasGarage = description.toLowerCase().includes('garage');
    const hasStudy = description.toLowerCase().includes('study') || description.toLowerCase().includes('office');
    const hasOutdoor = description.toLowerCase().includes('outdoor') || description.toLowerCase().includes('patio');

    // Generate different layouts based on style
    if (style === 'Modern' || style === 'Contemporary' || style === 'Minimalist') {
      // Modern open floor plan
      svgContent = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <!-- Filters for shadows and effects -->
        <defs>
          <filter id="shadow" x="-2" y="-2" width="104%" height="104%">
            <feDropShadow dx="2" dy="2" stdDeviation="2" flood-opacity="0.3" />
          </filter>
          <linearGradient id="modernGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f8f9fa" />
            <stop offset="100%" stop-color="#e9ecef" />
          </linearGradient>
        </defs>

        <!-- Background with subtle grid -->
        <rect width="800" height="600" fill="#F8F9FA" />
        <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#E9ECEF" stroke-width="0.5" />
        </pattern>
        <rect width="800" height="600" fill="url(#smallGrid)" />

        <!-- Outer walls with shadow effect -->
        <rect x="55" y="55" width="690" height="490" fill="#E9ECEF" rx="2" ry="2" />
        <rect x="50" y="50" width="690" height="490" fill="none" stroke="#212529" stroke-width="4" rx="2" ry="2" />

        <!-- Main Gate/Entrance with better styling -->
        <rect x="350" y="46" width="100" height="8" fill="#495057" rx="2" ry="2" />
        <text x="400" y="38" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle" fill="#212529">Main Entrance</text>

        <!-- Dimensions -->
        <line x1="50" y1="570" x2="740" y2="570" stroke="#495057" stroke-width="1" />
        <line x1="50" y1="565" x2="50" y2="575" stroke="#495057" stroke-width="1" />
        <line x1="740" y1="565" x2="740" y2="575" stroke="#495057" stroke-width="1" />
        <text x="395" y="585" font-family="Arial" font-size="12" text-anchor="middle" fill="#212529">${parseFloat(description.match(/width.*?(\d+)/i)?.[1] || '30')} ft</text>

        <line x1="30" y1="50" x2="30" y2="540" stroke="#495057" stroke-width="1" />
        <line x1="25" y1="50" x2="35" y2="50" stroke="#495057" stroke-width="1" />
        <line x1="25" y1="540" x2="35" y2="540" stroke="#495057" stroke-width="1" />
        <text x="15" y="295" font-family="Arial" font-size="12" text-anchor="middle" transform="rotate(270, 15, 295)" fill="#212529">${parseFloat(description.match(/length.*?(\d+)/i)?.[1] || '40')} ft</text>

        <!-- Dimensions -->
        <line x1="50" y1="570" x2="750" y2="570" stroke="#000000" stroke-width="1" />
        <line x1="50" y1="565" x2="50" y2="575" stroke="#000000" stroke-width="1" />
        <line x1="750" y1="565" x2="750" y2="575" stroke="#000000" stroke-width="1" />
        <text x="400" y="585" font-family="Arial" font-size="12" text-anchor="middle">${projectData?.landDimensions?.width ? parseFloat(projectData.landDimensions.width) : parseFloat(description.match(/width.*?(\d+)/i)?.[1] || '30')} ${projectData?.landUnit || 'ft'}</text>

        <line x1="30" y1="50" x2="30" y2="550" stroke="#000000" stroke-width="1" />
        <line x1="25" y1="50" x2="35" y2="50" stroke="#000000" stroke-width="1" />
        <line x1="25" y1="550" x2="35" y2="550" stroke="#000000" stroke-width="1" />
        <text x="15" y="300" font-family="Arial" font-size="12" text-anchor="middle" transform="rotate(270, 15, 300)">${projectData?.landDimensions?.length ? parseFloat(projectData.landDimensions.length) : parseFloat(description.match(/length.*?(\d+)/i)?.[1] || '40')} ${projectData?.landUnit || 'ft'}</text>

        <!-- Living area with gradient and rounded corners -->
        <rect x="100" y="100" width="300" height="200" rx="5" ry="5" fill="${roomColors.living}" filter="url(#shadow)" />
        <text x="250" y="200" font-family="Arial" font-size="16" font-weight="bold" text-anchor="middle" fill="#212529">Living Room</text>
        <text x="250" y="220" font-family="Arial" font-size="10" text-anchor="middle" fill="#495057">${Math.round(300 * 0.3048)} × ${Math.round(200 * 0.3048)} ft</text>

        <!-- Kitchen with gradient and rounded corners -->
        <rect x="400" y="100" width="200" height="150" rx="5" ry="5" fill="${roomColors.kitchen}" filter="url(#shadow)" />
        <text x="500" y="175" font-family="Arial" font-size="16" font-weight="bold" text-anchor="middle" fill="#212529">Kitchen</text>
        <text x="500" y="195" font-family="Arial" font-size="10" text-anchor="middle" fill="#495057">${Math.round(200 * 0.3048)} × ${Math.round(150 * 0.3048)} ft</text>

        <!-- Dining with gradient and rounded corners -->
        <rect x="400" y="250" width="200" height="150" rx="5" ry="5" fill="${roomColors.dining}" filter="url(#shadow)" />
        <text x="500" y="325" font-family="Arial" font-size="16" font-weight="bold" text-anchor="middle" fill="#212529">Dining</text>
        <text x="500" y="345" font-family="Arial" font-size="10" text-anchor="middle" fill="#495057">${Math.round(200 * 0.3048)} × ${Math.round(150 * 0.3048)} ft</text>

        <!-- Master Bedroom with gradient and rounded corners -->
        <rect x="100" y="300" width="200" height="200" rx="5" ry="5" fill="${roomColors.bedroom}" filter="url(#shadow)" />
        <text x="200" y="400" font-family="Arial" font-size="16" font-weight="bold" text-anchor="middle" fill="#212529">Master Bedroom</text>
        <text x="200" y="420" font-family="Arial" font-size="10" text-anchor="middle" fill="#495057">${Math.round(200 * 0.3048)} × ${Math.round(200 * 0.3048)} ft</text>

        <!-- Bathroom with gradient and rounded corners -->
        <rect x="300" y="300" width="100" height="100" rx="5" ry="5" fill="${roomColors.bathroom}" filter="url(#shadow)" />
        <text x="350" y="350" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="#212529">Bath</text>
        <text x="350" y="365" font-family="Arial" font-size="10" text-anchor="middle" fill="#495057">${Math.round(100 * 0.3048)} × ${Math.round(100 * 0.3048)} ft</text>

        ${hasStudy ? `
        <!-- Study with gradient and rounded corners -->
        <rect x="600" y="100" width="100" height="100" rx="5" ry="5" fill="${roomColors.study}" filter="url(#shadow)" />
        <text x="650" y="150" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="#212529">Study</text>
        <text x="650" y="165" font-family="Arial" font-size="10" text-anchor="middle" fill="#495057">${Math.round(100 * 0.3048)} × ${Math.round(100 * 0.3048)} ft</text>
        ` : ''}

        ${numBedrooms > 1 ? `
        <!-- Bedroom 2 with gradient and rounded corners -->
        <rect x="600" y="200" width="100" height="150" rx="5" ry="5" fill="${roomColors.bedroom}" filter="url(#shadow)" />
        <text x="650" y="275" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="#212529">Bedroom</text>
        <text x="650" y="290" font-family="Arial" font-size="10" text-anchor="middle" fill="#495057">${Math.round(100 * 0.3048)} × ${Math.round(150 * 0.3048)} ft</text>
        ` : ''}

        ${numBathrooms > 1 ? `
        <!-- Bathroom 2 with gradient and rounded corners -->
        <rect x="600" y="350" width="100" height="100" rx="5" ry="5" fill="${roomColors.bathroom}" filter="url(#shadow)" />
        <text x="650" y="400" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="#212529">Bath</text>
        <text x="650" y="415" font-family="Arial" font-size="10" text-anchor="middle" fill="#495057">${Math.round(100 * 0.3048)} × ${Math.round(100 * 0.3048)} ft</text>
        ` : ''}

        ${hasGarage ? `
        <!-- Garage with gradient and rounded corners -->
        <rect x="300" y="400" width="200" height="150" rx="5" ry="5" fill="${roomColors.garage}" filter="url(#shadow)" />
        <text x="400" y="475" font-family="Arial" font-size="16" font-weight="bold" text-anchor="middle" fill="#212529">Garage</text>
        <text x="400" y="495" font-family="Arial" font-size="10" text-anchor="middle" fill="#495057">${Math.round(200 * 0.3048)} × ${Math.round(150 * 0.3048)} ft</text>
        ` : ''}

        <!-- Title and Info -->
        <text x="400" y="30" font-family="Arial" font-size="20" font-weight="bold" text-anchor="middle">${style} Style Floor Plan</text>
        <text x="700" y="580" font-family="Arial" font-size="12" text-anchor="end">Generated by BuildWise.ai</text>
      </svg>
      `;
    } else if (style === 'Traditional' || style === 'Colonial') {
      // Traditional layout with more defined rooms
      svgContent = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <!-- Background -->
        <rect width="800" height="600" fill="#FFFFFF" />

        <!-- Outer walls -->
        <rect x="50" y="50" width="700" height="500" fill="none" stroke="#333333" stroke-width="8" />

        <!-- Entrance with Gate -->
        <rect x="350" y="50" width="100" height="50" fill="${roomColors.entrance}" />
        <rect x="350" y="46" width="100" height="8" fill="#555555" />
        <text x="400" y="80" font-family="Arial" font-size="14" text-anchor="middle">Entrance</text>

        <!-- Dimensions -->
        <line x1="50" y1="570" x2="750" y2="570" stroke="#000000" stroke-width="1" />
        <line x1="50" y1="565" x2="50" y2="575" stroke="#000000" stroke-width="1" />
        <line x1="750" y1="565" x2="750" y2="575" stroke="#000000" stroke-width="1" />
        <text x="400" y="585" font-family="Arial" font-size="12" text-anchor="middle">${projectData?.landDimensions?.width ? parseFloat(projectData.landDimensions.width) : parseFloat(description.match(/width.*?(\d+)/i)?.[1] || '30')} ${projectData?.landUnit || 'ft'}</text>

        <line x1="30" y1="50" x2="30" y2="550" stroke="#000000" stroke-width="1" />
        <line x1="25" y1="50" x2="35" y2="50" stroke="#000000" stroke-width="1" />
        <line x1="25" y1="550" x2="35" y2="550" stroke="#000000" stroke-width="1" />
        <text x="15" y="300" font-family="Arial" font-size="12" text-anchor="middle" transform="rotate(270, 15, 300)">${projectData?.landDimensions?.length ? parseFloat(projectData.landDimensions.length) : parseFloat(description.match(/length.*?(\d+)/i)?.[1] || '40')} ${projectData?.landUnit || 'ft'}</text>

        <!-- Living Room -->
        <rect x="100" y="100" width="250" height="200" fill="${roomColors.living}" />
        <text x="225" y="200" font-family="Arial" font-size="16" text-anchor="middle">Living Room</text>

        <!-- Dining Room -->
        <rect x="350" y="100" width="200" height="150" fill="${roomColors.dining}" />
        <text x="450" y="175" font-family="Arial" font-size="16" text-anchor="middle">Dining Room</text>

        <!-- Kitchen -->
        <rect x="550" y="100" width="150" height="150" fill="${roomColors.kitchen}" />
        <text x="625" y="175" font-family="Arial" font-size="16" text-anchor="middle">Kitchen</text>

        <!-- Hallway -->
        <rect x="350" y="250" width="100" height="150" fill="${roomColors.hallway}" />
        <text x="400" y="325" font-family="Arial" font-size="14" text-anchor="middle">Hall</text>

        <!-- Master Bedroom -->
        <rect x="100" y="300" width="250" height="200" fill="${roomColors.bedroom}" />
        <text x="225" y="400" font-family="Arial" font-size="16" text-anchor="middle">Master Bedroom</text>

        <!-- Master Bathroom -->
        <rect x="350" y="400" width="100" height="100" fill="${roomColors.bathroom}" />
        <text x="400" y="450" font-family="Arial" font-size="14" text-anchor="middle">Bath</text>

        ${numBedrooms > 1 ? `
        <!-- Bedroom 2 -->
        <rect x="450" y="250" width="150" height="150" fill="${roomColors.bedroom}" />
        <text x="525" y="325" font-family="Arial" font-size="14" text-anchor="middle">Bedroom</text>
        ` : ''}

        ${numBedrooms > 2 ? `
        <!-- Bedroom 3 -->
        <rect x="600" y="250" width="150" height="150" fill="${roomColors.bedroom}" />
        <text x="675" y="325" font-family="Arial" font-size="14" text-anchor="middle">Bedroom</text>
        ` : ''}

        ${numBathrooms > 1 ? `
        <!-- Bathroom 2 -->
        <rect x="450" y="400" width="100" height="100" fill="${roomColors.bathroom}" />
        <text x="500" y="450" font-family="Arial" font-size="14" text-anchor="middle">Bath</text>
        ` : ''}

        ${hasStudy ? `
        <!-- Study -->
        <rect x="550" y="400" width="150" height="100" fill="${roomColors.study}" />
        <text x="625" y="450" font-family="Arial" font-size="14" text-anchor="middle">Study</text>
        ` : ''}

        <!-- Title and Info -->
        <text x="400" y="30" font-family="Arial" font-size="20" font-weight="bold" text-anchor="middle">${style} Style Floor Plan</text>
        <text x="700" y="580" font-family="Arial" font-size="12" text-anchor="end">Generated by BuildWise.ai</text>
      </svg>
      `;
    } else {
      // Default layout for other styles
      svgContent = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <!-- Background -->
        <rect width="800" height="600" fill="#FFFFFF" />

        <!-- Outer walls -->
        <rect x="50" y="50" width="700" height="500" fill="none" stroke="#333333" stroke-width="8" />

        <!-- Main Gate/Entrance -->
        <rect x="350" y="46" width="100" height="8" fill="#555555" />
        <text x="400" y="40" font-family="Arial" font-size="12" text-anchor="middle">Main Entrance</text>

        <!-- Dimensions -->
        <line x1="50" y1="570" x2="750" y2="570" stroke="#000000" stroke-width="1" />
        <line x1="50" y1="565" x2="50" y2="575" stroke="#000000" stroke-width="1" />
        <line x1="750" y1="565" x2="750" y2="575" stroke="#000000" stroke-width="1" />
        <text x="400" y="585" font-family="Arial" font-size="12" text-anchor="middle">${projectData?.landDimensions?.width ? parseFloat(projectData.landDimensions.width) : parseFloat(description.match(/width.*?(\d+)/i)?.[1] || '30')} ${projectData?.landUnit || 'ft'}</text>

        <line x1="30" y1="50" x2="30" y2="550" stroke="#000000" stroke-width="1" />
        <line x1="25" y1="50" x2="35" y2="50" stroke="#000000" stroke-width="1" />
        <line x1="25" y1="550" x2="35" y2="550" stroke="#000000" stroke-width="1" />
        <text x="15" y="300" font-family="Arial" font-size="12" text-anchor="middle" transform="rotate(270, 15, 300)">${projectData?.landDimensions?.length ? parseFloat(projectData.landDimensions.length) : parseFloat(description.match(/length.*?(\d+)/i)?.[1] || '40')} ${projectData?.landUnit || 'ft'}</text>

        <!-- Living Room -->
        <rect x="100" y="100" width="300" height="200" fill="${roomColors.living}" />
        <text x="250" y="200" font-family="Arial" font-size="16" text-anchor="middle">Living Room</text>

        <!-- Kitchen -->
        <rect x="400" y="100" width="300" height="150" fill="${roomColors.kitchen}" />
        <text x="550" y="175" font-family="Arial" font-size="16" text-anchor="middle">Kitchen</text>

        <!-- Dining -->
        <rect x="400" y="250" width="300" height="100" fill="${roomColors.dining}" />
        <text x="550" y="300" font-family="Arial" font-size="16" text-anchor="middle">Dining</text>

        <!-- Master Bedroom -->
        <rect x="100" y="300" width="200" height="200" fill="${roomColors.bedroom}" />
        <text x="200" y="400" font-family="Arial" font-size="16" text-anchor="middle">Master Bedroom</text>

        <!-- Bathroom -->
        <rect x="300" y="300" width="100" height="100" fill="${roomColors.bathroom}" />
        <text x="350" y="350" font-family="Arial" font-size="14" text-anchor="middle">Bath</text>

        ${numBedrooms > 1 ? `
        <!-- Bedroom 2 -->
        <rect x="400" y="350" width="150" height="150" fill="${roomColors.bedroom}" />
        <text x="475" y="425" font-family="Arial" font-size="14" text-anchor="middle">Bedroom</text>
        ` : ''}

        ${numBedrooms > 2 ? `
        <!-- Bedroom 3 -->
        <rect x="550" y="350" width="150" height="150" fill="${roomColors.bedroom}" />
        <text x="625" y="425" font-family="Arial" font-size="14" text-anchor="middle">Bedroom</text>
        ` : ''}

        ${hasOutdoor ? `
        <!-- Outdoor Space -->
        <rect x="50" y="550" width="700" height="30" fill="${roomColors.outdoor}" />
        <text x="400" y="570" font-family="Arial" font-size="14" text-anchor="middle">Outdoor Space</text>
        ` : ''}

        <!-- Title and Info -->
        <text x="400" y="30" font-family="Arial" font-size="20" font-weight="bold" text-anchor="middle">${style} Style Floor Plan</text>
        <text x="700" y="580" font-family="Arial" font-size="12" text-anchor="end">Generated by BuildWise.ai</text>
      </svg>
      `;
    }

    // Save the SVG to a file
    const publicDir = path.join(process.cwd(), 'public');
    const uploadsDir = path.join(publicDir, 'uploads', 'floor-plans', 'generated');
    const projectDir = path.join(publicDir, 'uploads', 'floor-plans', 'project-1');

    // Create directories if they don't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Create project directories for fallback paths
    const projectDirs = [
      path.join(publicDir, 'uploads', 'floor-plans', 'project-1'),
      path.join(publicDir, 'uploads', 'floor-plans', 'project-2'),
      path.join(publicDir, 'uploads', 'floor-plans', 'project-3')
    ];

    projectDirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Save the SVG file
    const fileName = `floor-plan-${style.toLowerCase()}-${floorPlanId}.svg`;
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, svgContent);

    // Return the URL to the SVG file
    return `/uploads/floor-plans/generated/${fileName}`;
  } catch (error) {
    console.error("Error generating floor plan image:", error);

    // Fallback to static images if SVG generation fails
    const styleImageMap: Record<string, string> = {
      'Modern': '/uploads/floor-plans/project-1/modern-floor-plan.svg',
      'Traditional': '/uploads/floor-plans/project-2/traditional-floor-plan.svg',
      'Contemporary': '/uploads/floor-plans/project-3/contemporary-floor-plan.svg',
      'Minimalist': '/uploads/floor-plans/project-1/minimalist-floor-plan.svg',
      'Industrial': '/uploads/floor-plans/project-2/industrial-floor-plan.svg',
      'Farmhouse': '/uploads/floor-plans/project-2/farmhouse-floor-plan.svg',
      'Mediterranean': '/uploads/floor-plans/project-3/mediterranean-floor-plan.svg',
      'Colonial': '/uploads/floor-plans/project-1/colonial-floor-plan.svg',
    };

    return styleImageMap[style] || '/uploads/floor-plans/project-1/modern-floor-plan.svg';
  }
}

// POST endpoint to generate a real-time floor plan
export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user ID
    const { auth } = await import("@clerk/nextjs/server")
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to generate a floor plan." }, { status: 401 })
    }

    const projectData = await req.json()

    if (!projectData) {
      return NextResponse.json({ error: "Missing project data" }, { status: 400 })
    }

    console.log("Received project data:", {
      style: projectData.preferences.style,
      bedrooms: projectData.preferences.rooms.bedrooms,
      bathrooms: projectData.preferences.rooms.bathrooms,
      stories: projectData.preferences.stories
    })

    // Generate floor plan description
    console.log("Generating floor plan description...")
    const description = await generateFloorPlanDescription(projectData)
    console.log("Description generated successfully")

    // Generate floor plan image URL
    console.log("Generating floor plan image...")
    const imageUrl = await generateFloorPlanImage(description, projectData.preferences.style, projectData)
    console.log("Image URL generated successfully:", imageUrl)

    // Create a floor plan object
    const floorPlan = {
      projectId: projectData.id || "temp-project",
      userId: userId, // Use the authenticated user ID
      imageUrl: imageUrl,
      aiPrompt: JSON.stringify(projectData),
      description,
      generatedBy: "gemini",
      dimensions: {
        width: parseFloat(projectData.landDimensions.width) || 0,
        length: parseFloat(projectData.landDimensions.length) || 0,
        unit: projectData.landUnit || "sq ft"
      },
      rooms: {
        bedrooms: projectData.preferences.rooms.bedrooms,
        bathrooms: projectData.preferences.rooms.bathrooms
      },
      style: projectData.preferences.style,
      stories: projectData.preferences.stories,
      createdAt: new Date(),
    }

    return NextResponse.json({
      success: true,
      floorPlan
    }, { status: 201 })
  } catch (error: any) {
    console.error("Error generating real-time floor plan:", error)

    // Return a fallback floor plan if API fails
    const fallbackFloorPlan = {
      projectId: "temp-project",
      userId: userId || "anonymous", // Use the authenticated user ID if available
      imageUrl: "/uploads/floor-plans/project-1/modern-floor-plan.svg",
      description: "This is a fallback floor plan generated when the API request failed. It represents a modern home design with open living spaces, multiple bedrooms, and energy-efficient features.",
      generatedBy: "fallback",
      style: "Modern",
      dimensions: {
        width: 40,
        length: 60,
        unit: "sq ft"
      },
      rooms: {
        bedrooms: 3,
        bathrooms: 2
      },
      createdAt: new Date(),
    }

    return NextResponse.json({
      success: false,
      floorPlan: fallbackFloorPlan,
      error: error.message || "Failed to generate floor plan"
    }, { status: 200 })
  }
}
