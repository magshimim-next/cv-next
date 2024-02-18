import generateImageUrl from "@/helpers/imageURLHelper"
import Image from "next/image"

export const CvPreview = ({ cv }: { cv: CvModel }) => {
  const imageUrl = generateImageUrl(cv.document_link)
  return (
    <Image
      width={0}
      height={0}
      className="h-full w-full flex-1 rounded-lg"
      src={imageUrl}
      alt="CV Preview"
      priority
      referrerPolicy="no-referrer"
    />
  )
}
