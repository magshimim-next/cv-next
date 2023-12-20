import generateImageUrl from "@/helpers/imageURLHelper"
import { ClientCvModel } from "@/types/models/cv";
import Image from "next/image"


export const CvPreview = ({cv}: {cv: ClientCvModel}) => {

    const imageUrl = generateImageUrl(cv.documentLink);

    //TODO: add info somewhere?
    return (
        <Image
            width={0}
            height={0}
            className="w-full h-full flex-1 rounded-lg"
            src={imageUrl}
            alt="CV Preview"
            priority
            referrerPolicy="no-referrer"
        />
    )
}