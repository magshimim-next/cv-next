'use client'
import CVModel from "@/types/models/cv"
import Image from "next/image"
import { generateImageUrl } from "@/helpers/imageURLHelper"

interface CVCardProps {
  cv: CVModel
}

export default function CVItem({ cv }: CVCardProps) {
  return (
    <div className="h-6/6 relative w-full max-w-sm rounded rounded-lg object-cover shadow-lg">
      <Image
        width={500}
        height={500 * 1.4142}
        className="w-full rounded-lg"
        src={generateImageUrl(cv.documentLink)}
        alt="CV Preview"
        loading="lazy"
      />
      <div className="overlay gradient-blur-backdrop absolute bottom-0 left-0 flex h-1/2 w-full flex-col justify-end rounded-lg">
        <div className="px-6 pt-2">
          <div className="text-xl font-bold text-neutral-700">{cv.userID}</div>
          <p className="mb-2 text-base text-neutral-700">{cv.description}</p>
        </div>
        <div className="px-6 pb-2">
          <span className="mb-2 mr-2 inline-block rounded-full bg-neutral-200 px-3 py-1 text-sm font-semibold text-neutral-700">
            #{cv.categoryID}
          </span>
        </div>
      </div>
    </div>
  )
}
