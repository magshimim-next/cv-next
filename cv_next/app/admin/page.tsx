"use server";
import { Metadata } from "next";
import { getAllUsers } from "@/server/api/users";
import { ScrollToTop } from "@/components/ui/scrollToTop";
import { ProfilesTable } from "./components/profilesTable";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Admin Panel",
  };
}

export default async function Page() {
  const users = await getAllUsers();

  return (
    <div>
      <ScrollToTop />
      <div className="mx-auto mt-4">
        <h1 className="mb-6 text-center text-2xl font-semibold">Admin Panel</h1>

        {users.ok && <ProfilesTable profiles={users.val} />}
      </div>
    </div>
  );
}
