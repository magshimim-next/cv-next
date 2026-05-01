import { FaLinkedin, FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { FaGitlab } from "react-icons/fa6";

export const SocialLinksDisplay = ({ user }: { user: UserModel }) => {
  const socials = user.socials as { linkedin?: string | null; github?: string | null; gitlab?: string | null; portfolio?: string | null } | null;
  return (
    <div>
      <div className="flex flex-row items-center justify-start gap-2 pt-2">
        {socials?.linkedin ? (
          <a href={urlToRedirect(socials.linkedin)}>
            <FaLinkedin size={25} />
          </a>
        ) : undefined}

        {socials?.github ? (
          <a href={urlToRedirect(socials.github)}>
            <FaGithub size={25} />
          </a>
        ) : undefined}

        {socials?.gitlab ? (
          <a href={urlToRedirect(socials.gitlab)}>
            <FaGitlab size={25} />
          </a>
        ) : undefined}

        {socials?.portfolio ? (
          <a href={urlToRedirect(socials.portfolio)}>
            <FaExternalLinkAlt size={25} />
          </a>
        ) : undefined}
      </div>
    </div>
  );
};

/**
 * Generates a URL for redirection.
 * @param {string} link The link to redirect to.
 * @returns {string} The full URL for redirection.
 */
function urlToRedirect(link: string) {
  const url = new URL("/redirect", process.env.NEXT_PUBLIC_BASE_URL);
  url.searchParams.set("to", link);
  return url.toString();
}
