"use client"

import { useRouter } from "next/navigation"
import { encodeValue } from "@/lib/utils"
interface CVCardProps {
  cv: CvModel
  children: React.ReactNode
}

export default function CVItem({ cv, children }: CVCardProps) {
  const router = useRouter()
  const encodedId = encodeValue(cv.id)

  return (
    <div
      id={cv.id}
      className={`relative w-full max-w-sm cursor-pointer rounded-xl bg-white object-cover shadow-2xl`}
      onClick={() => router.push(`/cv/${encodedId}`)}
    >
        {children}
    </div>
  )
}
