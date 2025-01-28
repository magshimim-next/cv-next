import Image from "next/image";
import Link from "next/link";
import { Team_Credits as Credits } from "@/lib/definitions";

const Footer: React.FC = () => {
  return (
    <footer className="inset-x-0 bottom-0 mt-auto w-full p-4 font-light text-primary">
      <div className="container flex items-center justify-center">
        <hr className="h-1 flex-grow rounded border-0 bg-slate-500" />
        <div className="flex items-center space-x-6 px-4">
          <a
            href="https://instagram.com/magshimim.next"
            target="_blank"
            className="dark:fill-slate-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="45"
              height="45"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-linkedin"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </a>
          <a
            href="https://linkedin.com/company/magshimim-next"
            target="_blank"
            className="dark:fill-slate-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="41"
              height="46"
              viewBox="0 0 24 24"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </div>
        <hr className="h-1 flex-grow rounded border-0 bg-slate-500" />
      </div>

      <div className="mb-2 mt-3 flex justify-center">
        <Image
          alt="Footer image"
          loading="lazy"
          width="125"
          height="75"
          src="/images/logo.png"
        />
      </div>
      <div className="mb-2 flex justify-center">
        <p>
          &copy; {new Date().getFullYear()} Magshimim Next. All rights reserved.
        </p>
      </div>
      <div className="mt-1 shadow-md">
        <div className="mb-2 flex justify-center">
          <div className="mb-2 flex h-fit max-w-fit items-center justify-center rounded-md px-5 text-center text-xs opacity-50 hover:shadow-xl sm:text-left">
            {`Credit to our team: ${Credits.slice(0, -1).join(", ")} and ${Credits.slice(-1)}`}
          </div>
        </div>
        <div className="flex justify-center rounded-md text-center text-xs opacity-50 hover:shadow-xl sm:text-left">
          <span className="mb-2 text-xs opacity-75">
            {`Want to see more amazing people? Go to our `}
            <Link href="/hall" className="text-blue-500 hover:underline">
              &nbsp;Hall of Fame
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
