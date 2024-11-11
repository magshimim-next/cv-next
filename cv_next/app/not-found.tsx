import Image from "next/image";
import notFound404 from "../public/images/404.png";
import notFound404Light from "../public/images/404Light.png";
import blackChair from "../public/images/chair.png";
import whiteChair from "../public/images/whiteChair.png";

export default function NotFound() {
  return (
    <div>
      <div className="left-0 flex h-3/4 w-full items-center justify-center space-y-8 p-6">
        <div className="flex flex-row items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="items-center-justify-center flex flex-row">
              <div>
                <Image
                  alt="closeIcon"
                  src={notFound404}
                  className="dark:hidden"
                ></Image>
                <Image
                  alt="closeIcon"
                  src={notFound404Light}
                  className="hidden dark:block"
                ></Image>
              </div>
              <h1 className="place-self-center pl-10 text-left text-7xl">
                {" "}
                Page Not Found
              </h1>
            </div>
            <div className="items-center-justify-center flex flex-row">
              <h2 className="place-self-center text-left text-3xl">
                This page didn’t land the job. Try another page!&nbsp;
                <a href="/" className="underline">
                  Go Home
                </a>
              </h2>
            </div>
          </div>
          <Image
            alt="blackChair"
            src={blackChair}
            className="w-1/2 dark:hidden"
          ></Image>
          <Image
            alt="whiteChair"
            src={whiteChair}
            className="hidden w-1/2 dark:block"
          ></Image>
        </div>
      </div>
    </div>
  );
}
