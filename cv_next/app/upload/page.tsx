"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/app/feed/components/button";
import { useError } from "@/providers/error-provider";
import { uploadCV } from "@/app/actions/cvs/uploadCv";
import { LinkInput } from "@/components/ui/CVInput/LinkInput";
import { CategoriesInput } from "@/components/ui/CVInput/CategoriesInput";
import { DescriptionInput } from "@/components/ui/CVInput/DescriptionInput";

type FormValues = {
  link: string;
  description: string;
  cvCategories: number[];
};

/**
 * This page is the upload page for a CV.
 * @returns {Element} The upload page.
 */
export default function Page() {
  const { showError } = useError();

  const {
    control,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      link: "",
      description: "",
      cvCategories: [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    const uploadResp = await uploadCV({
      cvData: data,
    });
    if (uploadResp) {
      showError(uploadResp, "");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center p-6 py-10">
      <title>Upload CV</title>
      <h1 className="mb-8 text-3xl font-bold">Upload CV</h1>
      <form
        className="flex w-full max-w-lg flex-col space-y-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <LinkInput control={control} errors={errors} />

        <DescriptionInput
          control={control}
          errors={errors}
          clearErrors={() => clearErrors}
          setError={() => setError}
        />

        <CategoriesInput control={control} errors={errors} />

        <div className="flex justify-center">
          <Button
            text="Submit"
            onClick={handleSubmit(onSubmit)}
            isDisabled={!isValid}
          />
        </div>
      </form>
    </main>
  );
}
