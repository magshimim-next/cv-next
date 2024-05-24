"use client";
import React, { useState, useEffect } from "react";
import { PencilIcon, Check } from "lucide-react";
import { useSupabase } from "@/hooks/supabase";

export default function EditableUsername({ user }: { user: UserModel }) {
  const [value, setValue] = useState(user.username || user.full_name || "");
  const [isEditing, setIsEditing] = useState(false);
  const [viewingCurrentUser, setViewingCurrentUser] = useState(false);

  const supabase = useSupabase();

  useEffect(() => {
    async function getUser() {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error("User not found");
      if (userId == user.id) {
        setViewingCurrentUser(true);
      }
    }
    getUser();
  });

  function handleStartEditing() {
    setIsEditing(true);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

  function handleSave() {
    setIsEditing(false);
    // Here you can perform any actions to save the edited value, e.g., update it in the database
  }

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
            value={value}
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
        </div>
      ) : (
        <div className="flex items-center">
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
      )}
    </div>
  );
}
