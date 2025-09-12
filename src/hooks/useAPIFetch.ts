import { mutate } from "swr";
import { useCallback } from "react";

export const getRouteUri = (base: string, endpoint: string): string => {
  return `${base}/${endpoint}`;
};

const postHandler = async (
  url: string,
  body: Record<string, any>,
  timeout: number = 5000
) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error(`Request to ${url} timed out after ${timeout}ms`);
      }
    }
    throw error;
  } finally {
    clearTimeout(id);
  }
};

export const useApiFetch = () => {
  const fetchFromApi = useCallback(
    async (
      base: string,
      endpoint: string,
      body: Record<string, any>,
      timeout: number = 10000
    ) => {
      const apiUrl = getRouteUri(base, endpoint);

      try {
        const data = await postHandler(apiUrl, body, timeout);
        mutate(apiUrl, data, false);
        return data;
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("timed out after")) {
            //redundat to log this
            return;
          }
          throw error;
        } else {
          if ((error as Error).message.includes("CV is private")) {
            return { error: "CV_IS_PRIVATE" };
          }
          throw new Error("An unknown error occurred during the API fetch");
        }
      }
    },
    []
  );

  return fetchFromApi;
};
