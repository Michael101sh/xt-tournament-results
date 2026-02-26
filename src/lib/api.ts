const API_BASE = "/api/v1";

export const fetchSuspects = async (): Promise<number[]> => {
  const response = await fetch(`${API_BASE}/players/suspects`);
  if (!response.ok) {
    throw new Error(`Failed to fetch suspects: ${response.status}`);
  }

  return response.json();
};
