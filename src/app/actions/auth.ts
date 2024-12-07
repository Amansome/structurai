"use server";

import { signUpSchema } from "@/schema";
import { db } from "@/server/db";
import { ZodError } from "zod";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/server/auth";
import { AuthError } from "next-auth";
import nodemailer from "nodemailer";
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
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"Your App" <cs@mzed.studio>',
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
  });
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

    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      return "User already exists";
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
    
  } catch (error) {
    if (error instanceof ZodError) {
      return error.errors.map((error) => error.message).join(", ");
    }
  }
}