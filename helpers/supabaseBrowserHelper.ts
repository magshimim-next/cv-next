import { createBrowserClient } from "@supabase/ssr";

/*
The function will create a supabase object for the client side.
Unlike the server component, this is singleton by design
*/
export function createClientComponent() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { isSingleton: true, cookieEncoding: "raw" }
  );
}
