import { MouseEventHandler } from "react";
import { IoReloadCircle } from "react-icons/io5";

export const ReloadButton = ({
  children,
  callback,
}: {
  children: React.ReactNode;
  callback?: MouseEventHandler<SVGElement>;
}) => {
  return (
    <IoReloadCircle
      onClick={callback}
      className="cursor-pointer transition delay-150 duration-300 ease-in-out hover:rotate-180 hover:scale-110"
      size={40}
    >
      {children}
    </IoReloadCircle>
  );
};
