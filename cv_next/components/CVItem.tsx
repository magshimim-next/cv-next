import CVModel from "@/types/cv"
import { generateImageUrl } from "@/helpers/imageURLHelper"

interface CVCardProps {
  cv: CVModel
}

export default function CVItem({ cv }: CVCardProps) {
  return (
    <div className="h-6/6 relative w-full max-w-sm rounded rounded-lg object-cover shadow-lg">
      <img
        className="w-full rounded-lg"
        src={generateImageUrl(cv.documentUrl)}
        alt="CV Preview"
      />
      <div className="overlay gradient-blur-backdrop absolute bottom-0 left-0 flex h-1/2 w-full flex-col justify-end rounded-lg">
        <div className="px-6 pt-2">
          <div className="text-xl font-bold text-neutral-700">{cv.userId}</div>
          <p className="mb-2 text-base text-neutral-700">{cv.description}</p>
        </div>
        <div className="px-6 pb-2">
          <span className="mb-2 mr-2 inline-block rounded-full bg-neutral-200 px-3 py-1 text-sm font-semibold text-neutral-700">
            #{cv.categoryId}
          </span>
        </div>
      </div>
    </div>
  )
}
