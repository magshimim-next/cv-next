import { fetchCv } from "@/app/actions/fetchCv";
// import { fetchAllCvs } from "@/app/actions/fetchCvs";
import { decodeValue, encodeValue } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CommentsSection } from "./components/commentsSection";
import { CvPreview } from "./components/cvPreview";


// export const generateStaticParams = async () => {
    //TODO: attempt this after next-14 update

//     const cvs = await fetchAllCvs();
//     return cvs?.map(cv => ({ cvId: encodeValue(cv.id) }));
// }

export default async function Page({ params } : { params: { cvId: string }}) {

    const { cvId } = params;

    const decodedId = decodeValue(decodeURIComponent(cvId));
    if (!decodedId) {
        notFound();
    };

    const cv = await fetchCv(decodedId);

    if (cv === null) {
        notFound();
    }

    return (
    <div className="grid grid-cols-1 gap-y-4 md:grid-cols-[65%_35%] md:gap-x-4">
        <section className="flex-col h-[78.75rem] rounded-lg">
            <CvPreview cv={cv} />
        </section>
        <section className="self-start h-[78.75rem] flex-col">
            <CommentsSection cv={cv} />
        </section>
    </div>
    )
}