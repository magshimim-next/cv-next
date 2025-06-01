import { PiFilePdfDuotone } from "react-icons/pi";
import { TbFileTypeDocx } from "react-icons/tb";
import { HiOutlineSave } from "react-icons/hi";
import { getExportLinks } from "@/helpers/imageURLHelper";

export default function DownloadButtons({ cvLink }: { cvLink: string }) {
  const exportLinks = getExportLinks(cvLink);

  if (!exportLinks) return null;

  const { pdfUrl, docxUrl } = exportLinks;
  const isSameLink = pdfUrl === docxUrl;

  return (
    <div className="flex gap-2">
      {isSameLink ? (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm"
          title="Download"
        >
          <HiOutlineSave size={25} />
        </a>
      ) : (
        <>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm"
            title="Download PDF"
          >
            <PiFilePdfDuotone size={25} />
          </a>
          <a
            href={docxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm"
            title="Download DOCX"
          >
            <TbFileTypeDocx size={22} />
          </a>
        </>
      )}
    </div>
  );
}
