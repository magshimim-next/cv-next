import { transformToPreviewLink } from "@/lib/utils";

export const CvPreview = ({ cv, height }: { cv: CvModel; height?: number }) => {
  const previewUrl = transformToPreviewLink(cv.document_link);

  return (
    <div>
      <iframe
        src={previewUrl + "&rm=minimal"}
        width="100%"
        height={height || "800"}
      />
    </div>
  );
};
