import { z } from "zod";

export const signupSchema = z.object({
  firstName: z
    .string()
    .min(2)
    .max(50),

  lastName: z
    .string()
    .min(2)
    .max(50),

  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9@._]+$/),

  phone: z
    .string()
    .min(10)
    .max(20),

  password: z
    .string()
    .min(12)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
});



export const verifySignupOTPSchema = z.object({
  phone: z
    .string()
    .min(10)
    .max(20),

  otp: z
    .string()
    .length(6),
});



export const loginSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30),

  password: z
    .string()
    .min(1),
});