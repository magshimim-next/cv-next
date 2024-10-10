import Image from "next/image";
import notFound404 from "../public/images/404.png";
import notFound404Light from "../public/images/404Light.png";

export default function NotFound() {
  return (
    <div className="left-0 flex h-3/4 w-full items-center justify-center space-y-8 p-6">
      <div className="flex flex-row items-center justify-center">
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
      <h1 className="pl-10 text-7xl"> Page Not Found</h1>
    </div>
  );
}
