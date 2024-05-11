import Link from "next/link"
import Image from "next/image"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { heroHeader, routes } from "@/lib/definitions"

const credit = [
  'Ron Peer', 
  'Arad Donenfeld', 
  'Avner Mindelis', 
  'Nevo Sznajder', 
  'Yechiam Weiss', 
  'Nehoray Gil', 
  'Adam Liberov', 
  'Denis Granovsky', 
  'Ethan Krimer',
  'Ilan Yashuk'
]

export default function HeroHeader() {
  return (
    <section className="container flex flex-col gap-4 pb-12 pt-4 text-center lg:items-center lg:gap-8 lg:py-20">
      <div className="flex flex-1 flex-col items-center gap-4 text-center lg:gap-8">
        <div className="space-y-4 flex flex-col items-center justify-center">
          <h1 className="text-7xl font-bold lg:text-7xl flex flex-row justify-center items-center w-full">
            {
              heroHeader.image !== "" ? (
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
              )
            }
            {heroHeader.header}
          </h1>
          <h2 className="text-lg font-light text-muted-foreground lg:text-3xl">
            {heroHeader.subheader}
          </h2>
          <h3 className="text-m text-base font-light text-muted-foreground lg:text-lg whitespace-pre">
            {heroHeader.explenetion ?? ''}
          </h3>
        </div> 
        <div className="flex flex-row gap-10">
          {
            routes.filter(link => link.UILocation === 'profile').map((link) => (
              <Link
                href={link.path}
                target="_blank"
                className={`w-[10rem] ${cn(buttonVariants({ size: "xs" }))}`}
              >
                {link.route}
              </Link>
            ))
          }
        </div>
        <div className="flex flex-row gap-10">
          {
            routes.filter(link => link.UILocation === 'navbar').map((link) => (
              <div className="h-80 w-80 bg-primary-foreground rounded-2xl hover:rounded-3xl p-10 flex flex-col items-center justify-end relative">
                <Link
                  href={link.path}
                  target="_blank"
                  className={`w-[10rem] ${cn(buttonVariants({ size: "sm" }))}`}
                >
                  {link.route}
                </Link>
                <div className="flex justify-center items-center w-full h-full top-0 absolute opacity-20 pointer-events-none">
                  <Image 
                    className="absolute pointer-events-none dark:invert" 
                    src={link.image ?? ''}
                    width={250}
                    height={250}
                    alt={link.route}
                  />
                </div>
              </div>
            ))
          }
        </div>
        <div className="h-10 w-full bottom-0 flex items-center justify-center text-primary shadow-inner text-xs px-2 rounded-md opacity-50">
          {
            `credit to our team: ${ credit.slice(0,-1).join(', ')} and ${credit.slice(-1)}`
          } 
        </div>
      </div>
      
    </section>
  )
}
