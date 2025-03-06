"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ImCheckmark } from "react-icons/im";
import { setNewDisplayName } from "@/app/actions/users/updateUser";
import { useError } from "@/providers/error-provider";
import { Button } from "@/components/ui/button";

type FormValues = {
  display_name: string;
};

export const DisplayNameInput = ({
  userId,
  currentName,
}: {
  userId: string;
  currentName: string;
}) => {
  const { register, handleSubmit } = useForm<FormValues>({ mode: "onChange" });
  const [newDisplayName, setInputDisplayName] = useState<string>(currentName);
  const { showError } = useError();
  const handleOnSubmit: SubmitHandler<FormValues> = async (data) => {
    setInputDisplayName(data.display_name);

    const resp = await setNewDisplayName(userId, data.display_name);
    if (!resp.ok) {
      showError(
        "",
        resp.errors.postgrestError?.message ||
          resp.errors.authError?.message ||
          resp.errors.err?.message ||
          "Unknown error"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleOnSubmit)}
      className="flex items-center justify-center gap-3"
    >
      <input
        id="display_name"
        className="w-48 whitespace-nowrap rounded-lg border px-2 py-1 text-center text-sm focus:ring focus:ring-blue-300"
        {...register("display_name", {
          required: "Display name is required",
        })}
        defaultValue={newDisplayName}
      />
      <Button
        type="submit"
        size="icon"
        className="rounded-full bg-green-500 p-2 text-white hover:bg-green-600"
      >
        <ImCheckmark className="h-4 w-4"></ImCheckmark>
      </Button>
    </form>
  );
};
