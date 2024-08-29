"use client";
import React, { useState, useEffect } from "react";
import { PencilIcon, Check, X } from "lucide-react";
import { createClientComponent } from "@/helpers/supabaseBrowserHelper";
import { setNewUsername } from "@/app/actions/users/updateUser";
import { useRouter } from "next/navigation";

export default function EditableUsername({ user }: { user: UserModel }) {
  const router = useRouter();
  const [value, setValue] = useState(user.username || user.full_name || "");
  const [tempValue, setTempValue] = useState(
    user.username || user.full_name || ""
  );
  const [isEditing, setIsEditing] = useState(false);
  const [viewingCurrentUser, setViewingCurrentUser] = useState(false);
  const [errorUpdating, setError] = useState("");
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
      if (value != (user.username || user.full_name) && viewingCurrentUser) {
        const result = await setNewUsername(user.id, value);
        if (!result.ok) {
          if (
            result.errors.postgrestError?.message.includes(
              "duplicate key value"
            )
          ) {
            setError("Name unavailable!");
          } else {
            setError("Error updating the username!");
          }
          setValue(user.username || user.full_name || "");
          setTempValue(user.username || user.full_name || "");
        }
      }
    })();
  }, [value, user, viewingCurrentUser]);

  function handleStartEditing() {
    setIsEditing(true);
    setTempValue(value);
    setError("");
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTempValue(event.target.value);
  }

  function handleCancel() {
    setIsEditing(false);
    setTempValue(value);
  }

  const handleSave = async () => {
    setIsEditing(false);
    setValue(tempValue);
  };

  if (!viewingCurrentUser) {
    return (
      <div className="flex items-center">
        <p className="inline-flex items-center text-xl font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-3 flex items-center justify-center">
      {isEditing ? (
        <div className="flex items-center">
          <input
            type="text"
            value={tempValue}
            onChange={handleChange}
            autoFocus
            className="mr-2 rounded-md border border-gray-300 p-2 text-xl font-semibold text-gray-900 dark:text-white"
          />
          <button
            onClick={handleSave}
            className="text-xl text-gray-600 dark:text-gray-300"
          >
            <Check />
          </button>
          <button
            onClick={handleCancel}
            className="text-xl text-gray-600 dark:text-gray-300"
          >
            <X />
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-center">
            <p className="inline-flex items-center text-xl font-semibold text-gray-900 dark:text-white">
              {value}
            </p>
            <button
              onClick={handleStartEditing}
              className="ml-2 text-gray-600 dark:text-gray-300"
            >
              <PencilIcon size={20} />
            </button>
          </div>
          <div className="flex justify-center">
            {errorUpdating && (
              <p className="mt-2 text-red-600 dark:text-red-400">
                {errorUpdating}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
