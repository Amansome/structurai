"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schema";
import { signIn } from "next-auth/react";
import { generateAndSendOtp, register } from "@/app/actions/auth";

export function useSignUp() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null); // Clear previous errors

    try {
      if (!showOtp) {
        // Validate email and password input
        const validation = signUpSchema.safeParse({ email, password });
        if (!validation.success) {
          setError(
            validation.error.errors.map((err) => err.message).join(", ")
          );
          setIsPending(false);
          return;
        }

        try {
          // First step: Send OTP (this will now check if email exists)
          await generateAndSendOtp(email);
          setShowOtp(true);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to send verification code"
          );
        }
      } else {
        // Validate OTP
        if (otp.length !== 6) {
          setError("Please enter a 6-digit verification code.");
          setIsPending(false);
          return;
        }

        // Proceed with registration
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("otp", otp);

        const regError = await register(undefined, formData);

        if (regError) {
          setError(regError);
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError(
        showOtp ? "Invalid verification code" : "Failed to send verification code"
      );
    } finally {
      setIsPending(false);
    }
  };

  const handleGoogleSignUp = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  // Helper functions similar to your password reset hook
  const getButtonText = () => {
    if (isPending) return "Please wait...";
    return showOtp ? "Verify code" : "Verify Email";
  };

  const getFormHeading = () => {
    return "Create an account";
  };

  const getFormSubheading = () => {
    return showOtp
      ? `Enter the code sent to ${email}`
      : "Sign up with your email and password";
  };

  return {
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
    error, // Expose the error state
  };
}