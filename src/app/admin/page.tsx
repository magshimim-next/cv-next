"use server";
import { Metadata } from "next";
import { ScrollToTop } from "@/components/ui/scrollToTop";
import { getAllUsersPerms } from "@/app/actions/users/getUser";
import { ProfilesTable } from "./components/profilesTable";
import { QuickActions } from "./components/quickActions";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Admin Panel",
  };
}

export default async function Page() {
  const users = await getAllUsersPerms();

  return (
    <div>
      <ScrollToTop />
      <div className="mx-auto mt-4">
        <h1 className="mb-6 text-center text-2xl font-semibold">Admin Panel</h1>
        <QuickActions />

        {users.ok && <ProfilesTable profiles={users.val} />}
      </div>
    </div>
  );
}
