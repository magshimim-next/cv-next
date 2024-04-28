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
  const isPlaceHolder = valueId === null;

  const changeIsMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuBorderStyle = isMenuOpen ? "outline-b-0 rounded-b-none" : "";
  const selectionStyle = isMenuOpen ? "block" : "hidden";
  return (
    <>
      <div
        className={`outline-gray-40 relative flex h-2/6 w-1/6 items-center justify-center whitespace-nowrap bg-white outline-2 ${menuBorderStyle} box-border cursor-pointer rounded-md px-10 py-4`}
        onClick={changeIsMenuOpen}
      >
        <div className={`${isPlaceHolder ? "text-gray-400" : "text-black"}`}>
          {`${text}: ${isPlaceHolder ? placeHolder : getValueById(valueId)}`}
        </div>
        <div
          className={`absolute top-full z-10 block h-fit w-full bg-white ${selectionStyle} border-gray-40 max-h-40 divide-y-2 overflow-y-auto border-2 border-t-0`}
        >
          <div
            className="flex h-10 w-full items-center justify-center bg-white text-gray-400 hover:bg-slate-200"
            onClick={() => onChange(null)}
          >
            {"all"}
          </div>
          {valueIds.map((possibleValueId) => {
            return (
              // eslint-disable-next-line react/jsx-key
              <div
                key={possibleValueId}
                className="flex h-8 w-full items-center justify-center bg-white text-black hover:bg-slate-200"
                onClick={() => onChange(possibleValueId)}
              >
                {`${getValueById(possibleValueId)}`}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
