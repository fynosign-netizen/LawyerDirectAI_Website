const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ApiLawyer {
  id: string;
  barNumber: string;
  licenseState: string;
  title: string | null;
  specializations: string[];
  bio: string | null;
  yearsExperience: number;
  consultationRate: number;
  languages: string[];
  isAvailable: boolean;
  onlineStatus: 'online' | 'offline' | 'busy';
  rating: number;
  totalReviews: number;
  verificationStatus: string;
  profilePhoto: string | null;
  user: {
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
}

interface LawyersResponse {
  success: boolean;
  data: ApiLawyer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Some DB entries use abbreviation ("NY"), others use full name ("New York")
const STATE_ABBR_TO_NAME: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
  MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
  NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina',
  ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
  RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee',
  TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

const doFetch = async (params: {
  specialization?: string;
  state?: string;
  available?: boolean;
  limit?: number;
}): Promise<ApiLawyer[]> => {
  const query = new URLSearchParams();
  if (params.specialization) query.set('specialization', params.specialization);
  if (params.state) query.set('state', params.state);
  if (params.available !== undefined) query.set('available', String(params.available));
  if (params.limit) query.set('limit', String(params.limit));
  query.set('sort', 'rating');

  const res = await fetch(`${API_URL}/lawyers?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch lawyers');

  const json: LawyersResponse = await res.json();
  return json.data;
};

export const fetchMatchedLawyers = async (params: {
  specialization?: string;
  state?: string;
  available?: boolean;
  limit?: number;
}): Promise<ApiLawyer[]> => {
  // Try with the given state value first
  let lawyers = await doFetch(params);

  // If no results and state is an abbreviation, also try the full name (and vice versa)
  if (lawyers.length === 0 && params.state) {
    const alt = STATE_ABBR_TO_NAME[params.state]
      || Object.entries(STATE_ABBR_TO_NAME).find(([, name]) => name === params.state)?.[0];
    if (alt) {
      lawyers = await doFetch({ ...params, state: alt });
    }
  }

  return lawyers;
};
