"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useActionState, useState } from "react";
import { authenticate } from "../actions/auth";
import { EyeOff } from "lucide-react";
import { Eye } from "lucide-react";
import { SignInWithGoogle } from "@/components/auth/SignInWithGoogle";

export default function SignUpPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <Card className="p-6 ">
          <h1 className=" text-2xl font-bold mb-6">Signin to account</h1>
          <div className="mb-6">
        <SignInWithGoogle />
          </div>

          {/* Add your sign-up form fields here */}
          <form action={formAction}>
            <input type="hidden" name="redirectTo" value="/dashboard" />

            {errorMessage && (
              <div className="mb text-balance rounded bg-error/5 p-1 text-center text-sm text-error-foreground">
                <p>{errorMessage}</p>
              </div>
            )}

            <div className="relative mb-4 h-fit">
              <label
                htmlFor="email"
                className="absolute left-2 top-1 text-xs font-medium text-secondary-foreground/70"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 w-full rounded-md border px-3 pb-4 pt-7"
                placeholder="Enter your email"
              />
            </div>
            <div className="relative mb-4 h-fit">
              <label
                htmlFor="email"
                className="absolute left-2 top-1 z-10 text-xs font-medium text-secondary-foreground/70"
              >
                Password
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                minLength={8}
                className="z-0 mt-1 w-full rounded-md border px-3 pb-4 pt-7"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>

            <div className="flex mb-6 absolute right-0 
           justify-between items-center">
              <Button asChild size={"sm"} variant={'link'} >
                <Link href="/password/reset">Forgot password?</Link>
              </Button>
          </div>
             </div>

            <Button disabled={isPending} className="w-full mt-6">
              {isPending ? "Logging in.." : "Login"}
            </Button>

            <p className="mt-4">
              Have an account?{" "}
              <Button asChild size={"sm"} variant={"secondary"}>
                <Link href="/signup">Create account</Link>
              </Button>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
