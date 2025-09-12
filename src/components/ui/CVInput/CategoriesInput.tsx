"use client";
import { Controller } from "react-hook-form";
import { DropdownInput } from "@/app/feed/components/filters/valueSelect";
import Categories from "@/types/models/categories";
import { getAllNumbersFromArr } from "@/lib/utils";

/**
 * Props for CategoriesInput component.
 */
interface CategoriesInputProps {
  /** The react hook forms control object */
  control: any;
  /** The form errors object */
  errors: any;
}

/**
 * Input component for CV categories with validation.
 * @param {CategoriesInputProps} props - The react hook forms props for the component.
 * @returns {JSX.Element} The component.
 */
export function CategoriesInput({ control, errors }: CategoriesInputProps) {
  return (
    <div className="flex flex-col">
      <label className="mb-2 text-lg font-medium">Categories</label>
      <Controller
        name="cvCategories"
        control={control}
        rules={{
          required: "Please select between 1 and 3 categories",
          validate: (value) =>
            (value.length >= 1 && value.length <= 3) || "Select 1–3 categories",
        }}
        render={({ field }) => (
          <DropdownInput
            onChange={(value) => field.onChange(value || [])}
            valueIds={getAllNumbersFromArr(Object.keys(Categories.category))}
            getValueById={(id) => Categories.category[id]}
            valueId={field.value}
            noneText="none"
            placeHolder="Select categories"
            exclude={[Categories.category.Undefined]}
          />
        )}
      />
      {errors.cvCategories && (
        <p className="mt-1 text-sm text-red-500">
          {errors.cvCategories.message}
        </p>
      )}
    </div>
  );
}
