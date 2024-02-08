"use client"

import { useRouter } from "next/navigation"
import { ClientCvModel } from "@/types/models/cv"
import { encodeValue } from "@/lib/utils"
interface CVCardProps {
  cv: ClientCvModel
  children: React.ReactNode
}

export default function CVItem({ cv, children }: CVCardProps) {
  const router = useRouter()
  const encodedId = encodeValue(cv.id)

  return (
    <div
      id={cv.id}
      className={`relative w-full max-w-sm cursor-pointer rounded-lg bg-white object-cover shadow-lg`}
      onClick={() => router.push(`/cv/${encodedId}`)}
    >
      {children}
    </div>
  )
}
