// Utility function to generate MOJ File Number
// Format: MOJ/YEAR/STATE-CODE/SEQUENTIAL-NUMBER
// Example: MOJ/2024/LA/00001, MOJ/2024/FCT/00123

/**
 * Generate a unique MOJ File Number
 * @param stateCode - State code (e.g., 'LA' for Lagos, 'FCT' for Federal Capital Territory)
 * @param sequentialNumber - Sequential number for the case (optional, will be auto-generated if not provided)
 * @returns Formatted MOJ File Number
 */
export function generateMOJFileNumber(
  stateCode: string,
  sequentialNumber?: number
): string {
  const currentYear = new Date().getFullYear();
  
  // If no sequential number provided, generate a random one (will be replaced by actual DB sequence)
  const seqNum = sequentialNumber || Math.floor(Math.random() * 99999) + 1;
  
  // Pad the sequential number with leading zeros (5 digits)
  const paddedSeqNum = seqNum.toString().padStart(5, '0');
  
  // Format: MOJ/YEAR/STATE-CODE/SEQUENTIAL-NUMBER
  return `MOJ/${currentYear}/${stateCode.toUpperCase()}/${paddedSeqNum}`;
}

/**
 * Extract state code from state name
 * @param stateName - Full state name (e.g., 'Lagos State', 'Federal Capital Territory')
 * @returns State code
 */
export function getStateCodeFromName(stateName: string): string {
  const stateCodeMap: { [key: string]: string } = {
    'Abia State': 'AB',
    'Adamawa State': 'AD',
    'Akwa Ibom State': 'AK',
    'Anambra State': 'AN',
    'Bauchi State': 'BA',
    'Bayelsa State': 'BY',
    'Benue State': 'BE',
    'Borno State': 'BO',
    'Cross River State': 'CR',
    'Delta State': 'DE',
    'Ebonyi State': 'EB',
    'Edo State': 'ED',
    'Ekiti State': 'EK',
    'Enugu State': 'EN',
    'Gombe State': 'GO',
    'Imo State': 'IM',
    'Jigawa State': 'JI',
    'Kaduna State': 'KD',
    'Kano State': 'KN',
    'Katsina State': 'KT',
    'Kebbi State': 'KE',
    'Kogi State': 'KO',
    'Kwara State': 'KW',
    'Lagos State': 'LA',
    'Nasarawa State': 'NA',
    'Niger State': 'NI',
    'Ogun State': 'OG',
    'Ondo State': 'ON',
    'Osun State': 'OS',
    'Oyo State': 'OY',
    'Plateau State': 'PL',
    'Rivers State': 'RI',
    'Sokoto State': 'SO',
    'Taraba State': 'TA',
    'Yobe State': 'YO',
    'Zamfara State': 'ZA',
    'Federal Capital Territory': 'FCT',
    'FCT': 'FCT',
    'Federal Ministry of Justice': 'FMJ',
  };

  // Try exact match first
  if (stateCodeMap[stateName]) {
    return stateCodeMap[stateName];
  }

  // Try partial match (case-insensitive)
  const normalizedName = stateName.toLowerCase();
  for (const [key, value] of Object.entries(stateCodeMap)) {
    if (normalizedName.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedName)) {
      return value;
    }
  }

  // Default to first 3 letters if no match found
  return stateName.substring(0, 3).toUpperCase();
}

/**
 * Get the next sequential number for a state
 * This should be called from the API to get the actual count from database
 */
export async function getNextSequentialNumber(
  stateCode: string,
  currentYear: number
): Promise<number> {
  void stateCode;
  void currentYear;
  // This is a placeholder - actual implementation should query the database
  // to get the count of cases for this state in the current year
  // For now, return a random number (will be implemented in API)
  return Math.floor(Math.random() * 99999) + 1;
}
