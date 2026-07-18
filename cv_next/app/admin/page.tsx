"use server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

/**
 * The function handles the tab name generation.
 * @returns {Promise<Metadata>} The metadata object.
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Admin Panel",
  };
}

/**
 * This page is the admin page. This currently just redirects to forms next admin panel.
 * @returns {Promise<void>} The admin page (redirect to forms next admin panel).
 */
export default async function Page() {
  redirect("https://forms.magshimim-next.com/admin");
}
