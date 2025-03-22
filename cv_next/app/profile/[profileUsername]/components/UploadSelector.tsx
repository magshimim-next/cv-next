"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { RiImageAddFill } from "react-icons/ri";

interface UploadSelectorProps {
  user: any;
  onUploadComplete?: () => void;
}

export default function UploadSelector({
  user,
  onUploadComplete,
}: UploadSelectorProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", user.id);

    //TODO: upload image to bucket

    if (onUploadComplete) {
      onUploadComplete();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <h2 className="mb-4 text-center text-xl font-semibold">
        Select Your profile picture
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <button
          type="submit"
          disabled={!selectedFile || uploading}
          className={`w-full rounded-md px-4 py-2 font-medium text-white ${
            !selectedFile || uploading
              ? "cursor-not-allowed bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          } transition-colors`}
        >
          {uploading ? "Uploading..." : "Select Picture"}
        </button>
      </form>
    </div>
  );
}
