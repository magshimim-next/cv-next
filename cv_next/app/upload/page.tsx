"use client";

import { Suspense, useState } from "react"
import { InputBox } from "../feed/components/inputbar"
import { DropdownInput } from "../feed/components/filters/valueSelect";
import Image from "next/image";
import openLink from "@/public/images/openLink.png";
import warningIcon from "@/public/images/warning.png";
import Categories from "@/types/models/categories";
import { getAllNumbersFromArr } from "@/lib/utils";
import { CvPreview } from "@/components/cvPerview";
import PopupWrapper from "@/components/ui/popupButtom";
import { Button } from "../feed/components/button";

interface InputValues {
  title: string;
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
  const [catagoryId, setCatagoryId] = useState<InputValues["catagoryId"]>(null)
  const [description, setDescription] = useState<InputValues["description"]>('')
  const [link, setLink] = useState<InputValues["link"]>('')
  const [title, setTitle] = useState<InputValues["title"]>('')

  const checkIfLinkIsValid = () => {
    return !!link.match('https?://(?:docs|drive).google.com/(?:document|file)/d/([a-zA-Z0-9-]+)(?:/(?:edit|view)?usp=[a-zA-Z0-9-&=]+)?')
  }

  const validateInput = () => {
    if(!catagoryId) return false;
    if(!description) return false;
    if(!link) return false;
    if(!title) return false;

    return true
  }

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="w-full flex justify-center items-center">
          <div className="w-2/4 h-full flex justify-center items-center flex-col gap-8">
            {/* <div className="absolute bg-black h-full w-full bottom-0"></div> */}
              <div className="text-7xl">Upload cv</div>
              {/* <InputRow title="title" inputElement={
                  <InputBox onChange={(e) => setTitle(e)} placeHolder="please enter a title" value={title}></InputBox>
              } isValid={!!title}></InputRow>
               */}
              <InputRow title="Link" inputDescription="please enter a google docs link of the cv" inputElement={  
                  <div className="flex flex-row justify-between w-full items-center">
                      <InputBox onChange={(e) => setLink(e)} placeHolder="please enter the cv link" value={link}></InputBox>
                      <PopupWrapper 
                        clickable= {
                          <div className="h-12 w-20 flex flex-row justify-center items-center">
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
              } isValid={checkIfLinkIsValid()}></InputRow>

              <InputRow title="Description" inputDescription="please enter a description 1 > 500 chars" inputElement={
                <InputBox onChange={(e) => setDescription(e)} placeHolder="please enter a description" value={description}></InputBox>
              } isValid={!!description && description.length <= 500 }></InputRow>

              <InputRow title="Catagory" inputDescription="please select at least one catagory" inputElement={
                <DropdownInput text="" onChange={(e) => setCatagoryId(e)} placeHolder="please select a catagory" valueIds={getAllNumbersFromArr(Object.keys(Categories.category))} getValueById={(e) => Categories.category[e]} valueId={catagoryId}></DropdownInput>
              } isValid={!!catagoryId}></InputRow>

              <Row inputElement={
                <div className="flex justify-center items-center w-full h-full">
                  <div className="w-1/2 mt-20">
                    <Button text={'send'} onClick={() => {}}></Button>
                  </div>
                </div>
              }></Row>

          </div>
        </div>
      </Suspense>
    </main>
  )
}
