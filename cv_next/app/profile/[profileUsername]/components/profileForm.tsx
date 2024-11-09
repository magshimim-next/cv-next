"use client";

import { useMemo, useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUser } from "@/hooks/useUser";
import Categories from "@/types/models/categories";
import { MultiSelect } from "@/components/ui/multiSelect";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { updateUserAction } from "@/app/actions/users/updateUser";
import { ProfileKeys } from "@/lib/supabase-definitions";

type FormValues = {
  username: string;
  workCategories: number[];
  workStatus: keyof typeof ProfileKeys.work_status;
};

export default function ProfileForm({
  user,
  revalidationFn,
  exitEditMode,
}: {
  user: UserModel;
  revalidationFn: () => void;
  exitEditMode: () => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onChange" });
  const { userData, mutateUser } = useUser();
  const [isPending, startTransition] = useTransition();

  const mapCategories: number[] = useMemo(() => {
    const keys = Object.keys(Categories.category)
      .map((key) => parseInt(key))
      .filter((key) => !isNaN(key));
    return keys;
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleOnSubmit: SubmitHandler<FormValues> = async (data) => {
    const { username, workCategories, workStatus } = data;
    let userDataToUpdate: Partial<UserModel> = {
      id: user.id,
    };
    // Only update if the value has changed
    if (username !== user.username) {
      //TODO: username needs to be handled very differently!
      userDataToUpdate.full_name = username;
    }
    if (
      JSON.stringify(workCategories.toSorted()) !==
      JSON.stringify(user.work_status_categories?.toSorted())
    ) {
      userDataToUpdate.work_status_categories = workCategories;
    }
    if (workStatus !== user.work_status) {
      userDataToUpdate.work_status = workStatus;
    }

    if (Object.keys(userDataToUpdate).length === 1) {
      // No changes
      exitEditMode();
      return;
    }
    startTransition(async () => {
      const result = await updateUserAction(userDataToUpdate);
      if (result.ok) {
        // Revalidate cache for user
        revalidationFn();
        await mutateUser();
        exitEditMode();
      } else {
        const error =
          result.errors?.postgrestError ??
          result.errors?.authError ??
          result.errors?.err;
        setError("root", { message: error?.message ?? "An error occurred" });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <div className="flex flex-wrap justify-between">
        <label className="font-bold" htmlFor="username">
          Username:{" "}
        </label>
        <input
          className="w-full"
          id="username"
          {...register("username", { required: "Username is required" })}
          defaultValue={user.full_name ?? ""}
        />
        {errors.username && (
          <FormErrorMessage message={errors.username.message} />
        )}
      </div>

      <MultiSelect<FormValues>
        name="workCategories"
        label="Work Categories: "
        options={mapCategories}
        labels={mapCategories.map((id) => Categories.category[id])}
        control={control}
        defaultValue={user.work_status_categories ?? undefined}
      />

      <div className="flex flex-wrap justify-between">
        <label className="font-bold" htmlFor="workStatus">
          Work Status
        </label>
        <select
          id="workStatus"
          {...register("workStatus", { required: "Work status is required" })}
          defaultValue={user.work_status ?? "nothing"}
        >
          {Object.entries(ProfileKeys.work_status).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
        {errors.workStatus && (
          <FormErrorMessage message={errors.workStatus.message} />
        )}
      </div>

      <div className="mt-2 flex justify-end">
        <button
          className={`${cn(buttonVariants({ size: "sm" }))}`}
          type="submit"
          disabled={isPending || !!Object.keys(errors).length}
        >
          {isPending ? "Updating..." : "Update Profile"}
        </button>
      </div>
      {errors.root && <FormErrorMessage message={errors.root.message} />}
    </form>
  );
}

const FormErrorMessage = ({ message }: { message?: string }) => (
  <div className="mb-2 text-red-500">{message}</div>
);
