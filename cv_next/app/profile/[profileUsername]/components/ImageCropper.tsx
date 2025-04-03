"use client";

import { useRef } from "react";
import { Cropper, CropperRef, CircleStencil } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

export default function ImageCropper({
  image,
  onCropComplete,
  onCancel,
}: ImageCropperProps) {
  const cropperRef = useRef<CropperRef>(null);

  const handleCrop = () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCanvas();
      if (canvas) {
        const croppedImage = canvas.toDataURL();
        onCropComplete(croppedImage);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-0 p-4">
      <div className="flex w-full max-w-3xl flex-col rounded-lg bg-white bg-opacity-0 p-4">
        <div className="flex w-full flex-grow justify-center">
          <div className="h-[350px] w-[350px]">
            <Cropper
              ref={cropperRef}
              src={image}
              className="h-full w-full bg-opacity-0"
              stencilComponent={CircleStencil}
              stencilProps={{
                aspectRatio: 1,
              }}
              imageRestriction="fitArea"
              fitMethod="cover"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-center space-x-2">
          <button
            onClick={onCancel}
            className="rounded-md bg-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleCrop}
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Crop Image
          </button>
        </div>
      </div>
    </div>
  );
}
