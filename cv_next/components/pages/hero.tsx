import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { heroHeader, routes } from "@/lib/definitions";
import { uiLocation } from "@/lib/definitions";

const credit = [
  "Ron Peer",
  "Arad Donenfeld",
  "Avner Mindelis",
  "Nevo Sznajder",
  "Yechiam Weiss",
  "Adam Liberov",
  "Denis Granovsky",
  "Ethan Krimer",
  "Ilan Yashuk",
  "Assaf Kabesa",
];

export default function HeroHeader() {
  return (
    <section className="container flex flex-col gap-4 pb-12 pt-4 text-center lg:items-center lg:gap-8 lg:py-20">
      <div className="flex flex-1 flex-col items-center gap-4 text-center lg:gap-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="flex w-full flex-row items-center justify-center text-7xl font-bold lg:text-7xl">
            {heroHeader.image !== "" ? (
              <div className="flex justify-center">
                <Image
                  src={heroHeader.image}
                  width={200}
                  height={150}
                  alt="Header image"
                />
              </div>
            ) : (
              <></>
            )}
            {heroHeader.header}
          </h1>
          <h2 className="text-lg font-light text-muted-foreground lg:text-3xl">
            {heroHeader.subheader}
          </h2>
          <h3 className="text-m whitespace-pre text-base font-light text-muted-foreground lg:text-lg">
            {heroHeader.explanation ?? ""}
          </h3>
        </div>
        <div className="flex flex-row gap-10">
          {routes
            .filter((link) => link.UILocation === uiLocation.profile)
            .map((link) => (
              <Link
                href={link.path}
                className={`w-[10rem] ${cn(buttonVariants({ size: "xs" }))}`}
                key={link.path}
              >
                {link.route}
              </Link>
            ))}
        </div>
        <div className="flex flex-row gap-10">
          {routes
            .filter((link) => link.UILocation === uiLocation.navbar)
            .map((link) => (
              <div
                className="relative flex h-80 w-80 flex-col items-center justify-end rounded-2xl bg-primary-foreground p-10 hover:rounded-3xl"
                key={"linking"}
              >
                <Link
                  href={link.path}
                  className={`w-[10rem] ${cn(buttonVariants({ size: "sm" }))}`}
                  key={link.path}
                >
                  {link.route}
                </Link>
                <div className="pointer-events-none absolute top-0 flex h-full w-full items-center justify-center opacity-20">
                  <Image
                    className="pointer-events-none absolute dark:invert"
                    src={link.image ?? ""}
                    width={250}
                    height={250}
                    alt={link.route}
                  />
                </div>
              </div>
            ))}
        </div>
        <div className="bottom-0 flex h-10 w-full items-center justify-center rounded-md px-2 text-xs text-primary opacity-50 shadow-inner">
          {`credit to our team: ${credit.slice(0, -1).join(", ")} and ${credit.slice(-1)}`}
        </div>
      </div>
    </section>
  );
}
