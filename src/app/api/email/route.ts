import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { env } from '@/env';

// Only create a real transporter in production
const transporter = env.NODE_ENV === 'production' 
  ? nodemailer.createTransport({
      host: env.EMAIL_SERVER_HOST,
      port: parseInt(env.EMAIL_SERVER_PORT || "587"),
      auth: {
        user: env.EMAIL_SERVER_USER,
        pass: env.EMAIL_SERVER_PASSWORD,
      },
    })
  : null; // No transporter in development

export async function POST(request: Request) {
  try {
    const { email, otp, type } = await request.json();

    // In development, just log the OTP and return success
    if (env.NODE_ENV !== 'production') {
      console.log('==================================');
      console.log(`📧 DEVELOPMENT MODE: Email not actually sent`);
      console.log(`📧 Would have sent email to: ${email}`);
      console.log(`📧 OTP: ${otp}`);
      console.log(`📧 Type: ${type || 'registration'}`);
      console.log('==================================');
      return NextResponse.json({ success: true });
    }

    // In production, actually send the email
    await transporter?.sendMail({
      from: `"FormAI" <${env.EMAIL_FROM}>`,
      to: email,
      subject: "Verification code for FormAI",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
          <h2>Your OTP Code</h2>
          <p style="font-size: 32px;">Your OTP code is <strong>${otp}</strong>.</p>
          <p style="font-size: 14px;">It is valid for 5 minutes.</p>
          <p style="color: #888;">Thank you for using our service!</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email sending failed:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}