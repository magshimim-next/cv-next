"use client";
import { getBlurredCv } from "@/app/actions/cvs/getBlurCv";
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
import Definitions from "@/lib/definitions";

const errorUrl = "/error.webp";
interface CVCardProps {
  cv: CvModel;
}

const getBlur = cache(async (imageURL: string) => {
  return await getBlurredCv(imageURL);
});

const getURL = cache(async (cvId: string) => {
  return await getImageURL(cvId);
});

export default function CVItemRSC({ cv }: CVCardProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [realURL, setRealURL] = useState("");
  const [authorName, setAuthorName] = useState("");

  const [base64Data, setBase64Data] = useState(
    "data:iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPs7p5fDwAFlAI2LB7hbAAAAABJRU5ErkJggg=="
  );

  const categoryLink = `/feed?category=${Categories.category[
    cv.category_id
  ].toLowerCase()}`;

  useEffect(() => {
    const revalidateImage = async () => {
      await revalidatePreview(cv.document_link);
        const imageUrl =
          (await getURL(getIdFromLink(cv.document_link) || "")) ?? errorUrl;
        let validatedURL = imageUrl;
        if (imageRef.current) {
          imageRef.current.src = validatedURL;
        }
        setRealURL(validatedURL);
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

  useEffect(() => {
    (async () => {
      if (realURL != "") {
        const base64 = await getBlur(realURL);
        setBase64Data(base64);
      }
    })();
  }, [realURL]);

  return (
    <>
      <Image
        width={500}
        height={500 * 1.4142}
        className="w-full rounded-lg p-2"
        src={realURL}
        placeholder="blur"
        blurDataURL={base64Data}
        alt="CV Preview"
        priority
        ref={imageRef}
      />
      <div className="overlay gradient-blur-backdrop absolute bottom-0 flex h-full w-full rounded-lg backdrop-blur-[0.5px] transition hover:via-transparent hover:backdrop-blur-none">
        <div className="overlay absolute bottom-0 h-1/5 w-full rounded-xl bg-transparent p-6">
          <div className="absolute bottom-0 left-0 mx-5 mb-2.5">
            <div className="mr-2 inline text-xl font-bold text-neutral-700">
              {authorName}
            </div>
            <p className="inline text-xs text-neutral-400">{formattedDate}</p>
          </div>
          <Link
            href={categoryLink}
            className="absolute bottom-0 right-0 mx-4 mb-2.5 rounded-full bg-gray-700 px-3 py-1 text-sm font-semibold text-white hover:bg-gray-400 hover:underline"
          >
            #{Categories.category[cv.category_id]}
          </Link>
        </div>
      </div>
    </>
  );
}
