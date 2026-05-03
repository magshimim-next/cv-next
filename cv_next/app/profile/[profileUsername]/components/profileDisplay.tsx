export const ProfileDisplay = ({ user }: { user: UserModel }) => {
  return (
    <>
      <div className="m-auto w-full">
        <div className="flex flex-wrap justify-between">
          <label className="font-bold" htmlFor="username">
            Display Name:{" "}
          </label>
          <span id="username">{user.display_name}</span>
        </div>

        <div className="flex flex-wrap justify-between">
          <label className="font-bold" htmlFor="workCategories">
            Work Categories:{" "}
          </label>
          <span id="workCategories">
            {user.work_categories?.join(", ") || "None"}
          </span>
        </div>
        <div className="flex flex-wrap justify-between">
          <label className="font-bold" htmlFor="workStatus">
            Work Status:{" "}
          </label>
          <span id="workStatus">{user.work_status || "Not sharing"}</span>
        </div>
      </div>
    </>
  );
};
