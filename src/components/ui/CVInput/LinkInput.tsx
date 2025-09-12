"use client";
import { Controller } from "react-hook-form";
import Image from "next/image";
import { InputBox } from "@/app/feed/components/inputbar";
import PopupWrapper from "@/components/ui/popupWrapper";
import { CvPreview } from "@/components/cvPerview";
import openLink from "@/public/images/openLink.png";
import { validateGoogleViewOnlyUrl } from "@/helpers/cvLinkRegexHelper";

/**
 * Props for LinkInput component.
 */
interface LinkInputProps {
  /** The react hook forms control object */
  control: any;
  /** The form errors object */
  errors: any;
}

/**
 * Input component for CV link with validation.
 * @param {LinkInputProps} props - The react hook forms props for the component.
 * @returns {JSX.Element} The component.
 */
export function LinkInput({ control, errors }: LinkInputProps) {
  return (
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
                      className={`dark:invert ${!validateGoogleViewOnlyUrl(field.value) ? "opacity-25" : ""}`}
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
}
