import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedinIn, faGithub } from "@fortawesome/free-brands-svg-icons";
import { ScrollToTop } from "@/components/ui/scrollToTop";
import { External_Credits as contributors } from "@/lib/definitions";
import styles from "./styles.module.css";

const startsCount = 15;

const hall: React.FC = () => {
  return (
    <>
      <title>Hall of fame</title>
      {/* stars background */}
      <ul
        className={`${styles.crowns} absolute left-0 top-0 z-[-1] h-full w-full overflow-hidden`}
      >
        {Array.from({ length: startsCount }).map((_, index) => (
          <li key={index} className={styles["crowns li"]}></li>
        ))}
      </ul>
      <div className="relative mx-auto h-full w-[700px] max-w-full xl:w-[1400px]">
        <ScrollToTop />
        <div className="select-none p-5 text-center">
          <h1
            className={`${styles["hall-title"]} mb-5 inline-flex items-center pt-3`}
          >
            HALL OF FAME
          </h1>
          <h3 className="pb8 font-bold lg:text-lg">
            Awesome People Who Contributed to the Project{" "}
          </h3>
          <h3 className="pb-8 text-base font-light text-muted-foreground lg:text-lg">
            Want to also be in this list? Contact us in the community chat and
            win eternal glory!
          </h3>
          <ul>
            <div className="flex max-h-[80vh] w-full flex-row-reverse flex-wrap justify-center self-center overflow-y-auto overflow-x-hidden xl:flex">
              {contributors.map((contributor) => (
                <div
                  key={contributor.name}
                  className={`${styles.card} relative m-[1vh] flex h-[25vh] w-[25vh] flex-col justify-between rounded-lg bg-primary-foreground p-4 text-center`}
                >
                  <div
                    className={`${styles["name-image"]} relative flex w-full items-center`}
                  >
                    <Image
                      src={
                        contributor.avatar_url ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
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
                    {contributor.title}
                  </h4>
                  <h3 className="select-none text-muted-foreground">
                    {contributor.contribution}
                  </h3>
                  <div className="relative flex w-full items-center justify-end overflow-visible">
                    {contributor.linkedIn && (
                      <a href={contributor.linkedIn}>
                        <FontAwesomeIcon
                          icon={faLinkedinIn}
                          className="mr-2 h-5 w-5"
                        />
                      </a>
                    )}
                    {contributor.gitHub && (
                      <a href={contributor.gitHub}>
                        <FontAwesomeIcon
                          icon={faGithub}
                          className="ml-2 h-5 w-5"
                        />
                      </a>
                    )}
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
