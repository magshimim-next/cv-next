"use client";

import { useMemo, useTransition } from "react";
import { useForm, SubmitHandler, Path } from "react-hook-form";
import { useUser } from "@/hooks/useUser";
import Categories from "@/types/models/categories";
import { MultiSelect } from "@/components/ui/multiSelect";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { updateUserAction } from "@/app/actions/users/updateUser";
import { ProfileKeys } from "@/lib/supabase-definitions";
import { FormInput } from "./formInput";

export type FormValues = {
  displsy_name: string;
  workCategories: number[];
  workStatus: keyof typeof ProfileKeys.work_status;
  linkedin: string;
  github: string;
  gitlab: string;
  portfolio: string;
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
    setValue,
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
    const { displsy_name, workCategories, workStatus , linkedin, github, gitlab, portfolio} = data;
    let userDataToUpdate: Partial<UserModel> = {
      id: user.id,
    };
    // Only update if the value has changed
    if (displsy_name !== user.display_name) {
      userDataToUpdate.display_name = displsy_name;
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

    //todo: sentisize links
    if(gitlab){
      userDataToUpdate.gitlab_link = gitlab;
    }

    if(portfolio){
      userDataToUpdate.portfolio_link = portfolio;
    }

    if(github){
      userDataToUpdate.github_link = github;
    }

    if(linkedin){
      userDataToUpdate.linkedin_link = linkedin;
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

  const clearSocial = async (social: Path<FormValues>) => {
    setValue(social, "")
    //alert(social)
  }

  return (
    <form className="flex flex-col gap-1" onSubmit={handleSubmit(handleOnSubmit)} >

      <FormInput 
        field="displsy_name"
        placeholder="displsy name"
        defaultValue={user.display_name ?? ""}
        register={register}
        isRequired={true}
        hasError={errors.displsy_name && true}
        errorMsg={errors.displsy_name?.message}/>

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
          Work Status:
        </label>
        <select
          id="workStatus"
          className="rounded-md bg-accent hover:bg-muted"
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

      <FormInput 
        field="linkedin"
        placeholder="linkedin url"
        defaultValue={user.linkedin_link ?? ""}
        register={register}
        clearFunc={clearSocial}
        hasError={errors.linkedin && true}
        errorMsg={errors.linkedin?.message}/>

      <FormInput 
        field="github"
        placeholder="github url"
        defaultValue={user.github_link ?? ""}
        register={register}
        clearFunc={clearSocial}
        hasError={errors.github && true}
        errorMsg={errors.github?.message}/>

      <FormInput 
        field="gitlab"
        placeholder="gitlab url"
        defaultValue={user.gitlab_link ?? ""}
        register={register}
        clearFunc={clearSocial}
        hasError={errors.gitlab && true}
        errorMsg={errors.gitlab?.message}/>

      <FormInput 
        field="portfolio"
        placeholder="portfolio url"
        defaultValue={user.portfolio_link ?? ""}
        register={register}
        clearFunc={clearSocial}
        hasError={errors.portfolio && true}
        errorMsg={errors.portfolio?.message}/>

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

export const FormErrorMessage = ({ message }: { message?: string }) => (
  <div className="mb-2 text-red-500">{message}</div>
);
