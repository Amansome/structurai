// "use client"; // Mark this component as a client component
// import { signIn } from "@/server/auth";
import { Button } from "../ui/button";
import {signIn} from "next-auth/react";

export function SignInWithGoogle() {
  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    await signIn("google"); 
  };

  return (
    <>
      <form onSubmit={handleSignIn}>
        <Button variant={"outline"} type="submit" className="w-full">
          Sign in with Google
        </Button>
      </form>
    </>
  );
}