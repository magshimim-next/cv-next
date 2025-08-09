"use client";
import { Controller } from "react-hook-form";
import { InputTextArea } from "@/app/feed/components/inputbar";
import Definitions from "@/lib/definitions";

/**
 * Props for DescriptionInput component.
 */
interface DescriptionInputProps {
  /** The react hook forms control object */
  control: any;
  /** The form errors object */
  errors: any;
  /** Function to clear errors for a specific field */
  clearErrors: (name: string) => void;
  /** Function to set an error for a specific field */
  setError: (name: string, error: { type: string; message: string }) => void;
}

/**
 * Input component for CV description with validation.
 * @param {DescriptionInputProps} props - The react hook forms props for the component.
 * @returns {JSX.Element} The component.
 */
export function DescriptionInput({
  control,
  errors,
  clearErrors,
  setError,
}: DescriptionInputProps) {
  return (
    <div className="flex flex-col">
      <label className="mb-2 text-lg font-medium">Description</label>
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
          const currentLength = field.value?.length || 0;
          const charCountColor =
            currentLength >= Definitions.MAX_DESCRIPTION_SIZE
              ? "text-red-500"
              : "text-gray-500";

          return (
            <div className="flex flex-col">
              <InputTextArea
                onChange={(newValue: string) => {
                  if (newValue.length <= Definitions.MAX_DESCRIPTION_SIZE) {
                    field.onChange(newValue);
                    clearErrors("description");
                  } else {
                    setError("description", {
                      type: "maxLength",
                      message: `Description must not exceed ${Definitions.MAX_DESCRIPTION_SIZE} characters`,
                    });
                  }
                }}
                value={field.value}
                placeHolder={`Enter a brief description (1–${Definitions.MAX_DESCRIPTION_SIZE} chars)`}
              />
              <div className="mt-1 flex justify-between text-sm">
                <div className="text-red-500">
                  {errors.description?.message || <span>&nbsp;</span>}
                </div>
                <span className={charCountColor}>
                  {currentLength} / {Definitions.MAX_DESCRIPTION_SIZE}{" "}
                  characters
                </span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
