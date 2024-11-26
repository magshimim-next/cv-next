import Image from "next/image";
import { ScrollToTop } from "@/components/ui/scrollToTop";
import { External_Credits as contributors } from "@/lib/definitions";

const hall: React.FC = () => {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.0/css/all.min.css"
      />
      <title>Hall of fame</title>
      {/* stars background */}
      <ul className="crowns absolute left-0 top-0 z-[-1] h-[100%] w-[100%] overflow-hidden">
        {Array.from({ length: 15 }).map((_, index) => (
          <li key={index}></li>
        ))}
      </ul>
      <div className="relative mx-auto h-full w-[700px] max-w-full xl:w-[1400px]">
        <ScrollToTop />
        <div className="select-none p-5 text-center">
          <h1 className="hall-title mb-5 inline-flex items-center pt-3 text-2xl font-bold text-gray-900 dark:text-white sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
            HALL OF FAME
          </h1>
          <h3 className="pb8 font-bold lg:text-lg">
            Awesome people who contributed to the project
          </h3>
          <h3 className="pb-8 text-base font-light text-muted-foreground lg:text-lg">
            Want to also be in this list? Contact us in the community chat and
            win eternal glory!
          </h3>
          <ul>
            <div className="flex max-h-[80vh] w-full flex-row-reverse flex-wrap justify-center justify-center self-center overflow-y-auto overflow-x-hidden xl:flex">
              {contributors.map((contributor, index) => (
                // key = index for now, but its bad practice.
                // https://robinpokorny.com/blog/index-as-a-key-is-an-anti-pattern/
                <div
                  key={index}
                  className="card relative relative m-[1vh] mb-[10px] ml-[1vh] mr-[1vh] mt-[1vh] flex h-[25vh] w-[25vh] flex-col justify-between rounded-[10px] rounded-lg bg-primary-foreground p-4 p-[1em] text-center text-center"
                >
                  <div className="name-image relative flex w-full items-center overflow-visible">
                    <Image
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      width={50}
                      height={50}
                      className="mr-1 select-none"
                      alt="Profile Picture"
                    />
                    <h1 className="ml-4 text-left text-muted-foreground lg:text-xl">
                      {contributor.name}
                    </h1>
                  </div>
                  <h4 className="mt-4 select-none text-muted-foreground">
                    {contributor.title ? contributor.title : null}
                  </h4>
                  <h3 className="select-none text-muted-foreground">
                    {contributor.contribution}
                  </h3>
                  <div className="relative flex w-full items-center justify-end overflow-visible">
                    {contributor.linkedIn ? (
                      <a href={contributor.linkedIn}>
                        <i className="fa-brands fa-linkedin-in mr-2"></i>
                      </a>
                    ) : null}
                    {contributor.gitHub ? (
                      <a href={contributor.gitHub}>
                        <i className="fa-brands fa-github ml-2"></i>
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </ul>
        </div>
      </div>
    </>
  );
};

export default hall;
