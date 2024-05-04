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
  subheader: `improve the magshimim next community's resumes.`,
  explenetion: `we as a magshimim next community can help each other get jobs by improving our memeber's resumes.
  this website is a place to uplode resumes, let other review them and make them better.
  we will not tolerate any abuse, hateful commects, griffing, pentesting and etc... `
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
    UILocation: 'navbar'
  },
  {
    route: "Feed",
    path: "/feed",
    image: '/images/feed.png',
    UILocation: 'navbar'
  },
  {
    route: "Login",
    path: "/login",
    image: '',
    UILocation: 'profile'
  },
  {
    route: "Signout",
    path: "/logout",
    image: '',
    UILocation: 'profile'
  },
]