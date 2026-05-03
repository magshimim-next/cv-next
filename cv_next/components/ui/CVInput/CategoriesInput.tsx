"use client";
import { Controller } from "react-hook-form";
import { DropdownInput } from "@/app/feed/components/filters/valueSelect";
import Categories from "@/types/models/categories";

interface CategoriesInputProps {
  control: any;
  errors: any;
}

/**
 * Controlled category picker for CV upload/edit forms, integrated with react-hook-form.
 * Enforces a selection of 1–3 categories and renders a validation error when violated.
 * @param {CategoriesInputProps} props - Component props.
 * @param {any} props.control - The react-hook-form control object from the parent form.
 * @param {any} props.errors - The react-hook-form errors object, used to display the cvCategories error.
 * @returns {JSX.Element} The category label, dropdown, and validation error message.
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
          <DropdownInput<string>
            onChange={(value) => field.onChange(value || [])}
            valueIds={[...Categories.values]}
            getValueById={(v) => v}
            valueId={field.value?.length ? field.value : null}
            noneText="none"
            placeHolder="Select categories"
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
