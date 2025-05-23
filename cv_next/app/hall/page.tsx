"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedinIn, faGithub } from "@fortawesome/free-brands-svg-icons";
import { ScrollToTop } from "@/components/ui/scrollToTop";
import { External_Credits as contributors, Team_Credits } from "@/lib/credits";
import useWindowSize from "@/hooks/useWindowSize";
import styles from "./styles.module.css";
import FloatingStars from "./stars";

export default function Page() {
  const { scrollHeight, height } = useWindowSize();

  return (
    <>
      <title>Hall of Fame</title>
      <ul
        style={{ height: scrollHeight ? `${scrollHeight}px` : `${height}px` }}
        className={styles.starsContainer}
      >
        <FloatingStars />
      </ul>
      <div className="relative mx-auto h-full w-[700px] max-w-full xl:w-[1400px]">
        <ScrollToTop />
        <div className="select-none text-center">
          <h1
            className={`${styles["hall-title"]} mb-5 inline-flex items-center`}
          >
            HALL OF FAME
          </h1>
          <h3 className="pb8 font-bold lg:text-lg">
            Our core team that is working hard to make this project a reality
          </h3>
          <h3 className="pb-8 text-base font-light text-muted-foreground lg:text-lg">
            Want to join us and help? Reach out to us in the community chat!
          </h3>
          <ul className="mb-8">
            <div className="flex h-auto w-full flex-row-reverse flex-wrap justify-center gap-3 self-center xl:flex">
              {Team_Credits.map((contributor) => (
                <div
                  key={contributor.name}
                  className={`${styles.card} relative m-[1vh] flex min-h-[25vh] w-[35vh] flex-col justify-between rounded-lg bg-primary-foreground p-4 text-center`}
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
                    <h1 className="ml-4 max-w-full overflow-hidden break-words text-left text-base text-muted-foreground sm:text-lg lg:text-xl">
                      {contributor.name}
                    </h1>
                  </div>
                  <h4 className="mb-1 mt-4 select-none text-sm text-muted-foreground ">
                    {contributor.title}
                  </h4>
                  <h3 className="mb-1 select-none text-base text-muted-foreground">
                    {contributor.contribution}
                  </h3>
                  <div className="relative flex w-full items-center justify-end">
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
          <h3 className="pb8 font-bold lg:text-lg">
            Awesome People Who Contributed to the Project
          </h3>
          <h3 className="pb-8 text-base font-light text-muted-foreground lg:text-lg">
            Want to also be in this list? Contact us in the community chat and
            win eternal glory!
          </h3>
          <ul>
            <div className="flex h-auto w-full flex-row-reverse flex-wrap justify-center gap-3 self-center xl:flex">
              {contributors.map((contributor) => (
                <div
                  key={contributor.name}
                  className={`${styles.card} relative m-[1vh] flex min-h-[25vh] w-[35vh] flex-col justify-between rounded-lg bg-primary-foreground p-4 text-center`}
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
                    <h1 className="ml-4 max-w-full overflow-hidden break-words text-left text-base text-muted-foreground sm:text-lg lg:text-xl">
                      {contributor.name}
                    </h1>
                  </div>
                  <h4 className="mb-1 mt-4 select-none text-sm text-muted-foreground ">
                    {contributor.title}
                  </h4>
                  <h3 className="mb-1 select-none text-base text-muted-foreground">
                    {contributor.contribution}
                  </h3>
                  <div className="relative flex w-full items-center justify-end">
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
}
