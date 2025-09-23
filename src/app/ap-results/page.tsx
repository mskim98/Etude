"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { APResultsPage } from "@/components/features/ap/results/APResultsPage";
import { ApServiceImpl } from "@/lib/services/ap";
import { supabase } from "@/lib/supabase";
import type { UserApResult } from "@/types/ap";

function APResultsContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [examResult, setExamResult] = useState<UserApResult | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const resultId = searchParams.get("resultId");
	const examId = searchParams.get("examId");
	const subjectId = searchParams.get("subjectId");

	useEffect(() => {
		const loadExamResult = async () => {
			try {
				if (!resultId) {
					setError("결과 ID가 없습니다.");
					setLoading(false);
					return;
				}

				// 현재 사용자 ID 가져오기
				const {
					data: { user },
				} = await supabase.auth.getUser();
				if (!user) {
					router.push("/auth/login");
					return;
				}

				// AP 서비스를 통해 결과 조회
				const apService = new ApServiceImpl();
				const results = await apService.getUserResults(user.id);

				// 특정 결과 찾기
				const result = results.find((r) => r.id === resultId);
				if (!result) {
					setError("시험 결과를 찾을 수 없습니다.");
					setLoading(false);
					return;
				}

				setExamResult(result);
			} catch (error) {
				console.error("Failed to load exam result:", error);
				setError("시험 결과를 불러오는데 실패했습니다.");
			} finally {
				setLoading(false);
			}
		};

		loadExamResult();
	}, [resultId, examId, router]);

	const handleRetryExam = () => {
		// AP 시험 재시도 - AP 시험 페이지로 이동 (subjectId 포함)
		if (examId && subjectId) {
			router.push(`/ap-exam?examId=${examId}&subjectId=${subjectId}`);
		} else if (examId) {
			// subjectId 누락 시 과목 선택 페이지로 유도
			router.push(`/dashboard/ap-courses`);
		} else {
			router.push("/dashboard/ap-courses");
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">시험 결과를 불러오는 중...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-600 mb-4">{error}</p>
					<button
						onClick={() => router.push("/dashboard")}
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					>
						대시보드로 돌아가기
					</button>
				</div>
			</div>
		);
	}

	if (!examResult) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-600">시험 결과를 찾을 수 없습니다.</p>
					<button
						onClick={() => router.push("/dashboard")}
						className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					>
						대시보드로 돌아가기
					</button>
				</div>
			</div>
		);
	}

	// UserApResult를 ExamResult 형태로 변환
	const resultForDisplay = {
		id: examResult.id,
		subjectId: examResult.examId,
		totalQuestions: examResult.totalQuestions,
		correctAnswers: examResult.correctAnswers,
		score: examResult.score,
		timeSpent: examResult.timeSpent,
		completedAt: examResult.completedAt || new Date(),
		mistakes: examResult.wrongAnswers,
		questionTypeAnalysis: examResult.questionTypeAnalysis,
	};

	return (
		<APResultsPage
			result={resultForDisplay}
			subject={{
				id: examResult.examId,
				name: "AP Chemistry",
				type: "AP",
				progress: 0,
				totalChapters: 0,
				completedChapters: 0,
				lastScore: examResult.score,
				icon: "🧪",
				examDate: new Date("2025-05-15"),
			}}
			onNavigate={(page) => {
				if (page === "dashboard") {
					// AP Chemistry 시험 결과에서 돌아올 때 Chemistry 과목을 자동 선택
					router.push("/dashboard/ap-courses?subject=67fe3544-fb7b-4805-b248-deb04df0f3e8");
				} else {
					router.push(`/${page}`);
				}
			}}
			onRetryExam={handleRetryExam}
		/>
	);
}

export default function APResults() {
	return (
		<Suspense fallback={
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">시험 결과를 불러오는 중...</p>
				</div>
			</div>
		}>
			<APResultsContent />
		</Suspense>
	);
}
