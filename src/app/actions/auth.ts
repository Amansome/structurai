"use server";

import { signUpSchema } from "@/schema";
import { db } from "@/server/db";
import { ZodError } from "zod";
import bcrypt from 'bcryptjs';

export async function register(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const { email, password } = await signUpSchema.parseAsync({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const user = await db.user.findUnique({
        where: {
           email: email,
           },
    });

    if (!user) {
        return "User already exists";
    }

    const hash = await bcrypt.hash(password, 10);

    await db.user.create({
        data: {
            email: email,
            password: hash,
        },
    });
    


  } catch (error) {
    if (error instanceof ZodError) {
      return error.errors.map((error) => error.message).join(", ");
    }
  }
}
