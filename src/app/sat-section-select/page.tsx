"use client";

import { useRouter } from "next/navigation";
import { SATSectionSelectPage } from "@/components/SATSectionSelectPage";
import type { Subject } from "@/types";

export default function SATSectionSelect() {
	const router = useRouter();

	// Mock SAT Practice Test data with section progress
	const mockSATTest: Subject = {
		id: "sat-test-1",
		name: "SAT Practice Test 1",
		type: "SAT",
		progress: 100,
		totalChapters: 3,
		completedChapters: 3,
		lastScore: 1550,
		icon: "🎯",
		examDate: new Date("2025-05-15"),
		sectionProgress: {
			reading: {
				completed: true,
				score: 380,
				correctAnswers: 45,
				totalQuestions: 52,
				timeSpent: 60,
			},
			writing: {
				completed: true,
				score: 390,
				correctAnswers: 40,
				totalQuestions: 44,
				timeSpent: 35,
			},
			math: {
				completed: true,
				score: 780,
				correctAnswers: 52,
				totalQuestions: 58,
				timeSpent: 70,
			},
		},
	};

	return (
		<SATSectionSelectPage
			selectedTest={mockSATTest}
			onNavigate={(page) => {
				// Next.js 라우팅으로 페이지 이동
				router.push(`/${page}`);
			}}
			onStartSection={(section) => {
				console.log("Starting section:", section);
				// 실제 시험 페이지로 이동
				router.push("/exam");
			}}
		/>
	);
}
