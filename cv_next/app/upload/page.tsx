"use client";

import { Suspense, useState } from "react";
import { InputBox, InputTextArea } from "../feed/components/inputbar";
import { DropdownInput } from "../feed/components/filters/valueSelect";
import Image from "next/image";
import openLink from "@/public/images/openLink.png";
import warningIcon from "@/public/images/warning.png";
import Categories from "@/types/models/categories";
import { getAllNumbersFromArr } from "@/lib/utils";
import { CvPreview } from "@/components/cvPerview";
import PopupWrapper from "@/components/ui/popupWrapper";
import { Button } from "../feed/components/button";
import { checkUploadCV, InputValues } from "../actions/cvs/uploadCv";
import { useSupabase } from "@/hooks/supabase";
import { validateGoogleViewOnlyUrl } from "@/helpers/cvLinkRegexHelper";

const Row = ({ inputElement }: { inputElement: JSX.Element }) => {
  return (
    <div className="flex w-full flex-col items-start justify-center gap-1">
      {inputElement}
    </div>
  );
};

export const InputRow = ({
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
    <Row
      inputElement={
        <>
          <div className="flex flex-row items-center gap-3 text-xl">
            {title}
            {!isValid && (
              <Image
                className="dark:invert"
                alt=""
                src={warningIcon}
                width={25}
                height={25}
                title={inputDescription}
              ></Image>
            )}
          </div>
          {inputElement}
        </>
      }
    ></Row>
  );
};

export default function Page() {
  const [catagoryId, setCatagoryId] = useState<InputValues["catagoryId"]>(null);
  const [description, setDescription] =
    useState<InputValues["description"]>("");
  const [link, setLink] = useState<InputValues["link"]>("");
  const [errorMsg, setErrorMsg] = useState<string | null>();
  const supabase = useSupabase();

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
        userId,
      })
    );
  }
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        {errorMsg && (
          <PopupWrapper onClose={() => setErrorMsg(null)}>
            <div className=" flex items-center justify-center rounded-md border-2 border-black bg-red-700 px-10 py-5 text-2xl">
              {errorMsg}
            </div>
          </PopupWrapper>
        )}
        <div className="flex w-full items-center justify-center">
          <div className="flex h-full w-2/4 flex-col items-center justify-center gap-8">
            <div className="text-7xl">Upload CV</div>
            <InputRow
              title="Link"
              inputDescription="Please enter a google docs link of the cv"
              isValid={validate.link()}
              inputElement={
                <div className="flex w-full flex-row items-center justify-between">
                  <InputBox
                    onChange={(e) => setLink(e)}
                    placeHolder="Please enter the CV link"
                    value={link}
                  ></InputBox>
                  {
                    <PopupWrapper
                      clickable={
                        <div
                          className="flex h-12 w-20 flex-row items-center justify-center"
                          title=""
                        >
                          <Image
                            className={`dark:invert ${!validate.link() && "opacity-25"}`}
                            alt=""
                            src={openLink}
                            width={30}
                            height={30}
                          ></Image>
                        </div>
                      }
                      disableButton={!validate.link()}
                    >
                      <div className="bg-secondary">
                        {link && <CvPreview document_link={link}></CvPreview>}
                      </div>
                    </PopupWrapper>
                  }
                </div>
              }
            ></InputRow>
            <InputRow
              title="Description"
              inputDescription="Please enter a description 1 > 500 chars"
              isValid={validate.description()}
              inputElement={
                <InputTextArea
                  onChange={setDescription}
                  placeHolder="Please enter a description"
                  value={description}
                ></InputTextArea>
              }
            ></InputRow>
            <InputRow
              title="Catagory"
              inputDescription="Please select 1-3 catagories"
              isValid={validate.catagoryIds()}
              inputElement={
                <div className="w-80">
                  <DropdownInput
                    onChange={(e) => setCatagoryId(e || null)}
                    placeHolder="Please select a catagory"
                    valueIds={getAllNumbersFromArr(
                      Object.keys(Categories.category)
                    )}
                    getValueById={(e) => Categories.category[e]}
                    valueId={catagoryId}
                    noneText="none"
                  ></DropdownInput>
                </div>
              }
            ></InputRow>
            <Row
              inputElement={
                <div className="flex h-full w-full items-center justify-center">
                  <div className="mt-20 w-1/2">
                    <Button
                      text="Upload"
                      onClick={startUpload}
                      isDisabled={!validate.cv()}
                    ></Button>
                  </div>
                </div>
              }
            ></Row>
          </div>
        </div>
      </Suspense>
    </main>
  );
}
