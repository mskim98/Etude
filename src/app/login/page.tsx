"use client";

import { useRouter } from "next/navigation";
import { LoginPage } from "@/components/LoginPage";

export default function Login() {
	const router = useRouter();

	return (
		<LoginPage
			onNavigate={(page) => {
				// Next.js 라우팅으로 페이지 이동
				router.push(`/${page}`);
			}}
			onLogin={(user) => {
				// 로그인 성공 시 대시보드로 이동
				console.log("Login:", user);
				router.push("/dashboard");
			}}
		/>
	);
}
