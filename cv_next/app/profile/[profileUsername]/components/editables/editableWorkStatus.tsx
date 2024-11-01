"use client";
import React, { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClientComponent } from "@/helpers/supabaseBrowserHelper";
import { setNewWorkStatus } from "@/app/actions/users/updateUser";
import { ProfileKeys } from "@/lib/supabase-definitions";
import EditableWorkCategories from "./editableWorkCategories";

export default function EditableWorkStatus({ user }: { user: UserModel }) {
  const router = useRouter();
  const [viewingCurrentUser, setViewingCurrentUser] = useState(false);

  const [workStatus, setWorkStatus] = useState(user.work_status);
  const [tempWorkStatus, setTempWorkStatus] = useState(user.work_status);

  const supabase = createClientComponent();

  useEffect(() => {
    async function getUser() {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) router.push("/inactive");
      if (userId === user.id) {
        setViewingCurrentUser(true);
      }
    }
    getUser();
  }, [supabase.auth, user.id, router]);

  useEffect(() => {
    (async () => {
      if (workStatus != user.work_status && viewingCurrentUser) {
        const result = await setNewWorkStatus(user.id, workStatus);
        if (!result.ok) {
          setWorkStatus(user.work_status);
          setTempWorkStatus(user.work_status);
        }
      }
    })();
  }, [workStatus, user, viewingCurrentUser]);

  if (!viewingCurrentUser && user.work_status != "nothing") {
    return (
      <div className="flex-col items-center">
        <div className="mb-2 flex justify-center text-base">
          {user.username || user.full_name} is{" "}
          {ProfileKeys.work_status[workStatus]}!
        </div>
        <div className="flex justify-center text-base">
          <EditableWorkCategories
            user={user}
            viewingCurrentUser={viewingCurrentUser}
          />
        </div>
      </div>
    );
  }

  if (viewingCurrentUser) {
    return (
      <div className="flex-col items-center ">
        <div className="mb-2 flex justify-center text-base">
          Your work status is set to
          <select
            onChange={(e) =>
              setTempWorkStatus(
                e.target.value as "open_to_work" | "hiring" | "nothing"
              )
            }
            className="dark:bg-theme-800"
            style={{
              marginLeft: "5px",
              flexDirection: "column",
              alignItems: "center",
            }}
            value={tempWorkStatus}
          >
            {Object.entries(ProfileKeys.work_status).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
          <div>
            {tempWorkStatus != workStatus ? (
              <div>
                <button
                  onClick={() => setWorkStatus(tempWorkStatus)}
                  className="text-xl text-gray-600 dark:text-gray-300"
                >
                  <Check />
                </button>
                <button
                  onClick={() => setTempWorkStatus(workStatus)}
                  className="text-xl text-gray-600 dark:text-gray-300"
                >
                  <X />
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex justify-center text-base">
          {user.work_status != "nothing" || workStatus != "nothing" ? (
            <EditableWorkCategories
              user={user}
              viewingCurrentUser={viewingCurrentUser}
            />
          ) : (
            "Update your work status and share it with the community!"
          )}
        </div>
      </div>
    );
  }
}
