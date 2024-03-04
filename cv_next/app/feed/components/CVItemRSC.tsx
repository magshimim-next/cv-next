import Image from "next/image"
import Link from "next/link"
import Categories from "@/types/models/categories"
import { useRef, useState } from "react"
import { getIdFromLink } from "@/helpers/imageURLHelper"

const errorUrl = "/public/error.jgp" // TODO: replace with real URL here
interface CVCardProps {
  cv: CvModel
}

export default function CVItemRSC({ cv }: CVCardProps) {
  const categoryLink = `/feed?category=${Categories.category[
    cv.category_id
  ].toLowerCase()}`
  const cvId = getIdFromLink(cv.document_link)
  if (!cvId) {
    return null
  }
  const imageUrl = getImageURL(cvId) ?? errorUrl

  const formattedDate = new Date(cv.created_at).toLocaleDateString("en-US")

  const [retryCount, setRetryCount] = useState(1)
  const imageRef = useRef<HTMLImageElement>(null)
  const handleImageError = () => {
    if (retryCount <= 30) {
      setTimeout(() => {
        imageRef.current!.src = imageUrl
        setRetryCount(retryCount + 1)
      }, 2000 * retryCount)
    }
  }

  return (
    <>
      <Image
        width={500}
        height={500 * 1.4142}
        className="w-full rounded-lg p-2"
        onError={handleImageError}
        src={imageUrl}
        alt="CV Preview"
        priority
        ref={imageRef}
      />
      <div className="overlay gradient-blur-backdrop absolute bottom-0 flex h-1/6 w-full rounded-b-lg">
        <div className="overlay absolute bottom-0 h-1/5 w-full rounded-b-lg bg-white p-6">
          <div className="absolute bottom-0 left-0 mx-5 mb-2.5">
            <div className="mr-2 inline text-xl font-bold text-neutral-700">
              {cv.user_id}
            </div>
            <p className="inline text-xs text-neutral-700/75">
              {formattedDate}
            </p>
          </div>
          <Link
            href={categoryLink}
            className="absolute bottom-0 right-0 mx-4 mb-2.5 rounded-full bg-neutral-200 px-3 py-1 text-sm font-semibold text-neutral-700 hover:underline"
          >
            #{Categories.category[cv.category_id]}
          </Link>
        </div>
      </div>
    </>
  )
}
