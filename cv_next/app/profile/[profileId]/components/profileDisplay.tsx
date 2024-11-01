import { ProfileKeys } from "@/lib/supabase-definitions";
import Categories from "@/types/models/categories";

export const ProfileDisplay = ({ user }: { user: UserModel }) => {
  return (
    <>
      <div className="m-auto w-full">
        <div className="flex justify-between">
          <label htmlFor="username">Username: </label>
          <span id="username">{user.username}</span>
        </div>
        <div className="flex justify-between">
          <label htmlFor="workCategories">Work Categories: </label>
          <span id="workCategories">
            {user.work_status_categories
              ?.map((id) => Categories.category[id])
              .join(", ") || "None"}
          </span>
        </div>
        <div className="flex justify-between">
          <label htmlFor="workStatus">Work Status: </label>
          <span id="workStatus">{ProfileKeys.work_status[user.work_status] || "Nothing"}</span>
        </div>
      </div>
    </>
  );
};
