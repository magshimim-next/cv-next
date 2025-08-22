"use client";

import { useRouter, useSearchParams } from "next/navigation";
import warning from "@/public/images/warning_red_dark.png";
import { Button } from "@/components/ui/button";
import { sanitizeLink } from "@/helpers/cvLinkRegexHelper";

export default function RedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toParam = searchParams.get("to") ?? undefined;
  const targetUrl = sanitizeLink(toParam);
  const displayText = targetUrl ?? "Invalid url";

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="flex flex-col items-center justify-center space-y-6 sm:mt-16">
          <img
            alt="warning"
            src={warning.src}
            className="w-40 sm:w-56 md:w-64"
          />
          <h1 className="text-center text-3xl font-bold md:text-left md:text-6xl">
            You are about to leave CV Next and go to
          </h1>
        </div>

        <h2 className="max-w-[90vw] text-center text-lg md:text-left md:text-2xl">
          <span className="mt-2 block break-all font-semibold md:inline">
            {displayText}
          </span>
        </h2>

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" onClick={() => router.back()}>
            Go Back
          </Button>
          {targetUrl ? (
            <Button asChild>
              <a href={targetUrl} rel="noopener noreferrer" target="_self">
                Continue
              </a>
            </Button>
          ) : (
            <Button disabled>Continue</Button>
          )}
        </div>
      </div>
    </div>
  );
}
