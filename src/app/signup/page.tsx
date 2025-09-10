"use client";

import { useRouter } from "next/navigation";
import { SignUpPage } from "@/components/SignUpPage";

export default function SignUp() {
	const router = useRouter();

	return (
		<SignUpPage
			onNavigate={(page) => {
				// Next.js 라우팅으로 페이지 이동
				router.push(`/${page}`);
			}}
			onSignUp={(user) => {
				// 회원가입 성공 시 대시보드로 이동
				console.log("Sign up:", user);
				router.push("/dashboard");
			}}
		/>
	);
}
