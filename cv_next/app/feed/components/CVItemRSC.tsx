import Image, { StaticImageData } from "next/image"
import Link from "next/link"
import generateImageUrl from "@/helpers/imageURLHelper"
import Categories from "@/types/models/categories"
import { useState } from "react"
interface CVCardProps {
  cv: CvModel
}

export default function CVItemRSC({ cv }: CVCardProps) {
  const categoryLink = `/feed?category=${Categories.category[
    cv.category_id
  ].toLowerCase()}`
  const imageUrl = generateImageUrl(cv.document_link)
  const formattedDate = new Date(cv.created_at).toLocaleDateString("en-US")

  const [imgSrc, setImgSrc] = useState<StaticImageData | string>(imageUrl)

  return (
    <>
      <Image
        width={500}
        height={500 * 1.4142}
        className="w-full rounded-lg p-2"
        src={imgSrc}
        placeholder="data:image/public/images/blackCv.png"
        alt="CV Preview"
        priority
      />
      <div className="overlay gradient-blur-backdrop absolute bottom-0 flex h-full w-full rounded-lg backdrop-blur-[0.5px] transition hover:via-transparent hover:backdrop-blur-none">
        <div className="overlay absolute bottom-0 h-1/5 w-full rounded-xl bg-transparent p-6">
          <div className="absolute bottom-0 left-0 mx-5 mb-2.5">
            <div className="mr-2 inline text-xl font-bold text-black">
              {cv.user_id}
            </div>
            <p className="inline text-xs text-neutral-400">{formattedDate}</p>
          </div>
          <Link
            href={categoryLink}
            className="absolute bottom-0 right-0 mx-4 mb-2.5 rounded-full bg-gray-700 px-3 py-1 text-sm font-semibold text-white hover:bg-gray-400 hover:underline"
          >
            #{Categories.category[cv.category_id]}
          </Link>
        </div>
      </div>
    </>
  )
}
