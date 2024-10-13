import { useEffect, useState } from "react";
import { InputBox } from "./inputbar";
import { DropdownInput } from "./filters/valueSelect";
import Categories from "@/types/models/categories";
import { useMemo } from "react";
import { filterValues } from "@/types/models/filters";
import { categoryString } from "@/lib/utils";
import { useSearchParams, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useDebounceValue } from "@/hooks/useDebounceCallback";

export const CATEGORY_PARAM = "category";
export const DESCRIPTION_PARAM = "description";

export const FilterPanel = ({
  defaultFilters,
  // eslint-disable-next-line unused-imports/no-unused-vars
  cvs,
}: {
  defaultFilters: filterValues;
  cvs: CvModel[];
}) => {
  const [searchValue, setSearchValue] = useState(defaultFilters.searchValue);
  const [categoryIds, setCategoryId] = useState(defaultFilters.categoryIds);

  const debouncedSearchValue = useDebounceValue(searchValue);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (categoryIds) {
      const uriCategories = searchParams.get(CATEGORY_PARAM)?.split(",") ?? [];
      const stateCategories = categoryIds?.map(id => categoryString(id));
      //only handle change if categories actually changed
      if (JSON.stringify(uriCategories) != JSON.stringify(stateCategories)) {
        params.set(CATEGORY_PARAM, categoryIds.map(categoryString).join(","));
      }
    } else {
      params.delete(CATEGORY_PARAM);
    }

    const uriSearchValue = searchParams.get(DESCRIPTION_PARAM) ?? "";
    if (debouncedSearchValue) {
      if (uriSearchValue !== debouncedSearchValue) {
        params.set(DESCRIPTION_PARAM, debouncedSearchValue);
      }
    } else {
      params.delete(DESCRIPTION_PARAM);
    }
    router.replace(`${pathname}?${params}`);
  }, [debouncedSearchValue, searchParams, router, pathname, categoryIds]);

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
