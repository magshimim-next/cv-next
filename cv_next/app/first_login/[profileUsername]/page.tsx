"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setNewUsername } from "@/app/actions/users/updateUser";
import { getUserModel, getUser } from "@/app/actions/users/getUser";
import { Button } from "@/app/feed/components/button";
import { InputBox } from "@/app/feed/components/inputbar";
import { useUser } from "@/hooks/useUser";
import FirstTimeSignIn from "./components/firstTimeSignIn";

export default function Page({
  params,
}: {
  params: { profileUsername: string };
}) {
  const { mutateUser } = useUser();
  const { profileUsername } = params;

  useEffect(() => {
    onEnter();
  }, [profileUsername]);

  async function onEnter() {
    const res = await getUserModel(profileUsername);
    const current = await getUser();

    if (
      res === null ||
      !current.ok ||
      !res.ok ||
      res.val.id !== current.val.id
    ) {
      router.push(`/not_found`);
      return;
    }
  }

  async function onConfirm() {
    const res = await getUserModel(profileUsername);

    if (res === null || !res.ok) {
      router.push(`/not_found`);
      return;
    }

    const isValid = await setNewUsername(res.val.id, newUsername);
    if (isValid.ok) {
      await mutateUser();
      //await setFirstLogin(false);
      router.push(`/profile/${newUsername}`);
    }
  }

  const validate = (() => {
    const checkNewUsername = () => {
      //TODO: need to add a check for the username rules
      return true;
    };

    return {
      newUsername: checkNewUsername,
    };
  })();

  const [newUsername, setUsername] = useState<string>("");
  const router = useRouter();

  return (
    <main>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="p-1 text-center">
          <h1 className="mb-5 inline-flex items-center pt-3 text-2xl font-bold capitalize text-gray-900 dark:text-white sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
            Welcome to our community
          </h1>

          <div className="flex items-center justify-center space-x-4">
            <h2 className="text-xl font-light text-muted-foreground lg:text-3xl">
              You are currently signed in as:{" "}
              <span className="font-bold">{profileUsername}</span>
            </h2>
            <FirstTimeSignIn />
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-4">
          <label
            htmlFor="new_username"
            className="mt-5 text-sm capitalize text-muted-foreground lg:text-2xl"
          >
            new username:
          </label>

          <div className="mt-5 text-sm font-light text-muted-foreground lg:text-xl">
            <InputBox
              placeHolder="new username"
              onChange={setUsername}
              value={newUsername}
            />
          </div>
        </div>

        <div className="mt-5 flex max-w-sm items-center justify-center">
          <Button
            text="Confirm"
            onClick={onConfirm}
            isDisabled={!validate.newUsername()}
          />
        </div>
      </div>
    </main>
  );
}
