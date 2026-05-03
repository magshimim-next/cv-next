"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/app/feed/components/button";
import { useError } from "@/providers/error-provider";
import { uploadCV } from "@/app/actions/cvs/uploadCv";
import { LinkInput } from "@/components/ui/CVInput/LinkInput";
import { CategoriesInput } from "@/components/ui/CVInput/CategoriesInput";
import { DescriptionInput } from "@/components/ui/CVInput/DescriptionInput";
import { ConfirmCheckbox } from "@/components/ui/ConfirmCheckbox";

type FormValues = {
  link: string;
  description: string;
  cvCategories: number[];
};

/**
 * This page is used to show client side of CV upload.
 * @returns {Element} The upload page for CVs.
 */
export default function UploadCVForm() {
  const { showError } = useError();
  const [isChecked, setIsChecked] = useState(false);
  const checkboxMessage =
    "I agree to my CV being publically available to community members.";

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

      <ConfirmCheckbox
        checked={isChecked}
        onChange={setIsChecked}
        message={checkboxMessage}
      />

      <div className="flex justify-center">
        <Button
          text="Submit"
          onClick={handleSubmit(onSubmit)}
          isDisabled={!isValid || !isChecked}
        />
      </div>
    </form>
  );
}
