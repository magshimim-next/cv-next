import { useEffect, useState } from "react";
import { InputBox } from "./inputbar";
import { DropdownInput } from "./filters/valueSelect";
import Categories from "@/types/models/categories";
import { useMemo } from "react";
import { filterValues } from "@/types/models/filters";
import { categoryString } from "@/lib/utils";
import { useSearchParams, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

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

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (categoryIds) {
      params.delete("category");
      categoryIds.map((category) => {
        if (category !== undefined)
          params.append("category", categoryString(category));
      });
      router.replace(`${pathname}?${params}`);
    } else {
      params.delete("category");
      router.replace(`${pathname}`);
    }
    onChange({
      categoryIds: categoryIds,
      searchValue: searchValue,
    });
  }, [searchValue, categoryIds, onChange, searchParams, router, pathname]);

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
