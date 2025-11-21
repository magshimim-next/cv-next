"use client";
import Image from "next/image";
import { FC } from "react";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { validateGoogleViewOnlyUrl } from "@/helpers/cvLinkRegexHelper";
import openLink from "@/public/images/openLink.png";
import Tooltip from "../tooltip";
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
export const LinkInput: FC<LinkInputProps> = ({ control, errors }) => {
  return (
    <>
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
          <Field>
            <FieldLabel htmlFor="link" className="text-lg font-medium">
              Link
            </FieldLabel>
            <div className="flex items-center gap-3">
              <Input
                {...field}
                type="url"
                className="h-12 bg-white text-black placeholder:text-gray-400"
                placeholder="Enter Google Docs link"
                id="link"
              />
              <Tooltip id="previewCV" message="Preview CV">
                <Button
                  disabled={!validateGoogleViewOnlyUrl(field.value)}
                  variant="ghost"
                  size="icon"
                >
                  <Image
                    src={openLink}
                    alt="open"
                    className="h-6 w-6 dark:invert"
                  />
                </Button>
              </Tooltip>
            </div>
            <p className="text-sm text-red-500">
              {errors?.link?.message ?? ""}
            </p>
          </Field>
        )}
      />
    </>
  );
};
