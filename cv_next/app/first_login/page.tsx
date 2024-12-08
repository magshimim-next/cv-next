// import { redirect } from "next/navigation";
// import { getUser } from "@/app/actions/users/getUser";
import FirstTimeSignIn from "@/app/first_login/components/firstTimeSignIn";

export default async function Page() {
  return (
    <main>
      <div className="relative mx-auto h-full max-w-full">
        <div className="p-1 text-center">
          <h1 className="mb-5 inline-flex items-center pt-3 text-2xl font-bold text-gray-900 dark:text-white sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
            welcome to our community
          </h1>

          <div className="flex items-center justify-center space-x-4">
            <p className="text-gray-700 dark:text-gray-300">
              change username screen here
            </p>
            <FirstTimeSignIn />
          </div>
        </div>
      </div>
    </main>
  );
}
