"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import Categories from "@/types/models/categories";
import Definitions, { API_DEFINITIONS } from "@/lib/definitions";
import { generateCategoryLink, shimmer, toBase64 } from "@/lib/utils";
import { useApiFetch } from "@/hooks/useAPIFetch";
import access_denied from "@/public/images/access_denied.png";

interface CVCardProps {
  cv: CvModel;
}

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

  const author_obj = JSON.parse(JSON.stringify(cv.user_id || "Loading..."));
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
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(300, 300))}`}
          alt="CV Preview"
          priority
        />
      ) : (
        <div style={{ width: "380px", height: `400px`, overflow: "hidden" }}>
          <Image
            width={500}
            height={500}
            className="w-full rounded-lg p-2"
            src={`data:image/svg+xml;base64,${toBase64(shimmer(300, 300))}`}
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(300, 300))}`}
            alt="CV Preview"
            priority
          />
        </div>
      )}

      <div className="overlay gradient-blur-backdrop absolute bottom-0 flex h-full w-full rounded-lg backdrop-blur-[0.5px] transition hover:via-transparent hover:backdrop-blur-none">
        <div className="overlay absolute bottom-0 h-1/5 w-full rounded-xl bg-transparent p-6">
          <div className="absolute bottom-0 left-0 mx-5 mb-2.5">
            <div className="flex flex-wrap items-baseline">
              <div className="mr-2 text-xl font-bold text-neutral-700">
                {author_obj.display_name}
              </div>
              <p className="text-xs text-neutral-400">{formattedDate}</p>
            </div>
            <div className="mt-2 flex flex-wrap space-x-2">
              {cv.cv_categories.map((category, index) => (
                <Link key={index} href={generateCategoryLink(category)}>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-full bg-gray-700 px-3 py-1 text-sm font-semibold text-white hover:bg-gray-400 hover:underline"
                  >
                    #{Categories.category[category]}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
