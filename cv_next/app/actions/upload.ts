function isValidUrl(url: string, whitelist: string[]): boolean {
    // Regular expression to match a valid domain
    const domainRegex = /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9.-]+)\.[a-zA-Z]{2,}(?:\/\S*)?$/;
  
    // Extract domain from the URL
    const match = url.match(domainRegex);
    if (!match || match.length < 2) {
      return false; // Invalid domain format
    }
  
    const domain = match[1];
  
    // Check if the domain is in the whitelist
    if (!whitelist.includes(domain)) {
      return false; // Domain not in whitelist
    }
  
    // Check for invalid characters in the URL
    const invalidCharRegex = /[^\w.:-]/;
    if (invalidCharRegex.test(url)) {
      return false; // Invalid characters found
    }
  
    return true; // URL is valid
  }
  
  // Example usage:
  const url = "https://example.com/path";
  const whitelist = ["example.com", "trusteddomain.com"];
  
  if (isValidUrl(url, whitelist)) {
    console.log("URL is valid.");
  } else {
    console.log("URL is invalid.");
  }
  