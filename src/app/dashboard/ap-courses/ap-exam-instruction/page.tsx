"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { APExamInstructionPage } from "@/components/features/ap/exams/APExamInstructionPage";
import { ApServiceImpl } from "@/lib/services/ap";
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
				// 실제 AP exam 데이터를 API에서 가져오기
				const apService = new ApServiceImpl();
				const exams = await apService.getExams({ subjectId });
				const exam = exams.find((e) => e.id === examId);

				if (!exam) {
					console.error("Exam not found:", examId);
					router.push("/dashboard/ap-courses");
					return;
				}

				setExamData(exam);
			} catch (error) {
				console.error("Failed to load exam data:", error);
				router.push("/dashboard/ap-courses");
			} finally {
				setLoading(false);
			}
		};

		loadExamData();
	}, [examId, subjectId, router]);

	const handleStartExam = async () => {
		if (!examData || !subjectId) return;

		try {
			// 시험 시작 시 user_ap_result 레코드 생성 (tested_at 기록)
			const apService = new ApServiceImpl();
			await apService.startExamAttempt(examData.id);
			
			// 실제 시험 페이지로 이동 (ap-exam 페이지)
			router.push(`/ap-exam?examId=${examData.id}&subjectId=${subjectId}`);
		} catch (error) {
			console.error("Failed to start exam attempt:", error);
			// 에러가 발생해도 시험 페이지로 이동 (사용자 경험 우선)
			router.push(`/ap-exam?examId=${examData.id}&subjectId=${subjectId}`);
		}
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
