"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function usePasswordReset() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const requestBody = {
      step,
      email,
      ...(step >= 2 && { otp }),
      ...(step === 2 && { type: "password-reset" }),
      ...(step === 3 && { newPassword })
    };

    try {
      const response = await fetch('/api/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        if (step === 1) {
          setMessage("Check your email for the OTP.");
          setStep(2);
        } else if (step === 2) {
          setStep(3);
          setMessage("");
        } else {
          setMessage("Password reset successfully. Redirecting to sign in...");
          setTimeout(() => {
            router.push('/signin');
          }, 1500);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "An error occurred.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    switch (step) {
      case 1:
        return "Request OTP";
      case 2:
        return "Verify OTP";
      case 3:
        return "Reset Password";
      default:
        return "Request OTP";
    }
  };

  const getHeading = () => {
    switch (step) {
      case 1:
        return "Reset your password";
      case 2:
        return "Enter OTP";
      case 3:
        return "Set New Password";
      default:
        return "Reset your password";
    }
  };

  const getSubheading = () => {
    switch (step) {
      case 1:
        return "Enter your email to receive an OTP for password reset.";
      case 2:
        return "Enter the OTP sent to your email.";
      case 3:
        return "Enter your new password to complete the reset.";
      default:
        return "Enter your email to receive an OTP for password reset.";
    }
  };

  return {
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
  };
}