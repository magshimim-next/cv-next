import { ReactNode } from "react";

export const Button = ({
  text,
  onClick,
  bottomFlat,
  isDisabled
}: {
  bottomFlat?: boolean
  text: ReactNode;
  onClick: () => void;
  isDisabled?: boolean
}) => {
  const menuBorderStyle = bottomFlat ? "outline-b-0 rounded-b-none" : "";
  return (
    <button
          className={`outline-gray-40 text-black flex h-full w-full items-center justify-center whitespace-nowrap bg-white ${isDisabled ? 'opacity-25' : 'cursor-pointer hover:bg-slate-200'} outline-2 ${menuBorderStyle} box-border rounded-md px-10 py-4`}
          onClick={onClick}
          >
          {text}
        </button>
  );
};
