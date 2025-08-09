"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { notFound, useRouter } from "next/navigation";
import { decodeValue, encodeValue } from "@/lib/utils";
import { useError } from "@/providers/error-provider";
import { getCvModel } from "@/app/actions/cvs/fetchCvs";
import { Visible_Error_Messages } from "@/lib/definitions";
import { updateCV } from "@/app/actions/cvs/uploadCv";
import { deleteCV } from "@/app/actions/cvs/deleteCv";
import { checkCVModifyPermission } from "@/app/actions/cvs/checkPermission";
import { CategoriesInput } from "@/components/ui/CVInput/CategoriesInput";
import { DescriptionInput } from "@/components/ui/CVInput/DescriptionInput";
import { LinkInput } from "@/components/ui/CVInput/LinkInput";
import { CvActions } from "./components/cvEditActions";

type FormValues = {
  link: string;
  description: string;
  cvCategories: number[];
};

/**
 * This page is the edit page for a CV. This allows changing links, description, categories, etc.
 * @param {{string}} param0 The cv ID from the URL.
 * @returns {Element} The edit page.
 */
export default function Page({ params }: { params: { cvId: string } }) {
  const { cvId } = params;
  const decodedCvId = decodeValue(decodeURIComponent(cvId));
  const [cvData, setCvData] = useState<CvModel | null>(null);

  const { showError } = useError();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    formState: { errors, isValid },
    reset,
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      link: "",
      description: "",
      cvCategories: [],
    },
  });

  if (!decodedCvId) {
    notFound();
  }

  const onDeleteAlertClick = async () => {
    const deleteResult = await deleteCV(decodedCvId);
    if (deleteResult.ok) {
      router.push("/feed");
    } else {
      showError(
        deleteResult.errors.err?.message ||
          Visible_Error_Messages.DefaultError.title,
        "",
        () => router.push(`/cv/${encodeValue(decodedCvId)}`)
      );
    }
  };

  useEffect(() => {
    const fetchCV = async () => {
      const data = await getCvModel(decodedCvId);
      if (data.ok) {
        reset({
          link: data.val.document_link || "",
          description: data.val.description || "",
          cvCategories: data.val.cv_categories || [],
        });
        const canEdit = await checkCVModifyPermission(data.val);
        if (!canEdit.ok) {
          router.push(`/cv/${encodeValue(data.val.id)}`);
          return;
        }
        setCvData(data.val);
      } else {
        showError("CV not found.", "");
      }
    };

    fetchCV();
  }, [decodedCvId, reset, router, setValue, showError]);

  const onSubmit = async (data: FormValues) => {
    if (!cvData) {
      showError("CV data not loaded.", "");
      return;
    }
    const updatedCV: CvModel = cvData;
    updatedCV.document_link = data.link;
    updatedCV.description = data.description;
    updatedCV.cv_categories = data.cvCategories;
    const updateResp = await updateCV({
      cvData: updatedCV,
    });
    if (updateResp) {
      showError(updateResp, "", () =>
        router.push(`/cv/${encodeValue(cvData.id)}`)
      );
    } else {
      setCvData(updatedCV);
    }
  };

  if (!cvData) return <div>Loading...</div>;

  return (
    <main className="flex flex-col items-center justify-center p-6 py-5">
      <title>Edit CV</title>
      <h1 className="mb-8 text-3xl font-bold">Edit CV</h1>
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

        <CvActions
          isValid={isValid}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          cvId={cvData.id}
          onDeleteAlertClick={onDeleteAlertClick}
          router={router}
        />
      </form>
    </main>
  );
}
