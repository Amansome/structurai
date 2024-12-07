"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useActionState } from "react";
import { register } from "../actions/auth";

export default function SignUpPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    register,
    undefined,
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <Card className="p-6">
          <h1 className="mb-4 text-2xl font-bold">Create an account</h1>

          {/* Add your sign-up form fields here */}
          <form action={formAction}>
            {/* Example input field */}
            <div className="relative mb-4 h-fit">
              <label
                htmlFor="email"
                className="text-secondary-foreground/70 absolute left-2 top-1 text-xs font-medium"
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
                className="text-secondary-foreground/70 absolute left-2 top-1 text-xs font-medium"
              >
                Password
              </label>
              <Input
                type="password"
                id="password"
                name="password"
                required
                minLength={8}
                className="mt-1 w-full rounded-md border px-3 pb-4 pt-7"
                placeholder="Enter your password"
              />
            </div>
            <Button className="w-full">Create account</Button>

            <p className="mt-4">
              Already have an account?{" "}
              <Button asChild size={"sm"} variant={"secondary"}>
                <Link href="/signin">Sign in</Link>
              </Button>
            </p>
            {errorMessage && (
              <div className="text-error-foreground bg-error/5 text-sm rounded p-2 text-balance text-center">
                <p>
                {errorMessage}
                </p>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}
