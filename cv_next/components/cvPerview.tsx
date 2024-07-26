"use client";
import { transformGoogleViewOnlyUrl } from "@/helpers/cvLinkRegexHelper";

export const CvPreview = ({
  document_link,
}: {
  document_link: CvModel["document_link"];
}) => {
  let presentedURL = document_link;

  const transformedURL = transformGoogleViewOnlyUrl(document_link);
  if (transformedURL != "") {
    presentedURL = transformedURL;
  }

  return (
    <div className="w-full">
      <iframe src={presentedURL + "&rm=minimal"} width="1000" height="800" />
    </div>
  );
};
