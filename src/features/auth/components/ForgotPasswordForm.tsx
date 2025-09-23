"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useForgotPasswordForm } from "../hooks/useAuthForm";

interface ForgotPasswordFormProps {
	onSuccess?: () => void;
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
	const [isSuccess, setIsSuccess] = React.useState(false);
	const { form, onSubmit, isLoading, error } = useForgotPasswordForm();

	const {
		register,
		formState: { errors },
	} = form;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await onSubmit(e);
			setIsSuccess(true);
			if (onSuccess) {
				setTimeout(onSuccess, 3000);
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
								We&apos;ve sent a password reset link to your email address. Please check your inbox and follow the
								instructions to reset your password.
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
					<CardTitle className="text-2xl font-bold text-gray-900">Reset Password</CardTitle>
					<CardDescription className="text-gray-600">
						Enter your email address and we&apos;ll send you a link to reset your password
					</CardDescription>
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

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Sending..." : "Send Reset Link"}
						</Button>

						<div className="text-center">
							<Link href="/auth/login" className="inline-flex items-center text-sm text-blue-600 hover:underline">
								<ArrowLeft className="w-4 h-4 mr-1" />
								Back to Login
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
