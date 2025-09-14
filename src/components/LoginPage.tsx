"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/auth";

interface LoginPageProps {
	onNavigate: (page: "landing" | "signup" | "forgot-password") => void;
	onLoginSuccess?: () => void;
}

export function LoginPage({ onNavigate, onLoginSuccess }: LoginPageProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// Zustand store에서 로그인 함수와 에러 상태 가져오기
	const { signIn, error: authError } = useAuthStore();

	/**
	 * 로그인 폼 제출 처리 함수
	 * 1. Zustand store의 signIn 함수 호출
	 * 2. 성공 시 onLoginSuccess 콜백 실행
	 * 3. 실패 시 에러 메시지 표시
	 */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(""); // 에러 상태 초기화
		setIsLoading(true); // 로딩 시작

		try {
			// Zustand store를 통해 로그인 실행
			await signIn(email, password);
			// 로그인 성공 시 부모 컴포넌트에 알림 (자동 리다이렉트 처리됨)
			onLoginSuccess?.();
		} catch (err) {
			// 에러 발생 시 사용자에게 표시할 메시지 설정
			setError(err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
		} finally {
			setIsLoading(false); // 로딩 완료
		}
	};

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

					<h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back</h1>
					<p className="text-gray-600">Sign in to continue your learning journey</p>
				</div>

				{/* Login Form */}
				<Card className="border-0 shadow-lg">
					<CardHeader>
						<CardTitle className="text-center">Sign In</CardTitle>
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

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										className="h-11 pr-10"
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4 text-gray-400" />
										) : (
											<Eye className="h-4 w-4 text-gray-400" />
										)}
									</Button>
								</div>
							</div>

							{error && (
								<Alert className="bg-red-50 border-red-200">
									<AlertDescription className="text-red-800">{error}</AlertDescription>
								</Alert>
							)}

							<div className="flex items-center justify-between">
								<Button
									type="button"
									variant="link"
									onClick={() => onNavigate("forgot-password")}
									className="p-0 h-auto text-blue-600 hover:text-blue-700"
								>
									Forgot password?
								</Button>
							</div>

							<Button type="submit" className="w-full h-11" disabled={isLoading}>
								{isLoading ? "Signing in..." : "Sign In"}
							</Button>
						</form>

						<div className="mt-6 text-center">
							<p className="text-gray-600">
								Don&apos;t have an account?{" "}
								<Button
									variant="link"
									onClick={() => onNavigate("signup")}
									className="p-0 h-auto text-blue-600 hover:text-blue-700"
								>
									Sign up
								</Button>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
