export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ROUTES = {
  schedule: `${API_URL}/schedule`,
  events: `${API_URL}/events`,
  // Add other endpoints as needed
} as const;
