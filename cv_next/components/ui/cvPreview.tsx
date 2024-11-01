import { transformToPreviewLink } from "@/lib/utils";

export const CvPreview = ({ cv }: { cv: CvModel }) => {
  const previewUrl = transformToPreviewLink(cv.document_link);

  return (
    <div style={{ height: "100%" }}>
      <iframe src={previewUrl + "&rm=minimal"} width="100%" height="100%" />
    </div>
  );
};
