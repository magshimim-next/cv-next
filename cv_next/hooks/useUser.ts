"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { getUser } from "@/app/actions/users/getUser";

const getUserClient = async () => {
  const userDataResponse = await getUser();
  if (userDataResponse.ok) {
    return userDataResponse.val;
  } else {
    throw { message: userDataResponse.where };
  }
};

export const useUser = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, mutate, error } = useSWR("user", getUserClient, {
    revalidateOnMount: false,
    revalidateOnFocus: false,
    onErrorRetry: (
      error: { message: string },
      key,
      config,
      revalidate,
      { retryCount }
    ) => {
      if (error.message.includes("403") || error.message.includes("400")) {
        //don't retry if user is signed out
        return;
      }
      // Only retry up to 10 times.
      if (retryCount >= 10) return;

      // Retry after 5 seconds.
      setTimeout(() => revalidate({ retryCount }), 5000);
    },
  });

  const activeUser = data?.id;
  const loading = !data && !error;
  const loginState = activeUser && !error;
  //const loggedOut = error && error.status === 403; : might be useful instead of loginState

  useEffect(() => {
    if (mounted && !data && !error) {
      mutate();
    }
  }, [mounted, data, error, mutate]);

  return {
    loading,
    loginState,
    userData: data,
    mutateUser: mutate,
  };
};
