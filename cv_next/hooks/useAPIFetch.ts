import { useCallback } from "react";

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
