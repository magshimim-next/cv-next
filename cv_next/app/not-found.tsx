
import notFound404 from "../public/images/404.png"
import Image from "next/image"

export default function NotFound() {
    return <div className="flex justify-center items-center h-full w-full">
        <div className="flex justify-center flex-row items-center">
            <Image alt="closeIcon" src={notFound404}></Image>
        </div>
        <h1>404 - Page Not Found</h1>
    </div>
}