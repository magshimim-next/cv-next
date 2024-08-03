export const uiLocation = {
  navbar: 'navbar',
  profile: 'profile'
} as const

export default class Definitions {
  public static readonly undefinedIndex = -1
  public static readonly CVS_PER_PAGE = 6
  public static readonly PAGINATION_INIT_PAGE_NUMBER = -1
  public static readonly MAX_OPERATIONS = 10
  public static readonly MAX_OPERATIONS_REFILL_PER_SECOND = 2
  public static readonly CVS_REVALIDATE_TIME_IN_SECONDS = 0
}

export const heroHeader: PageHeader = {
  header: `Next`,
  image: `/images/logo.png`,
  subheader: `Improve the Magshimim Next Community's resumes.`,
  explanation: `As a community, we can help each other secure jobs by enhancing our members' resumes. This website is a platform to upload resumes, allow others to review them, and make them better.
We expect all interactions to be respectful and constructive, with no tolerance for abuse, hateful comments, or any form of inappropriate behavior.`
}

export const inactiveHeader: PageHeader = {
  header: `Access Denied`,
  subheader: `This page requieres that you get approved by the moderators`,
  image: `/access-denied.webp`,
}


export const routes: routes[] = [
  {
    route: "Home",
    path: "/",
    image: '/images/home.png',
    UILocation: uiLocation.navbar
  },
  {
    route: "Feed",
    path: "/feed",
    image: '/images/feed.png',
    UILocation: uiLocation.navbar
  },
  {
    route: "Login",
    path: "/login",
    image: '',
    UILocation: uiLocation.profile
  },
  {
    route: "Signout",
    path: "/logout",
    image: '',
    UILocation: uiLocation.profile
  },
]