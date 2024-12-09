"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from 'next/link';

export default function PasswordReset() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password

  // Update the handleSubmit function in your PasswordReset component
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Create request body based on current step
  const requestBody = {
    step,
    email,
    ...(step >= 2 && { otp }),
    ...(step === 3 && { newPassword })
  };

  console.log("Request Body:", requestBody);

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
        setMessage("Password reset successfully.");
      }
    } else {
      const errorData = await response.json();
      setMessage(errorData.error || "An error occurred.");
    }
  } catch (error) {
    setMessage("An error occurred. Please try again.");
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <Card className="p-6">
          <h1 className="text-xl font-bold mb-1">{getHeading()}</h1>
          <p className="mb-6 text-sm text-secondary-foreground/70">
            {getSubheading()}
          </p>
          
          <form onSubmit={handleSubmit}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="mt-1 w-full rounded-md border px-3"
              disabled={step !== 1}
            />
            
            {step >= 2 && (
              <Input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
                className="mt-4 w-full rounded-md border px-3"
              />
            )}
            
            {step === 3 && (
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="mt-4 w-full rounded-md border px-3"
              />
            )}

            <Button type="submit" className="w-full mt-6">
              {getButtonText()}
            </Button>

            {message && (
              <p className={`mt-4 text-center ${
                message.includes("success") ? "text-green-500" : "text-red-500"
              }`}>
                {message}
              </p>
            )}
          </form>

          <div className="flex justify-between items-center mt-4">
            <Button asChild size="sm" variant="link">
              <Link href="/signin">Already have an account? Sign in</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}