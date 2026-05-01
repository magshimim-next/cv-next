"use client";
import { Controller } from "react-hook-form";
import { DropdownInput } from "@/app/feed/components/filters/valueSelect";
import Categories from "@/types/models/categories";

interface CategoriesInputProps {
  control: any;
  errors: any;
}

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
