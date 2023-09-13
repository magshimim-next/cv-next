import CVModel from "@/types/cv"
import { generateImageUrl } from "@/helpers/imageURLHelper"

interface CVCardProps {
  cv: CVModel
}

export default function CVItem({ cv }: CVCardProps) {
  return (


    <div className="max-w-sm  rounded shadow-lg object-cover w-full h-6/6 rounded-lg bg-gray-100">
      <img
        className="w-full"
        src={generateImageUrl(cv.documentUrl)}
        alt="CV Preview"
      />
      <div className="px-6 pt-2 ">
        <div className="mb-2 text-xl font-bold">{cv.userId}</div>
        <p className="text-base text-gray-700">{cv.description}</p>
      </div>
      <div className="px-6 pb-2">
        <span className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
          #{cv.categoryId}
        </span>
      </div>
    </div>
  )
}
