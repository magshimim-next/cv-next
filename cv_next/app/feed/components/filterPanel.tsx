import { useEffect, useState } from "react";
import { InputBox } from "./inputbar";
import { DropdownInput } from "./filters/valueSelect";
import Categories from "@/types/models/categories";
import { useMemo } from "react";
import { filterValues } from "@/types/models/filters";

export const FilterPanel = ({
  defaultFilters,
  onChange,
  // eslint-disable-next-line unused-imports/no-unused-vars
  cvs,
}: {
  defaultFilters: filterValues;
  cvs: CvModel[];
  onChange: (filters: filterValues) => void;
}) => {
  const [searchValue, setSearchValue] = useState(defaultFilters.searchValue);
  const [categoryIds, setCategoryId] = useState(defaultFilters.categoryIds);

  useEffect(() => {
    onChange({
      categoryIds: categoryIds,
      searchValue: searchValue,
    });
  }, [searchValue, categoryIds, onChange]);

  const mapCategories: number[] = useMemo(() => {
    const keys = Object.keys(Categories.category)
      .map((key) => parseInt(key))
      .filter((key) => !isNaN(key));
    return keys;
  }, []);

  return (
    <div className=" my-[10px] flex flex-col items-center justify-between gap-2 md:flex-row">
      <InputBox
        placeHolder="Input text to search"
        value={searchValue}
        onChange={setSearchValue}
      ></InputBox>
      <div className="w-80">
        <DropdownInput
          placeHolder="all"
          valueIds={mapCategories}
          text="Categories"
          valueId={categoryIds}
          onChange={setCategoryId}
          getValueById={(id: number) => {
            return Categories.category[id];
          }}
          noneText="all"
          selected={defaultFilters.categoryIds}
        ></DropdownInput>
      </div>
    </div>
  );
};
