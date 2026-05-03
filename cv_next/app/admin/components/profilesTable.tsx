"use server";
import Image from "next/image";
import Link from "next/link";
import { PermsDropDown } from "./permsDropDown";

export const ProfilesTable = ({
  profiles,
}: {
  profiles: Partial<UserWithPerms>[];
}) => {
  return (
    <div className="w-full rounded-lg shadow-md">
      <table className="mx-auto w-full max-w-full rounded-lg border border-gray-300 bg-white text-center dark:border-gray-700 dark:bg-black">
        <thead className="bg-gray-100 dark:bg-gray-900">
          <tr className=" text-sm uppercase text-gray-700 dark:text-gray-300">
            <th className="whitespace-nowrap border p-4">ID</th>
            <th className="whitespace-nowrap border p-4">Display Name</th>
            <th className="whitespace-nowrap border p-4">Username</th>
            <th className="whitespace-nowrap border p-4">Avatar</th>
            <th className="whitespace-nowrap border p-4">User Type</th>
          </tr>
        </thead>

        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.id}>
              <td className="whitespace-nowrap border p-4 text-gray-700 dark:text-gray-300">
                {profile.id}
              </td>
              <td className="whitespace-nowrap border p-4 font-medium">
                {profile.display_name}
              </td>
              <td className="whitespace-nowrap border p-4 ">
                {profile.username ? (
                  <Link
                    className=" hover:underline"
                    href={`/profile/${profile.username}`}
                  >
                    {profile.username}
                  </Link>
                ) : (
                  <span className="text-gray-400">No username</span>
                )}
              </td>
              {profile.avatar_url ? (
                <td className="border p-4 text-center">
                  <div className="relative mx-auto h-12 w-12">
                    <Image
                      src={profile.avatar_url}
                      alt={profile.display_name || ""}
                      width={125}
                      height={75}
                      className="h-full w-full rounded-full border object-contain"
                    />
                  </div>
                </td>
              ) : (
                <td />
              )}
              <td className="whitespace-nowrap border p-4">
                <PermsDropDown
                  userId={profile.id || ""}
                  currentPerms={profile.user_type || ""}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
