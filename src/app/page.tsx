"use client";

import { useRouter } from "next/navigation";
import { LandingPage } from "@/components/LandingPage";

export default function Home() {
	const router = useRouter();

	return (
		<LandingPage
			onNavigate={(page) => {
				// Next.js 라우팅으로 페이지 이동
				router.push(`/${page}`);
			}}
			onDevLogin={() => {
				// 개발자 로그인 - 대시보드로 바로 이동
				router.push("/dashboard");
			}}
		/>
	);
}
