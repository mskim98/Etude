"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from "@/store/auth";
import type { UserRole } from "@/types";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Debug function for testing email check
async function testEmailCheck() {
	try {
		console.log("=== 이메일 중복 확인 함수 테스트 ===");

		// Test with known email
		const { data: existingData, error: existingError } = await supabase.rpc("check_email_duplicate", {
			email_to_check: "msung98@naver.com", // Known existing email
		});
		console.log("기존 이메일 테스트:", { existingData, existingError });

		// Test with new email
		const { data: newData, error: newError } = await supabase.rpc("check_email_duplicate", {
			email_to_check: "test" + Date.now() + "@example.com", // New email
		});
		console.log("새 이메일 테스트:", { newData, newError });

		console.log("=== 테스트 완료 ===");
	} catch (err) {
		console.error("테스트 실패:", err);
	}
}

// Expose for manual testing in console
if (typeof window !== "undefined") {
	(window as any).testEmailCheck = testEmailCheck;
}

interface SignUpPageProps {
	onNavigate: (page: "landing" | "login") => void;
	onSignUpSuccess?: () => void;
}

export function SignUpPage({ onNavigate, onSignUpSuccess }: SignUpPageProps) {
	const searchParams = useSearchParams();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		role: "student" as UserRole,
		university: "",
		major: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [step, setStep] = useState<"form" | "email-verification" | "admin-approval">(
		(searchParams.get("step") as any) || "form"
	);
	const [emailChecked, setEmailChecked] = useState(false);
	const [emailChecking, setEmailChecking] = useState(false);
	const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

	// Zustand store에서 인증 관련 함수들 가져오기
	const { signUp, sendEmailVerification, checkEmailVerification, clearAuthData, error: authError } = useAuthStore();

	/**
	 * 회원가입 폼 제출 처리 함수
	 * 1. 이메일 중복 검사 확인
	 * 2. 비밀번호 일치 및 길이 검증
	 * 3. Supabase 회원가입 요청 (이메일 인증 링크 발송)
	 */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(""); // 에러 상태 초기화
		setIsLoading(true); // 로딩 시작

		try {
			// 1. 이메일 중복 검사 완료 여부 확인
			if (!emailChecked || !emailAvailable) {
				setError("이메일 중복 검사를 완료해주세요.");
				return;
			}

			// 2. 비밀번호 검증
			if (formData.password !== formData.confirmPassword) {
				setError("비밀번호가 일치하지 않습니다.");
				return;
			}

			if (formData.password.length < 6) {
				setError("비밀번호는 최소 6자 이상이어야 합니다.");
				return;
			}

			// 3. Supabase를 통한 회원가입 요청 (이메일 인증 링크 자동 발송)
			await signUp(
				formData.email,
				formData.password,
				formData.name,
				formData.role,
				formData.university,
				formData.major
			);

			// Move to email verification step
			setStep("email-verification");
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * 입력 필드 값 변경 처리 함수
	 * 이메일 변경 시 중복 검사 상태 초기화
	 */
	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));

		// 이메일이 변경되면 중복 검사 상태 초기화
		if (field === "email") {
			setEmailChecked(false);
			setEmailAvailable(null);
		}
	};

	/**
	 * 이메일 중복 검사 함수
	 * 1. 이메일 형식 검증
	 * 2. Supabase RPC 함수 호출 (check_email_duplicate)
	 * 3. 10초 타임아웃 설정으로 무한 대기 방지
	 */
	const handleCheckEmail = async () => {
		if (!formData.email) {
			setError("이메일을 입력해주세요.");
			return;
		}

		// 기본 이메일 형식 검증
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			setError("올바른 이메일 형식을 입력해주세요.");
			return;
		}

		setEmailChecking(true); // 중복 검사 로딩 시작
		setError(""); // 에러 상태 초기화
		console.log("이메일 중복 확인 시작:", formData.email);

		// Debug: Check Supabase connection and environment
		try {
			console.log("Environment Check:");
			console.log("- NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ 설정됨" : "❌ 없음");
			console.log(
				"- NEXT_PUBLIC_SUPABASE_ANON_KEY:",
				process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ 설정됨" : "❌ 없음"
			);
			console.log("- Supabase client:", supabase ? "✓ 생성됨" : "❌ 없음");
		} catch (dbgErr) {
			console.error("환경 변수 확인 실패:", dbgErr);
		}

		try {
			// Use the check_email_duplicate function with timeout
			const timeoutPromise = new Promise((_, reject) =>
				setTimeout(() => reject(new Error("요청 시간이 초과되었습니다. 다시 시도해주세요.")), 10000)
			);

			const rpcPromise = supabase.rpc("check_email_duplicate", {
				email_to_check: formData.email,
			});

			const { data, error } = (await Promise.race([rpcPromise, timeoutPromise])) as any;

			console.log("RPC 응답:", { data, error });

			if (error) {
				console.error("RPC 에러:", error);
				setError(`이메일 확인에 실패했습니다: ${error.message || error.code || "Unknown error"}`);
				return;
			}

			// data is boolean: true if email exists, false if available
			const emailExists = data as boolean;
			const isAvailable = !emailExists;

			console.log("이메일 중복 확인 결과:", { emailExists, isAvailable });

			setEmailAvailable(isAvailable);
			setEmailChecked(true);

			if (!isAvailable) {
				setError("이미 사용 중인 이메일입니다.");
			} else {
				console.log("사용 가능한 이메일입니다.");
			}
		} catch (err) {
			console.error("이메일 확인 중 예외 발생:", err);

			// More detailed error handling
			if (err instanceof Error) {
				if (err.message.includes("시간이 초과")) {
					setError("서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.");
				} else if (err.message.includes("NetworkError") || err.message.includes("fetch")) {
					setError("네트워크 연결을 확인하고 다시 시도해주세요.");
				} else {
					setError(`이메일 확인에 실패했습니다: ${err.message}`);
				}
			} else {
				setError("이메일 확인에 실패했습니다. 다시 시도해주세요.");
			}
		} finally {
			setEmailChecking(false);
			console.log("이메일 중복 확인 완료");
		}
	};

	// Email verification step
	if (step === "email-verification") {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
				<Card className="w-full max-w-md border-0 shadow-lg">
					<CardContent className="p-8 text-center">
						<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
								<span className="text-white text-lg">📧</span>
							</div>
						</div>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">이메일 인증이 필요합니다</h2>
						<p className="text-gray-600 mb-6">
							{formData.email}로 인증 이메일을 보내드렸습니다.
							<br />
							이메일을 확인하고 인증 링크를 클릭해주세요.
						</p>

						<div className="space-y-3">
							<Button onClick={() => onNavigate("landing")} variant="outline" className="w-full">
								뒤로 가기
							</Button>
						</div>

						{authError && (
							<Alert className="mt-4 bg-red-50 border-red-200">
								<AlertDescription className="text-red-800">{authError}</AlertDescription>
							</Alert>
						)}
					</CardContent>
				</Card>
			</div>
		);
	}

	// Admin approval step
	if (step === "admin-approval") {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
				<Card className="w-full max-w-md border-0 shadow-lg">
					<CardContent className="p-8 text-center">
						<div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
								<span className="text-white text-lg">⏳</span>
							</div>
						</div>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">회원가입 완료!</h2>
						<p className="text-gray-600 mb-6">
							이메일 인증이 완료되었습니다.
							<br />
							관리자가 계정을 승인할 때까지 잠시 기다려주세요.
							<br />
							승인 완료 시 이메일로 알려드리겠습니다.
						</p>

						<div className="space-y-3">
							<Button onClick={() => onNavigate("login")} className="w-full">
								로그인 페이지로 이동
							</Button>

							<Button onClick={() => setStep("form")} variant="outline" className="w-full">
								다시 회원가입
							</Button>

							{/* Debug button for clearing auth data */}
							{process.env.NODE_ENV === "development" && (
								<Button
									onClick={async () => {
										await clearAuthData();
										window.location.reload();
									}}
									variant="destructive"
									className="w-full text-xs"
								>
									🔧 인증 데이터 정리 (개발용)
								</Button>
							)}
						</div>
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

					<h1 className="text-2xl font-semibold text-gray-900 mb-2">Create Account</h1>
					<p className="text-gray-600">Join thousands of students improving their scores</p>
				</div>

				{/* Sign Up Form */}
				<Card className="border-0 shadow-lg">
					<CardHeader>
						<CardTitle className="text-center">Sign Up</CardTitle>
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
								<Label htmlFor="name">Full Name</Label>
								<Input
									id="name"
									type="text"
									placeholder="Enter your full name"
									value={formData.name}
									onChange={(e) => handleInputChange("name", e.target.value)}
									required
									className="h-11"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="university">University (Optional)</Label>
								<Input
									id="university"
									type="text"
									placeholder="Enter your university"
									value={formData.university}
									onChange={(e) => handleInputChange("university", e.target.value)}
									className="h-11"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="major">Major (Optional)</Label>
								<Input
									id="major"
									type="text"
									placeholder="Enter your major"
									value={formData.major}
									onChange={(e) => handleInputChange("major", e.target.value)}
									className="h-11"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<div className="flex gap-2">
									<Input
										id="email"
										type="email"
										placeholder="Enter your email"
										value={formData.email}
										onChange={(e) => handleInputChange("email", e.target.value)}
										required
										className="h-11 flex-1"
									/>
									<Button
										type="button"
										onClick={handleCheckEmail}
										disabled={emailChecking || !formData.email}
										variant="outline"
										className="h-11 px-4 whitespace-nowrap"
									>
										{emailChecking ? (
											<div className="flex items-center gap-2">
												<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
												확인 중...
											</div>
										) : emailChecked && emailAvailable ? (
											"✓ 사용가능"
										) : (
											"중복확인"
										)}
									</Button>
								</div>

								{/* Email status indicators */}
								{emailChecked && emailAvailable && (
									<p className="text-sm text-green-600">✓ 사용 가능한 이메일입니다.</p>
								)}
								{emailChecked && !emailAvailable && (
									<p className="text-sm text-red-600">이미 사용 중인 이메일입니다.</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Create a password"
										value={formData.password}
										onChange={(e) => handleInputChange("password", e.target.value)}
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

							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Confirm Password</Label>
								<div className="relative">
									<Input
										id="confirmPassword"
										type={showConfirmPassword ? "text" : "password"}
										placeholder="Confirm your password"
										value={formData.confirmPassword}
										onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
										required
										className="h-11 pr-10"
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									>
										{showConfirmPassword ? (
											<EyeOff className="h-4 w-4 text-gray-400" />
										) : (
											<Eye className="h-4 w-4 text-gray-400" />
										)}
									</Button>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="role">Role</Label>
								<Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
									<SelectTrigger className="h-11">
										<SelectValue placeholder="Select your role" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="student">Student</SelectItem>
										<SelectItem value="teacher">Teacher</SelectItem>
										<SelectItem value="admin">Admin</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{error && (
								<Alert className="bg-red-50 border-red-200">
									<AlertDescription className="text-red-800">{error}</AlertDescription>
								</Alert>
							)}

							<Button type="submit" className="w-full h-11" disabled={isLoading || !emailChecked || !emailAvailable}>
								{isLoading ? "Creating Account..." : "Create Account"}
							</Button>

							{(!emailChecked || !emailAvailable) && (
								<p className="text-sm text-amber-600 text-center">이메일 중복 확인을 완료해주세요.</p>
							)}
						</form>

						<div className="mt-6 text-center">
							<p className="text-gray-600">
								Already have an account?{" "}
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
