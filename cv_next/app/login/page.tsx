import Image from "next/image"

export default function Page() {
  return (
    <main>
      <div className="grid place-items-center px-4 text-sm font-medium">
        <div className="w-full max-w-sm rounded-lg shadow-lg bg-primary opacity-10">
          <div className="p-4 md:p-5 lg:p-6">
            <div className="grid gap-y-3">
              <div>
                <button className="flex items-center justify-center gap-x-2 rounded-md border border-primary bg-accent px-4 py-3 text-primary transition hover:text-muted">
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
                <button className="flex items-center justify-center gap-x-2 rounded-md border border-primary bg-accent px-4 py-3 text-primary transition hover:text-muted">
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
          </div>
          <div className="flex flex-row"></div>
        </div>
      </div>
    </main>
  )
}
