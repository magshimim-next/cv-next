import { mutate } from "swr";
import { useCallback } from "react";

export const getRouteUri = (base: string, endpoint: string): string => {
  return `${base}/${endpoint}`;
};

const postFetcher = async (url: string, body: Record<string, any>) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }

  return response.json();
};

// Hook for POST requests
export const useApiFetch = () => {
  // Function to trigger a POST request
  const fetchFromApi = useCallback(
    async (base: string, endpoint: string, body: Record<string, any>) => {
      const apiUrl = getRouteUri(base, endpoint);

      // Call postFetcher directly
      try {
        const data = await postFetcher(apiUrl, body);
        // Optionally update the cache
        mutate(apiUrl, data, false);
        return data;
      } catch (error) {
        throw error;
      }
    },
    []
  );

  return fetchFromApi;
};
