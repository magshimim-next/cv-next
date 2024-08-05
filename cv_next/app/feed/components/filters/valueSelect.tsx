import { useState, useRef, useEffect } from "react";

export const DropdownInput = ({
  placeHolder,
  valueIds,
  valueId,
  onChange,
  getValueById,
  text,
  isApplyOptionVisible,
  noneText,
}: {
  placeHolder: string;
  valueIds: number[];
  valueId: number[] | null;
  getValueById: (id: number) => string;
  onChange: (newValue: number[] | null) => void;
  text?: string;
  isApplyOptionVisible?: boolean;
  noneText: "all" | "none";
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const isPlaceHolder = valueId === null;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectTitle, setSelectTitle] = useState("");

  const menuBorderStyle = isMenuOpen ? "outline-b-0 rounded-b-none" : "";
  const selectionStyle = isMenuOpen ? "block" : "hidden";
  const textValue = isPlaceHolder ? (
    <div className="text-gray-400">{`${text ? `${text}:` : ""} ${placeHolder}`}</div>
  ) : valueId.length > 1 ? (
    <div className="text-black">{`${text ? `${text}:` : ""} ${getValueById(valueId[0])} +${valueId.length - 1}`}</div>
  ) : (
    <div className="text-black">{`${text ? `${text}:` : ""} ${getValueById(valueId[0])}`}</div>
  );

  const changeIsMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCheckboxChange = (categoryId: number) => {
    setSelectedCategories((prevSelectedIds) => {
      if (prevSelectedIds.includes(categoryId)) {
        return prevSelectedIds.filter(
          (selectedId) => selectedId !== categoryId
        );
      } else {
        return [...prevSelectedIds, categoryId];
      }
    });
    setIsMenuOpen(true);
  };

  const handleAllSelection = () => {
    setSelectedCategories([]);
    onChange(null);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!dropdownRef.current?.contains(event.relatedTarget as Node)) {
      setIsMenuOpen(false);
      onChange(selectedCategories.length ? selectedCategories : null);
    }
  };

  useEffect(() => {
    onChange(selectedCategories.length ? selectedCategories : null);
    setSelectTitle(selectedCategories.map(getValueById).join(", "));
  }, [selectedCategories, onChange, setSelectTitle, getValueById]);

  return (
    <>
      <div
        className={`outline-gray-40 relative flex h-2/6 items-center justify-center whitespace-nowrap bg-white outline-2 ${menuBorderStyle} box-border min-w-0 cursor-pointer rounded-md px-2 py-4`}
        onClick={changeIsMenuOpen}
        onBlur={handleBlur}
        ref={dropdownRef}
        tabIndex={-1}
        title={selectTitle}
      >
        <div className="min-w-0">{textValue}</div>
        <div
          className={`absolute top-full z-10 block h-fit w-full bg-white ${selectionStyle} border-gray-40 max-h-40 divide-y-2 overflow-y-auto border-2 border-t-0`}
        >
          <div
            className="flex h-10 w-full items-center justify-center bg-white text-gray-400 hover:bg-slate-200"
            onClick={handleAllSelection}
          >
            {noneText}
          </div>
          {valueIds.map((possibleValueId) => (
            <label
              key={possibleValueId}
              className="flex h-8 w-full items-center justify-between bg-white text-black hover:bg-slate-200"
              style={{ paddingLeft: "20px", paddingRight: "20px" }}
              htmlFor={`checkbox-${possibleValueId}`}
            >
              <input
                id={`checkbox-${possibleValueId}`}
                type="checkbox"
                checked={selectedCategories.includes(possibleValueId)}
                onChange={() => {
                  handleCheckboxChange(possibleValueId);
                }}
              />
              {`${getValueById(possibleValueId)}`}
            </label>
          ))}
          {isApplyOptionVisible && (
            <div
              className="flex h-10 w-full items-center justify-center bg-white text-black hover:bg-slate-200"
              onClick={() =>
                onChange(selectedCategories.length ? selectedCategories : null)
              }
            >
              {"Apply"}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
