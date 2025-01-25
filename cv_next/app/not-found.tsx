import Image from "next/image";
import blackChair from "@/public/images/chair.png";
import whiteChair from "@/public/images/whiteChair.png";
import notFound404 from "@/public/images/404.png";
import notFound404Light from "@/public/images/404Light.png";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="flex flex-col items-center justify-center space-y-6 sm:mt-16 md:flex-row md:space-x-6 md:space-y-0">
          <div className="mt-4 flex items-center justify-center ">
            <Image
              alt="blackChair"
              src={blackChair}
              className="w-40 dark:hidden sm:w-60"
            />
            <Image
              alt="whiteChair"
              src={whiteChair}
              className="hidden w-40 dark:block sm:w-60"
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <Image
              alt="404"
              src={notFound404}
              className="w-40 dark:hidden sm:w-56"
            />
            <Image
              alt="404"
              src={notFound404Light}
              className="hidden w-40 dark:block sm:w-56"
            />
            <h1 className="text-center text-4xl font-bold md:text-left md:text-7xl">
              Page Not Found
            </h1>
          </div>
        </div>

        <h2 className="text-center text-xl md:text-left md:text-3xl">
          This page didn’t land the job.&nbsp;
          <span className="mt-2 block md:inline">Try another page!&nbsp;</span>
          <a href="/" className="text-blue-600 underline hover:text-blue-800">
            Go Home
          </a>
        </h2>
      </div>
    </div>
  );
}
