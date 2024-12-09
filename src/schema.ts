import { object, string, z } from "zod";

export const signUpSchema = object({
  email: string({ required_error: "Email is required" })
    .email("Invalid email address"),
  password: string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be at most 32 characters long"),
});

export const signInSchema = object({
    email: string({ required_error: "Email is required" }).email("Invalid email address"),
    password: string({ required_error: "Password is required" })
  });



// Separate schemas for each step
export const emailSchema = z.object({
  email: z.string({ required_error: "Email is required" })
    .email("Invalid email address"),
  step: z.literal(1)
});

export const otpVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string({ required_error: "OTP is required" })
    .length(6, "OTP must be exactly 6 digits"),
  step: z.literal(2)
});

export const passwordResetSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
  newPassword: z.string({ required_error: "New password is required" })
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be at most 32 characters long"),
  step: z.literal(3)
});
