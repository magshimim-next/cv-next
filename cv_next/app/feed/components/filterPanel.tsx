import { useEffect, useState } from "react";
import { SearchBox } from "./filters/searchbar";
import { DropdownInput } from "./filters/valueSelect";
import Categories from "@/types/models/categories";

export interface filterValues {
  searchValue: string;
  categoryId: number | null;
}

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
  const [categoryId, setCategoryId] = useState(defaultFilters.categoryId);

  useEffect(() => {
    onChange({
      categoryId: categoryId,
      searchValue: searchValue,
    });
  }, [searchValue, categoryId]);

  return (
    <div className="mx-10 my-[10px] flex flex-row items-center justify-between gap-2">
      <SearchBox
        placeHolder=" input text to search"
        value={searchValue}
        onChange={setSearchValue}
      ></SearchBox>
      <DropdownInput
        placeHolder="all"
        valueIds={Object.keys(Categories.category)
          .map((key) => parseInt(key))
          .filter((key) => !isNaN(key))}
        text="catagory"
        valueId={categoryId}
        onChange={setCategoryId}
        getValueById={(id: number) => {
          return Categories.category[id];
        }}
      ></DropdownInput>
    </div>
  );
};
