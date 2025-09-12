"use client";
import { useRef, useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useUser } from "@/hooks/useUser";
import {
  setCurrentProfilePath,
  uploadProfilePicture,
} from "@/app/actions/users/updateUser";
import { useError } from "@/providers/error-provider";
import { Visible_Error_Messages } from "@/lib/definitions";
import UploadSelector from "./UploadSelector";
import ImageCropper from "./ImageCropper";

interface PopupProps {
  closeCb: () => void;
}

export default function PfpUploadPopup({ closeCb }: PopupProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { userData, mutateUser } = useUser();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [cropperImage, setCropperImage] = useState<string | null>(null);

  const { showError } = useError();

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.show();
    }
  }, []);

  const handleFileSelect = (file: File | null, imageData: string | null) => {
    setSelectedFile(file);
    setCropperImage(imageData);
  };

  const handleCropComplete = (croppedImage: string) => {
    setPreview(croppedImage);
    setCropperImage(null);
  };

  const handleCropCancel = () => {
    setCropperImage(null);
    setSelectedFile(null);
    setPreview(null);
  };

  function uploadFailed() {
    setUploading(false);
    showError(
      Visible_Error_Messages.UploadFailed.title,
      Visible_Error_Messages.UploadFailed.description
    );
    closeCb();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !preview) return;

    setUploading(true);

    try {
      // Extract base64 data from the data URL
      const base64Data = preview.split(",")[1];

      const isValid = await uploadProfilePicture(base64Data);
      if (!isValid.ok) {
        uploadFailed();
        return;
      }

      const newProfilePath = isValid.val;
      const res = await setCurrentProfilePath(newProfilePath);
      if (!res.ok) {
        uploadFailed();
        return;
      }

      await mutateUser();
      closeCb();
    } catch (error) {
      uploadFailed();
    }
  };

  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center">
      <div
        className="absolute h-full w-full bg-black opacity-50"
        onClick={closeCb}
      ></div>

      <dialog
        ref={dialogRef}
        className="relative h-[500px] w-[800px] rounded-xl border-2 border-black backdrop-blur-2xl"
      >
        <div
          className="absolute left-5 top-5 h-7 w-7 cursor-pointer"
          onClick={closeCb}
        >
          <IoCloseSharp size={30} />
        </div>
        <div className="mt-20 flex w-full flex-col items-center">
          {userData && (
            <div className="mt-10 flex w-full flex-col items-center">
              {cropperImage ? (
                <ImageCropper
                  image={cropperImage}
                  onCropComplete={handleCropComplete}
                  onCancel={handleCropCancel}
                />
              ) : (
                <UploadSelector
                  user={userData}
                  preview={preview}
                  uploading={uploading}
                  onFileSelect={handleFileSelect}
                  onSubmit={handleSubmit}
                />
              )}
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}
