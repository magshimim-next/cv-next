import { ScrollToTop } from "@/components/ui/scrollToTop";
import { External_Credits as contributors } from "@/lib/definitions";

const hall: React.FC = () => {
  return (
    <div className="relative mx-auto h-full w-[700px] max-w-full xl:w-[1400px]">
      <ScrollToTop />
      <div className="p-1 text-center">
        <h1 className="mb-5 inline-flex items-center pt-3 text-2xl font-bold text-gray-900 dark:text-white sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
          A Huge Thank You to Our Contributors
        </h1>
        <h3 className="pb-8 text-base font-light text-muted-foreground lg:text-lg">
          Want to also be in this list? Contact as in the community chat and win
          eternal glory!
        </h3>
        <ul>
          <div className="justify-center xl:flex">
            <div
              id="grid-container"
              className="w450:grid-cols-1 w450:gap-7 grid w-full grid-cols-2 gap-10 md:grid-cols-3 xl:w-1/2"
            >
              {contributors.map((contributor, index) => (
                <a
                  key={index}
                  target="_blank"
                  className="rounded-base mb-3 rounded-lg border-2 border-b border-gray-200 bg-white p-6 text-base dark:bg-theme-800"
                  style={{
                    borderColor: "#000",
                    boxShadow: "4px 4px 0px 0px #000",
                    transform: "translate(4px, 4px)",
                  }}
                >
                  <p
                    className="mt-3 text-lg sm:text-xl"
                    style={{ fontWeight: "700" }}
                  >
                    {contributor.name}
                  </p>
                  <p
                    className="mt-1 text-sm sm:text-base"
                    style={{ fontWeight: "500" }}
                  >
                    {contributor.contribution}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default hall;
