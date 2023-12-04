import Image from "next/image"

export default function Page() {
  return (
    <main>
      <div>
        <h1 className="relative p-2 text-xl">Select login method</h1>
      </div>
      <div className="flex flex-row">
        <div>
          <button className="flex gap-2 rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:border-slate-400 hover:shadow dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500">
            <Image
              className="h-6 w-6"
              src="google.svg"
              loading="lazy"
              alt="google logo"
              width={6}
              height={6}
            />
            <span>Login with Google</span>
          </button>
        </div>
        <div>
          <button className="flex gap-2 rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:border-slate-400 hover:shadow dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500">
            <Image
              className="h-6 w-6"
              src="something.svg"
              loading="lazy"
              alt="google logo"
              width={6}
              height={6}
            />
            <span>Login with something else</span>
          </button>
        </div>
      </div>
    </main>
  )
}
