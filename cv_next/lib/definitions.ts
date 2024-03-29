export default class Definitions {
  public static readonly undefinedIndex = -1
  public static readonly CVS_PER_PAGE = 6
  public static readonly PAGINATION_INIT_PAGE_NUMBER = -1
  public static readonly MAX_OPERATIONS = 10
  public static readonly MAX_OPERATIONS_REFILL_PER_SECOND = 2
  public static readonly CVS_REVALIDATE_TIME_IN_SECONDS = 0
}

export const heroHeader: PageHeader = {
  header: `Landing pages made easy`,
  subheader: `Easy to setup. Customizable. Quick. Responsive.`,
  image: `/hero-img.webp`,
}

export const inactiveHeader: PageHeader = {
  header: `Access Denied`,
  subheader: `This page requieres that you get approved by the moderators`,
  image: `/access-denied.webp`,
}
