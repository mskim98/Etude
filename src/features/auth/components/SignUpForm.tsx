"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, BookOpen, AlertCircle, CheckCircle } from "lucide-react";
import { useSignUpForm } from "../hooks/useAuthForm";

interface SignUpFormProps {
	onSuccess?: () => void;
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
	const [showPassword, setShowPassword] = React.useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
	const [isSuccess, setIsSuccess] = React.useState(false);

	const { form, onSubmit, isLoading, error } = useSignUpForm();

	const {
		register,
		setValue,
		watch,
		formState: { errors },
	} = form;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await onSubmit(e);
			setIsSuccess(true);
			if (onSuccess) {
				setTimeout(onSuccess, 2000);
			}
		} catch (error) {
			// Error is handled by the form hook
		}
	};

	if (isSuccess) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardContent className="p-6">
						<div className="text-center space-y-4">
							<div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
								<CheckCircle className="w-8 h-8 text-green-600" />
							</div>
							<h2 className="text-xl font-semibold text-gray-900">Check Your Email</h2>
							<p className="text-gray-600">
								We've sent a verification link to your email address. Please check your inbox and click the link to
								verify your account.
							</p>
							<Button asChild className="w-full">
								<Link href="/auth/login">Back to Login</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
					<CardDescription className="text-gray-600">Sign up for a new account</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						{error && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
								<Input
									{...register("email")}
									id="email"
									type="email"
									placeholder="Enter your email"
									className="pl-10"
									disabled={isLoading}
								/>
							</div>
							{errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="name">Full Name</Label>
							<div className="relative">
								<User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
								<Input
									{...register("name")}
									id="name"
									placeholder="Enter your full name"
									className="pl-10"
									disabled={isLoading}
								/>
							</div>
							{errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="university">University</Label>
								<div className="relative">
									<GraduationCap className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
									<Input
										{...register("university")}
										id="university"
										placeholder="University"
										className="pl-10"
										disabled={isLoading}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="major">Major</Label>
								<div className="relative">
									<BookOpen className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
									<Input {...register("major")} id="major" placeholder="Major" className="pl-10" disabled={isLoading} />
								</div>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="role">Role</Label>
							<Select
								defaultValue="student"
								onValueChange={(value) => setValue("role", value as "student" | "teacher" | "admin")}
								disabled={isLoading}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select your role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="student">Student</SelectItem>
									<SelectItem value="teacher">Teacher</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
								<Input
									{...register("password")}
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="Create a password"
									className="pl-10 pr-10"
									disabled={isLoading}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
								>
									{showPassword ? <EyeOff /> : <Eye />}
								</button>
							</div>
							{errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm Password</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
								<Input
									{...register("confirmPassword")}
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									placeholder="Confirm your password"
									className="pl-10 pr-10"
									disabled={isLoading}
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
								>
									{showConfirmPassword ? <EyeOff /> : <Eye />}
								</button>
							</div>
							{errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
						</div>

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Creating account..." : "Create Account"}
						</Button>

						<div className="text-center">
							<p className="text-sm text-gray-600">
								Already have an account?{" "}
								<Link href="/auth/login" className="text-blue-600 hover:underline">
									Sign in
								</Link>
							</p>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
