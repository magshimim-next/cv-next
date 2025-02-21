"use server";
import Image from "next/image";
import { getAllUsers } from "@/server/api/users";

export default async function Page() {
  const users = await getAllUsers();
  if (users.ok) {
    return (
      <div className="mx-auto mt-10 ">
        <h1 className="mb-6 text-center text-2xl font-semibold">
          User Profiles
        </h1>

        <div className="w-full rounded-lg shadow-md">
          <table className="mx-auto w-full max-w-full rounded-lg border border-gray-300 bg-white text-center dark:border-gray-700 dark:bg-black">
            <thead className="bg-gray-100 dark:bg-gray-900">
              <tr className=" text-sm uppercase text-gray-700 dark:text-gray-300">
                <th className="whitespace-nowrap border p-4">ID</th>
                <th className="whitespace-nowrap border p-4">Username</th>
                <th className="whitespace-nowrap border p-4">Display Name</th>
                <th className="whitespace-nowrap border p-4">Avatar</th>
                <th className="whitespace-nowrap border p-4">User Type</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {users.val.map((profile) => (
                <tr key={profile.id}>
                  <td className="whitespace-nowrap border p-4 text-gray-700 dark:text-gray-300">
                    {profile.id}
                  </td>
                  <td className="whitespace-nowrap border p-4 font-medium">
                    {profile.username}
                  </td>
                  <td className="whitespace-nowrap border p-4">
                    {profile.display_name}
                  </td>
                  {profile.avatar_url ? (
                    <td className="border p-4 text-center">
                      <div className="relative mx-auto h-12 w-12">
                        <Image
                          src={profile.avatar_url}
                          alt={profile.display_name || ""}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-full border"
                        />
                      </div>
                    </td>
                  ) : (
                    <td />
                  )}
                  <td className="whitespace-nowrap border p-4">
                    <span
                      className="rounded-full px-3 py-1 text-sm font-medium"
                      style={{
                        backgroundColor:
                          profile.user_type === "inactive"
                            ? "#EF4444"
                            : profile.user_type === "admin"
                              ? "#F59E0B"
                              : "#10B981",
                      }}
                    >
                      {profile.user_type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  return <div>Error: {users.errors as string}</div>;
}
