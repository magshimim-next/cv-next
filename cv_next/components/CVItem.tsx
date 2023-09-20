import CVModel from "@/types/cv"
import { generateImageUrl } from "@/helpers/imageURLHelper"

interface CVCardProps {
  cv: CVModel
}

export default function CVItem({ cv }: CVCardProps) {
  return (
    // <div className="h-6/6 relative w-full max-w-sm rounded rounded-lg object-cover shadow-lg">
    //   <img
    //     className="w-full rounded-lg"
    //     src={generateImageUrl(cv.documentUrl)}
    //     alt="CV Preview"
    //   />
    //   <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col justify-end rounded-lg bg-gradient-to-t from-black via-transparent to-transparent px-6 py-2">
    //     <div className="flex justify-between">
    //       <div>
    //         <div className="text-xl font-bold text-white">{cv.userId}</div>
    //         <p className="text-base text-gray-300">{cv.description}</p>
    //       </div>
    //       <span className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
    //         #{cv.categoryId}
    //       </span>
    //     </div>
    //   </div>
    // </div>

<div className="max-w-sm rounded shadow-lg object-cover w-full h-6/6 rounded-lg relative">
  <img
    className="w-full rounded-lg"
    src={generateImageUrl(cv.documentUrl)}
    alt="CV Preview"
  />
  <div className="overlay absolute bottom-0 left-0 w-full bg-primary rounded-lg">
    <div className="px-6 pt-2">
      <div className="mb-2 text-xl font-bold">{cv.userId}</div>
      <p className="text-base text-gray-700">{cv.description}</p>
    </div>
    <div className="px-6 pb-2">
      <span className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
        #{cv.categoryId}
      </span>
    </div>
  </div>
</div>


  //   <div className="max-w-sm rounded shadow-lg object-cover w-full h-6/6 rounded-lg">
  //     <img
  //       className="w-full"
  //       src={generateImageUrl(cv.documentUrl)}
  //       alt="CV Preview"
  //     />
  //     <div className="px-6 pt-2 ">
  //       <div className="mb-2 text-xl font-bold">{cv.userId}</div>
  //       <p className="text-base text-gray-700">{cv.description}</p>
  //     </div>
  //     <div className="px-6 pb-2">
  //       <span className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
  //         #{cv.categoryId}
  //       </span>
  //     </div>
  //   </div>
  )
}
