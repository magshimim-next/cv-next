"use client";
import { FiTrash2 } from "react-icons/fi";
import { UseFormHandleSubmit } from "react-hook-form";
import ButtonWithAlert from "@/components/ui/ButtonWithAlert";
import { encodeValue } from "@/lib/utils";

/**
 * Props for CvActions component.
 */
interface CvActionsProps {
  /** Whether the CV data is valid */
  isValid: boolean;
  /** Function to handle CV submission */
  handleSubmit: UseFormHandleSubmit<any>;
  /** Function to submit the form */
  onSubmit: (data: any) => void | Promise<void>;
  /** The CV data */
  cvId: string;
  /** Function to handle deletion */
  onDeleteAlertClick: () => void | Promise<void>;
  /** React page router */
  router: any;
}

/**
 * CV actions that are shown on the edit page.
 * @param {CvActionsProps} props - The functions to run on each click, and their arguments.
 * @returns {JSX.Element} The component.
 */
export function CvActions({
  isValid,
  handleSubmit,
  onSubmit,
  cvId,
  onDeleteAlertClick,
  router,
}: CvActionsProps) {
  return (
    <div className="flex-col justify-center">
      <div className="mb-3 flex justify-center">
        <ButtonWithAlert
          buttonContent="Update"
          isDisabled={!isValid}
          buttonClassName="
            outline-gray-40 box-border flex h-full w-full items-center justify-center 
            whitespace-nowrap rounded-md px-10 py-4 outline-2"
          alertMessage="Are you sure you want to update this CV?"
          alertColor="green"
          onConfirm={() => handleSubmit(onSubmit)()}
        />
      </div>

      <div className="mb-3 flex justify-center">
        <ButtonWithAlert
          buttonContent="Cancel without saving"
          buttonClassName="
            outline-gray-40 box-border flex h-full w-full items-center justify-center 
            whitespace-nowrap rounded-md px-10 py-4 outline-2"
          alertMessage="Are you sure you want to leave this CV unchanged?"
          alertColor="red"
          onConfirm={() => router.push(`/cv/${encodeValue(cvId)}`)}
        />
      </div>

      <div className="mb-3 flex justify-center">
        <ButtonWithAlert
          buttonContent={
            <span className="flex items-center gap-2">
              <FiTrash2 /> Delete
            </span>
          }
          buttonClassName="
            outline-gray-40 box-border flex h-full w-full items-center justify-center 
            whitespace-nowrap rounded-md bg-red-500 px-6 py-4 text-white outline-2 hover:bg-red-600"
          alertMessage="Are you sure you want to delete this CV?"
          alertColor="red"
          onConfirm={onDeleteAlertClick}
        />
      </div>
    </div>
  );
}
