"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { EyeOff, Eye, AlertCircle } from "lucide-react";
import { ActionButton } from "@/components/global/ActionButton";
import { Separator } from "@/components/ui/separator";
import { useSignIn } from "@/hooks/authentication/useSignIn";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SignInPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isPending,
    handleSubmit,
    handleGoogleSignIn,
    getButtonText,
    getFormHeading,
    getFormSubheading,
    oauthError,
    error,
  } = useSignIn();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 p-4">
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="bg-secondary py-3 text-center">
            <CardTitle className="text-2xl font-bold text-secondary-foreground">
              {getFormHeading()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-2">

            {oauthError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="sr-only">Error</AlertTitle>
                <AlertDescription>{oauthError}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="sr-only">Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            </div>

            <ActionButton
              onClick={handleGoogleSignIn}
              image="/googleicon.svg"
              label="Sign in with Google"
              loadingText="Please wait"
              variant="outline"
              className="w-full"
            />

            <div className="my-6 flex items-center">
              <Separator className="flex-1" />
              <span className="mx-4 text-xs text-muted-foreground">
                OR CONTINUE WITH EMAIL
              </span>
              <Separator className="flex-1" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <label
                  htmlFor="email"
                  className="absolute left-3 top-2 text-xs font-medium text-muted-foreground"
                >
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 px-3 pb-2 pt-6"
                  placeholder="name@example.com"
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="password"
                  className="absolute left-3 top-2 text-xs font-medium text-muted-foreground"
                >
                  Password
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 px-3 pb-2 pt-6"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="flex justify-end">
                <Button asChild size="sm" variant="link" className="px-0">
                  <Link href="/password/reset">Forgot password?</Link>
                </Button>
              </div>

              <Button disabled={isPending} className="mt-2 w-full py-6">
                {getButtonText()}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              Don't have an account?{" "}
              <Button asChild size="sm" variant="link" className="p-0">
                <Link href="/signup">Create an account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}