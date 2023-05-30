import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello World!</h1>
      <Link href={"/pages/login"}>Log In</Link>
      <Link href={"/pages/register"}>Register</Link>
    </main>
  )
}
