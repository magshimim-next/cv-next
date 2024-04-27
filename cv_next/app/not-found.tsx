
import notFound404 from "../public/images/404.png"
import notFound404Light from "../public/images/404Light.png"
import Image from "next/image"

export default function NotFound() {
    // const { theme, setTheme } = useTheme() 

    return <div className="absolute left-0 flex justify-center items-center h-3/4 w-full space-y-8 p-6">
        <div className="flex justify-center flex-row items-center">
            <Image alt="closeIcon" src={notFound404} className="dark:hidden"></Image>
            <Image alt="closeIcon" src={notFound404Light} className="hidden dark:block"></Image>
        </div>
        <h1 className="text-7xl pl-10"> Page Not Found</h1>
    </div>
}