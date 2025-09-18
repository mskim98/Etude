"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { APExamPage } from "@/components/features/exams/APExamPage";
import type { ApExam, ApExamQuestion } from "@/types/ap";

export default function APExamPageRoute() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [examData, setExamData] = useState<ApExam | null>(null);
	const [questions, setQuestions] = useState<ApExamQuestion[]>([]);
	const [loading, setLoading] = useState(true);

	// URL에서 examId와 subjectId 파라미터 가져오기
	const examId = searchParams.get("examId");
	const subjectId = searchParams.get("subjectId");

	useEffect(() => {
		const loadExamData = async () => {
			if (!examId || !subjectId) {
				console.error("Missing examId or subjectId parameters");
				router.push("/dashboard/ap-courses");
				return;
			}

			try {
				// TODO: 실제 AP exam 데이터를 API에서 가져오는 로직으로 교체
				// 현재는 mock 데이터 사용
				const mockExamData: ApExam = {
					id: examId,
					title: "AP Chemistry Practice Exam 1",
					description: "Comprehensive practice exam covering all major topics in AP Chemistry",
					difficulty: "normal",
					duration: 195, // 3시간 15분
					questionCount: 60,
					isActive: true,
					canTake: true,
					completed: false,
					attemptCount: 0,
				};

				// Mock questions data
				const mockQuestions: ApExamQuestion[] = Array.from({ length: 60 }, (_, index) => ({
					id: `q${index + 1}`,
					order: index + 1,
					question: `This is AP Chemistry question ${index + 1}. Which of the following best describes the concept being tested?`,
					passage: index % 5 === 0 ? `Passage for questions ${index + 1}-${index + 3}: This passage provides context for the following chemistry problems...` : undefined,
					choiceType: "text",
					difficulty: "normal",
					topic: "General Chemistry",
					choices: [
						{ id: "a", order: 1, text: "Option A - This represents one possible answer", isCorrect: index % 4 === 0 },
						{ id: "b", order: 2, text: "Option B - This represents another possible answer", isCorrect: index % 4 === 1 },
						{ id: "c", order: 3, text: "Option C - This represents a third possible answer", isCorrect: index % 4 === 2 },
						{ id: "d", order: 4, text: "Option D - This represents the final possible answer", isCorrect: index % 4 === 3 },
					],
					explanation: `This is the explanation for question ${index + 1}. The correct answer demonstrates the key chemistry principle being tested.`,
				}));

				setExamData(mockExamData);
				setQuestions(mockQuestions);
			} catch (error) {
				console.error("Failed to load exam data:", error);
				router.push("/dashboard/ap-courses");
			} finally {
				setLoading(false);
			}
		};

		loadExamData();
	}, [examId, subjectId, router]);

	const handleExamComplete = (result: unknown) => {
		// AP 시험 완료 시 AP 결과 페이지로 이동
		console.log("AP Exam completed:", result);
		router.push("/ap-results");
	};

	const handleGoBack = () => {
		router.push("/dashboard/ap-courses");
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">시험을 준비하는 중...</p>
				</div>
			</div>
		);
	}

	if (!examData || !questions.length) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-600">시험 정보를 찾을 수 없습니다.</p>
					<button
						onClick={handleGoBack}
						className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					>
						돌아가기
					</button>
				</div>
			</div>
		);
	}

	return (
		<APExamPage
			examData={examData}
			questions={questions}
			onExamComplete={handleExamComplete}
			onGoBack={handleGoBack}
		/>
	);
}
