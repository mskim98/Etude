"use client";

import { useRouter } from "next/navigation";
import { MockExamPage } from "@/components/features/sat/exams/MockExamPage";
import type { Subject } from "@/types";

export default function ExamPage() {
	const router = useRouter();

	// Mock subject data for testing
	const subject: Subject = {
		id: "sat-test-4",
		name: "SAT Practice Test 4",
		type: "SAT",
		progress: 67,
		totalChapters: 3,
		completedChapters: 2,
		lastScore: undefined,
		icon: "📋",
		examDate: new Date("2025-09-05"),
		sectionProgress: {
			reading: {
				progress: 100,
				completed: true,
				score: 680,
			},
			writing: {
				progress: 0,
				completed: false,
				score: undefined,
			},
			math: {
				progress: 100,
				completed: true,
				score: 750,
			},
		},
	};

	const handleExamComplete = (result: unknown) => {
		// 시험 완료 시 결과 페이지로 이동
		console.log("Exam completed:", result);
		if (subject.type === "SAT") {
			router.push("/sat-results");
		} else {
			router.push("/ap-results");
		}
	};

	return (
		<MockExamPage
			subject={subject}
			onExamComplete={handleExamComplete}
			onNavigate={(page) => {
				// Next.js 라우팅으로 페이지 이동
				router.push(`/${page}`);
			}}
			startImmediately={false} // 기존 동작 유지 - instruction 화면 먼저 보여줌
		/>
	);
}
