"use client";

import { Suspense, useState } from "react"
import { InputBox } from "../feed/components/inputbar"
import { DropdownInput } from "../feed/components/filters/valueSelect";
import Image from "next/image";
import profileIcon from "@/public/images/profile.png";
import Categories from "@/types/models/categories";
import { getAllNumbersFromArr } from "@/lib/utils";
import { CvPreview } from "@/components/cvPerview";
import PopupWrapper from "@/components/ui/popupButtom";

interface InputValues {
  title: string;
  link: string;
  description: string;
  catagoryId: number | null
}

export const InputRow = ({
    inputElement,
    title,
  }: {
    inputElement: JSX.Element;
    title: string;
  }) => {
    return <div className="w-full flex justify-center items-start flex-col gap-1">
        <div className="text-xl">{title}</div>
        {inputElement}
    </div>
}

export default function Page() {
  const [catagoryId, setCatagoryId] = useState<InputValues["catagoryId"]>(null)
  const [description, setDescription] = useState<InputValues["description"]>('')
  const [link, setLink] = useState<InputValues["link"]>('')
  const [title, setTitle] = useState<InputValues["title"]>('')

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="w-full flex justify-center items-center">
          <div className="w-2/4 h-full flex justify-center items-center flex-col gap-8">
            {/* <div className="absolute bg-black h-full w-full bottom-0"></div> */}
              <div className="text-7xl">upload cv</div>
              <InputRow title="title" inputElement={
                  <InputBox onChange={(e) => setTitle(e)} placeHolder="please enter a title" value={title}></InputBox>
              }></InputRow>
              <InputRow title="link" inputElement={  
                  <div className="flex flex-row justify-between w-full items-center">
                      <InputBox onChange={(e) => setLink(e)} placeHolder="please enter the cv link" value={link}></InputBox>
                      <PopupWrapper 
                        clickable= {
                          <div className="h-12 w-20 flex flex-row justify-center items-center">
                              <Image 
                                  alt='' 
                                  src={profileIcon}
                                  width={50}
                                  height={50}
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
                        disableButton={!link}
                      >
                      </PopupWrapper>
                  </div>
              }></InputRow>
              <InputRow title="description" inputElement={
                <InputBox onChange={(e) => setDescription(e)} placeHolder="please enter a description" value={description}></InputBox>
              }></InputRow>
              <InputRow title="catagory" inputElement={
                <DropdownInput onChange={(e) => setCatagoryId(e)} placeHolder="please select a catagory" valueIds={getAllNumbersFromArr(Object.keys(Categories.category))} getValueById={(e) => Categories.category[e]} valueId={catagoryId}></DropdownInput>
              }></InputRow>

          </div>
        </div>
      </Suspense>
    </main>
  )
}
