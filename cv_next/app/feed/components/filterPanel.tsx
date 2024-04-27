import { useEffect, useState } from "react"
import { SearchBox } from "../../../components/ui/filters/searchbar"
import { DropdownInput } from "../../../components/ui/filters/valueSelect"
import Categories from "@/types/models/categories"
// eslint-disable-next-line unused-imports/no-unused-imports
import { ModeSwitch } from "@/components/ui/filters/modeSwitch"

export interface filterValues {
  searchValue: string
  categoryId: number | null
}

export const MODES: [string, string] = ["review", "published"]

export const FilterPanel = ({
  defaultFilters,
  onChange,
  // eslint-disable-next-line unused-imports/no-unused-vars
  cvs,
}: {
  defaultFilters: filterValues
  cvs: CvModel[]
  onChange: (filters: filterValues) => void
}) => {
  const [searchValue, setSearchValue] = useState(defaultFilters.searchValue)
  const [categoryId, setCategoryId] = useState(defaultFilters.categoryId)
  const [_modeValue, _setModeValue] = useState(MODES[0])

  useEffect(() => {
    onChange({
      categoryId: categoryId,
      searchValue: searchValue,
    })
  }, [searchValue, categoryId])

  return (
    <div className="mx-10 my-[10px] flex flex-row items-center justify-between gap-2">
      <SearchBox
        placeHolder=" input text to search"
        value={searchValue}
        onChange={(value: string) => {
          setSearchValue(value)
        }}
      ></SearchBox>
      <DropdownInput
        placeHolder="all"
        valueIds={Object.keys(Categories.category)
          .map((key) => parseInt(key))
          .filter((key) => !isNaN(key))}
        text="catagory"
        valueId={categoryId}
        onChange={(value: number | null) => {
          setCategoryId(value)
        }}
        getValueById={(id: number) => {
          return Categories.category[id]
        }}
      ></DropdownInput>
      {/* <ModeSwitch value={modeValue} values={MODES} onChange={setModeValue}></ModeSwitch> */}
    </div>
  )
}
