"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { useLoginForm } from "../hooks/useAuthForm";

interface LoginFormProps {
	onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
	const [showPassword, setShowPassword] = React.useState(false);
	const { form, onSubmit, isLoading, error } = useLoginForm();

	const {
		register,
		formState: { errors },
	} = form;

	React.useEffect(() => {
		if (onSuccess && !isLoading && !error) {
			onSuccess();
		}
	}, [onSuccess, isLoading, error]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
					<CardDescription className="text-gray-600">Sign in to your account</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={onSubmit} className="space-y-4">
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
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
								<Input
									{...register("password")}
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="Enter your password"
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

						<div className="flex items-center justify-between">
							<Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
								Forgot password?
							</Link>
						</div>

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Signing in..." : "Sign In"}
						</Button>

						<div className="text-center">
							<p className="text-sm text-gray-600">
								Don't have an account?{" "}
								<Link href="/auth/signup" className="text-blue-600 hover:underline">
									Sign up
								</Link>
							</p>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
