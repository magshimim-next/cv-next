"use client";

import { useSupabase } from "./supabase";
import useSWR from "swr";


export const useUser = () => {
    const supabase = useSupabase();
    const { data, mutate, error } = useSWR('user', supabase.auth.getUser);

    const loading = !data && !error;
    const loginState = data && !error;
    //const loggedOut = error && error.status === 403; : might be useful instead of loginState

    return {
        loading,
        loginState,
        user: data,
        mutateUser: mutate
    };
}