
export function calculateCarbonSavings(energySavedKwh: number): { co2SavedKg: number; treesEquivalent: number } {
  const poundsPerKwh = 1.4053;
  const kgPerPound = 0.453592;
  const kgCo2PerTreeYear = 80;

  const co2SavedPounds = energySavedKwh * poundsPerKwh;
  const co2SavedKg = co2SavedPounds * kgPerPound;
  const treesEquivalent = co2SavedKg / kgCo2PerTreeYear;

  return {
    co2SavedKg: parseFloat(co2SavedKg.toFixed(2)), 
    treesEquivalent: parseFloat(treesEquivalent.toFixed(2)), 
  };
}

export default calculateCarbonSavings;

