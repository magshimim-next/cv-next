"use server";

import { notFound } from "next/navigation";
import { getUserModel } from "@/app/actions/users/getUser";
import { NewUsernameForm } from "@/app/first_login/[profileUsername]/components/newUsernameForm";
import { getCurrentId, isCurrentFirstLogin } from "@/server/api/users";

export default async function Page({
  params,
}: {
  params: { profileUsername: string };
}) {
  const { profileUsername } = params;
  const res = await getUserModel(profileUsername);
  const current = await getCurrentId();
  const isFirstLogin = await isCurrentFirstLogin();

  if (
    res === null ||
    !current.ok ||
    !res.ok ||
    res.val.id !== current.val ||
    !isFirstLogin.ok ||
    !isFirstLogin.val
  ) {
    notFound();
  }

  return (
    <main>
      <NewUsernameForm user={res.val} />
    </main>
  );
}
