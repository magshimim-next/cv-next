"use client";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { signInWithSocialProvider } from "../actions/user/fetchUserInfo";

export default function Page() {
  return (
    <main>
      <div className="place-items-center px-4 text-sm font-medium">
        <div className="p-4 md:p-5 lg:p-6">
          <div className="grid gap-y-3">
            <Button
              className="c-bOcPnF"
              onClick={() => signInWithSocialProvider("google")}
            >
              <FcGoogle />
              <span style={{ marginLeft: "5px" }}>Sign in with Google</span>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
