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
      <CVItem cv={mockcv} />
    </main>
  )
}
