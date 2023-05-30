import Link from "next/link";
import Layout from "@/app/ui/layout";
export default function Home() {
  return (
    <main>
      <Layout>
        <h1>Hello World!</h1>
        <Link href={"/pages/login"}>Log In</Link>
        <Link href={"/pages/register"}>Register</Link>
      </Layout>
    </main>
  );
}
