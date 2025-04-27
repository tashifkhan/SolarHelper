
interface LatLon {
    lat: number;
    lon: number;
}

const NOMINATIM_API_BASE_URL = "https://nominatim.openstreetmap.org/search";

/**
 * Converts an Indian Pincode to Latitude and Longitude using an external API.
 * @param pincode - The 6-digit Indian pincode string.
 * @returns A Promise resolving to an object { lat: number, lon: number } or null if not found or an error occurred.
 */
async function getLatLonFromPincode(pincode: string): Promise<LatLon | null> {
if (!pincode || !/^\d{6}$/.test(pincode)) {
    console.error("Invalid Indian pincode format. Must be a 6-digit number.");
    return null;
}


const url = new URL(NOMINATIM_API_BASE_URL);
url.searchParams.append('postalcode', pincode);
url.searchParams.append('country', 'India'); 
url.searchParams.append('format', 'json'); 
url.searchParams.append('limit', '1'); 
url.searchParams.append('addressdetails', '0'); 

try {
    const response = await fetch(url.toString(), {});

    if (!response.ok) {
    console.error(`API request failed with status: ${response.status}`);
    return null;
    }

    const data = await response.json();

    if (data && data.length > 0) {
    const result = data[0];
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);

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
  
export default getLatLonFromPincode ;