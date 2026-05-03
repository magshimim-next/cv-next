import Link from "next/link";
import { generateCategoryLink } from "@/lib/utils";

/**
 * Component that renders a category link with a styled button.
 *
 * @param {number} categoryId - The ID of the category to generate the link for.
 * @param {string} className - Optional additional class names to apply to the button.
 * @param {React.MouseEventHandler<HTMLDivElement>} onClick - Optional click event handler for the button.
 * @returns {JSX.Element} The rendered category link component.
 */
export const CvCategory = ({
  categoryId,
  className,
  onClick,
}: {
  categoryId: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}) => {
  return (
    <Link href={generateCategoryLink(categoryId)}>
      <div
        onClick={onClick ? onClick : undefined}
        className={
          className ??
          "mb-2 mr-2 rounded-full bg-gray-700 px-3 py-1 text-sm font-semibold text-white hover:bg-gray-400 hover:underline"
        }
      >
        #{categoryId}
      </div>
    </Link>
  );
};
