export const CvPreview = ({ cv }: { cv: CvModel }) => {
  return (
    <div>
      <iframe
        src={cv.document_link + "&rm=minimal"}
        width="100%"
        height="800"
      />
    </div>
  );
};
