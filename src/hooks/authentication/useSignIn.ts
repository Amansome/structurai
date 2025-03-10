"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { authenticate } from "@/app/actions/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function useSignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [oauthError, setOauthError] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "OAuthAccountNotLinked") {
      setOauthError(
        "You already created account using your email and password."
      );
      router.replace("/signin");
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("redirectTo", "/dashboard");

      const result = await authenticate(undefined, formData);

      if (result?.success) {
        router.push("/dashboard");
      } else if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  const getButtonText = () => {
    return isPending ? "Signing in..." : "Sign in";
  };

  const getFormHeading = () => {
    return "Sign in to your account";
  };

  const getFormSubheading = () => {
    return "Sign in with your email and password";
  };

  return {
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
  };
}
