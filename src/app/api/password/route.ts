// api/password/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import bcrypt from 'bcryptjs';
import { generateAndSendOtp } from '@/app/actions/auth';
import { z } from 'zod';
import { otpVerificationSchema, passwordResetSchema } from '@/schema';
import { emailSchema } from '@/schema';


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { step } = body;

    // Validate user exists first
    const user = await db.user.findUnique({ 
      where: { email: body.email } 
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User does not exist.' }, 
        { status: 404 }
      );
    }

    // Handle different steps
    switch (step) {
      case 1: {
        // Validate email step
        await emailSchema.parseAsync(body);
        
        // Generate and send OTP
        try {
          await generateAndSendOtp(body.email, "password-reset", "require");
          return NextResponse.json({ success: true });
        } catch (otpError) {
          console.error('OTP generation or sending failed:', otpError);
          return NextResponse.json(
            { error: 'Failed to send OTP' }, 
            { status: 500 }
          );
        }
      }

      case 2: {
        // Validate OTP step
        await otpVerificationSchema.parseAsync(body);
        
        // Verify OTP
        const otpRecord = await db.otp.findFirst({
          where: {
            email: body.email,
            otp: body.otp,
            expiresAt: {
              gte: new Date(),
            },
          },
        });

        if (!otpRecord) {
          return NextResponse.json(
            { error: 'Invalid or expired OTP.' }, 
            { status: 400 }
          );
        }

        return NextResponse.json({ success: true });
      }

      case 3: {
        // Validate password reset step
        await passwordResetSchema.parseAsync(body);
        
        // Verify OTP again for security
        const otpRecord = await db.otp.findFirst({
          where: {
            email: body.email,
            otp: body.otp,
            expiresAt: {
              gte: new Date(),
            },
          },
        });

        if (!otpRecord) {
          return NextResponse.json(
            { error: 'Invalid or expired OTP.' }, 
            { status: 400 }
          );
        }

        // Hash and update password
        const hash = await bcrypt.hash(body.newPassword, 10);
        await db.user.update({
          where: { email: body.email },
          data: { password: hash },
        });

        // Clean up OTP
        await db.otp.delete({ where: { id: otpRecord.id } });
        
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid step' }, 
          { status: 400 }
        );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map(e => e.message).join(", ") }, 
        { status: 400 }
      );
    }
    console.error('Password operation failed:', error);
    return NextResponse.json(
      { error: 'Failed to process request' }, 
      { status: 500 }
    );
  }
}