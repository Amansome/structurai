"use server";

import { signUpSchema } from "@/schema";
import { db } from "@/server/db";
import { ZodError } from "zod";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/server/auth";
import { AuthError } from "next-auth";
import { addMinutes } from "date-fns";

export async function SignOut() {
  await signOut();
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Please enter correct email and password.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

async function sendOtp(email: string, otp: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/email`, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  });

  if (!response.ok) {
    throw new Error('Failed to send OTP email');
  }
}

export async function generateAndSendOtp(email: string) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
  const expiresAt = addMinutes(new Date(), 5); // Set expiration time to 5 minutes

  await db.otp.create({
    data: {
      email,
      otp,
      expiresAt,
    },
  });

  await sendOtp(email, otp);
}

export async function register(
  prevState: string | undefined,
  formData: FormData,
) {
  const otp = formData.get("otp") as string;

  try {
    const { email, password } = await signUpSchema.parseAsync({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // Check if the user already exists
    const existingUser = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      // Check if the user signed up with Google
      const googleAccount = await db.account.findFirst({
        where: {
          userId: existingUser.id,
          provider: 'google',
        },
      });

      if (googleAccount) {
        return "You have already signed up with Google. Please sign in using Google.";
      }

      return "User already exists. Please sign in with your Email and password.";
    }

    const otpRecord = await db.otp.findFirst({
      where: {
        email,
        otp,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!otpRecord) {
      return "Invalid or expired OTP.";
    }

    const hash = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        email: email,
        password: hash,
      },
    });

    await db.otp.delete({
      where: { id: otpRecord.id },
    });

    // Log the user in after successful registration
    await signIn("credentials", { email, password });

  } catch (error) {
    if (error instanceof ZodError) {
      return error.errors.map((error) => error.message).join(", ");
    }
  }
}