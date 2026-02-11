const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function trackVisit(path: string) {
  try {
    await fetch(`${API_URL}/tracking/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, referrer: document.referrer }),
    });
  } catch {
    // Silent fail — tracking should never break the app
  }
}
