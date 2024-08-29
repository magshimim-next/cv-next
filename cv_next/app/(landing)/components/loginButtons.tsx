"use client";

import Link from "next/link";
import { useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { UI_Location, routes } from "@/lib/definitions";
import { cn } from "@/lib/utils";

export const LoginButtons = () => {
  const { loading, loginState, mutateUser } = useUser();

  useEffect(() => {
    mutateUser();
  }, [mutateUser]);

  if (loading) return <></>; //TODO: perhaps render loading state

  const profileRoutes = routes.filter(
    (link) => link.UILocation === UI_Location.profile
  );

  const loginValue = !loginState
    ? profileRoutes.filter((route) => route.path.includes("login"))[0]
    : profileRoutes.filter((route) => route.path.includes("signout"))[0];
  //TODO: probably need definition change

  return (
    <Link
      href={loginValue.path}
      className={`w-40 ${cn(buttonVariants({ size: "xs" }))}`}
      key={loginValue.path}
    >
      {loginValue.route}
    </Link>
  );
};
