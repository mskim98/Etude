"use client";

import { useRouter } from "next/navigation";
import { SignUpPage } from "@/components/SignUpPage";

/**
 * 회원가입 페이지 래퍼 컴포넌트
 * SignUpPage 컴포넌트를 렌더링하고 네비게이션 함수 제공
 */
export default function SignUp() {
	const router = useRouter();

	return (
		<SignUpPage
			onNavigate={(page) => {
				// Next.js 라우팅으로 페이지 이동
				router.push(`/${page}`);
			}}
			onSignUpSuccess={() => {
				// 회원가입 성공 시 로그인 페이지로 이동
				router.push("/login");
			}}
		/>
	);
}
