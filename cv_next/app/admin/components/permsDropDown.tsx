"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { PermsKeys } from "@/lib/supabase-definitions";

type FormValues = {
  perms: keyof typeof PermsKeys.user_types_enum;
};

export const PermsDropDown = ({
  userId,
  currentPerms,
}: {
  userId: string;
  currentPerms: string;
}) => {
  const [newPerms, setNewPerms] = useState<string>(currentPerms);
  const { handleSubmit, register } = useForm<FormValues>({ mode: "onChange" });

  const handleOnSubmit: SubmitHandler<FormValues> = async (data) => {
    setNewPerms(data.perms);
    console.log(data);
  };

  return (
    <form onChange={handleSubmit(handleOnSubmit)}>
      <div className="flex flex-wrap justify-between text-center">
        <select
          id="perms"
          {...register("perms", { required: "Permission level is required" })}
          defaultValue={newPerms}
          className="rounded-full px-3 py-1 text-sm font-medium"
          style={{
            backgroundColor:
              newPerms === "inactive"
                ? "#EF4444"
                : newPerms === "admin"
                  ? "#F59E0B"
                  : "#10B981",
          }}
        >
          {Object.entries(PermsKeys.user_types_enum).map(([key, value]) => (
            <option
              key={key}
              value={key}
              className="rounded-full px-3 py-1 text-sm font-medium"
              style={{
                backgroundColor:
                  value === "inactive"
                    ? "#EF4444"
                    : value === "admin"
                      ? "#F59E0B"
                      : "#10B981",
              }}
            >
              {value}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
};
