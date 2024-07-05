"use client";

import Image from "next/image";
import Link from "next/link";
import Categories from "@/types/models/categories";
import { useState, useEffect, useMemo, useRef } from "react";
import { getIdFromLink, getGoogleImageUrl } from "@/helpers/imageURLHelper";
import Definitions from "@/lib/definitions";

interface CVCardProps {
  cv: CvModel;
}

export default function CVItem({ cv }: CVCardProps) {
  const [realURL, setRealURL] = useState("");
  const [authorName, setAuthorName] = useState("");

  const [base64Data, setBase64Data] = useState(
    Definitions.PLAICEHOLDER_IMAGE_DATA
  );

  const categoryLink = `/feed?category=${Categories.category[
    cv.category_id
  ].toLowerCase()}`;

  const getBlur = useMemo(
    () => async (imageURL: string) => {
      const response = await fetch("/actions/cvs/cvsPreview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathname: "getBlurredCv", cvLink: imageURL }),
      });

      if (!response.ok) {
        throw new Error("Failed to get blurred CV");
      }

      const data = await response.json();
      return data.base64;
    },
    []
  );

  const getURL = useMemo(
    () => async (cvId: string) => {
      const response = await fetch("/actions/cvs/cvsPreview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathname: "getImageURL", cvId }),
      });

      if (!response.ok) {
        throw new Error("Failed to get image URL");
      }

      const data = await response.json();
      return data.publicUrl;
    },
    []
  );

  const getCachedUserName = useMemo(
    () => async (userId: string) => {
      const response = await fetch("/actions/cvs/cvsPreview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathname: "getUserName", userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to get user name");
      }

      const data = await response.json();
      return data.fullName;
    },
    []
  );

  async function revalidatePreview(cvLink: string) {
    await fetch("/actions/cvs/cvsPreview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pathname: "revalidatePreview", cvLink }),
    });
  }

  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    const fetchData = async () => {
      const revalidateImage = async () => {
        await revalidatePreview(cv.document_link);
        const imageUrl =
          (await getURL(getIdFromLink(cv.document_link) || "")) ?? "";
        if (isMountedRef.current) setRealURL(imageUrl);
      };

      const getAuthorName = async () => {
        const userUploading = (await getCachedUserName(cv.user_id || "")) || "";
        if (isMountedRef.current) setAuthorName(userUploading);
      };

      const getBlurCv = async () => {
        const base64 = await getBlur(getGoogleImageUrl(cv.document_link));
        if (isMountedRef.current) setBase64Data(base64);
      };

      await getBlurCv();
      await getAuthorName();
      await revalidateImage();

      const interval = setInterval(() => {
        if (isMountedRef.current) revalidateImage();
      }, Definitions.FETCH_WAIT_TIME * 1000); // Revalidate every 2 minutes

      return () => clearInterval(interval);
    };

    fetchData();
    return () => {
      isMountedRef.current = false;
    };
  }, [cv.document_link, cv.user_id, getBlur, getCachedUserName, getURL]);

  const formattedDate = new Date(cv.created_at).toLocaleDateString("en-US");

  return (
    <>
      {realURL ? (
        <Image
          width={500}
          height={500 * 1.4142}
          className="w-full rounded-lg p-2"
          src={realURL}
          placeholder="blur"
          blurDataURL={base64Data}
          alt="CV Preview"
          priority
        />
      ) : (
        <div style={{ width: "380px", height: `400px`, overflow: "hidden" }}>
          <Image
            width={500}
            height={500}
            className="w-full rounded-lg p-2"
            src={base64Data}
            placeholder="blur"
            blurDataURL={base64Data}
            alt="CV Preview"
            priority
          />
        </div>
      )}

      <div className="overlay gradient-blur-backdrop absolute bottom-0 flex h-full w-full rounded-lg backdrop-blur-[0.5px] transition hover:via-transparent hover:backdrop-blur-none">
        <div className="overlay absolute bottom-0 h-1/5 w-full rounded-xl bg-transparent p-6">
          <div className="absolute bottom-0 left-0 mx-5 mb-2.5">
            <div className="mr-2 inline text-xl font-bold text-neutral-700">
              {authorName}
            </div>
            <p className="inline text-xs text-neutral-400">{formattedDate}</p>
          </div>
          <Link href={categoryLink}>
            <div
              onClick={(e) => e.stopPropagation()} // Add the onClick event handler to prevent redirection and handle the inner click event
              className="absolute bottom-0 right-0 mx-4 mb-2.5 rounded-full bg-gray-700 px-3 py-1 text-sm font-semibold text-white hover:bg-gray-400 hover:underline"
            >
              #{Categories.category[cv.category_id]}
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
