import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Login() {
  const handleLogin = () => {
    signIn("google");
  };

  return (
    <div className="w-full min-h-screen justify-center items-center flex flex-col gap-7">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          src="/logo.svg"
          alt="Logo"
          className="mx-auto h-10 w-auto"
          width={100}
          height={24}
          priority
        />
        <h2 className="mt-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Login to continue
        </h2>
      </div>
      <Button onClick={handleLogin} variant="outline" size={"lg"} type="button">
        <Icons.google className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>
    </div>
  );
}
