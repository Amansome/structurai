"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Loader2, Eye, EyeOff } from "lucide-react";
import { usePasswordReset } from '@/hooks/authentication/usePasswordReset';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function PasswordReset() {
  const {
    email,
    setEmail,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    message,
    step,
    isLoading,
    handleSubmit,
    getButtonText,
    getHeading,
    getSubheading,
    error,
  } = usePasswordReset();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 p-4">
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="bg-secondary py-3 text-center">
            <CardTitle className="text-2xl font-bold text-secondary-foreground">
              {getHeading()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-2">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="sr-only">Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
            <p className="mb-6 text-center text-balance text-sm text-muted-foreground">
              {getSubheading()}
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <label
                  htmlFor="email"
                  className="absolute left-3 top-2 text-xs font-medium text-muted-foreground"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="h-14 px-3 pb-2 pt-6"
                  disabled={step !== 1 || isLoading}
                />
              </div>

              {step >= 2 && (
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
                      <InputOTPGroup >
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

              {step === 3 && (
                <div className="relative">
                  <label
                    htmlFor="newPassword"
                    className="absolute left-3 top-2 text-xs font-medium text-muted-foreground"
                  >
                    New Password
                  </label>
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className="h-14 px-3 pb-2 pt-6"
                    disabled={isLoading}
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
              )}

              <Button
                type="submit"
                className="mt-2 w-full py-6"
                disabled={isLoading || (step >= 2 && otp.length !== 6)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  getButtonText()
                )}
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