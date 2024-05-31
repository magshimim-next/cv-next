import { useState } from "react";

export const DropdownInput = ({
  placeHolder,
  valueIds,
  valueId,
  onChange,
  getValueById,
  text,
}: {
  placeHolder: string;
  valueIds: number[];
  valueId: number | null;
  getValueById: (id: number) => string;
  onChange: (newValue: number | null) => void;
  text: string;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const isPlaceHolder = valueId === null;

  const changeIsMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuBorderStyle = isMenuOpen ? "outline-b-0 rounded-b-none" : "";
  const selectionStyle = isMenuOpen ? "block" : "hidden";
  const textValue = isPlaceHolder ? (
    <div className="text-gray-400">{`${text}: ${placeHolder}`}</div>
  ) : (
    <div className="text-black">{`${text}: ${getValueById(valueId)}`}</div>
  );

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
  };

  return (
    <>
      <div
        className={`outline-gray-40 relative flex h-2/6 w-1/6 items-center justify-center whitespace-nowrap bg-white outline-2 ${menuBorderStyle} box-border cursor-pointer rounded-md px-10 py-4`}
        onClick={changeIsMenuOpen}
      >
        {textValue}
        <div
          className={`absolute top-full z-10 block h-fit w-full bg-white ${selectionStyle} border-gray-40 max-h-40 divide-y-2 overflow-y-auto border-2 border-t-0`}
        >
          <div
            className="flex h-10 w-full items-center justify-center bg-white text-gray-400 hover:bg-slate-200"
            onClick={() => onChange(null)}
          >
            {"all"}
          </div>
          {valueIds.map((possibleValueId) => (
            <label
              key={possibleValueId}
              className="flex h-8 w-full items-center justify-between bg-white text-black hover:bg-slate-200"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(possibleValueId)}
                onChange={() => handleCheckboxChange(possibleValueId)}
              />
              {`${getValueById(possibleValueId)}`}
            </label>
          ))}
          <div
            className="flex h-10 w-full items-center justify-center bg-white text-black hover:bg-slate-200"
            onClick={() => onChange(selectedCategories[0])}
          >
            {"Apply"}
          </div>
        </div>
      </div>
    </>
  );
};
