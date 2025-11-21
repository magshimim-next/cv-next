"use client";
import { Controller } from "react-hook-form";
import { FC } from "react";
import Definitions from "@/lib/definitions";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "../field";

/**
 * Props for DescriptionInput component.
 */
interface DescriptionInputProps {
  /** The react hook forms control object */
  control: any;
  /** The form errors object */
  errors: any;
}

/**
 * Input component for CV description with validation.
 * @param {DescriptionInputProps} props - The react hook forms props for the component.
 * @returns {JSX.Element} The component.
 */
export const DescriptionInput: FC<DescriptionInputProps> = ({
  control,
  errors,
}) => {
  return (
    <>
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
          const currentLength: number = field.value?.length || 0;
          const charCountColor: string =
            errors?.description?.message ||
            currentLength >= Definitions.MAX_DESCRIPTION_SIZE
              ? "text-red-500"
              : "text-gray-500";

          return (
            <Field>
              <FieldLabel htmlFor="description" className="text-lg font-medium">
                Description
              </FieldLabel>
              <Textarea
                maxLength={Definitions.MAX_DESCRIPTION_SIZE}
                {...field}
                id="description"
                className="h-32 max-h-48 bg-white text-black placeholder:text-gray-400"
                placeholder={`Enter a brief description (1–${Definitions.MAX_DESCRIPTION_SIZE} chars)`}
              />
              <p className={charCountColor}>
                {errors?.description?.message ||
                  `${currentLength} / ${Definitions.MAX_DESCRIPTION_SIZE} characters`}
              </p>
            </Field>
          );
        }}
      />
    </>
  );
};
