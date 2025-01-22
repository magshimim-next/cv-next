/*
The function will make sure that the Google URL is a preview and shareable
*/
export function transformGoogleViewOnlyUrl(link: string): string {
  if (!validateGoogleViewOnlyUrl(link)) return "";

  try {
    const url = new URL(link);
    url.pathname = url.pathname.replace(/\/(view|edit|preview)/, "/preview");
    if (!url.searchParams.has("usp")) {
      url.searchParams.set("usp", "sharing");
    }
    return url.toString();
  } catch (error) {
    return "";
  }
}

export function validateGoogleViewOnlyUrl(link: string): boolean {
  const regex = /https?:\/\/(?:docs|drive)\.google\.com\/(?:document|file)\/d\/([a-zA-Z0-9_-]+)\/(?:view|preview|edit)(?:\?(?:.*&)?usp=[a-zA-Z0-9_-]+(?:&.*)?)?/;
  return regex.test(link) 
}
