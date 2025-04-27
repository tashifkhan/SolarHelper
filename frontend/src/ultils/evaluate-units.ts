interface Slab {
	range: string;
	rate_inr_per_kwh?: number | string; // Allow string for ranges like "3.75-4.0"
	rate_inr_per_unit?: number | string; // Alternative key used in some entries
	// Add other potential properties if needed
}

interface LocationTariff {
	fixed_charge_inr_per_kw_month?: number;
	fixed_charge_inr_per_connection_month?: number;
	slabs: Slab[];
	// Add other potential top-level properties like 'average_tariff_inr_per_kwh', 'notes', etc.
}

// --- Helper Functions ---

/**
 * Parses a slab range string into minimum and maximum units.
 * Handles formats like "0-100 units", "101-200 kWh", ">400 units", "Up to 50 units".
 * @param rangeStr - The range string from the tariff data.
 * @returns An object { min: number, max: number } or null if parsing fails.
 */
function parseRange(rangeStr: string): { min: number; max: number } | null {
	if (!rangeStr) return null;

	rangeStr = rangeStr.toLowerCase().replace(/units|kwh/g, "").trim();

	// Handle "> X" or "above X"
	const aboveMatch = rangeStr.match(/(?:>|above)\s*(\d+)/);
	if (aboveMatch) {
		const min = parseInt(aboveMatch[1], 10) + 1; // Start from the next unit
		return { min: min, max: Infinity };
	}

	// Handle "Up to X"
	const upToMatch = rangeStr.match(/up to\s*(\d+)/);
	if (upToMatch) {
		return { min: 0, max: parseInt(upToMatch[1], 10) };
	}

	// Handle "X-Y"
	const rangeMatch = rangeStr.match(/(\d+)\s*-\s*(\d+)/);
	if (rangeMatch) {
		const min = parseInt(rangeMatch[1], 10);
		const max = parseInt(rangeMatch[2], 10);
		// Adjust min for ranges like 0-100, 101-200 (make min inclusive)
		const adjustedMin = min === 0 ? 0 : min;
		return { min: adjustedMin, max: max };
	}

	// Handle single value ranges like "first 100" - assume 0-100
	const firstMatch = rangeStr.match(/first\s*(\d+)/);
	if (firstMatch) {
		return { min: 0, max: parseInt(firstMatch[1], 10) };
	}

	// Handle specific cases like "usage exceeding 300 units"
	const exceedingMatch = rangeStr.match(/exceeding\s*(\d+)/);
	if (exceedingMatch) {
		return { min: parseInt(exceedingMatch[1], 10) + 1, max: Infinity };
	}

	console.warn(`Could not parse range string: "${rangeStr}"`);
	return null;
}

/**
 * Parses a rate value, which might be a number or a string like "3.75-4.0".
 * @param rateVal - The rate value from the slab data.
 * @returns A single numeric rate (average if range) or null if invalid.
 */
function parseRate(rateVal: number | string | undefined): number | null {
	if (typeof rateVal === "number") {
		return rateVal;
	}
	if (typeof rateVal === "string") {
		const rangeMatch = rateVal.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
		if (rangeMatch) {
			// Return the average of the range
			return (
				(parseFloat(rangeMatch[1]) + parseFloat(rangeMatch[2])) / 2
			);
		}
		// Try parsing as a single number string
		const num = parseFloat(rateVal);
		if (!isNaN(num)) {
			return num;
		}
	}
	console.warn(`Could not parse rate value: "${rateVal}"`);
	return null;
}

// --- Main Calculation Function ---

/**
 * Estimates the monthly electricity units (kWh) consumed based on the bill amount
 * and the tariff structure for a specific location.
 *
 * NOTE: This is an estimation. It simplifies complex tariff rules (like
 * different slabs based on total consumption, time-of-day charges, demand charges,
 * taxes, duties, and subsidies not explicitly listed in the slabs).
 * It prioritizes slab rates and simple fixed charges per connection.
 * Per-kW fixed charges are ignored as connected load is unknown.
 * If tariff data for the location is not found, it uses a fallback estimation (bill / 4).
 *
 * @param monthlyBill - The total monthly electricity bill amount in INR.
 * @param locationTariff - The tariff object for the specific location (state/UT/district), or undefined if not found.
 * @returns The estimated number of units (kWh) consumed, or null if the bill amount is invalid.
 */
export function calculateUnitsFromBill(
	monthlyBill: number,
	locationTariff: LocationTariff | undefined
): number | null {
	if (monthlyBill <= 0) {
		console.error("Invalid input: Non-positive bill amount.");
		return null;
	}

	// Fallback if location tariff is not found
	if (!locationTariff) {
		console.warn("Location tariff not found. Using fallback estimation (bill / 4).");
		return Math.round(monthlyBill / 4);
	}

	// Proceed with detailed calculation if tariff exists
	if (!locationTariff.slabs) {
		console.error("Invalid tariff data: Missing slabs.");
		// Optionally, could also return fallback here, but indicates a data issue
		return Math.round(monthlyBill / 4); // Or return null
	}

	let remainingBill = monthlyBill;
	let totalUnits = 0;

	// 1. Subtract simple fixed charges (per connection) if available
	if (locationTariff.fixed_charge_inr_per_connection_month) {
		remainingBill -= locationTariff.fixed_charge_inr_per_connection_month;
		if (remainingBill < 0) remainingBill = 0; // Bill might just be fixed charge
	}
	// Ignoring fixed_charge_inr_per_kw_month as we don't know the kW load.

	// 2. Parse and sort slabs
	const parsedSlabs = locationTariff.slabs
		.map((slab) => {
			const range = parseRange(slab.range);
			// Use rate_inr_per_kwh first, fallback to rate_inr_per_unit
			const rate = parseRate(slab.rate_inr_per_kwh ?? slab.rate_inr_per_unit);
			if (range && rate !== null) {
				return { ...range, rate };
			}
			return null;
		})
		.filter((s): s is { min: number; max: number; rate: number } => s !== null) // Type guard
		.sort((a, b) => a.min - b.min); // Sort by starting unit

	if (parsedSlabs.length === 0) {
		console.error("No valid/parseable slabs found in the tariff data.");
		return null;
	}

	// 3. Iterate through slabs and calculate units
	for (const slab of parsedSlabs) {
		if (remainingBill <= 0) break;

		// Calculate the maximum number of units in this slab
		// For the first slab (min=0), units are just 'max'.
		// For subsequent slabs, units are 'max - previous_max'.
		// Let's adjust min=0 for the first slab for simpler calculation.
		const slabMinUnits = slab.min === 0 ? 0 : slab.min;
		const slabMaxUnits = slab.max === Infinity ? Infinity : slab.max;

		// Find the previous slab's max to determine the start unit for this slab's range
		const previousSlabMax = parsedSlabs
			.filter(s => s.max < slabMinUnits)
			.reduce((max, s) => Math.max(max, s.max), 0);

		const unitsInSlabRange = slabMaxUnits - previousSlabMax;

		if (unitsInSlabRange <= 0 && slabMaxUnits !== Infinity) {
			// Skip potentially overlapping or incorrectly defined ranges
			continue;
		}

		// Cost to fully utilize this slab's range
		const costOfSlabRange = unitsInSlabRange * slab.rate;

		if (remainingBill >= costOfSlabRange && slabMaxUnits !== Infinity) {
			// Consume the entire slab
			totalUnits += unitsInSlabRange;
			remainingBill -= costOfSlabRange;
		} else {
			// Consume part of the slab (or the rest of the bill falls into this infinite slab)
			const unitsInThisSlab = remainingBill / slab.rate;
			totalUnits += unitsInThisSlab;
			remainingBill = 0; // All bill accounted for
			break; // Exit loop
		}
	}

	// Handle cases where the bill might be less than the cost of the first slab units
	if (totalUnits === 0 && remainingBill > 0 && parsedSlabs.length > 0) {
	    const firstSlabRate = parsedSlabs[0].rate;
	    if (firstSlabRate > 0) {
	        totalUnits = remainingBill / firstSlabRate;
	        remainingBill = 0;
	    }
	}

	// If bill remains after iterating all slabs (e.g., due to rounding or unparsed charges),
	// it might indicate an issue or uncaptured costs. We return the calculated units anyway.
	if (remainingBill > 0.01) { // Use a small threshold for floating point inaccuracies
		console.warn(`Remaining bill amount (${remainingBill.toFixed(2)}) after calculation. Result might be inaccurate.`);
	}

	return Math.round(totalUnits); // Return estimated units, rounded
}

// --- Pincode-based Unit Calculation ---
import getPincodeLocation from "./evaluate-pincode"; // Import the pincode helper

/**
 * Fetches tariff data based on pincode, then estimates monthly units from the bill.
 * @param bill - The total monthly electricity bill amount in INR.
 * @param pincode - The 6-digit Indian pincode string.
 * @returns A Promise resolving to the estimated number of units (kWh) or null if calculation fails.
 */
export async function getUnitsForBillFromPincode(bill: number, pincode: string): Promise<number | null> {
    try {
        // 1. Determine location from pincode
        const locationName = getPincodeLocation(pincode);

        let tariff: LocationTariff | undefined = undefined;

        if (locationName && locationName !== "Army Post Office (APO/FPO)") {
            // 2. Fetch the tariff data (assuming it's served at this path)
            // TODO: Adjust the fetch path as needed for your application structure
            const response = await fetch('/unitcost.json');
            if (!response.ok) {
                // Don't throw an error, allow fallback calculation
                console.warn(`Could not fetch tariff data! status: ${response.status}. Proceeding with fallback.`);
            } else {
                 const allTariffs: { [key: string]: LocationTariff } = await response.json();
                 // 3. Find the specific tariff using the location name from pincode
                 tariff = allTariffs[locationName];

                 if (!tariff) {
                     console.warn(`Tariff data not found for location: ${locationName} (derived from pincode ${pincode}). Proceeding with fallback.`);
                 }
            }
        } else {
             console.warn(`Could not determine a valid tariff location for pincode: ${pincode}. Proceeding with fallback.`);
        }

        // 4. Calculate units using the found tariff or fallback logic within calculateUnitsFromBill
        const units = calculateUnitsFromBill(bill, tariff);

        if (units !== null) {
            console.log(`Estimated units for a ₹${bill} bill (Pincode: ${pincode}, Location: ${locationName || 'Unknown'}): ${units} kWh`);
            return units;
        } else {
            console.log(`Could not estimate units for pincode ${pincode}.`);
            return null;
        }

    } catch (error) {
        console.error("Error processing pincode or fetching tariff data:", error);
        return null; // Return null on general errors
    }
}


// Example call using the new function:
async function runExample() {
    const units1 = await getUnitsForBillFromPincode(15000, "110001"); // Delhi example
    const units2 = await getUnitsForBillFromPincode(8000, "380001");  // Gujarat example
    const units3 = await getUnitsForBillFromPincode(5000, "999999");  // Invalid pincode example (should use fallback)

    console.log(`Units for ₹15000 bill in Delhi: ${units1}`);
    console.log(`Units for ₹8000 bill in Gujarat: ${units2}`);  
    console.log(`Units for ₹5000 bill in Invalid Pincode: ${units3}`); // Should use fallback
}
runExample();
