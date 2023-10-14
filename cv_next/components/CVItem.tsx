"use client"
import CVModel from "@/types/models/cv"
import Image from "next/image"
import Link from "next/link"
import { generateImageUrl } from "@/helpers/imageURLHelper"
import { Categories } from "@/types/models/categories"
interface CVCardProps {
  cv: CVModel
}

export default function CVItem({ cv }: CVCardProps) {
  const categoryLink = `/feed?category=${Categories.category[
    cv.categoryID
  ].toLowerCase()}`
  return (
    <div className="h-6/6 relative w-full max-w-sm rounded rounded-lg object-cover shadow-lg">
      <Image
        width={500}
        height={500 * 1.4142}
        className="w-full rounded-lg "
        src={generateImageUrl(cv.documentLink)}
        alt="CV Preview"
        loading="lazy"
      />
      <div className="overlay gradient-blur-backdrop absolute bottom-0 flex h-1/2 w-full rounded-lg">
        <div className=" absolute bottom-0 left-0 mx-5 mb-3">
          <div className="mr-2 inline text-xl font-bold text-neutral-700">
            {cv.userID}
          </div>
          <p className="inline text-xs text-neutral-700/75">
            {new Date(cv.uploadDate).toLocaleDateString("en-US")}
          </p>
        </div>
        <Link
          href={categoryLink}
          className="absolute bottom-0 right-0 mx-4 mb-3 rounded-full bg-neutral-200 px-3 py-1 text-sm font-semibold text-neutral-700 hover:underline"
        >
          #{Categories.category[cv.categoryID]}
        </Link>
      </div>
    </div>
  )
}
