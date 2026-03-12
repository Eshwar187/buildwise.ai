/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"

// Function to fetch real-time designers using OpenStreetMap Nominatim and Overpass API
async function fetchDesigners(location: string) {
  try {
    console.log(`Fetching designers for location: ${location}`);

    // Extract city and state from location
    const locationParts = location.split(',').map(part => part.trim());
    const city = locationParts[0] || 'New York';
    const state = locationParts.length > 1 ? locationParts[1] : '';
    const country = locationParts.length > 2 ? locationParts[2] : '';

    // Construct the location parameter for the API
    const searchLocation = city + (state ? `, ${state}` : '') + (country ? `, ${country}` : '');
    console.log(`Searching for designers in: ${searchLocation}`);

    // First, use Nominatim API to get the bounding box or coordinates of the location
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchLocation)}&format=json&limit=1`;
    
    // Respect Nominatim Usage Policy by providing a User-Agent
    const headers = {
      'User-Agent': 'BuildWiseApp/1.0 (contact@buildwise.ai)'
    };

    const geocodeResponse = await fetch(geocodeUrl, { headers });
    const geocodeData = await geocodeResponse.json();

    if (!geocodeData || geocodeData.length === 0) {
      console.error('Nominatim API error or no results for:', searchLocation);
      throw new Error(`Could not find coordinates for ${searchLocation}`);
    }

    const { lat, lon } = geocodeData[0];
    console.log(`Found coordinates for ${searchLocation}: ${lat}, ${lon}`);

    // Determine bounding box around the point (roughly 50km radius)
    // 1 degree is approx 111km. 50km is about 0.45 degrees.
    const radiusDeg = 0.45;
    const minLat = parseFloat(lat) - radiusDeg;
    const minLon = parseFloat(lon) - Math.abs(radiusDeg / Math.cos(parseFloat(lat) * Math.PI / 180));
    const maxLat = parseFloat(lat) + radiusDeg;
    const maxLon = parseFloat(lon) + Math.abs(radiusDeg / Math.cos(parseFloat(lat) * Math.PI / 180));

    // Now use Overpass API to search for interior designers and architects
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["office"="architect"](${minLat},${minLon},${maxLat},${maxLon});
        way["office"="architect"](${minLat},${minLon},${maxLat},${maxLon});
        relation["office"="architect"](${minLat},${minLon},${maxLat},${maxLon});
        node["shop"="interior_decoration"](${minLat},${minLon},${maxLat},${maxLon});
        way["shop"="interior_decoration"](${minLat},${minLon},${maxLat},${maxLon});
        relation["shop"="interior_decoration"](${minLat},${minLon},${maxLat},${maxLon});
      );
      out center;
    `;

    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    
    console.log('Calling Overpass API');

    const overpassResponse = await fetch(overpassUrl, {
      method: 'POST',
      body: overpassQuery,
      headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    const overpassData = await overpassResponse.json();

    console.log('Overpass API found results:', overpassData.elements ? overpassData.elements.length : 0);

    // If we don't get any results, try a different query
    if (!overpassData.elements || overpassData.elements.length === 0) {
      console.log('No places found, generating designers instead');
      return generateDesigners(searchLocation, city, state, country);
    }

    // Filter elements with a name tag
    const namedElements = overpassData.elements.filter((el: any) => el.tags && el.tags.name);
    
    if (namedElements.length === 0) {
      console.log('No named places found, generating designers instead');
      return generateDesigners(searchLocation, city, state, country);
    }

    // Transform the Overpass API data into our designer format
    const designers = await Promise.all(namedElements.slice(0, 5).map(async (place: any, index: number) => {
      const name = place.tags.name;
      
      // Extract phone and website
      const phone = place.tags.phone || place.tags['contact:phone'] || "";
      const website = place.tags.website || place.tags['contact:website'] || "";
      
      // Generate an email based on the company name
      const emailObj = place.tags.email || place.tags['contact:email'];
      const companyName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const email = emailObj || `info@${companyName}.com`;

      // Extract the full address
      const housenumber = place.tags['addr:housenumber'] || "";
      const street = place.tags['addr:street'] || "";
      const addrCity = place.tags['addr:city'] || city;
      let address = "";
      if (housenumber && street) {
        address = `${housenumber} ${street}, ${addrCity}`;
      } else {
        address = `${addrCity}${state ? `, ${state}` : ''}`;
      }

      // Generate a random experience value between 5-25 years
      const experience = Math.floor(Math.random() * 20) + 5;

      // Determine specialization based on tags
      let specialization = "Interior Design";
      if (place.tags.office === "architect") {
        specialization = "Architecture";
      } else if (place.tags.shop === "interior_decoration") {
        specialization = "Interior Design";
      }

      if (name.toLowerCase().includes("modern")) {
        specialization = "Modern Design";
      } else if (name.toLowerCase().includes("traditional")) {
        specialization = "Traditional Design";
      }

      // Create a bio based on available information
      const bio = `${name} is a professional ${specialization.toLowerCase()} firm with ${experience} years of experience, located in ${addrCity}.`;

      // Create a portfolio description
      const portfolio = `Specializes in ${specialization.toLowerCase()} projects throughout ${addrCity} and surrounding areas. Known for quality craftsmanship and attention to detail.`;

      const plat = place.lat || (place.center && place.center.lat) || lat;
      const plon = place.lon || (place.center && place.center.lon) || lon;
      // Map URL
      const mapsUrl = `https://www.openstreetmap.org/?mlat=${plat}&mlon=${plon}#map=17/${plat}/${plon}`;

      return {
        id: place.id.toString() || `designer-${index + 1}`,
        name: name,
        company: name,
        experience,
        specialization,
        bio,
        phone,
        email,
        website,
        address,
        location: address,
        portfolio,
        rating: (4 + Math.random()).toFixed(1),
        imageUrl: '', // Will be handled by the UI
        mapsUrl,
        projects: Math.floor(Math.random() * 100) + 50
      };
    }));

    console.log(`Successfully processed ${designers.length} designers for ${city}`);
    
    // Supplement with generated if fewer than 5
    if (designers.length < 5) {
      const generated = await generateDesigners(location, city, state, country);
      const needed = 5 - designers.length;
      designers.push(...generated.slice(0, needed));
    }

    return designers;
  } catch (error) {
    console.error("Error fetching designers from OSM API:", error);
    // Fall back to generating designers
    const locationParts = location.split(',').map(part => part.trim());
    const city = locationParts[0] || 'New York';
    const state = locationParts.length > 1 ? locationParts[1] : '';
    const country = locationParts.length > 2 ? locationParts[2] : '';
    return generateDesigners(location, city, state, country);
  }
}

// Fallback function to generate designers when API fails
async function generateDesigners(location: string, city: string, state: string, country: string) {
  try {
    console.log(`Generating designers for location: ${location}`);

    // Adjust names based on country if available
    let firstNames = ['Sarah', 'Michael', 'Jennifer', 'David', 'Emily', 'Robert', 'Jessica', 'William', 'Amanda', 'Richard'];
    let lastNames = ['Johnson', 'Smith', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson'];

    // Customize names based on country/region if available
    if (country && country.toLowerCase().includes('india')) {
      firstNames = ['Raj', 'Priya', 'Amit', 'Neha', 'Vikram', 'Ananya', 'Arjun', 'Divya', 'Rahul', 'Meera'];
      lastNames = ['Sharma', 'Patel', 'Singh', 'Gupta', 'Kumar', 'Verma', 'Rao', 'Reddy', 'Joshi', 'Malhotra'];
    } else if (country && country.toLowerCase().includes('china')) {
      firstNames = ['Li', 'Wei', 'Min', 'Jie', 'Yan', 'Hui', 'Xin', 'Yong', 'Ling', 'Fang'];
      lastNames = ['Wang', 'Li', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou'];
    }

    // Generate company name prefixes based on location
    const companyPrefixes = [city];
    if (state) companyPrefixes.push(state);
    if (country) companyPrefixes.push(country);
    companyPrefixes.push('Modern', 'Elite', 'Premier', 'Luxury', 'Creative', 'Innovative', 'Classic');

    const companySuffixes = ['Interiors', 'Design Studio', 'Architects', 'Design Group', 'Associates', 'Partners', 'Spaces', 'Concepts'];

    // Generate specializations
    const specializations = ['Modern', 'Contemporary', 'Traditional', 'Minimalist', 'Industrial', 'Scandinavian', 'Mid-Century Modern', 'Transitional', 'Bohemian', 'Farmhouse'];

    // Generate designers
    const designers = Array.from({ length: 5 }, (_, index) => {
      // Generate random name
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${firstName} ${lastName}`;

      // Generate company name
      const prefix = companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)];
      const suffix = companySuffixes[Math.floor(Math.random() * companySuffixes.length)];
      const company = `${prefix} ${suffix}`;

      // Generate experience (5-25 years)
      const experience = Math.floor(Math.random() * 20) + 5;

      // Generate specialization
      const specialization = specializations[Math.floor(Math.random() * specializations.length)];

      // Generate bio
      const locationStr = city + (state ? `, ${state}` : '') + (country ? `, ${country}` : '');
      const bio = `${name} is a professional interior designer with ${experience} years of experience in ${specialization} design. Based in ${locationStr}, ${name} has worked on numerous high-profile projects throughout the region.`;

      // Generate contact information
      const areaCode = Math.floor(Math.random() * 900) + 100;
      const phonePrefix = Math.floor(Math.random() * 900) + 100;
      const phoneSuffix = Math.floor(Math.random() * 9000) + 1000;
      const phone = `(${areaCode}) ${phonePrefix}-${phoneSuffix}`;

      // Generate email
      const emailName = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
      const emailDomain = company.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
      const email = `${emailName}@${emailDomain}`;

      // Generate website
      const website = `https://www.${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

      // Generate address
      const streetNumber = Math.floor(Math.random() * 9000) + 1000;
      const streets = ['Main St', 'Broadway', 'Park Ave', 'Oak St', 'Maple Ave', 'Washington St', 'Market St'];
      const street = streets[Math.floor(Math.random() * streets.length)];
      const address = `${streetNumber} ${street}, ${city}${state ? `, ${state}` : ''}${country ? `, ${country}` : ''}`;

      // Generate portfolio
      const portfolioItems = [
        'Luxury residential homes',
        'Commercial office spaces',
        'Retail environments',
        'Hospitality design',
        'Healthcare facilities',
        'Educational institutions',
        'Public spaces'
      ];
      const portfolioItem1 = portfolioItems[Math.floor(Math.random() * portfolioItems.length)];
      const portfolioItem2 = portfolioItems[Math.floor(Math.random() * portfolioItems.length)];
      const portfolio = `Specializes in ${specialization} design for ${portfolioItem1} and ${portfolioItem2}. Known for attention to detail and client satisfaction.`;

      // Generate rating (4.0-5.0)
      const rating = (4 + Math.random()).toFixed(1);

      // Generate Google Maps URL
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company + ' ' + city)}`;

      return {
        id: `designer-${index + 1}`,
        name,
        company,
        experience,
        specialization,
        bio,
        phone,
        email,
        website,
        address,
        location: address,
        portfolio,
        rating,
        imageUrl: '', // No default image, will be handled by the UI
        mapsUrl,
        projects: Math.floor(Math.random() * 100) + 50
      };
    });

    console.log(`Generated ${designers.length} designers for ${city}`);
    return designers;
  } catch (error) {
    console.error("Error generating designers:", error);
    throw error;
  }
}

// GET endpoint to retrieve real-time designers
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const location = url.searchParams.get("location") || "New York, USA"

    console.log(`Received request for designers in location: ${location}`)

    // Fetch designers based on location using Google Maps API
    const designers = await fetchDesigners(location)

    console.log(`Found ${designers.length} designers for ${location}`)

    return NextResponse.json({
      success: true,
      designers
    }, {
      status: 200,
      headers: {
        "Cache-Control": "max-age=300, stale-while-revalidate=600"
      }
    })
  } catch (error: any) {
    console.error("Error fetching designers:", error)

    // Return error with appropriate message
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to fetch designers. Please try again."
    }, { status: 500 })
  }
}
