import { mutate } from "swr";
import { useCallback } from "react";

export const getRouteUri = (base: string, endpoint: string): string => {
  return `${base}/${endpoint}`;
};

const postHandler = async (url: string, body: Record<string, any>) => {
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

export const useApiFetch = () => {
  const fetchFromApi = useCallback(
    async (base: string, endpoint: string, body: Record<string, any>) => {
      const apiUrl = getRouteUri(base, endpoint);

      try {
        const data = await postHandler(apiUrl, body);
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
