"use client";

import Image from "next/image";
import { Suspense, useState } from "react";

import { CvPreview } from "@/components/cvPerview";
import PopupWrapper from "@/components/ui/popupWrapper";
import openLink from "@/public/images/openLink.png";
import warningIcon from "@/public/images/warning.png";
import Categories from "@/types/models/categories";
import { checkUploadCV } from "@/app/actions/cvs/uploadCv";
import { Button } from "@/app/feed/components/button";
import { DropdownInput } from "@/app/feed/components/filters/valueSelect";
import { InputBox, InputTextArea } from "@/app/feed/components/inputbar";
import { getAllNumbersFromArr } from "@/lib/utils";
import { validateGoogleViewOnlyUrl } from "@/helpers/cvLinkRegexHelper";
import { useError } from "@/providers/error-provider";

const InputRow = ({
  inputElement,
  title,
  isValid,
  inputDescription,
}: {
  inputElement: JSX.Element;
  title: string;
  isValid: boolean;
  inputDescription: string;
}) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-row items-center gap-2 text-lg sm:text-xl">
        {title}
        {!isValid && (
          <Image
            className="dark:invert"
            alt=""
            src={warningIcon}
            width={20}
            height={20}
            title={inputDescription}
          />
        )}
      </div>
      {inputElement}
    </div>
  );
};

export default function Page() {
  const [categoryId, setCategoryId] = useState<number[]>([]);
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const { showError } = useError();

  const [isLinkTouched, setIsLinkTouched] = useState(false);
  const [isDescriptionTouched, setIsDescriptionTouched] = useState(false);
  const [isCategoryTouched, setIsCategoryTouched] = useState(false);

  const validate = (() => {
    const checkIfLinkIsValid = () => {
      return validateGoogleViewOnlyUrl(link);
    };
    const checkIfCatagorisAreValid = () => {
      return !!categoryId && categoryId.length >= 1 && categoryId.length <= 3;
    };
    const checkIfDescriptionIsValid = () => {
      return !!description && description.length <= 500;
    };
    return {
      link: checkIfLinkIsValid,
      categoryIds: checkIfCatagorisAreValid,
      description: checkIfDescriptionIsValid,
      cv: () => {
        if (!checkIfCatagorisAreValid()) return false;
        if (!checkIfDescriptionIsValid()) return false;
        if (!checkIfLinkIsValid()) return false;

        return true;
      },
    };
  })();

  async function startUpload() {
    if (!validate.cv()) return;
    const uploadResp = await checkUploadCV({
      cvData: {
        cvCategories: categoryId,
        description: description,
        link: link,
      },
    });
    if (uploadResp) {
      showError(uploadResp, "");
    }
  }

  return (
    <main className="p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex w-full flex-col items-center justify-center">
          <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl">
            Upload CV
          </h1>
          <div className="w-full max-w-md space-y-6">
            <InputRow
              title="Link"
              inputDescription="Please enter a Google Docs link of the CV"
              isValid={!isLinkTouched || validate.link()}
              inputElement={
                <div className="flex w-full flex-row items-center justify-between">
                  <InputBox
                    onChange={(e) => {
                      setLink(e);
                      setIsLinkTouched(true);
                    }}
                    placeHolder="Enter CV link"
                    value={link}
                  />
                  <PopupWrapper
                    clickable={
                      <div className="ml-2 flex h-12 w-12 flex-row items-center justify-center">
                        <Image
                          className={`dark:invert ${!validate.link() && "opacity-25"}`}
                          alt=""
                          src={openLink}
                          width={24}
                          height={24}
                        />
                      </div>
                    }
                    disableButton={!validate.link()}
                  >
                    <div className="bg-secondary">
                      {link && <CvPreview document_link={link} />}
                    </div>
                  </PopupWrapper>
                </div>
              }
            />
            <InputRow
              title="Description"
              inputDescription="Please enter a description 1 > 500 chars"
              isValid={!isDescriptionTouched || validate.description()}
              inputElement={
                <InputTextArea
                  onChange={(e) => {
                    setDescription(e);
                    setIsDescriptionTouched(true);
                  }}
                  placeHolder="Enter description"
                  value={description}
                />
              }
            />
            <InputRow
              title="Category"
              inputDescription="Please select 1-3 categories"
              isValid={!isCategoryTouched || validate.categoryIds()}
              inputElement={
                <DropdownInput
                  onChange={(e) => {
                    setCategoryId(e || []);
                    setIsCategoryTouched(true);
                  }}
                  placeHolder="Select category"
                  valueIds={getAllNumbersFromArr(
                    Object.keys(Categories.category)
                  )}
                  getValueById={(e) => Categories.category[e]}
                  valueId={categoryId}
                  noneText="none"
                />
              }
            />
            <div className="flex max-w-md justify-center">
              <Button
                text="Upload"
                onClick={startUpload}
                isDisabled={!validate.cv()}
              />
            </div>
          </div>
        </div>
      </Suspense>
    </main>
  );
}
