import CVItem from "@/components/CVItem";
import { getAllCvs } from "@/server/api/cvs";

export default async function Feed() {
  console.log("Feed Reached");
  const cvs = await getAllCvs(true);
  return (
    <main>
      <div className="container mx-auto space-y-8 p-6">
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {cvs ? cvs.map((cv) => (
            <CVItem key={cv.id} cv={cv} />
          )) : <></>
        }
        </div>
      </div>
    </main>
  )
}
