// State logo mapping utility
// Maps state names to their respective logo images

export const STATE_LOGOS: { [key: string]: string } = {
  // Federal
  'Federal Ministry of Justice': '/state-logos/MoJ_logo.jpeg',
  'Federal Capital Territory': '/state-logos/FCT.jpg',
  'FCT': '/state-logos/FCT.jpg',
  
  // States (A-Z)
  'Abia State': '/state-logos/abia.jpeg',
  'Adamawa State': '/state-logos/adamawa.jpeg',
  'Akwa Ibom State': '/state-logos/Akwa Ibom.jpeg',
  'Anambra State': '/state-logos/anambra.jpeg',
  'Bauchi State': '/state-logos/Bauchi.jpeg',
  'Bayelsa State': '/state-logos/Bayelsa.jpg',
  'Benue State': '/state-logos/Benue.jpg',
  'Borno State': '/state-logos/Borno.jpeg',
  'Cross River State': '/state-logos/Cross_River.jpg',
  'Delta State': '/state-logos/Delta.jpeg',
  'Ebonyi State': '/state-logos/Ebonyi.jpg',
  'Edo State': '/state-logos/Edo_State.png',
  'Ekiti State': '/state-logos/Ekiti.jpg',
  'Enugu State': '/state-logos/Enugu.jpg',
  'Gombe State': '/state-logos/Gombe',
  'Imo State': '/state-logos/Imo.jpg',
  'Jigawa State': '/state-logos/Jigawa.jpg',
  'Kaduna State': '/state-logos/Kaduna.png',
  'Kano State': '/state-logos/Kano.jpg',
  'Katsina State': '/state-logos/Kastina.jpg',
  'Kebbi State': '/state-logos/Kebbi.jpg',
  'Kogi State': '/state-logos/Kogi.jpg',
  'Kwara State': '/state-logos/Kwara.jpg',
  'Lagos State': '/state-logos/lagos.jpeg',
  'Nasarawa State': '/state-logos/Nasarawa.jpg',
  'Niger State': '/state-logos/Niger.jpeg',
  'Ogun State': '/state-logos/Ogun.jpg',
  'Ondo State': '/state-logos/Ondo.png',
  'Osun State': '/state-logos/osun.png',
  'Oyo State': '/state-logos/oyo.joeg',
  'Plateau State': '/state-logos/Plateau.jpg',
  'Rivers State': '/state-logos/Rivers.jpg',
  'Sokoto State': '/state-logos/Sokoto.jpg',
  'Taraba State': '/state-logos/Taraba.png',
  'Yobe State': '/state-logos/Yobe.jpg',
  'Zamfara State': '/state-logos/Zamfara.jpg',
};

/**
 * Get the logo path for a given state or tenant name
 * Falls back to Coat of Arms if no specific logo exists
 */
export function getStateLogo(stateName: string): string {
  // Check for exact match
  if (STATE_LOGOS[stateName]) {
    return STATE_LOGOS[stateName];
  }
  
  // Check for partial match (case-insensitive)
  const normalizedName = stateName.toLowerCase();
  for (const [key, value] of Object.entries(STATE_LOGOS)) {
    if (normalizedName.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedName)) {
      return value;
    }
  }
  
  // Default to Coat of Arms
  return '/state-logos/Coat of Arm.png';
}

/**
 * Check if a state has a specific logo
 */
export function hasStateLogo(stateName: string): boolean {
  return getStateLogo(stateName) !== '/state-logos/Coat of Arm.png';
}
