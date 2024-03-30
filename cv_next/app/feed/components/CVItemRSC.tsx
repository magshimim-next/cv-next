import Image from "next/image"
import Link from "next/link"
import Categories from "@/types/models/categories"
import { useRef, useState, useEffect } from "react"
import { getIdFromLink } from "@/helpers/imageURLHelper"
import { getImageURL, revalidatePreview } from "@/app/actions/cvs/preview"
import ReactLoading from 'react-loading';
import Definitions from "@/lib/definitions"

const errorUrl = "/public/error.jgp" // TODO: replace with real URL here
interface CVCardProps {
  cv: CvModel
}

export default function CVItemRSC({ cv }: CVCardProps) {

  const [retryCount, setRetryCount] = useState(1)
  const imageRef = useRef<HTMLImageElement>(null)
  const [realURL, setRealURL] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const categoryLink = `/feed?category=${Categories.category[
    cv.category_id
  ].toLowerCase()}`

  useEffect(() => {
    const revalidateImage = async () => {
      try {
          await revalidatePreview(cv.document_link);
          const imageUrl = await getImageURL(getIdFromLink(cv.document_link) || "") ?? errorUrl;
          let validatedURL = imageUrl;

          imageRef.current!.src = validatedURL;
          setRealURL(validatedURL);
      } catch (error) {
          console.error('Error revalidating image:', error);
      } finally {
          setIsLoading(false);
      }
    };

    revalidateImage(); // Immediately invoke revalidateImage

    const interval = setInterval(revalidateImage, Definitions.FETCH_WAIT_TIME * 1000); // Revalidate every 2 minutes

    return () => clearInterval(interval);
  }, [cv.document_link, realURL]); // Add dependencies of revalidateImage

  const formattedDate = new Date(cv.created_at).toLocaleDateString("en-US")
  const handleImageError = () => {
    console.log("Error loading image")
  }

  if (isLoading) {
    return <ReactLoading type={"spinningBubbles"} color={"#000"} height={667} width={375} />
  }
  
  return (
    <>
      <Image
        width={500}
        height={500 * 1.4142}
        className="w-full rounded-lg p-2"
        onError={handleImageError}
        src={realURL}
        alt="CV Preview"
        priority
        ref={imageRef}
        onLoad={() => setIsLoading(false)}
      />
      <div className="overlay gradient-blur-backdrop absolute bottom-0 flex h-1/6 w-full rounded-b-lg">
        <div className="overlay absolute bottom-0 h-1/5 w-full rounded-b-lg bg-white p-6">
          <div className="absolute bottom-0 left-0 mx-5 mb-2.5">
            <div className="mr-2 inline text-xl font-bold text-neutral-700">
              {cv.user_id}
            </div>
            <p className="inline text-xs text-neutral-700/75">
              {formattedDate}
            </p>
          </div>
          <Link
            href={categoryLink}
            className="absolute bottom-0 right-0 mx-4 mb-2.5 rounded-full bg-neutral-200 px-3 py-1 text-sm font-semibold text-neutral-700 hover:underline"
          >
            #{Categories.category[cv.category_id]}
          </Link>
        </div>
      </div>
    </>
  )
}
