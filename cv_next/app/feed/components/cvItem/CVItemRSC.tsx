import Image from "next/image"
import Link from "next/link"
import generateImageUrl from "@/helpers/imageURLHelper"
import Categories from "@/types/models/categories"
import { ClientCvModel } from "@/types/models/cv"
interface CVCardProps {
  cv: ClientCvModel
}

export function CVItemRSC({ cv }: CVCardProps) {
  const categoryLink = `/feed?category=${Categories.category[
    cv.categoryID
  ].toLowerCase()}`
  const imageUrl = generateImageUrl(cv.documentLink)
  const formattedDate = new Date(cv.uploadDate).toLocaleDateString("en-US")

  return (
    <>
      <Image
        width={500}
        height={500 * 1.4142}
        className="w-full rounded-lg p-2"
        src={imageUrl}
        alt="CV Preview"
        priority
      />
      <div className="overlay gradient-blur-backdrop absolute bottom-0 flex h-1/6 w-full rounded-b-lg">
        <div className="overlay absolute bottom-0 h-1/5 w-full rounded-b-lg bg-white p-6">
          <div className="absolute bottom-0 left-0 mx-5 mb-2.5">
            <div className="mr-2 inline text-xl font-bold text-neutral-700">
              {cv.userID}
            </div>
            <p className="inline text-xs text-neutral-700/75">
              {formattedDate}
            </p>
          </div>
          <Link
            href={categoryLink}
            className="absolute bottom-0 right-0 mx-4 mb-2.5 rounded-full bg-neutral-200 px-3 py-1 text-sm font-semibold text-neutral-700 hover:underline"
          >
            #{Categories.category[cv.categoryID]}
          </Link>
        </div>
      </div>
    </>
  )
}
