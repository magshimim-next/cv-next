"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Credits,
  ERROR_MESSAGES,
  heroHeader,
  routes,
  UI_Location,
} from "@/lib/definitions";

import PopupWrapper from "@/components/ui/popupWrapper";
import { LoginButtons } from "./components/loginButtons";

export default function Home() {
  const searchparams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>();
  const [errorDescription, setErrorDescription] = useState<string | null>();
  const router = useRouter();

  useEffect(() => {
    const error = searchparams.get("error");
    if (error == ERROR_MESSAGES.InactiveUser.keyword) {
      setErrorMsg(ERROR_MESSAGES.InactiveUser.title);
      setErrorDescription(ERROR_MESSAGES.InactiveUser.description);
    } else if (error != null) {
      setErrorMsg(ERROR_MESSAGES.DefaultError.title);
      setErrorDescription(ERROR_MESSAGES.DefaultError.description);
    }
  }, [searchparams]);

  return (
    <main className="p-4">
      <section className="container mx-auto flex flex-col text-center lg:items-center lg:gap-8 ">
        <div className="flex flex-1 flex-col items-center gap-4 text-center lg:gap-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h1 className="flex items-center justify-center text-4xl font-bold lg:text-7xl">
              {errorMsg && (
                <PopupWrapper
                  onClose={() => {
                    setErrorMsg(null);
                    router.push("/signout");
                  }}
                >
                  <div className="flex flex-col items-center justify-center rounded-md border-2 border-black bg-red-700 px-4 py-2 text-white">
                    <div className="text-xl font-bold">{errorMsg}</div>
                    {errorDescription && (
                      <div className="mt-2 text-lg text-white/90">
                        {errorDescription}
                      </div>
                    )}
                  </div>
                </PopupWrapper>
              )}
              {heroHeader.image && (
                <div className="mr-4 flex-shrink-0">
                  <Image
                    src={heroHeader.image}
                    width={125}
                    height={75}
                    alt="Header image"
                    className="object-cover"
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
            <LoginButtons />
          </div>
          <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
            <RoutesRender />
          </div>
          <div className="flex h-12 w-full items-center justify-center rounded-md px-4 text-xs text-primary opacity-50 shadow-inner">
            {`Credit to our team: ${Credits.slice(0, -1).join(", ")} and ${Credits.slice(-1)}`}
          </div>
        </div>
      </section>
    </main>
  );
}

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
