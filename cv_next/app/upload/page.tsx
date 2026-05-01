"use server";

import { notFound } from "next/navigation";
import { RecommendedCvsSection } from "@/components/ui/recommendedCvs";
import Categories from "@/types/models/categories";
import { getCurrentId } from "@/server/api/users";
import UploadCVForm from "./components/uploadForm";

/**
 * This page is used to upload a CV.
 * @returns {Element} The upload page for CVs.
 */
export default async function Page() {
  const userId = await getCurrentId();
  if (!userId.ok) {
    notFound();
  }
  const randomCategories = [...Categories.values].sort(() => 0.5 - Math.random()).slice(0, 3);

  return (
    <div>
      <div
        className="flex flex-col items-center justify-center"
        style={{ paddingTop: "1.5rem" }}
      >
        <title>Upload CV</title>
        <h1 className="mb-5 text-3xl font-bold">Upload CV</h1>
        <h4>Need inspiration? Check below to see some CVs!</h4>
        <UploadCVForm />
      </div>
      <RecommendedCvsSection
        filteredCategories={randomCategories}
        currentUserId={userId.val}
        amountToFetch={8}
        title="Looking for Inspiration?"
        subtitle="Don't know where to begin? Have a look at some of the community member's CVs!"
      />
    </div>
  );
}
