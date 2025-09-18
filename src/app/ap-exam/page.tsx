"use client";

import { useRouter } from "next/navigation";
import { MockExamPage } from "@/components/features/exams/MockExamPage";
import type { Subject } from "@/types";

export default function APExamPage() {
	const router = useRouter();

	const handleExamComplete = (result: any) => {
		// AP 시험 완료 시 AP 결과 페이지로 이동
		console.log("AP Exam completed:", result);
		router.push("/ap-results");
	};

	return (
		<MockExamPage
			subject={subject}
			onExamComplete={handleExamComplete}
			onNavigate={(page) => {
				// Next.js 라우팅으로 페이지 이동
				router.push(`/${page}`);
			}}
		/>
	);
}
