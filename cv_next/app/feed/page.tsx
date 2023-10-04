import CVItem from "@/components/CVItem"
import CVModel from "@/types/cv"

export default function Feed() {
  let mockcv = new CVModel(
    "cv-id",
    "user-id",
    "https://lh3.google.com/u/0/d/1gquDwmvOjuRCVQJ-LkMnA3NOLWDw_UDu=w1000-h1200-p",
    1
  )
  return (
    <main>
      <div className="container mx-auto space-y-8 p-6">
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          <CVItem cv={mockcv} />
          <CVItem cv={mockcv} />
          <CVItem cv={mockcv} />
          <CVItem cv={mockcv} />
          <CVItem cv={mockcv} />
          <CVItem cv={mockcv} />
        </div>
      </div>
    </main>
  )
}
