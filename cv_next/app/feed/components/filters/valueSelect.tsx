import { useState } from "react";
import { Button } from "../button";

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
  text?: string;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isPlaceHolder = valueId === null;

  const changeIsMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const selectionStyle = isMenuOpen ? "block" : "hidden";
  const newText = text ?  `${text}:` : '' 
  const textValue = isPlaceHolder ? (
    <div className="text-black">{`${newText} ${placeHolder}`}</div>
  ) : (
    <div className="text-grey">{`${newText} ${getValueById(valueId)}`}</div>
  );

  return (
    <>
      <div className="relative h-2/6 w-2/6">
        <Button text={textValue} onClick={changeIsMenuOpen} bottomFlat={isMenuOpen}></Button>
        <div
          className={`absolute top-full h-fit w-full bg-white ${selectionStyle} border-b-gray-40 max-h-40 divide-y-2 overflow-y-auto border-t-0`}
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
