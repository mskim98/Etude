"use client";

import { useRouter } from "next/navigation";
import { MockExamPage } from "@/components/MockExamPage";
import type { Subject } from "@/types";

export default function APExamPage() {
	const router = useRouter();

	// Mock AP subject data for testing
	const subject: Subject = {
		id: "ap-chemistry",
		name: "AP Chemistry",
		type: "AP",
		progress: 75,
		totalChapters: 6,
		completedChapters: 4,
		lastScore: 4,
		icon: "🧪",
		examDate: new Date("2025-05-15"),
		sectionProgress: {
			reading: {
				progress: 80,
				completed: false,
				score: undefined,
			},
			writing: {
				progress: 70,
				completed: false,
				score: undefined,
			},
			math: {
				progress: 85,
				completed: false,
				score: undefined,
			},
		},
	};

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
