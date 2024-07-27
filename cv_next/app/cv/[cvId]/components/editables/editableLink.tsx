"use client";
import React, { useState, useEffect } from "react";
import { PencilIcon, Check, X } from "lucide-react";
import { useSupabase } from "@/hooks/supabase";
import { setNewCvLink } from "@/app/actions/cvs/updateCv";

export default function EditableLink({ cv }: { cv: CvModel }) {
  const [value, setValue] = useState(cv.document_link);
  const [tempValue, setTempValue] = useState(cv.document_link);
  const [isEditing, setIsEditing] = useState(false);
  const [viewingCurrentUser, setViewingCurrentUser] = useState(false);
  const [errorUpdating, setError] = useState("");
  const supabase = useSupabase();

  useEffect(() => {
    async function getUser() {
      const uploader = JSON.parse(JSON.stringify(cv.user_id));
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error("User not found");
      if (userId === uploader.id) {
        setViewingCurrentUser(true);
      }
    }
    getUser();
  }, [supabase.auth, cv.user_id]);

  useEffect(() => {
    (async () => {
      if (value != cv.document_link && viewingCurrentUser) {
        const result = await setNewCvLink(cv.id, value);
        if (!result.ok) {
          setError("Error updating link");
          setValue(cv.document_link);
          setTempValue(cv.document_link);
        }
      }
    })();
  }, [value, cv, viewingCurrentUser]);

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
        <p className="inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-3 flex items-center justify-center">
      {isEditing ? (
        <div className="flex w-fit items-center">
          <input
            type="text"
            value={tempValue}
            onChange={handleChange}
            autoFocus
            className="mr-2 rounded-md border border-gray-300 p-2 text-xs font-semibold text-gray-900 dark:text-white"
          />
          <button
            onClick={handleSave}
            className="text-xs text-gray-600 dark:text-gray-300"
          >
            <Check />
          </button>
          <button
            onClick={handleCancel}
            className="text-xs text-gray-600 dark:text-gray-300"
          >
            <X />
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-center">
            <a
              href={value}
              className="inline-flex items-center overflow-auto text-xs text-gray-900 dark:text-white"
            >
              {value}
            </a>
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
