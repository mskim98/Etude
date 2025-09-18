"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MockExamPage } from "@/components/features/exams/MockExamPage";
import type { Subject } from "@/types";

export default function APExamPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [subject, setSubject] = useState<Subject | null>(null);
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
				const mockSubject: Subject = {
					id: subjectId,
					name: "AP Chemistry Practice Exam",
					type: "AP",
					progress: 0,
					totalChapters: 1,
					completedChapters: 0,
					lastScore: undefined,
					icon: "🧪",
					examDate: new Date("2025-05-15"),
				};

				setSubject(mockSubject);
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

	if (!subject) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-600">시험 정보를 찾을 수 없습니다.</p>
					<button
						onClick={() => router.push("/dashboard/ap-courses")}
						className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					>
						돌아가기
					</button>
				</div>
			</div>
		);
	}

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
