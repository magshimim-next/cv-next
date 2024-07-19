"use client";

import { Suspense, useState } from "react";
import { InputBox } from "../feed/components/inputbar";
import { DropdownInput } from "../feed/components/filters/valueSelect";
import Image from "next/image";
import openLink from "@/public/images/openLink.png";
import warningIcon from "@/public/images/warning.png";
import Categories from "@/types/models/categories";
import { getAllNumbersFromArr } from "@/lib/utils";
import { CvPreview } from "@/components/cvPerview";
import PopupWrapper from "@/components/ui/popupButtom";
import { Button } from "../feed/components/button";
import { checkUploadCV } from "../actions/cvs/uploadCv";
import { useSupabase } from "@/hooks/supabase";

export interface InputValues {
  link: string;
  description: string;
  catagoryId: number[] | null
}

const Row = ({
  inputElement
}: {
  inputElement: JSX.Element;
}) => {
  return <div className="w-full flex justify-center items-start flex-col gap-1">
      {inputElement}
  </div>
}

export const InputRow = ({
    inputElement,
    title,
    isValid,
    inputDescription
  }: {
    inputElement: JSX.Element;
    title: string;
    isValid: boolean;
    inputDescription: string;
  }) => {
    return <Row inputElement={
      <>
          <div className="text-xl flex flex-row items-center gap-3">
            {title}
            { !isValid && <Image className="dark:invert" alt='' src={warningIcon}width={25}height={25} title={inputDescription}></Image> }
          </div>
          {inputElement}
      </>
    }></Row>
    
    
}

export default function Page() {
  const [catagoryId, setCatagoryId] = useState<InputValues["catagoryId"]>(null);
  const [description, setDescription] =
    useState<InputValues["description"]>("");
  const [link, setLink] = useState<InputValues["link"]>("");
  const supabase = useSupabase();

  const checkIfLinkIsValid = () => {
    return !!link.match('https?://(?:docs|drive).google.com/(?:document|file)/d/([a-zA-Z0-9-]+)(?:/(?:edit|view)?usp=[a-zA-Z0-9-&=]+)?')
  }

  const validate = (() => {
    const checkIfLinkIsValid = () => {
      return !!link.match('https?://(?:docs|drive).google.com/(?:document|file)/d/([a-zA-Z0-9-]+)(?:/(?:edit|view)?usp=[a-zA-Z0-9-&=]+)?')
    }
    const checkIfCatagorisAreValid = () => {
      return !!catagoryId && catagoryId.length <= 3
    }
    const checkIfDescriptionIsValid = () => {
      return description.length <= 500 
    }
    return {
      link: checkIfLinkIsValid,
      catagoryIds: checkIfCatagorisAreValid,
      description: checkIfDescriptionIsValid,
      cv: () => {
        if(!checkIfCatagorisAreValid) return false;
        if(!checkIfDescriptionIsValid) return false;
        if(!checkIfLinkIsValid()) return false;

        return true
      }
    }
  })()

  async function startUpload() {
    const userId: string | undefined = (await supabase.auth.getUser()).data.user
      ?.id;
    if (!userId) {
      return;
    }
    const cvData: InputValues = {
      catagoryId: catagoryId,
      description: description,
      link: link,
    };
    if(!validate.cv()) return
    await checkUploadCV({ cvData, userId });
  }
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex w-full items-center justify-center">
          <div className="flex h-full w-2/4 flex-col items-center justify-center gap-8">
            <div className="text-7xl">upload cv</div>
            <InputRow
              title="link"
              inputDescription="please enter a google docs link of the cv"
              isValid={validate.link()}
              inputElement={
                <div className="flex w-full flex-row items-center justify-between">
                  <InputBox
                    onChange={(e) => setLink(e)}
                    placeHolder="please enter the cv link"
                    value={link}
                  ></InputBox>
                  <PopupWrapper 
                        clickable= {
                          <div className="h-12 w-20 flex flex-row justify-center items-center" title="">
                              <Image className="dark:invert"
                                  alt='' 
                                  src={openLink}
                                  width={30}
                                  height={30}
                              ></Image>
                          </div>
                        }  
                        children={
                          <div className="bg-secondary">
                            {
                              link && <CvPreview document_link={link}></CvPreview>
                            }
                          </div>
                        }
                        disableButton={!checkIfLinkIsValid()}
                      >
                      </PopupWrapper>
                </div>
              }
            ></InputRow>
            <InputRow
              title="description"
              inputDescription="Please enter a description 1 > 500 chars"
              isValid={validate.description()}
              inputElement={
                <InputBox
                  onChange={(e) => {if(validate.description()) setDescription(e)}}
                  placeHolder="please enter a description"
                  value={description}
                ></InputBox>
              }
            ></InputRow>
            <InputRow
              title="catagory"
              inputDescription="Please select 1-3 catagories"
              isValid={validate.catagoryIds()}
              inputElement={
                <DropdownInput
                  onChange={(e) => setCatagoryId(e || null)}
                  placeHolder="please select a catagory"
                  valueIds={getAllNumbersFromArr(
                    Object.keys(Categories.category)
                  )}
                  getValueById={(e) => Categories.category[e]}
                  valueId={catagoryId}
                ></DropdownInput>
              }
            ></InputRow>
            {/* TODO: Hide button until all was given */}
            <Row inputElement={
                <div className="flex justify-center items-center w-full h-full">
                  <div className="w-1/2 mt-20">
                    <Button text="send" onClick={startUpload} isDisabled={!validate.cv()}></Button>
                  </div>
                </div>
              }></Row>
          </div>
        </div>
      </Suspense>
    </main>
  );
}
