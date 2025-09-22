"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { APExamInstructionPage } from "@/components/features/ap/exams/APExamInstructionPage";
import type { ApExam } from "@/types/ap";

export default function APExamInstructionPageRoute() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [examData, setExamData] = useState<ApExam | null>(null);
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
				// TODO: AP exam 데이터를 실제 API에서 가져오는 로직으로 교체
				// 현재는 mock 데이터 사용
				const mockExamData: ApExam = {
					id: examId,
					title: "AP Chemistry Practice Exam 1",
					description:
						"Comprehensive practice exam covering all major topics in AP Chemistry including atomic structure, chemical bonding, and thermodynamics.",
					difficulty: "Medium",
					duration: 195, // 3시간 15분 (AP Chemistry 실제 시험 시간)
					questionCount: 60, // Multiple Choice: 60문항
					isActive: true,
					canTake: true,
					completed: false,
					attemptCount: 0,
				};

				setExamData(mockExamData);
			} catch (error) {
				console.error("Failed to load exam data:", error);
				router.push("/dashboard/ap-courses");
			} finally {
				setLoading(false);
			}
		};

		loadExamData();
	}, [examId, subjectId, router]);

	const handleStartExam = () => {
		if (!examData || !subjectId) return;

		// 실제 시험 페이지로 이동 (ap-exam 페이지)
		router.push(`/ap-exam?examId=${examData.id}&subjectId=${subjectId}`);
	};

	const handleGoBack = () => {
		router.push("/dashboard/ap-courses");
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">시험 정보를 불러오는 중...</p>
				</div>
			</div>
		);
	}

	if (!examData) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-600">시험 정보를 찾을 수 없습니다.</p>
					<button onClick={handleGoBack} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
						돌아가기
					</button>
				</div>
			</div>
		);
	}

	return <APExamInstructionPage examData={examData} onStartExam={handleStartExam} onGoBack={handleGoBack} />;
}
