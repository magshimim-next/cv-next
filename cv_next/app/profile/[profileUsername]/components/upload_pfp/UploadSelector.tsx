"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { RiImageAddFill } from "react-icons/ri";

interface UploadSelectorProps {
  user: any;
  preview: string | null;
  uploading: boolean;
  onFileSelect: (file: File | null, imageData: string | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function UploadSelector({
  preview,
  uploading,
  onFileSelect,
  onSubmit,
}: UploadSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const isImageFile = (file: File): boolean => {
    return file.type.startsWith("image/");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setError(null);

    if (file) {
      if (!isImageFile(file)) {
        setError("Please select an image file (JPEG, PNG, etc.)");
        onFileSelect(null, null);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onFileSelect(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onFileSelect(null, null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    setError(null);

    if (file) {
      if (!isImageFile(file)) {
        setError("Please select an image file (JPEG, PNG, etc.)");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onFileSelect(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <h2 className="mb-4 text-center text-xl font-semibold">
        Select Your profile picture
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div
          className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:bg-gray-50"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            <div className="relative h-48 w-full">
              <Image
                src={preview}
                alt="Preview"
                layout="fill"
                objectFit="contain"
                className="rounded-md"
              />
            </div>
          ) : (
            <div className="text-gray-500">
              <p className="mb-2">Drag and drop your image here</p>
              <p className="text-sm">or click to browse files</p>
              <div className="mx-auto mt-2 flex justify-center text-gray-400">
                <RiImageAddFill className="h-12 w-12" />
              </div>
            </div>
          )}

          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </div>

        {error && (
          <div className="mt-2 text-center text-sm text-red-500">{error}</div>
        )}

        <button
          type="submit"
          disabled={!preview || uploading}
          className={`w-full rounded-md px-4 py-2 font-medium text-white ${
            !preview || uploading
              ? "cursor-not-allowed bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          } transition-colors`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
