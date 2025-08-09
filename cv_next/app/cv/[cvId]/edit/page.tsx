"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { notFound, useRouter } from "next/navigation";
import { FiTrash2 } from "react-icons/fi";
import { decodeValue, encodeValue } from "@/lib/utils";
import { useError } from "@/providers/error-provider";
import { getCvModel } from "@/app/actions/cvs/fetchCvs";
import { Visible_Error_Messages } from "@/lib/definitions";
import { updateCV } from "@/app/actions/cvs/uploadCv";
import { deleteCV } from "@/app/actions/cvs/deleteCv";
import { checkCVModifyPermission } from "@/app/actions/cvs/checkPermission";
import ButtonWithAlert from "@/components/ui/ButtonWithAlert";
import { CategoriesInput } from "@/components/ui/CVInput/CategoriesInput";
import { DescriptionInput } from "@/components/ui/CVInput/DescriptionInput";
import { LinkInput } from "@/components/ui/CVInput/LinkInput";

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

  const onDeleteAlertClick = async (type: boolean) => {
    if (!type) return;
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

  const cvActions = (
    <div className="flex-col justify-center">
      <div className="mb-3 flex justify-center">
        <ButtonWithAlert
          buttonContent="Update"
          isDisabled={!isValid}
          buttonClassName="outline-gray-40 box-border flex h-full w-full items-center justify-center 
      whitespace-nowrap rounded-md px-10 py-4 outline-2 
      "
          alertMessage="Are you sure you want to update this CV?"
          alertColor="green"
          onConfirm={handleSubmit(onSubmit)}
        />
      </div>
      <div className="mb-3 flex justify-center">
        <ButtonWithAlert
          buttonContent="Cancel without saving"
          buttonClassName="outline-gray-40 box-border flex h-full w-full items-center justify-center 
      whitespace-nowrap rounded-md px-10 py-4 outline-2 
      "
          alertMessage="Are you sure you want to leave this CV unchanged?"
          alertColor="red"
          onConfirm={() => router.push(`/cv/${encodeValue(cvData.id)}`)}
        />
      </div>

      <div className="mb-3 flex justify-center">
        <ButtonWithAlert
          buttonContent={
            <span className="flex items-center gap-2">
              <FiTrash2 /> Delete
            </span>
          }
          buttonClassName="outline-gray-40 box-border flex h-full w-full items-center justify-center 
      whitespace-nowrap rounded-md bg-red-500 px-6 
 py-4 text-white outline-2 hover:bg-red-600"
          alertMessage="Are you sure you want to delete this CV?"
          alertColor="red"
          onConfirm={() => onDeleteAlertClick}
        />
      </div>
    </div>
  );

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

        {cvActions}
      </form>
    </main>
  );
}
