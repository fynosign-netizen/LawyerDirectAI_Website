
export interface LawyerMatch {
  name: string;
  category: string;
  state: string;
  urgency: string;
  summary: string;
}

export interface AnalysisResult {
  category: string;
  state: string;
  urgency: 'Low' | 'Medium' | 'High';
  shortSummary: string;
}

export interface Lawyer {
  id: string;
  name: string;
  initials: string;
  title: string;
  rating: number;
  reviews: number;
  specialty: string;
  yearsExperience: number;
  barNumber: string;
  consultationRate: string;
  languages: string[];
  online: boolean;
  onlineStatus: 'online' | 'offline' | 'busy';
  profilePhoto: string | null;
  verified: boolean;
}

export const US_STATES = [
  { label: 'Alabama', value: 'AL' },
  { label: 'Alaska', value: 'AK' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'California', value: 'CA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Connecticut', value: 'CT' },
  { label: 'Delaware', value: 'DE' },
  { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Hawaii', value: 'HI' },
  { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Indiana', value: 'IN' },
  { label: 'Iowa', value: 'IA' },
  { label: 'Kansas', value: 'KS' },
  { label: 'Kentucky', value: 'KY' },
  { label: 'Louisiana', value: 'LA' },
  { label: 'Maine', value: 'ME' },
  { label: 'Maryland', value: 'MD' },
  { label: 'Massachusetts', value: 'MA' },
  { label: 'Michigan', value: 'MI' },
  { label: 'Minnesota', value: 'MN' },
  { label: 'Mississippi', value: 'MS' },
  { label: 'Missouri', value: 'MO' },
  { label: 'Montana', value: 'MT' },
  { label: 'Nebraska', value: 'NE' },
  { label: 'Nevada', value: 'NV' },
  { label: 'New Hampshire', value: 'NH' },
  { label: 'New Jersey', value: 'NJ' },
  { label: 'New Mexico', value: 'NM' },
  { label: 'New York', value: 'NY' },
  { label: 'North Carolina', value: 'NC' },
  { label: 'North Dakota', value: 'ND' },
  { label: 'Ohio', value: 'OH' },
  { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Rhode Island', value: 'RI' },
  { label: 'South Carolina', value: 'SC' },
  { label: 'South Dakota', value: 'SD' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' },
  { label: 'Utah', value: 'UT' },
  { label: 'Vermont', value: 'VT' },
  { label: 'Virginia', value: 'VA' },
  { label: 'Washington', value: 'WA' },
  { label: 'West Virginia', value: 'WV' },
  { label: 'Wisconsin', value: 'WI' },
  { label: 'Wyoming', value: 'WY' },
] as const;

// Map full state names to abbreviations for AI result normalization
export const STATE_NAME_TO_ABBR: Record<string, string> = {};
US_STATES.forEach(s => {
  STATE_NAME_TO_ABBR[s.label.toLowerCase()] = s.value;
  STATE_NAME_TO_ABBR[s.value.toLowerCase()] = s.value;
});

export const getStateAbbr = (stateStr: string): string | null => {
  if (!stateStr || stateStr === 'Nationwide') return null;
  const lower = stateStr.toLowerCase().trim();
  return STATE_NAME_TO_ABBR[lower] || null;
};

export const getStateName = (abbr: string): string => {
  return US_STATES.find(s => s.value === abbr)?.label || abbr;
};
