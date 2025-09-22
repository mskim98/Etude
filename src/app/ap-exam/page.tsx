"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { APExamPage } from "@/components/features/ap/exams/APExamPage";
import { ApServiceImpl } from "@/lib/services/ap";
import { supabase } from "@/lib/supabase";
import type { ApExam, ApExamQuestion, SubmitExamAnswersRequest } from "@/types/ap";

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
				// 실제 AP exam 데이터를 API에서 가져오기
				const apService = new ApServiceImpl();

				// 시험 정보 가져오기
				const exams = await apService.getExams({ subjectId });
				const exam = exams.find((e) => e.id === examId);

				if (!exam) {
					console.error("Exam not found:", examId);
					router.push("/dashboard/ap-courses");
					return;
				}

				// 시험 문제 가져오기
				const questionsData = await apService.getExamQuestions(examId);

				if (!questionsData || questionsData.length === 0) {
					console.error("No questions found for exam:", examId);
					router.push("/dashboard/ap-courses");
					return;
				}

				setExamData(exam);
				setQuestions(questionsData);
			} catch (error) {
				console.error("Failed to load exam data:", error);
				router.push("/dashboard/ap-courses");
			} finally {
				setLoading(false);
			}
		};

		loadExamData();
	}, [examId, subjectId, router]);

	const handleExamComplete = async (result: any) => {
		try {
			console.log("AP Exam completed:", result);

			// 현재 사용자 ID 가져오기
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				console.error("User not authenticated");
				router.push("/auth/login");
				return;
			}

			// 채점 요청 데이터 준비
			const submitRequest: SubmitExamAnswersRequest = {
				examId: examData?.id || "",
				userId: user.id,
				answers: result.answers || [],
				timeSpent: result.timeSpent || 0,
			};

			// AP 서비스를 통한 채점
			const apService = new ApServiceImpl();
			const examResult = await apService.submitExamAnswers(submitRequest);

			// 결과를 쿼리 파라미터로 전달하여 결과 페이지로 이동 (subjectId 포함)
			const resultParams = new URLSearchParams({
				examId: examData?.id || "",
				resultId: examResult.id,
				subjectId: subjectId || "",
			});

			router.push(`/ap-results?${resultParams.toString()}`);
		} catch (error) {
			console.error("Failed to submit exam:", error);
			// 에러가 발생해도 결과 페이지로 이동 (에러 처리)
			router.push("/ap-results");
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
					<button onClick={handleGoBack} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
						돌아가기
					</button>
				</div>
			</div>
		);
	}

	return (
		<APExamPage examData={examData} questions={questions} onExamComplete={handleExamComplete} onGoBack={handleGoBack} />
	);
}
