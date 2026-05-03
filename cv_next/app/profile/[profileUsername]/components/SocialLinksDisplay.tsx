import { FaLinkedin, FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { FaGitlab } from "react-icons/fa6";

export const SocialLinksDisplay = ({ user }: { user: UserModel }) => {
  return (
    <div>
      <div className="flex flex-row items-center justify-start gap-2 pt-2">
        {user.linkedin_link ? (
          <a href={urlToRedirect(user.linkedin_link)}>
            <FaLinkedin size={25} />
          </a>
        ) : undefined}

        {user.github_link ? (
          <a href={urlToRedirect(user.github_link)}>
            <FaGithub size={25} />
          </a>
        ) : undefined}

        {user.gitlab_link ? (
          <a href={urlToRedirect(user.gitlab_link)}>
            <FaGitlab size={25} />
          </a>
        ) : undefined}

        {user.portfolio_link ? (
          <a href={urlToRedirect(user.portfolio_link)}>
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
