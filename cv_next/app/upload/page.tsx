"use client";

import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import { InputBox, InputTextArea } from "@/app/feed/components/inputbar";
import { DropdownInput } from "@/app/feed/components/filters/valueSelect";
import { Button } from "@/app/feed/components/button";
import { getAllNumbersFromArr } from "@/lib/utils";
import Categories from "@/types/models/categories";
import { validateGoogleViewOnlyUrl } from "@/helpers/cvLinkRegexHelper";
import { useError } from "@/providers/error-provider";
import { checkUploadCV } from "@/app/actions/cvs/uploadCv";
import PopupWrapper from "@/components/ui/popupWrapper";
import openLink from "@/public/images/openLink.png";
import { CvPreview } from "@/components/cvPerview";

type FormValues = {
  link: string;
  description: string;
  cvCategories: number[];
};

export default function Page() {
  const { showError } = useError();

  const {
    control,
    handleSubmit,
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
    const uploadResp = await checkUploadCV({
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
                      <div className="ml-2 flex h-12 w-12 flex-row items-center justify-center">
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
                  <p className="mt-1 text-sm text-red-500">
                    {errors.link.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 text-lg font-medium">Description</label>
          <Controller
            name="description"
            control={control}
            rules={{
              required: "Description is required",
              maxLength: {
                value: 500,
                message: "Description must not exceed 500 characters",
              },
              minLength: {
                value: 1,
                message: "Description must have at least 1 character",
              },
            }}
            render={({ field }) => (
              <div>
                <InputTextArea
                  onChange={(newValue: string) => {
                    // One over the actual limit, to show the error message
                    if (newValue.length <= 501) {
                      field.onChange(newValue);
                    }
                  }}
                  value={field.value}
                  placeHolder="Enter a brief description (1-500 chars)"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 text-lg font-medium">Categories</label>
          <Controller
            name="cvCategories"
            control={control}
            rules={{
              required: "Please select between 1 and 3 categories",
              validate: (value) =>
                (value.length >= 1 && value.length <= 3) ||
                "Select 1-3 categories",
            }}
            render={({ field }) => (
              <DropdownInput
                onChange={(value) => field.onChange(value || [])}
                valueIds={getAllNumbersFromArr(
                  Object.keys(Categories.category)
                )}
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

        {/* Submit Button */}
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
