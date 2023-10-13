"use client"
import CVItem from "@/components/CVItem"
import CVModel from "@/types/models/cv"
import CvsApi from "@/server/api/cvs"
import { useState, useEffect } from "react"

export default function Feed() {
  const [cvs, setCvs] = useState<CVModel[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCvs = await CvsApi.getAllCvs(true)
        if (fetchedCvs) {
          setCvs(fetchedCvs)
        }
      } catch (error) {
        console.error("Error fetching CVs:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <main>
      <div className="container mx-auto space-y-8 p-6">
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {cvs.map((cv) => (
            <CVItem key={cv.id} cv={cv} />
          ))}
        </div>
      </div>
    </main>
  )
}
