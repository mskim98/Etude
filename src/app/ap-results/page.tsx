"use client";

import { useRouter } from "next/navigation";
import { APResultsPage } from "@/components/features/ap/results/APResultsPage";

export default function APResults() {
	const router = useRouter();

	const handleRetryExam = () => {
		// AP 시험 재시도 - AP 시험 페이지로 이동
		router.push("/ap-exam");
	};

	return (
		<APResultsPage
			onNavigate={(page) => {
				// Next.js 라우팅으로 페이지 이동
				router.push(`/${page}`);
			}}
			onRetryExam={handleRetryExam}
		/>
	);
}
