"use client";
import { PiFilePdfDuotone } from "react-icons/pi";
import { TbFileTypeDocx } from "react-icons/tb";
import { HiOutlineSave } from "react-icons/hi";
import { getExportLinks } from "@/helpers/imageURLHelper";
import Tooltip from "@/components/ui/tooltip";

/**
 * This component renders the docx and pdf downloads buttons for a CV.
 * @param {{string}} param0 the original CV link.
 * @returns {Element | null} The component with the download buttons.
 */
export default function DownloadButtons({ cvLink }: { cvLink: string }) {
  const exportLinks = getExportLinks(cvLink);

  if (!exportLinks) return null;

  const { pdfUrl, docxUrl } = exportLinks;
  const isSameLink = pdfUrl === docxUrl;

  return (
    <div className="flex">
      {isSameLink ? (
        <div className="rounded-full hover:bg-gray-100 dark:hover:bg-theme-700">
          <Tooltip id="DownloadFromDrive" message="Download">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm"
            >
              <HiOutlineSave size={25} />
            </a>
          </Tooltip>
        </div>
      ) : (
        <>
          <div className="rounded-full hover:bg-gray-100 dark:hover:bg-theme-700">
            <Tooltip id="DownloadAsPDF" message="Download PDF">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center rounded-md px-2 py-1.5 text-sm"
              >
                <PiFilePdfDuotone size={25} />
              </a>
            </Tooltip>
          </div>
          <div className="rounded-full hover:bg-gray-100 dark:hover:bg-theme-700">
            <Tooltip id="DownloadAsDOCX" message="Download DOCX">
              <a
                href={docxUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center rounded-md px-2 py-1.5 text-sm"
              >
                <TbFileTypeDocx size={22} />
              </a>
            </Tooltip>
          </div>
        </>
      )}
    </div>
  );
}
