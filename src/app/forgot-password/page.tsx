"use client";

import { useRouter } from "next/navigation";
import { ForgotPasswordPage } from "@/components/ForgotPasswordPage";

export default function ForgotPassword() {
	const router = useRouter();

	return (
		<ForgotPasswordPage
			onNavigate={(page) => {
				// Next.js 라우팅으로 페이지 이동
				router.push(`/${page}`);
			}}
		/>
	);
}
