"use client";
import LandingHeader from "./landingHeader";
import { AppShell, Header, useMantineTheme } from "@mantine/core";

export default function LandingLayout({ children }: { children: any }) {
  const theme = useMantineTheme();
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      header={
        <Header height={{ base: 50, md: 60 }} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <LandingHeader />
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
}
