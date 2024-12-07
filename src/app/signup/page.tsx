"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { generateAndSendOtp, register } from "../actions/auth";
import { toast } from "@/hooks/use-toast";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

export default function SignUpPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    try {
      if (!showOtp) {
        // First step: Send OTP
        await generateAndSendOtp(email);
        setShowOtp(true);
        toast({
          title: "Verification code sent",
          description: `Please check ${email} for your verification code`,
        });
      } else {
        // Second step: Verify OTP and create account
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("otp", otp);

        const error = await register(undefined, formData);

        if (error) {
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account created",
            description: "Successfully created your account!",
          });
          router.push("/dashboard");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: showOtp
          ? "Invalid verification code"
          : "Failed to send verification code",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <Card className="p-6">
          <h1 className="mb-4 text-2xl font-bold">Create an account</h1>

          <form onSubmit={handleSubmit}>
            {!showOtp ? (
              <>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="relative mb-4 h-fit">
                  <label
                    htmlFor="password"
                    className="absolute left-2 top-1 text-xs font-medium text-secondary-foreground/70"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-center text-sm text-muted-foreground">
                  Enter the verification code sent to {email}
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

            <div className="mt-6">
              <Button
                type="submit"
                disabled={isPending || (showOtp && otp.length !== 6)}
                className="w-full"
              >
                {isPending
                  ? "Please wait..."
                  : showOtp
                    ? "Verify code"
                    : "Verify Email"}
              </Button>
            </div>

            <p className="mt-4 text-center">
              Already have an account?{" "}
              <Button asChild size="sm" variant="secondary">
                <Link href="/signin">Sign in</Link>
              </Button>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
