import { object, string, z } from "zod";


// Password complexity requirements
export const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");


// User signup schema
export const signUpSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
  password: passwordSchema,
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
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must contain only numbers"),
  type: z.enum(["registration", "password-reset", "email-verification"])
});

export const passwordResetSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
  newPassword: z.string({ required_error: "New password is required" })
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be at most 32 characters long"),
  step: z.literal(3)
});
