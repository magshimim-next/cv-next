import { MouseEventHandler } from "react";
import { IoReloadCircle } from "react-icons/io5";


export const ReloadButton = ({children, callback} : {children: React.ReactNode, callback?: MouseEventHandler<SVGElement>}) => {

    return (
        <IoReloadCircle onClick={callback}
            className="cursor-pointer transition ease-in-out delay-150 hover:rotate-180 hover:scale-110 duration-300"
            size={40} color={`black`}>
            {children}
        </IoReloadCircle>
    )
}