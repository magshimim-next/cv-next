"use client";
import React, { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { useSupabase } from "@/hooks/supabase";
import { setNewWorkStatus } from "@/app/actions/users/updateUser";
import Categories from "@/types/models/categories";
import { ProfileKeys } from "@/lib/supabase-definitions";

export default function EditableWorkStatus({ user }: { user: UserModel }) {
  const [tempWorkStatus, setTempWorkStatus] = useState(user.work_status);
  const [viewingCurrentUser, setViewingCurrentUser] = useState(false);
  const [workStatus, setWorkStatus] = useState(user.work_status);
  const supabase = useSupabase();

  useEffect(() => {
    async function getUser() {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error("User not found");
      if (userId === user.id) {
        setViewingCurrentUser(true);
      }
    }
    getUser();
  }, [supabase.auth, user.id]);

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

  const workCategories = user.work_status_categories?.map(
    (categoryId, index) => (
      <span
        key={index}
        className="right-0 mx-4 mb-2 justify-center rounded-full bg-gray-700 px-3 py-1 text-sm font-semibold text-white hover:bg-gray-400"
      >
        {Categories.category[categoryId]}
      </span>
    )
  );

  if (workCategories && workCategories.length < 3 && viewingCurrentUser) {
    const emptySpans = new Array(3 - workCategories.length).fill(
      <span
        key={`empty-${workCategories.length + 1}`}
        className="right-0 mx-4 mb-2 justify-center rounded-full bg-gray-700 px-3 py-1 text-sm font-semibold text-white hover:bg-gray-400"
      >
        Empty
      </span>
    );
    workCategories.push(...emptySpans);
  }

  if (!viewingCurrentUser && user.work_status != "nothing") {
    return (
      <div className="flex-col items-center">
        <div className="mb-2 flex justify-center text-base">
          {user.username || user.full_name} is {workStatus}!
        </div>
        <div className="flex justify-center text-base">{workCategories}</div>
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
          {user.work_status != "nothing" || workStatus != "nothing"
            ? workCategories
            : "Update your work status and share it with the community!"}
        </div>
      </div>
    );
  }
}
