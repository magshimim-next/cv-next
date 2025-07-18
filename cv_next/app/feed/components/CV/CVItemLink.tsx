"use client";

import Link from "next/link";
import { encodeValue } from "@/lib/utils";
interface CVCardProps {
  cv: CvModel;
  children: React.ReactNode;
}

export default function CVItemLink({ cv, children }: CVCardProps) {
  const encodedId = encodeValue(cv.id);

  return (
    <Link
      id={cv.id}
      href={`/cv/${encodedId}`}
      className="relative h-full w-full max-w-full cursor-pointer overflow-hidden rounded-xl bg-white object-cover shadow-2xl"
      scroll={false}
    >
      {children}
    </Link>
  );
}
