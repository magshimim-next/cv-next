import { useEffect, useState, useMemo } from "react";
import Categories from "@/types/models/categories";
import { filterValues } from "@/types/models/filters";
import { InputBox } from "./inputbar";
import { DropdownInput } from "./filters/valueSelect";

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
