import { z } from "zod";

// Login form validation schema
export const loginSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(1, "Password is required"),
});

// Sign up form validation schema
export const signUpSchema = z
	.object({
		email: z.string().email("Please enter a valid email address"),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Password must contain at least one uppercase letter, one lowercase letter, and one number"
			),
		confirmPassword: z.string(),
		name: z.string().min(2, "Name must be at least 2 characters"),
		university: z.string().optional(),
		major: z.string().optional(),
		role: z.enum(["student", "teacher", "admin"]).default("student"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

// Forgot password form validation schema
export const forgotPasswordSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
});

// Validation helper functions
export const validateEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
	return password.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
};

export const getPasswordStrength = (password: string): "weak" | "medium" | "strong" => {
	if (password.length < 6) return "weak";
	if (password.length < 10) return "medium";
	return "strong";
};
