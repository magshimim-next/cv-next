"use client";

import { getUserModel, getUserSession } from "@/app/actions/users/getUser";
import { useEffect, useState } from "react";
import useSWR from "swr";

const getUserClient = async () => {
    const session = await getUserSession();
    const userSession = session?.data?.user;
    let userData;
    if (userSession) {
        const dataFetch = await getUserModel(userSession.id);
        if (dataFetch.ok) {
            userData = dataFetch.val;
        }
    }
    return {
        session,
        userData
    }
}

export const useUser = () => {
    const [ mounted, setMounted ] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { data, mutate, error } = useSWR('user', getUserClient, {
        revalidateOnMount: false,
        revalidateOnFocus: false
    });

    const activeUser = data?.session?.data?.user;
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
        userSession: activeUser || undefined,
        userData: data?.userData || undefined,
        mutateUser: mutate
    };
}