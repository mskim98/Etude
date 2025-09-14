"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, ArrowLeft, Mail } from "lucide-react";
import { useAuthStore } from "@/store/auth";

interface ForgotPasswordPageProps {
	onNavigate: (page: "landing" | "login") => void;
}

export function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState("");

	const { resetPassword, error: authError } = useAuthStore();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			await resetPassword(email);
			setIsSuccess(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	if (isSuccess) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
				<Card className="w-full max-w-md border-0 shadow-lg">
					<CardContent className="p-8 text-center">
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<Mail className="w-8 h-8 text-green-500" />
						</div>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">Check Your Email</h2>
						<p className="text-gray-600 mb-4">
							We&apos;ve sent a password reset link to <strong>{email}</strong>
						</p>
						<p className="text-sm text-gray-500 mb-6">
							Please check your email and follow the instructions to reset your password.
						</p>
						<Button onClick={() => onNavigate("login")} className="w-full">
							Back to Login
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
			<div className="w-full max-w-md">
				{/* Header */}
				<div className="text-center mb-8">
					<Button
						variant="ghost"
						onClick={() => onNavigate("landing")}
						className="absolute top-6 left-6 text-gray-600 hover:text-gray-900"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back
					</Button>

					<div className="flex items-center justify-center space-x-2 mb-6">
						<div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
							<BookOpen className="w-6 h-6 text-white" />
						</div>
						<span className="text-2xl font-semibold text-gray-900">ETUDE</span>
					</div>

					<h1 className="text-2xl font-semibold text-gray-900 mb-2">Reset Password</h1>
					<p className="text-gray-600">Enter your email to receive a password reset link</p>
				</div>

				{/* Reset Form */}
				<Card className="border-0 shadow-lg">
					<CardHeader>
						<CardTitle className="text-center">Forgot Password</CardTitle>
					</CardHeader>
					<CardContent>
						{/* Auth Error Alert */}
						{authError && (
							<Alert className="mb-6 bg-red-50 border-red-200">
								<AlertDescription className="text-red-800">{authError}</AlertDescription>
							</Alert>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="h-11"
								/>
							</div>

							{error && (
								<Alert className="bg-red-50 border-red-200">
									<AlertDescription className="text-red-800">{error}</AlertDescription>
								</Alert>
							)}

							<Button type="submit" className="w-full h-11" disabled={isLoading}>
								{isLoading ? "Sending..." : "Send Reset Link"}
							</Button>
						</form>

						<div className="mt-6 text-center">
							<p className="text-gray-600">
								Remember your password?{" "}
								<Button
									variant="link"
									onClick={() => onNavigate("login")}
									className="p-0 h-auto text-blue-600 hover:text-blue-700"
								>
									Sign in
								</Button>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
