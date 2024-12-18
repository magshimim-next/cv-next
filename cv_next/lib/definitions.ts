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
  public static readonly COMMENTS_REVALIDATE_TIME_IN_SECONDS = 0;
  public static readonly AUTH_CALLBACK_REDIRECT = "/auth/callback";
  public static readonly AUTH_DEFAULT_REDIRECT = "/";
  public static readonly PLAICEHOLDER_IMAGE_SIZE = 15;
  public static readonly PLAICEHOLDER_IMAGE_DATA =
    "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPs7p5fDwAFlAI2LB7hbAAAAABJRU5ErkJggg==";
}

export class API_DEFINITIONS {
  public static readonly CVS_API_BASE = "/api/cvs";
  public static readonly USERS_API_BASE = "/api/users";
  public static readonly FETCH_CVS_ENDPOINT = "fetchCvs";
  public static readonly FETCH_PREVIEWS_ENDPOINT = "fetchPreviews";
  public static readonly FETCH_USERS_ENDPOINT = "fetchUserData";
  public static readonly REVALIDATE_USERS_ENDPOINT = "revalidateSignout";
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
    "about",
  ];
}

export const heroHeader: PageHeader = {
  header: `NEXT`,
  image: `/images/logo.png`,
  subheader: `Improve the Magshimim Next Community's resumes.`,
  explanation: `As a community, we can help each other secure jobs by enhancing our members' resumes. This website is a platform to upload resumes, allow others to review them, and make them better.
We expect all interactions to be respectful and constructive, with no tolerance for abuse, hateful comments, or any form of inappropriate behavior.`,
};

export const routes: route[] = [
  {
    route: "Home",
    path: "/",
    image: "/images/home.png",
    UILocation: UI_Location.navbar,
  },
  {
    route: "Feed",
    path: "/feed",
    image: "/images/feed.png",
    UILocation: UI_Location.navbar,
  },
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
  "Ron Peer",
  "Arad Donenfeld",
  "Avner Mindelis",
  "Nevo Sznajder",
  "Yechiam Weiss",
  "Adam Liberov",
  "Denis Granovsky",
  "Ethan Krimer",
  "Ilan Yashuk",
  "Assaf Kabesa",
  "Alon Green",
  "Yarden Perets",
  "Omri Anidgar",
];

export const External_Credits = [
  { name: "Adam Abramov", contribution: "CSRF Account Takeover" },
  {
    name: "Adam Abramov",
    contribution: "Insufficient Verification of Data Authenticity",
  },
  { name: "Youval Daizi", contribution: "Home button logged out users" },
  {
    name: "Harel Kristal",
    contribution: "Login and Signout were visible regardless of state",
  },
  {
    name: "Harel Kristal",
    contribution: "Developer's Data Leak",
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
  DefaultError: {
    keyword: "default",
    title: "An Error Occurred",
    description:
      "Please try again later and contact support if the problem persists.",
  },
};
