"use client";

import { useRouter } from "next/navigation";
import { SATResultsPage } from "@/components/features/sat/results/SATResultsPage";

export default function SATResults() {
	const router = useRouter();

	// Mock data for demonstration
	const mockResult = {
		id: "1",
		subjectId: "sat",
		totalQuestions: 154,
		correctAnswers: 120,
		score: 1550,
		timeSpent: 180,
		completedAt: new Date(),
		mistakes: [],
		questionTypeAnalysis: []
	};

	const mockSubject = {
		id: "sat",
		name: "SAT",
		type: "SAT" as const,
		progress: 100,
		totalChapters: 3,
		completedChapters: 3,
		lastScore: 1550,
		icon: "🎯",
		examDate: new Date("2025-05-15")
	};

	return (
		<SATResultsPage
			result={mockResult}
			subject={mockSubject}
			onNavigate={(page) => {
				// Next.js 라우팅으로 페이지 이동
				router.push(`/${page}`);
			}}
			onRetryExam={() => {
				router.push("/sat-section-select");
			}}
		/>
	);
}
