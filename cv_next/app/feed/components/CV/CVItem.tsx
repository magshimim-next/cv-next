"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import Definitions, { API_DEFINITIONS } from "@/lib/definitions";
import { shimmer, toBase64 } from "@/lib/utils";
import { useApiFetch } from "@/hooks/useAPIFetch";
import access_denied from "@/public/images/access_denied.png";
import CategoriesDisplay from "./categoryDisplay";

interface CVCardProps {
  cv: CvModel;
}

/**
 * The CV card component that display preciew and other info
 * @param {CVCardProps} param0 The CV object
 * @returns {Element} The CV card component
 */
export default function CVItem({ cv }: CVCardProps) {
  const [realURL, setRealURL] = useState("");
  const fetchFromApi = useApiFetch();

  const revalidatePreview = useCallback(
    async (cvLink: string) => {
      const data = await fetchFromApi(
        API_DEFINITIONS.CVS_API_BASE,
        API_DEFINITIONS.FETCH_PREVIEWS_ENDPOINT,
        {
          pathname: "revalidatePreview",
          cvLink,
        }
      );
      return data;
    },
    [fetchFromApi]
  );

  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const revalidateImage = async () => {
        const data = await revalidatePreview(cv.document_link);
        if (data?.error == "CV_IS_PRIVATE") {
          setRealURL(access_denied.src);
          return;
        } else if (data?.publicUrl) {
          setRealURL(data.publicUrl);
        }
      };

      await revalidateImage();

      interval.current = setInterval(() => {
        revalidateImage();
      }, Definitions.FETCH_WAIT_TIME * 1000);
    };

    fetchData();
  }, [cv.document_link, revalidatePreview]);

  useEffect(
    () => () => {
      if (interval.current != null) {
        clearInterval(interval.current);
      }
    },
    []
  );

  const authorObject = JSON.parse(JSON.stringify(cv.user_id || "Loading..."));
  const formattedDate = new Date(cv.created_at).toLocaleDateString("en-US");

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow">
      <div className="aspect-[1/1.414] w-full overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={
            realURL.length > 1
              ? realURL
              : `data:image/svg+xml;base64,${toBase64(shimmer(300, 300))}`
          }
          width={500}
          height={500 * 1.4142}
          alt="CV Preview"
          className="h-full w-full object-contain object-top p-2"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(300, 300))}`}
          priority
        />
      </div>

      <div className="overlay gradient-blur-backdrop absolute bottom-0 flex h-full w-full rounded-lg backdrop-blur-[0.5px] transition hover:via-transparent hover:backdrop-blur-none">
        <div className="overlay absolute bottom-0 h-1/5 w-full rounded-xl bg-transparent p-6">
          <div className="absolute bottom-0 left-0 right-0 mx-5 mb-2.5">
            <div className="flex flex-wrap items-baseline">
              <div className="mr-2 text-xl font-bold text-neutral-700">
                {authorObject.display_name}
              </div>
              <p className="text-xs text-neutral-400">{formattedDate}</p>
            </div>
            <CategoriesDisplay categories={cv.cv_categories} />
          </div>
        </div>
      </div>
    </div>
  );
}
