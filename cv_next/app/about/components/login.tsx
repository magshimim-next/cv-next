import { FcGoogle } from "react-icons/fc";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { signInWithSocialProvider } from "@/app/actions/users/getUser";
import { useUser } from "@/hooks/useUser";

export default function Login() {
  const searchparams = useSearchParams();
  const next = searchparams.get("next") || "/feed";

  const [isloggedIn, setIsloggedIn] = useState<Boolean>(false);
  const router = useRouter();
  const { loginState, mutateUser } = useUser();

  useEffect(() => {
    mutateUser();
    setIsloggedIn(!loginState);
  }, [mutateUser, loginState]);

  function onClick() {
    if (!isloggedIn) {
      router?.push("/signout");
    } else {
      signInWithSocialProvider("google", next);
    }
  }

  return (
    <div className="place-items-center px-4 text-sm font-medium">
      <div className="p-4 md:p-5 lg:p-6">
        <div className="grid gap-y-3">
          <Button className="c-bOcPnF" onClick={onClick}>
            {isloggedIn ? (
              <>
                <FcGoogle />
                <span className="ml-2">Sign in with Google</span>
              </>
            ) : (
              "Signout"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
