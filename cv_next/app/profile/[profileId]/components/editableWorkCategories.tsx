"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Check, X } from "lucide-react";
import Categories from "@/types/models/categories";
import { arraysHaveSameContent } from "@/lib/utils";
import { setNewWorkCategories } from "@/app/actions/users/updateUser";

export default function EditableWorkCategories({
  user,
  viewingCurrentUser,
}: {
  user: UserModel;
  viewingCurrentUser: boolean;
}) {
  const [workCategories, setWorkCategories] = useState(
    user.work_status_categories || []
  );
  const [tempWorkCategories, setTempWorkCategories] = useState(
    user.work_status_categories || []
  );

  useEffect(() => {
    (async () => {
      if (
        !arraysHaveSameContent(
          workCategories,
          user.work_status_categories || []
        ) &&
        viewingCurrentUser
      ) {
        const result = await setNewWorkCategories(user.id, workCategories);
        if (!result.ok) {
          setWorkCategories(user.work_status_categories || []);
          setTempWorkCategories(user.work_status_categories || []);
        }
      }
    })();
  }, [workCategories, user, viewingCurrentUser]);

  const mapCategories: number[] = useMemo(() => {
    const keys = Object.keys(Categories.category)
      .map((key) => parseInt(key))
      .filter((key) => !isNaN(key));
    return keys;
  }, []);

  const workCategoriesComponent = tempWorkCategories.map(
    (categoryId, index) => (
      <span
        key={index}
        className="right-0 mx-4 mb-2 justify-center rounded-full bg-gray-700 px-3 py-1 text-sm font-semibold text-white hover:bg-gray-400"
      >
        {Categories.category[categoryId]}
      </span>
    )
  );

  if (!viewingCurrentUser && user.work_status != "nothing") {
    return (
      <div className="flex-col items-center">
        <div className="flex justify-center text-base">
          {workCategoriesComponent}
        </div>
      </div>
    );
  }

  if (viewingCurrentUser) {
    const filledWorkStatusCategories = [...tempWorkCategories];

    while (filledWorkStatusCategories.length < 3) {
      filledWorkStatusCategories.push(-1);
    }

    const editableCategories = filledWorkStatusCategories
      .slice(0, 3)
      .map((categoryId, index) => (
        <select
          key={index}
          onChange={(e) => {
            const newCategoryKey = e.target.value;
            const newCategoryIndex =
              Categories.category[
                newCategoryKey as keyof typeof Categories.category
              ];
            if (tempWorkCategories.includes(newCategoryIndex)) {
              //error
            }
            if (newCategoryIndex !== undefined) {
              const updatedCategories = [...tempWorkCategories];
              updatedCategories[index] = newCategoryIndex;
              setTempWorkCategories(updatedCategories);
            }
          }}
          className="dark:bg-theme-800"
          style={{
            marginLeft: "5px",
            flexDirection: "column",
            alignItems: "center",
          }}
          value={Categories.category[categoryId]}
        >
          {mapCategories.map((value) => (
            <option
              key={value}
              disabled={
                tempWorkCategories?.includes(value) &&
                value != Categories.category.Undefined
              }
            >
              {Categories.category[value]}
            </option>
          ))}
        </select>
      ));

    return (
      <div className="flex-col items-center ">
        <div className="flex justify-center text-base">
          {editableCategories}
        </div>
        <div>
          {!arraysHaveSameContent(tempWorkCategories, workCategories) ? (
            <div>
              <button
                onClick={() => setWorkCategories(tempWorkCategories)}
                className="text-xl text-gray-600 dark:text-gray-300"
              >
                <Check />
              </button>
              <button
                onClick={() => setTempWorkCategories(workCategories)}
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
    );
  }
}
