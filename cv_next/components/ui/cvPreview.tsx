import { transformToPreviewLink } from "@/lib/utils";

export const CvPreview = ({ cv }: { cv: CvModel }) => {
  const previewUrl = transformToPreviewLink(cv.document_link);

  return (
    <div style={{ height: "100%" }}>
      <iframe
        src={previewUrl + "&rm=minimal"}
        className="h-1/2 md:h-full"
        width="100%"
      />
    </div>
  );
};
