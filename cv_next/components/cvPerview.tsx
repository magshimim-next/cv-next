"use client"

export const CvPreview = ({ document_link }: { document_link: CvModel["document_link"] }) => {
    return (
      <div className="w-full">
        <iframe
          src={`${document_link}&rm=minimal`}
          width="1000"
          height="800"
        />
      </div>
    );
  };