import { useMemo } from "react";
import type { ApExam } from "@/types/ap";

/**
 * 시험 통계 및 계산된 데이터를 제공하는 훅
 */
export function useExamStats(exam: ApExam) {
	return useMemo(() => {
		const correctAnswers = exam.bestScore || 0;
		const totalQuestions = exam.questionCount || 0;
		const accuracyRate = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : undefined;

		return {
			correctAnswers,
			totalQuestions,
			accuracyRate,
			isCompleted: exam.completed || false,
			attempts: exam.attemptCount || 0,
		};
	}, [exam.bestScore, exam.questionCount, exam.completed, exam.attemptCount]);
}

/**
 * 여러 시험의 통계를 제공하는 훅
 */
export function useExamsStats(exams: ApExam[]) {
	return useMemo(() => {
		return exams.map((exam) => ({
			...exam,
			...useExamStats(exam),
		}));
	}, [exams]);
}
