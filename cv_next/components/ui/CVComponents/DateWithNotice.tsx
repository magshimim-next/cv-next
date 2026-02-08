import Link from "next/link";

type NoticeDateProps = {
  name: string;
  profileUrl?: string;
  formattedDate: string;
  creationDate: string;
  nameClassName?: string;
  dateClassName?: string;
  containerClassName?: string;
};

/**
 * The component will display the name of the uploader and the CV date of update/creation.
 * @param {NoticeDateProps} param0 The props for the component.
 * @param {string} param0.name The name of the uploader.
 * @param {string} [param0.profileUrl] The URL to the uploader's profile (optional).
 * @param {string} param0.formattedDate The formatted date of the CV's last update.
 * @param {string} param0.creationDate The formatted date of the CV's creation.
 * @param {string} [param0.nameClassName] Optional class name for styling the name element.
 * @param {string} [param0.dateClassName] Optional class name for styling the date element.
 * @param {string} [param0.containerClassName] Optional class name for styling the container element.
 * @returns {Element} The component displaying the uploader's name and CV dates, with optional styling and profile link.
 */
export function DateWithNotice({
  name,
  profileUrl,
  formattedDate,
  creationDate,
  nameClassName = "text-xl font-bold text-neutral-700",
  dateClassName = "text-xs text-neutral-400",
  containerClassName = "flex flex-col gap-x-2 sm:flex-row sm:items-baseline",
}: NoticeDateProps) {
  const NameElement = profileUrl ? (
    <Link href={profileUrl} className="hover:underline">
      <span className={nameClassName}>{name}</span>
    </Link>
  ) : (
    <span className={nameClassName}>{name}</span>
  );

  return (
    <div className={containerClassName}>
      {NameElement}

      <div className="flex flex-row items-center gap-x-2">
        <p className={dateClassName}>{formattedDate}</p>
        {formattedDate !== creationDate && (
          <p className="text-[0.65rem] text-neutral-400">Updated</p>
        )}
      </div>
    </div>
  );
}
