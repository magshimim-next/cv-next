"use client";

import { CvPreview } from "@/components/cvPerview";
import PopupWrapper from "@/components/ui/popupWrapper";
import { validateGoogleViewOnlyUrl } from "@/helpers/cvLinkRegexHelper";
import { createClientComponent } from "@/helpers/supabaseBrowserHelper";
import { getAllNumbersFromArr } from "@/lib/utils";
import openLink from "@/public/images/openLink.png";
import warningIcon from "@/public/images/warning.png";
import Categories from "@/types/models/categories";
import Image from "next/image";
import { Suspense, useState } from "react";

import { InputValues, checkUploadCV } from "../actions/cvs/uploadCv";
import { Button } from "../feed/components/button";
import { DropdownInput } from "../feed/components/filters/valueSelect";
import { InputBox, InputTextArea } from "../feed/components/inputbar";

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
  const [catagoryId, setCatagoryId] = useState<InputValues["catagoryId"]>(null);
  const [description, setDescription] =
    useState<InputValues["description"]>("");
  const [link, setLink] = useState<InputValues["link"]>("");
  const [errorMsg, setErrorMsg] = useState<string | null>();
  const supabase = createClientComponent();

  const validate = (() => {
    const checkIfLinkIsValid = () => {
      return validateGoogleViewOnlyUrl(link);
    };
    const checkIfCatagorisAreValid = () => {
      return !!catagoryId && catagoryId.length <= 3;
    };
    const checkIfDescriptionIsValid = () => {
      return !!description && description.length <= 500;
    };
    return {
      link: checkIfLinkIsValid,
      catagoryIds: checkIfCatagorisAreValid,
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
    const userId: string | undefined = (await supabase.auth.getUser()).data.user
      ?.id;
    if (!userId) return;
    setErrorMsg(
      await checkUploadCV({
        cvData: {
          catagoryId: catagoryId,
          description: description,
          link: link,
        },
      })
    );
  }
  return (
    <main className="p-4">
      <Suspense fallback={<div>Loading...</div>}>
        {errorMsg && (
          <PopupWrapper onClose={() => setErrorMsg(null)}>
            <div className="flex items-center justify-center rounded-md border-2 border-black bg-red-700 px-4 py-2 text-xl text-white">
              {errorMsg}
            </div>
          </PopupWrapper>
        )}
        <div className="flex w-full flex-col items-center justify-center">
          <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl">
            Upload CV
          </h1>
          <div className="w-full max-w-md space-y-6">
            <InputRow
              title="Link"
              inputDescription="Please enter a Google Docs link of the CV"
              isValid={validate.link()}
              inputElement={
                <div className="flex w-full flex-row items-center justify-between">
                  <InputBox
                    onChange={(e) => setLink(e)}
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
              isValid={validate.description()}
              inputElement={
                <InputTextArea
                  onChange={setDescription}
                  placeHolder="Enter description"
                  value={description}
                />
              }
            />
            <InputRow
              title="Category"
              inputDescription="Please select 1-3 categories"
              isValid={validate.catagoryIds()}
              inputElement={
                <DropdownInput
                  onChange={(e) => setCatagoryId(e || null)}
                  placeHolder="Select category"
                  valueIds={getAllNumbersFromArr(
                    Object.keys(Categories.category)
                  )}
                  getValueById={(e) => Categories.category[e]}
                  valueId={catagoryId}
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
