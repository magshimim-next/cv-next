"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaQuestionCircle } from "react-icons/fa";
import {
  setNewUsername,
  setFirstLoginCurrent,
} from "@/app/actions/users/updateUser";
import { getUserModel } from "@/app/actions/users/getUser";
import { Button } from "@/app/feed/components/button";
import { InputBox } from "@/app/feed/components/inputbar";
import { useUser } from "@/hooks/useUser";
import { useError } from "@/providers/error-provider";
import { checkUsername } from "@/helpers/usernameRegexHelper";
import { Visible_Error_Messages } from "@/lib/definitions";
import Tooltip from "@/components/ui/tooltip";
import FirstTimeSignIn from "./firstTimeSignIn";

export const NewUsernameForm = ({ user }: { user: UserModel }) => {
  let profileUsername = user?.username ?? "";
  const [newUsername, setUsername] = useState<string>("");
  const [validUsername, setValidUsername] = useState<boolean>(true);
  const { mutateUser } = useUser();
  const router = useRouter();
  const { showError } = useError();

  async function onConfirm() {
    const res = await getUserModel(profileUsername);

    if (res === null || !res.ok) {
      return;
    }

    const isValid = await setNewUsername(res.val.id, newUsername);
    if (isValid.ok) {
      await setFirstLoginCurrent(false);
      await mutateUser();
      router?.push(`/profile/${newUsername}`);
    } else {
      showError(
        Visible_Error_Messages.DuplicateUsername.title,
        Visible_Error_Messages.DuplicateUsername.description
      );
    }
  }

  const validate = (() => {
    const checkNewUsername = () => {
      return checkUsername(newUsername);
    };

    return {
      newUsername: checkNewUsername,
    };
  })();

  useEffect(() => {
    if (newUsername == "") return;

    setValidUsername(validate.newUsername());
  }, [newUsername]);

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

          {!validUsername && (
            <div className="flex items-center justify-center space-x-4 text-destructive">
              <Tooltip
                message="Use at least one alphanumeric (0-9 a-z A-Z) and special characters ( _ .) and should be between 1-20 characters long"
                id="firstTime"
              >
                <div className="mr-2">
                  <FaQuestionCircle />
                </div>
              </Tooltip>
              Username should match the requested format
            </div>
          )}

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
};
