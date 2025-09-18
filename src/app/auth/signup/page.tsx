"use client";

import { useRouter } from "next/navigation";
import { SignUpForm } from "@/features/auth";

export default function SignUp() {
	const router = useRouter();

	const handleSignUpSuccess = () => {
		// 회원가입 성공 시 로그인 페이지로 이동
		router.push("/auth/login");
	};

	return <SignUpForm onSuccess={handleSignUpSuccess} />;
}
