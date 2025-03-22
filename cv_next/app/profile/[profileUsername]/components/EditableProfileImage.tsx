"use client";
import Image from "next/image";
import { Upload } from "lucide-react";
import { useError } from "@/providers/error-provider";

export default function EditableProfileImage({ user }: { user: UserModel }) {
  const { showError } = useError();

  async function onProfileClick() {
    showError("Test", user.avatar_url!);
  }

  return (
    <div className="relative overflow-hidden rounded-full">
      <Image
        alt="profile"
        src={user.avatar_url || ""}
        width={90}
        height={60 * 1.4142}
        priority={true}
      />
      <div
        className="absolute bottom-0 left-0 right-0 flex cursor-pointer items-center justify-center bg-black bg-opacity-50 p-1"
        onClick={() => onProfileClick()}
      >
        <Upload className="h-5 w-5 text-white" />
      </div>
    </div>
  );
}
