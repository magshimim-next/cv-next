export const UI_Location = {
  navbar: "navbar",
  profile: "profile",
} as const;

export default class Definitions {
  public static readonly undefinedIndex = -1;
  public static readonly CVS_PER_PAGE = 6;
  public static readonly PAGINATION_INIT_PAGE_NUMBER = -1;
  public static readonly MAX_OPERATIONS = 10;
  public static readonly MAX_OPERATIONS_REFILL_PER_SECOND = 2;
  public static readonly CVS_REVALIDATE_TIME_IN_SECONDS = 0;
  public static readonly FETCH_WAIT_TIME = 120;
  public static readonly MAX_CHAR_NAME = 70;
  public static readonly MIN_CHAR_NAME = 1;
  public static readonly MAX_COMMENT_SIZE = 750;
  public static readonly COMMENTS_REVALIDATE_TIME_IN_SECONDS = 0;
  public static readonly AUTH_CALLBACK_REDIRECT = "/auth/callback";
  public static readonly FIRST_LOGIN_REDIRECT = "first_login";
  public static readonly LOGIN_REDIRECT = "login";
  public static readonly AUTH_DEFAULT_REDIRECT = "/";
}

export class API_DEFINITIONS {
  public static readonly CVS_API_BASE = "/api/cvs";
  public static readonly FETCH_CVS_ENDPOINT = "fetchCvs";
  public static readonly FETCH_PREVIEWS_ENDPOINT = "fetchPreviews";
  public static readonly FETCH_USERS_ENDPOINT = "fetchUserData";
}

export class Link_Definitions {
  public static readonly AUTH_CALLBACK_REDIRECT = "/auth/callback";
  public static readonly AUTH_DEFAULT_REDIRECT = "/";
  public static readonly ALLOWED_REDIRECTS = [
    "feed",
    "upload",
    "cv",
    "profile",
    "hall",
    "first_login",
  ];
}

export const heroHeader: PageHeader = {
  header: `NEXT`,
  subheader: `Improve the Magshimim Next Community's resumes.`,
  explanation: `As a community, we can help each other secure jobs by enhancing our members' resumes. This website is a platform to upload resumes, allow others to review them, and make them better.
We expect all interactions to be respectful and constructive, with no tolerance for abuse, hateful comments, or any form of inappropriate behavior.`,
};

export const routes: route[] = [
  {
    route: "Login",
    path: "/login",
    image: "",
    UILocation: UI_Location.profile,
  },
  {
    route: "Signout",
    path: "/signout",
    image: "",
    UILocation: UI_Location.profile,
  },
];

export const Team_Credits = [
  {
    name: "Ron Peer",
    title: "Full Stack Developer",
    contribution: "Working on the frontend of the project.",
    linkedIn: "https://www.linkedin.com/in/ron-peer-53b220270/",
    gitHub: "https://github.com/PeroG28",
  },
  {
    name: "Arad Donenfeld",
    title: "Security Researcher",
    contribution: "Leading the development of the project.",
    linkedIn: "https://www.linkedin.com/in/aradon267/",
    gitHub: "https://github.com/Aradon267",
  },
  {
    name: "Denis Granovsky",
    title: "Software Developer",
    contribution: "Managing the development of the project.",
    linkedIn: "https://www.linkedin.com/in/denisgran/",
    gitHub: "https://github.com/DenisGran",
  },
  {
    name: "Yarden Perets",
    title: "Software Engineer",
    contribution: "Working on development and DB stability for the poject.",
    linkedIn: "https://www.linkedin.com/in/yarden-perets/",
    gitHub: "https://github.com/lordYorden",
  },
  {
    name: "Assaf Kabesa",
    title: "Software Developer",
    contribution: "Working on the deployment process and cloud services.",
    linkedIn: "https://www.linkedin.com/in/assaf-kabesa/",
    gitHub: "https://github.com/AssafLolGG",
  },
  {
    name: "Omri Anidgar",
    title: "Full Stack Developer",
    contribution:
      "Working on the deployment process and frontend of the project.",
    linkedIn: "https://www.linkedin.com/in/omri-anidgar/",
    gitHub: "https://github.com/Omria09",
  },
  {
    name: "Shoham Yosef Bitton",
    title: "Developer",
    contribution:
      "Working on the deployment process and automations for the project.",
    linkedIn: "https://www.linkedin.com/in/shohamyosefbitton/",
    gitHub: "https://github.com/ShohamBit",
  },
  {
    name: "Alon Green",
    title: "Cloud Security Engineer",
    contribution: "Working on the frontend of the project.",
    linkedIn: "https://www.linkedin.com/in/assaf-kabesa/",
    gitHub: "https://github.com/TheGreenOak",
  },
  {
    name: "Nevo Sznajder",
    title: "Full Stack Developer",
    contribution: "Working on backend development of the project.",
    linkedIn: "https://www.linkedin.com/in/nevo-sznajder-916622279/",
    gitHub: "https://github.com/nevogithub",
  },
  {
    name: "Yechiam Weiss",
    title: "Full Stack Developer",
    contribution: "Advising us through the full product development process.",
    linkedIn: "https://www.linkedin.com/in/yechiamweiss/",
    gitHub: "https://github.com/YechiamW3",
  },
];

export const External_Credits = [
  {
    name: "Adam Abramov",
    title: "Tech Lead Reverse Engineer",
    avatar_url: "",
    contribution:
      "Insufficient Verification of Data Authenticity & CSRF Account Takeover.",
    linkedIn: "https://www.linkedin.com/in/theresearcher/",
  },
  {
    name: "Youval Daizi",
    title: "Cloud Security",
    contribution: "Home button caused users to log out.",
    linkedIn: "https://www.linkedin.com/in/youval-daizi/",
  },
  {
    name: "Harel Kristal",
    title: "Penetration Tester",
    contribution:
      "Login and Signout were always visible & Developer's data leak.",
    linkedIn: "https://www.linkedin.com/in/harel-kristal/",
  },
  {
    name: "Avner Mindelis",
    title: "Security Researcher",
    contribution: "Lead initial development of the project.",
    linkedIn: "https://www.linkedin.com/in/avner-mindelis/",
    github: "https://github.com/avnogy",
  },
  {
    name: "Adam Liberov",
    title: "Full Stack Developer",
    contribution: "Worked on initial development of the project.",
    linkedIn: "https://www.linkedin.com/in/adam-liberov-9918061b3/",
    github: "https://github.com/AdamLiberov",
  },
  {
    name: "Ethan Krimer",
    title: "Full Stack Developer",
    contribution: "Managed initial development of the project.",
    linkedIn: "https://www.linkedin.com/in/ethankrimer/",
  },
  {
    name: "Ilan Yashuk",
    title: "",
    contribution: "Worked on initial development of the project.",
    linkedIn: "https://www.linkedin.com/in/ilan-yashuk/",
    gitHub: "https://github.com/ya5huk",
  },
  // Add more contributors as needed
];

type ErrorMessages = {
  [key: string]: {
    keyword: string;
    title: string;
    description: string;
  };
};

export const Visible_Error_Messages: ErrorMessages = {
  InactiveUser: {
    keyword: "InactiveUser",
    title: "Inactive User",
    description: "That page requires that you get approved by the moderators.",
  },
  DuplicateUsername: {
    keyword: "DuplicateUsername",
    title: "Duplicate Username",
    description:
      "Username already exist. Please try again with a different username.",
  },
  PrivateCV: {
    keyword: "PrivateCV",
    title: "This CV has been set to private!",
    description: "Maybe the author just wasn't ready yet...",
  },
  CurrentUserPrivateCV: {
    keyword: "CurrentUserPrivateCV",
    title: "Your CV is set to private!",
    description: "Please update your CV settings to make it public again.",
  },
  UpdateAdminPerms: {
    keyword: "UpdateAdminPerms",
    title: "You can't change the permissions of an admin from the website",
    description:
      "Please go to the console to change the permissions of an admin.",
  },
  DefaultError: {
    keyword: "default",
    title: "An Error Occurred",
    description:
      "Please try again later and contact support if the problem persists.",
  },
};
