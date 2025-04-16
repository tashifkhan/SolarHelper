// --- Comprehensive Delhi Pincode to District Map ---
const delhiPincodeToDistrictMap: { [key: string]: string } = {
    "110001": "New Delhi",
    "110002": "Central Delhi",
    "110003": "South Delhi",
    "110004": "New Delhi", // Rashtrapati Bhawan
    "110005": "Central Delhi", // Karol Bagh area
    "110006": "Central Delhi", // Sadar Bazar area
    "110007": "North Delhi", // Civil Lines area
    "110008": "West Delhi", // Patel Nagar area
    "110009": "North Delhi", // Model Town area
    "110010": "South West Delhi", // Delhi Cantt area
    "110011": "New Delhi", // Parliament Street area
    "110012": "New Delhi", // Indraprastha area
    "110013": "South East Delhi", // Lajpat Nagar area
    "110014": "South East Delhi", // Nizamuddin area
    "110015": "West Delhi", // Rajouri Garden area
    "110016": "South Delhi", // Hauz Khas area
    "110017": "South Delhi", // Malviya Nagar area
    "110018": "West Delhi", // Tilak Nagar area
    "110019": "South East Delhi", // Kalkaji area
    "110020": "South Delhi", // Vasant Kunj area
    "110021": "South West Delhi", // Palam area
    "110022": "South Delhi", // R K Puram area
    "110023": "South Delhi", // Sarojini Nagar area
    "110024": "South East Delhi", // Defence Colony area
    "110025": "South East Delhi", // Okhla Industrial Area
    "110026": "West Delhi", // Punjabi Bagh area
    "110027": "West Delhi", // Janakpuri area
    "110028": "South West Delhi", // Naraina area
    "110029": "South Delhi", // Green Park area
    "110030": "South Delhi", // Vasant Vihar area
    "110031": "East Delhi", // Gandhi Nagar area
    "110032": "Shahdara", // Shahdara area
    "110033": "North West Delhi", // Saraswati Vihar area
    "110034": "North West Delhi", // Pitampura area
    "110035": "North West Delhi", // Shalimar Bagh area
    "110036": "North Delhi", // Alipur area
    "110037": "South West Delhi", // IGI Airport area
    "110038": "South West Delhi", // Delhi Cantt (Sadar Bazar)
    "110039": "North Delhi", // Narela area
    "110040": "North Delhi", // Narela Industrial Area
    "110041": "North West Delhi", // Rohini Sector 7,8,9 area
    "110042": "North West Delhi", // Ashok Vihar area
    "110043": "South West Delhi", // Kapashera area
    "110044": "South East Delhi", // Badarpur area
    "110045": "South West Delhi", // Najafgarh area
    "110046": "South West Delhi", // Nangloi area (often considered West Delhi too)
    "110047": "South Delhi", // Mehrauli area
    "110048": "South East Delhi", // Nehru Place area
    "110049": "South Delhi", // Hauz Khas Enclave area
    "110051": "East Delhi", // Krishna Nagar area
    "110052": "North West Delhi", // Wazirpur Industrial Area
    "110053": "Shahdara", // Jhilmil Industrial Area
    "110054": "North Delhi", // Delhi University area
    "110055": "Central Delhi", // Paharganj area
    "110056": "Central Delhi", // Anand Parbat area
    "110057": "South Delhi", // Chhatarpur area
    "110058": "West Delhi", // Vikaspuri area
    "110059": "West Delhi", // Uttam Nagar area
    "110060": "Central Delhi", // Karol Bagh (Ajmal Khan Road)
    "110061": "South West Delhi", // Dwarka Sector 1-10 area
    "110062": "South Delhi", // Saket area
    "110063": "West Delhi", // Paschim Vihar area
    "110064": "West Delhi", // Hari Nagar area
    "110065": "South East Delhi", // Sarita Vihar area
    "110066": "New Delhi", // Lodi Road area
    "110067": "South Delhi", // Munirka area
    "110068": "South Delhi", // IGNOU area
    "110069": "New Delhi", // Connaught Place area (specific PO)
    "110070": "South Delhi", // Vasant Kunj area (specific PO)
    "110071": "South West Delhi", // Palam Village area
    "110072": "South West Delhi", // Najafgarh (Dhansa)
    "110073": "South West Delhi", // Najafgarh (Jharoda Kalan)
    "110074": "South Delhi", // Fatehpur Beri area
    "110075": "South West Delhi", // Dwarka Sector 11-23 area
    "110076": "South East Delhi", // Jamia Nagar area
    "110077": "South West Delhi", // Dwarka (Palam Extn)
    "110078": "South West Delhi", // Dwarka Sector 14 area
    "110081": "North West Delhi", // Kanjhawala area
    "110082": "North West Delhi", // Bawana area
    "110083": "West Delhi", // Nangloi II, III
    "110084": "North West Delhi", // Rohini Sector 11 area
    "110085": "North West Delhi", // Rohini Sector 15, 16, 17 area
    "110086": "North West Delhi", // Rohini Sector 21, 22, 23 area
    "110087": "West Delhi", // Paschim Vihar Extn
    "110088": "North West Delhi", // Peeragarhi area
    "110090": "North East Delhi", // Bhajanpura area
    "110091": "East Delhi", // Mayur Vihar Phase 1 area
    "110092": "East Delhi", // Patparganj area
    "110093": "Shahdara", // Dilshad Garden area
    "110094": "North East Delhi", // Karawal Nagar area
    "110095": "Shahdara", // Nand Nagri area
    "110096": "East Delhi", // Mayur Vihar Phase 3 area
  };
  
  /**
   * Attempts to determine the Indian state, Union Territory, or specific
   * Delhi district based on a 6-digit pincode.
   *
   * @param pincode - The 6-digit Indian pincode as a string.
   * @returns The likely state/UT/district name as a string, or null if the
   *          pincode is invalid or the prefix is unrecognized.
   */
  function getPincodeLocation(pincode: string): string | null {
    // 1. Validate the input pincode format
    if (!/^\d{6}$/.test(pincode)) {
      console.error(`Invalid pincode format: ${pincode}`);
      return null;
    }
  
    // 2. Extract the 2-digit prefix
    const prefix = pincode.substring(0, 2);
  
    // 3. Map prefix to state/UT or specific Delhi district
    switch (prefix) {
      // --- Special Handling for Delhi using the comprehensive map ---
      case "11":
        const district = delhiPincodeToDistrictMap[pincode];
        // If found in the map, return it. Otherwise, return a fallback.
        return district ? district : "Delhi";
  
      // Zone 1 (Excluding Delhi)
      case "12":
      case "13":
        return "Haryana";
      case "14":
      case "15":
        return "Punjab";
      case "16":
        return "Punjab / Chandigarh";
      case "17":
        return "Himachal Pradesh / Punjab / Chandigarh";
      case "18":
      case "19":
        return "Jammu and Kashmir / Ladakh";
  
      // Zone 2
      case "20":
      case "21":
      case "22":
      case "23":
      case "28":
        return "Uttar Pradesh";
      case "24":
      case "25":
      case "26":
      case "27":
        return "Uttar Pradesh / Uttarakhand";
  
      // Zone 3
      case "30":
      case "31":
      case "32":
      case "33":
      case "34":
        return "Rajasthan";
      case "36":
      case "37":
      case "38":
        return "Gujarat";
      case "39":
        return "Gujarat / Dadra and Nagar Haveli and Daman and Diu";
  
      // Zone 4
      case "40":
      case "41":
      case "42":
      case "43":
      case "44":
        return "Maharashtra";
      case "45":
      case "46":
      case "47":
      case "48":
        return "Madhya Pradesh";
      case "49":
        return "Chhattisgarh / Madhya Pradesh";
  
      // Zone 5
      case "50":
      case "51":
      case "52":
      case "53":
        return "Andhra Pradesh / Telangana";
  
      // Zone 6
      case "56":
      case "57":
      case "58":
      case "59":
        return "Karnataka";
      case "60":
      case "61":
      case "62":
      case "63":
      case "64":
        return "Tamil Nadu / Puducherry (parts)";
      case "67":
      case "68":
      case "69":
        return "Kerala / Lakshadweep (parts)";
  
      // Zone 7
      case "70":
      case "71":
      case "72":
      case "73":
        return "West Bengal";
      case "74":
        return "West Bengal / Sikkim / Andaman and Nicobar Islands";
      case "75":
      case "76":
      case "77":
        return "Odisha";
      case "78":
        return "Assam";
      case "79":
        return "Northeastern States (Assam/Arunachal/Manipur/Meghalaya/Mizoram/Nagaland/Tripura)";
  
      // Zone 8
      case "80":
      case "81":
      case "82":
      case "83":
      case "84":
      case "85":
        return "Bihar / Jharkhand";
  
      // Zone 9 - Army Post Offices
      case "90":
      case "91":
      case "92":
      case "93":
      case "94":
      case "95":
      case "96":
      case "97":
      case "98":
      case "99":
        return "Army Post Office (APO/FPO)";
  
      // Default case for unrecognized prefixes
      default:
        console.warn(`Unrecognized pincode prefix: ${prefix}`);
        return null;
    }
  }
  
export default getPincodeLocation;