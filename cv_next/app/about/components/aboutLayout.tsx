"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Visible_Error_Messages,
  heroHeader,
  routes,
  UI_Location,
} from "@/lib/definitions";
import { useError } from "@/providers/error-provider";
import Login from "./login";

export const AboutLayout = () => {
  const searchparams = useSearchParams();
  const { showError } = useError();
  const router = useRouter();
  const error = searchparams.get("error");

  useEffect(() => {
    if (error === Visible_Error_Messages.InactiveUser.keyword) {
      showError(
        Visible_Error_Messages.InactiveUser.title,
        Visible_Error_Messages.InactiveUser.description,
        () => router.push("/signout")
      );
    } else if (error != null) {
      showError(
        Visible_Error_Messages.DefaultError.title,
        Visible_Error_Messages.DefaultError.description
      );
    }
  }, [error, showError, router]);

  return (
    <main className="p-4">
      <section className="container mx-auto flex flex-col text-center lg:items-center lg:gap-8 ">
        <div className="flex flex-1 flex-col items-center gap-4 text-center lg:gap-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h1 className="flex select-none items-center justify-center text-4xl font-bold lg:text-7xl">
              {heroHeader.image && (
                <div className="mr-4 flex-shrink-0">
                  <Image
                    src={heroHeader.image}
                    width={125}
                    height={75}
                    alt="Header image"
                    className="object-cover"
                    draggable="false"
                  />
                </div>
              )}
              {heroHeader.header}
            </h1>
            <h2 className="text-xl font-light text-muted-foreground lg:text-3xl">
              {heroHeader.subheader}
            </h2>
            <h3 className="text-base font-light text-muted-foreground lg:text-lg">
              {heroHeader.explanation ?? ""}
            </h3>
          </div>
          <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
            <Login />
          </div>
          <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
            <RoutesRender />
          </div>
        </div>
      </section>
    </main>
  );
};

const RoutesRender = () => {
  return (
    <>
      {routes
        .filter((link) => link.UILocation === UI_Location.navbar)
        .map((link) => (
          <Link
            href={link.path}
            key={link.route}
            className="relative flex h-60 w-60 flex-col items-center justify-end rounded-2xl bg-primary-foreground p-6"
          >
            <div className={`w-full ${cn(buttonVariants({ size: "sm" }))}`}>
              {link.route}
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
              <Image
                className="pointer-events-none absolute mb-6 dark:invert"
                src={link.image ?? ""}
                width={175}
                height={175}
                alt={link.route}
              />
            </div>
          </Link>
        ))}
    </>
  );
};
