"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Eye, EyeOff } from "lucide-react";
import { ActionButton } from "@/components/global/ActionButton";
import { Separator } from "@/components/ui/separator";
import { useSignUp } from "@/hooks/authentication/useSignUp";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function SignUpPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    otp,
    setOtp,
    showPassword,
    setShowPassword,
    showOtp,
    isPending,
    handleSubmit,
    handleGoogleSignUp,
    getButtonText,
    getFormHeading,
    getFormSubheading,
    error,
  } = useSignUp();

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
            <ActionButton
              onClick={handleGoogleSignUp}
              image="/googleicon.svg"
              label="Sign up with Google"
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
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="sr-only">Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!showOtp ? (
                <>
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
                      className="h-14 px-3 pb-2 pt-6"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      className="h-14 px-3 pb-2 pt-6"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <p className="text-center text-balance text-sm text-muted-foreground">
                    {getFormSubheading()}
                  </p>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                      value={otp}
                      onChange={setOtp}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending || (showOtp && otp.length !== 6)}
                className="mt-2 w-full py-6"
              >
                {getButtonText()}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Button asChild size="sm" variant="link" className="p-0">
                <Link href="/signin">Sign in</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}