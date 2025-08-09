"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { FiTrash2 } from "react-icons/fi";
import { InputBox, InputTextArea } from "@/app/feed/components/inputbar";
import { DropdownInput } from "@/app/feed/components/filters/valueSelect";
import { decodeValue, encodeValue, getAllNumbersFromArr } from "@/lib/utils";
import Categories from "@/types/models/categories";
import { validateGoogleViewOnlyUrl } from "@/helpers/cvLinkRegexHelper";
import { useError } from "@/providers/error-provider";
import { getCvModel } from "@/app/actions/cvs/fetchCvs";
import PopupWrapper from "@/components/ui/popupWrapper";
import openLink from "@/public/images/openLink.png";
import { CvPreview } from "@/components/cvPerview";
import Definitions, { Visible_Error_Messages } from "@/lib/definitions";
import { updateCV } from "@/app/actions/cvs/uploadCv";
import { deleteCV } from "@/app/actions/cvs/deleteCv";
import { checkCVModifyPermission } from "@/app/actions/cvs/checkPermission";
import ButtonWithAlert from "@/components/ui/ButtonWithAlert";
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
          isDisabled={!isValid}
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
          isDisabled={!isValid}
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

  const linkInput = (
    <div className="flex flex-col">
      <label className="mb-2 text-lg font-medium">Link</label>
      <Controller
        name="link"
        control={control}
        rules={{
          required: "Link is required",
          validate: (value) =>
            validateGoogleViewOnlyUrl(value) ||
            "Invalid Google Docs link format",
        }}
        render={({ field }) => (
          <div className="flex flex-col">
            <div className="flex items-center">
              <InputBox
                onChange={field.onChange}
                value={field.value}
                placeHolder="Enter Google Docs link"
              />
              <PopupWrapper
                clickable={
                  <div className="ml-2 flex h-12 w-12 items-center justify-center">
                    <Image
                      className={`dark:invert ${!validateGoogleViewOnlyUrl(field.value) && "opacity-25"}`}
                      alt=""
                      src={openLink}
                      width={24}
                      height={24}
                    />
                  </div>
                }
                disableButton={!validateGoogleViewOnlyUrl(field.value)}
              >
                <div className="bg-secondary">
                  {field.value && <CvPreview document_link={field.value} />}
                </div>
              </PopupWrapper>
            </div>
            {errors.link && (
              <p className="mt-1 text-sm text-red-500">{errors.link.message}</p>
            )}
          </div>
        )}
      />
    </div>
  );

  const descriptionInput = (
    <div className="flex flex-col">
      <label className="mb-2 text-lg font-medium">Description</label>
      <Controller
        name="description"
        control={control}
        rules={{
          required: "Description is required",
          maxLength: {
            value: Definitions.MAX_DESCRIPTION_SIZE,
            message: `Description must not exceed ${Definitions.MAX_DESCRIPTION_SIZE} characters`,
          },
          minLength: {
            value: 1,
            message: "Description must have at least 1 character",
          },
        }}
        render={({ field }) => {
          const currentLength = field.value?.length || 0;
          const charCountColor =
            currentLength >= Definitions.MAX_DESCRIPTION_SIZE
              ? "text-red-500"
              : "text-gray-500";

          return (
            <div className="flex flex-col">
              <InputTextArea
                onChange={(newValue: string) => {
                  if (newValue.length <= Definitions.MAX_DESCRIPTION_SIZE) {
                    field.onChange(newValue);
                    clearErrors("description");
                  } else {
                    setError("description", {
                      type: "maxLength",
                      message: `Description must not exceed ${Definitions.MAX_DESCRIPTION_SIZE} characters`,
                    });
                  }
                }}
                value={field.value}
                placeHolder="Enter a brief description (1–500 chars)"
              />
              <div className="mt-1 flex justify-between text-sm">
                <div className="text-red-500">
                  {errors.description?.message || <span>&nbsp;</span>}
                </div>
                <span className={charCountColor}>
                  {currentLength} / {Definitions.MAX_DESCRIPTION_SIZE}{" "}
                  characters
                </span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );

  const categoriesInput = (
    <div className="flex flex-col">
      <label className="mb-2 text-lg font-medium">Categories</label>
      <Controller
        name="cvCategories"
        control={control}
        rules={{
          required: "Please select between 1 and 3 categories",
          validate: (value) =>
            (value.length >= 1 && value.length <= 3) || "Select 1–3 categories",
        }}
        render={({ field }) => (
          <DropdownInput
            onChange={(value) => field.onChange(value || [])}
            valueIds={getAllNumbersFromArr(Object.keys(Categories.category))}
            getValueById={(id) => Categories.category[id]}
            valueId={field.value}
            noneText="none"
            placeHolder="Select categories"
            exclude={[Categories.category.Undefined]}
          />
        )}
      />
      {errors.cvCategories && (
        <p className="mt-1 text-sm text-red-500">
          {errors.cvCategories.message}
        </p>
      )}
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
        {linkInput}

        {descriptionInput}

        {categoriesInput}

        {cvActions}
      </form>
    </main>
  );
}
