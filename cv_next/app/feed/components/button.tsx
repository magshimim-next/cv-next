import { ReactNode } from "react";

export const Button = ({
  text,
  onClick,
  bottomFlat,
  isDisabled,
  className,
  type,
}: {
  bottomFlat?: boolean;
  text: ReactNode;
  onClick: () => void;
  isDisabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}) => {
  const menuBorderStyle = bottomFlat ? "outline-b-0 rounded-b-none" : "";
  return (
    <button
      type={type || "submit"}
      className={`${className ?? `bg-white text-black ${isDisabled ?? "hover:bg-slate-200"}`} outline-gray-40 flex h-full w-full items-center justify-center whitespace-nowrap 
      ${isDisabled ? "opacity-25" : "cursor-pointer "} outline-2 
      ${menuBorderStyle} box-border rounded-md px-10 py-4`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {text}
    </button>
  );
};
