import { useAuth0 } from "@auth0/auth0-react";
import { API_ROUTES } from "@/lib/config/api";

export function useAuthFetch() {
  const { getAccessTokenSilently } = useAuth0();

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = await getAccessTokenSilently();

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  };

  return { fetchWithAuth };
}
