"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { getUser, isUserAdmin } from "@/app/actions/users/getUser";

const getUserClient = async () => {
  const userDataResponse = await getUser();
  if (userDataResponse.ok) {
    return userDataResponse.val;
  } else {
    throw { message: userDataResponse.where };
  }
};

const getUserAdminStatus = async () => {
  const adminCheckResponse = await isUserAdmin();
  if (adminCheckResponse.ok) {
    return true;
  } else {
    return false;
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

  const {
    data: userIsAdmin,
    mutate: mutateAdmin,
    error: adminError,
  } = useSWR(data?.id ? "user_admin" : null, getUserAdminStatus, {
    revalidateOnMount: false,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (mounted && !userIsAdmin && !adminError) {
      mutateAdmin();
    }
    if (mounted && userIsAdmin && adminError) {
      mutateAdmin(undefined, false);
    }
  }, [mounted, mutateAdmin, userIsAdmin, adminError]);

  const activeUser = data?.id;
  const loading = !data && !error;
  const loginState = activeUser && !error;
  //const loggedOut = error && error.status === 403; : might be useful instead of loginState

  useEffect(() => {
    if (mounted && !data && !error) {
      mutate();
    }
    if (mounted && data && error) {
      mutate(undefined, false);
    }
  }, [mounted, data, error, mutate]);

  return {
    loading,
    loginState,
    userData: data,
    userIsAdmin: userIsAdmin,
    mutateUser: mutate,
  };
};
