import { useCallback } from "react";

export const CVS_API_BASE = "/api/cvs";
export const USERS_API_BASE = "/api/users";
export const FETCH_CVS_ENDPOINT = "fetchCvs";
export const FETCH_PREVIEWS_ENDPOINT = "fetchPreviews";
export const FETCH_USERS_ENDPOINT = "fetchUserData";

export const getRouteUri = (base: string, endpoint: string): string => {
  return `${base}/${endpoint}`;
};

export const useApiFetch = () => {
  const fetchFromApi = useCallback(
    async (base: string, endpoint: string, body: Record<string, any>) => {
      const response = await fetch(getRouteUri(base, endpoint), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${endpoint}`);
      }

      const data = await response.json();
      return data;
    },
    []
  );

  return fetchFromApi;
};
