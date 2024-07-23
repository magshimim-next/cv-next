"use client";

import Image from "next/image";
import Link from "next/link";
import Categories from "@/types/models/categories";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { getIdFromLink, getGoogleImageUrl } from "@/helpers/imageURLHelper";
import Definitions from "@/lib/definitions";
import { generateCategoryLink } from "@/lib/utils";
import {
  useApiFetch,
  CVS_API_BASE,
  USERS_API_BASE,
  FETCH_PREVIEWS_ENDPOINT,
  FETCH_USERS_ENDPOINT,
} from "@/hooks/useAPIFetch";

interface CVCardProps {
  cv: CvModel;
}

export default function CVItem({ cv }: CVCardProps) {
  const [realURL, setRealURL] = useState("");
  const [authorName, setAuthorName] = useState("");
  const fetchFromApi = useApiFetch();

  const [base64Data, setBase64Data] = useState(
    Definitions.PLAICEHOLDER_IMAGE_DATA
  );

  const getBlur = useMemo(
    () => async (imageURL: string) => {
      const data = await fetchFromApi(CVS_API_BASE, FETCH_PREVIEWS_ENDPOINT, {
        pathname: "getBlurredCv",
        cvLink: imageURL,
      });
      return data.base64;
    },
    [fetchFromApi]
  );

  const getURL = useMemo(
    () => async (cvId: string) => {
      const data = await fetchFromApi(CVS_API_BASE, FETCH_PREVIEWS_ENDPOINT, {
        pathname: "getImageURL",
        cvId,
      });
      return data.publicUrl;
    },
    [fetchFromApi]
  );

  const getCachedUserName = useMemo(
    () => async (userId: string) => {
      const data = await fetchFromApi(USERS_API_BASE, FETCH_USERS_ENDPOINT, {
        pathname: "getUserName",
        userId,
      });
      return data.fullName;
    },
    [fetchFromApi]
  );

  const revalidatePreview = useCallback(
    async (cvLink: string) => {
      await fetchFromApi(CVS_API_BASE, FETCH_PREVIEWS_ENDPOINT, {
        pathname: "revalidatePreview",
        cvLink,
      });
    },
    [fetchFromApi]
  );

  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const revalidateImage = async () => {
        await revalidatePreview(cv.document_link);
        const imageUrl =
          (await getURL(getIdFromLink(cv.document_link) || "")) ?? "";
        setRealURL(imageUrl);
      };

      const getAuthorName = async () => {
        const userUploading = (await getCachedUserName(cv.user_id || "")) || "";
        setAuthorName(userUploading);
      };

      const getBlurCv = async () => {
        const base64 = await getBlur(getGoogleImageUrl(cv.document_link));
        setBase64Data(base64);
      };

      await getBlurCv();
      await getAuthorName();
      await revalidateImage();

      interval.current = setInterval(() => {
        revalidateImage();
      }, Definitions.FETCH_WAIT_TIME * 1000); // Revalidate every 2 minutes
    };

    fetchData();
  }, [
    cv.document_link,
    cv.user_id,
    getBlur,
    getCachedUserName,
    getURL,
    revalidatePreview,
  ]);

  useEffect(
    () => () => {
      if (interval.current != null) {
        clearInterval(interval.current);
      }
    },
    []
  );

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
            <div className="flex flex-wrap items-baseline">
              <div className="mr-2 text-xl font-bold text-neutral-700">
                {authorName}
              </div>
              <p className="text-xs text-neutral-400">{formattedDate}</p>
            </div>
            <div className="mt-2 flex flex-wrap space-x-2">
              {cv.cv_categories.map((category, index) => (
                <Link key={index} href={generateCategoryLink(category)}>
                  <div
                    onClick={(e) => e.stopPropagation()} // Prevent redirection and handle the inner click event
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
