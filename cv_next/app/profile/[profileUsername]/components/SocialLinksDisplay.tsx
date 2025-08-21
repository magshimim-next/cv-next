import { FaLinkedin, FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { FaGitlab } from "react-icons/fa6";

export const SocialLinksDisplay = ({ user }: { user: UserModel }) => {
  return (
    <div >
        <div className="flex flex-row items-center justify-start gap-2 pt-2">
            {user.linkedin_link ? <a
            href={user.linkedin_link}>
                <FaLinkedin size={25}/>
            </a> : undefined}

            {user.github_link ? <a
            href={user.github_link}>
                <FaGithub size={25}/>
            </a> : undefined}

            {user.gitlab_link ? <a
            href={user.gitlab_link}>
                <FaGitlab size={25}/>
            </a> : undefined}

            {user.portfolio_link ? <a
            href={user.portfolio_link}>
                <FaExternalLinkAlt size={25}/>
            </a> : undefined}
        </div>
    </div>
  )
};