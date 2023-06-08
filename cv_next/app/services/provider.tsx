"use client";
import QueryProvider from "./providers/QueryProvider";
import ColorProvider from "./providers/colorSchemeProvider";

function Providers({ children }: React.PropsWithChildren) {
  return (
    <QueryProvider>
      <ColorProvider>{children}</ColorProvider>
    </QueryProvider>
  );
}

export default Providers;
