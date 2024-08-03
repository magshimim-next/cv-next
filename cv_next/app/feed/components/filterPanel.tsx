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
  const [categoryId, setCategoryId] = useState(defaultFilters.categoryIds);

  useEffect(() => {
    onChange({
      categoryIds: categoryId,
      searchValue: searchValue,
    });
  }, [searchValue, categoryId, onChange]);

  const mapCategories: number[] = useMemo(() => {
    const keys = Object.keys(Categories.category)
      .map((key) => parseInt(key))
      .filter((key) => !isNaN(key));
    return keys;
  }, []);

  return (
    <div className="mx-10 my-[10px] flex flex-row items-center justify-between gap-2">
      <InputBox
        placeHolder="Input text to search"
        value={searchValue}
        onChange={setSearchValue}
      ></InputBox>
      <div className="w-80">
        <DropdownInput
          placeHolder="all"
          valueIds={mapCategories}
          text="Category"
          valueId={categoryId}
          onChange={setCategoryId}
          getValueById={(id: number) => {
            return Categories.category[id];
          }}
          noneText="all"
        ></DropdownInput>
      </div>
    </div>
  );
};
