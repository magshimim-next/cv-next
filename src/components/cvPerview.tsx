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
    return (
      <div className="w-full">
        <iframe src={presentedURL + "&rm=minimal"} width="500" height="500" />
      </div>
    );
  }
  return (
    <div className="w-full">
      <p>URL didn&apos;t match regex</p>
    </div>
  );
};
