import { z } from "zod";
import type { UserRole } from "@/types";

// Sign up validation schema
export const signUpSchema = z
	.object({
		name: z.string().min(2, "Name must be at least 2 characters"),
		email: z.string().email("Invalid email address"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string(),
		role: z.enum(["student", "teacher", "admin"] as const).default("student"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

// Sign in validation schema
export const signInSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(1, "Password is required"),
});

// Profile update validation schema
export const profileUpdateSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters").optional(),
	university: z.string().optional(),
	major: z.string().optional(),
	gpa: z.number().min(0).max(4.0).optional(),
	ap_score: z.number().min(0).max(5).optional(),
	sat_score: z.number().min(400).max(1600).optional(),
});

// Password reset validation schema
export const passwordResetSchema = z.object({
	email: z.string().email("Invalid email address"),
});

// Service access request validation schema
export const serviceAccessSchema = z.object({
	serviceId: z.string().uuid("Invalid service ID"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type ServiceAccessInput = z.infer<typeof serviceAccessSchema>;
