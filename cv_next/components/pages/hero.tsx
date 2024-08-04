import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { heroHeader, routes } from "@/lib/definitions";
import { UI_Location } from "@/lib/definitions";

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
    <section className="container mx-auto flex flex-col text-center lg:items-center lg:gap-8 ">
      <div className="flex flex-1 flex-col items-center gap-4 text-center lg:gap-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="flex items-center justify-center text-4xl font-bold lg:text-7xl">
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
          {routes
            .filter((link) => link.UILocation === UI_Location.profile)
            .map((link) => (
              <Link
                href={link.path}
                className={`w-40 ${cn(buttonVariants({ size: "xs" }))}`}
                key={link.path}
              >
                {link.route}
              </Link>
            ))}
        </div>
        <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
          {routes
            .filter((link) => link.UILocation === UI_Location.navbar)
            .map((link) => (
              <div
                className="relative flex h-60 w-60 flex-col items-center justify-end rounded-2xl bg-primary-foreground p-6 hover:rounded-3xl"
                key={link.route}
              >
                <Link
                  href={link.path}
                  className={`w-full ${cn(buttonVariants({ size: "sm" }))}`}
                >
                  {link.route}
                </Link>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
                  <Image
                    className="object-cover"
                    src={link.image ?? ""}
                    width={250}
                    height={250}
                    alt={link.route}
                  />
                </div>
              </div>
            ))}
        </div>
        <div className="flex h-12 w-full items-center justify-center rounded-md px-4 text-xs text-primary opacity-50 shadow-inner">
          {`Credit to our team: ${credit.slice(0, -1).join(", ")} and ${credit.slice(-1)}`}
        </div>
      </div>
    </section>
  );
}
