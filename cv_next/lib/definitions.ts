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
}

export class Link_Definitions {
  public static readonly AUTH_CALLBACK_REDIRECT = "/auth/callback";
  public static readonly AUTH_DEFAULT_REDIRECT = "/";
}

export const heroHeader: PageHeader = {
  header: `Landing pages made easy`,
  subheader: `Easy to setup. Customizable. Quick. Responsive.`,
  image: `/hero-img.webp`,
};

export const inactiveHeader: PageHeader = {
  header: `Access Denied`,
  subheader: `This page requieres that you get approved by the moderators`,
  image: `/access-denied.webp`,
};
