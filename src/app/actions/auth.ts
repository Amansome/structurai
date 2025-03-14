"use server";

import { env } from "@/env";
import { logger } from "@/lib/logger";
import { signUpSchema, passwordSchema } from "@/schema";
import { signIn } from "@/server/auth";
import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import { addMinutes } from "date-fns";
import { AuthError } from "next-auth";
import { ZodError } from "zod";


// Define the AuthenticateResponse type interface
export interface AuthenticateResponse {
  error: string | null;
  success: boolean;
}

export async function authenticate(
  _prevState: AuthenticateResponse | undefined,
  formData: FormData
): Promise<AuthenticateResponse> {

  const redirectTo = formData.get("redirectTo") as string || "/dashboard";
  try {
    // Instead of returning "success", return the result directly
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false // Prevent Next Auth from handling redirects
    });

    if (result?.error) {
      return { error: "Please enter correct email and password.", success: false };
    }

    return { error: null, success: true }; 
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {error: "Please enter correct email and password.", success: false};
        default:
          return { error: "Something went wrong.", success: false };
      }
    }
    throw error;
  }
}

export async function sendOtp(email: string, otp: string, type: string) {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_BASE_URL}/api/email`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp, type }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      logger.error("Failed to send OTP email:", errorData);
      throw new Error(`Failed to send OTP email: ${errorData.message || response.statusText}`);
    }
    
    return true;
  } catch (error) {
    logger.error("Error sending OTP:", error);
    throw error;
  }
}

export async function generateAndSendOtp(
  email: string, 
  type = "registration", 
  existenceCheck = "prevent" // "prevent", "require", or "none"
) {
  try {
    // Check user existence based on the existenceCheck parameter
    if (existenceCheck !== "none") {
      const existingUser = await db.user.findUnique({
        where: { email }
      });

      if (existenceCheck === "prevent" && existingUser) {
        // For registration: prevent if user exists
        // Check if the user signed up with Google
        const googleAccount = await db.account.findFirst({
          where: {
            userId: existingUser.id,
            provider: 'google',
          },
        });

        if (googleAccount) {
          throw new Error("You have already signed up with Google. Please sign in using Google.");
        }

        throw new Error("User already exists. Please sign in with your Email and password.");
      } else if (existenceCheck === "require" && !existingUser) {
        // For password reset: require that user exists
        throw new Error("No account found with this email address.");
      }
    }
    
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = addMinutes(new Date(), 10); // Set expiration time to 10 minutes
    
    // Use a transaction to ensure data consistency
    await db.$transaction(async (tx) => {
      // Invalidate any existing OTPs for this email and type
      await tx.otp.updateMany({
        where: {
          email,
          type,
          status: {
            in: ["pending", "verified"]
          }
        },
        data: {
          status: "expired"
        }
      });

      // Create new OTP
      await tx.otp.create({
        data: {
          email,
          otp,
          expiresAt,
          type,
          status: "pending"
        },
      });
    });

    await sendOtp(email, otp, type);
    return "OTP sent successfully. Please check your email.";
  } catch (error) {
    logger.error("Error generating OTP:", {
      message: "Failed to generate and send OTP",
      error: error instanceof Error ? { message: error.message, stack: error.stack } : String(error),
    });
    
    // Re-throw the error with its original message if it's already an Error object
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error("Failed to generate and send OTP. Please try again.");
  }
}

type OtpVerificationResult = {
  verified: boolean;
  message?: string;
  otpId?: string;
};

export async function verifyOtp(email: string, otp: string, type: string): Promise<OtpVerificationResult> {
  try {
    // In development mode, automatically verify any OTP
    if (env.NODE_ENV !== 'production') {
      console.log('==================================');
      console.log(`🔑 DEVELOPMENT MODE: Auto-verifying OTP`);
      console.log(`🔑 Email: ${email}`);
      console.log(`🔑 OTP: ${otp}`);
      console.log(`🔑 Type: ${type}`);
      console.log('==================================');
      
      // Find or create an OTP record for development
      const otpRecord = await db.otp.findFirst({
        where: {
          email,
          type,
        },
      });
      
      const otpId = otpRecord?.id || 'dev-auto-verified';
      
      return { 
        verified: true, 
        otpId: otpId
      };
    }
    
    // Production verification logic
    let result: OtpVerificationResult = {
      verified: false,
      message: "Invalid or expired OTP."
    };
    
    await db.$transaction(async (tx) => {
      const otpRecord = await tx.otp.findFirst({
        where: {
          email,
          otp,
          type,
          status: "pending",
          expiresAt: {
            gte: new Date(),
          },
        },
      });

      if (!otpRecord) {
        return;
      }

      // Mark OTP as verified
      await tx.otp.update({
        where: { id: otpRecord.id },
        data: { status: "verified" }
      });

      result = { 
        verified: true, 
        otpId: otpRecord.id 
      };
    });

    return result;
  } catch (error) {
    logger.error("Error verifying OTP:", error);
    return { 
      verified: false, 
      message: "Error verifying OTP. Please try again." 
    };
  }
}

export async function register(
  prevState: string | undefined,
  formData: FormData,
) {
  const otp = formData.get("otp") as string;

  try {
    // Validate input data
    const validationResult = await signUpSchema.safeParseAsync({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validationResult.success) {
      return validationResult.error.errors.map((error) => error.message).join(", ");
    }

    const { email, password } = validationResult.data;

    // Check if the user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
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

    // Validate password complexity
    const passwordValidation = passwordSchema.safeParse(password);
    if (!passwordValidation.success) {
      return passwordValidation.error.errors.map((error) => error.message).join(", ");
    }

    // Verify OTP
    const otpVerification = await verifyOtp(email, otp, "registration");
    if (!otpVerification.verified) {
      return otpVerification.message || "Invalid OTP.";
    }

    // Special handling for development mode auto-verification
    const isDevAutoVerified = otpVerification.otpId === 'dev-auto-verified';
    
    if (!isDevAutoVerified && !otpVerification.otpId) {
      return "OTP verification failed. Please try again.";
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);
    
    // Use a transaction for user creation and related operations
    await db.$transaction(async (tx) => {
      // Create user - directly set emailVerified and isActive
      const user = await tx.user.create({
        data: {
          email,
          password: hash,
          emailVerified: new Date(), // Mark as verified immediately
          isActive: true, // Set account as active
        },
      });

      // Mark OTP as used (only in production or if we have a real OTP ID)
      if (!isDevAutoVerified && otpVerification.otpId) {
        await tx.otp.update({
          where: { id: otpVerification.otpId },
          data: { status: "used" }
        });
      }
    });

    return null; // Success - no error message
  } catch (error) {
    logger.error("Error during registration:", error);
    if (error instanceof ZodError) {
      return error.errors.map((error) => error.message).join(", ");
    }
    return "An error occurred during registration. Please try again.";
  }
}