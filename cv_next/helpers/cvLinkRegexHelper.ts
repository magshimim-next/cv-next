export const validateGoogleViewOnlyUrl = (url: string): boolean => {
  const pattern =
    /https?:\/\/(?:docs|drive)\.google\.com\/(?:document|file)\/d\/([a-zA-Z0-9_-]+)\/(?:view|preview|edit)(?:\?(?:usp=[a-zA-Z0-9_-]+&?)*)?/;
  return pattern.test(url);
};
