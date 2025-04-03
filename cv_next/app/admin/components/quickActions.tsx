"use client";
import { useError } from "@/providers/error-provider";
import { Button } from "@/app/feed/components/button";
import { activateUsers } from "@/app/actions/users/updateUser";

export const QuickActions = () => {
  const { showError } = useError();
  const activateAll = async () => {
    const res = await activateUsers();
    if (res.ok) {
      window.location.reload();
    } else {
      showError(
        "",
        res.errors.postgrestError?.message ||
          res.errors.authError?.message ||
          res.errors.err?.message ||
          "Unknown error"
      );
    }
  };

  return (
    <div className="mx-auto mb-3 flex max-w-36 justify-end">
      <Button text="Activate All" onClick={activateAll} />
    </div>
  );
};
