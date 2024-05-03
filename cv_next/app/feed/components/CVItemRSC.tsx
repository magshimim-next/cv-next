import Image from "next/image";
import Link from "next/link";
import Categories from "@/types/models/categories";
import { useRef, useState, useEffect, cache } from "react";
import { getIdFromLink } from "@/helpers/imageURLHelper";
import {
  getImageURL,
  revalidatePreview,
  getUserName,
} from "@/app/actions/cvs/preview";
import ReactLoading from "react-loading";
import Definitions from "@/lib/definitions";

const errorUrl = "/error.webp";
interface CVCardProps {
  cv: CvModel;
}

const getURL = cache(async (cvId: string) => {
  return await getImageURL(cvId);
});

export default function CVItemRSC({ cv }: CVCardProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [realURL, setRealURL] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const categoryLink = `/feed?category=${Categories.category[
    cv.category_id
  ].toLowerCase()}`;

  useEffect(() => {
    const revalidateImage = async () => {
      try {
        await revalidatePreview(cv.document_link);
        const imageUrl =
          (await getURL(getIdFromLink(cv.document_link) || "")) ?? errorUrl;
        let validatedURL = imageUrl;
        if (imageRef.current) {
          imageRef.current.src = validatedURL;
        }
        setRealURL(validatedURL);
      } catch (error) {
        console.error("Error revalidating image:", error);
      } finally {
        setIsLoading(false);
      }
    };
    const getAuthorName = async () => {
      const userUploading = (await getUserName(cv.user_id || "")) || "";
      setAuthorName(userUploading);
    };
    getAuthorName();
    revalidateImage(); // Immediately invoke revalidateImage

    const interval = setInterval(
      revalidateImage,
      Definitions.FETCH_WAIT_TIME * 1000
    ); // Revalidate every 2 minutes

    return () => clearInterval(interval);
  }, [cv, realURL]);

  const formattedDate = new Date(cv.created_at).toLocaleDateString("en-US");
  const handleImageError = () => {
    console.log("Error loading image");
    setRealURL(errorUrl);
  };

  if (isLoading) {
    return (
      <ReactLoading
        type={"spinningBubbles"}
        color={"#000"}
        height={667}
        width={375}
      />
    );
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
              {authorName}
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
  );
}
