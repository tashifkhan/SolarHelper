// Define a type for the coordinates
interface LatLon {
    lat: number;
    lon: number;
}

// --- Using Nominatim (OpenStreetMap Geocoding) ---
// This is a free service, but has usage policies and rate limits.
// Do not abuse it. For production or high volume, consider other options.
const NOMINATIM_API_BASE_URL = "https://nominatim.openstreetmap.org/search";

/**
 * Converts an Indian Pincode to Latitude and Longitude using an external API.
 * @param pincode - The 6-digit Indian pincode string.
 * @returns A Promise resolving to an object { lat: number, lon: number } or null if not found or an error occurred.
 */
async function getLatLonFromPincode(pincode: string): Promise<LatLon | null> {
// Basic validation for Indian pincode format (6 digits)
if (!pincode || !/^\d{6}$/.test(pincode)) {
    console.error("Invalid Indian pincode format. Must be a 6-digit number.");
    return null;
}

// Construct the API URL
const url = new URL(NOMINATIM_API_BASE_URL);
url.searchParams.append('postalcode', pincode);
url.searchParams.append('country', 'India'); // Explicitly specify the country
url.searchParams.append('format', 'json'); // Request JSON format
url.searchParams.append('limit', '1'); // We usually only need the best match
url.searchParams.append('addressdetails', '0'); // Don't need full address details
// Optional: Include a User-Agent header if required by the API or for better practice
// url.searchParams.append('email', 'your-email@example.com'); // Some APIs prefer this for identification

try {
    const response = await fetch(url.toString(), {
        headers: {
            // Add User-Agent header if required/recommended by the API
            // 'User-Agent': 'YourAppName/1.0 (Contact: your-email@example.com)'
        }
    });

    if (!response.ok) {
    console.error(`API request failed with status: ${response.status}`);
    return null;
    }

    const data = await response.json();

    // Nominatim returns an array of results. The first one is usually the best match.
    if (data && data.length > 0) {
    const result = data[0];
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);

    // Check if parsing was successful
    if (!isNaN(lat) && !isNaN(lon)) {
        return { lat, lon };
    } else {
        console.error("Failed to parse latitude/longitude from API response.");
        return null;
    }
    } else {
    console.warn(`No results found for pincode: ${pincode}`);
    return null;
    }

} catch (error) {
    console.error("Error fetching data from API:", error);
    return null;
}
}
  
