import { ReactNode } from "react";

export const Button = ({
  text,
  onClick,
  bottomFlat
}: {
  bottomFlat?: boolean
  text: ReactNode;
  onClick: () => void;
}) => {
  const menuBorderStyle = bottomFlat ? "outline-b-0 rounded-b-none" : "";
  return (
    <div
          className={`outline-gray-40 text-black flex h-full w-full items-center justify-center whitespace-nowrap bg-white hover:bg-slate-200 outline-2 ${menuBorderStyle} box-border cursor-pointer rounded-md px-10 py-4`}
          onClick={onClick}
          >
          {text}
        </div>
  );
};
