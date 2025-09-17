import { useState, useEffect, useCallback } from "react";
import { apService } from "@/lib/services/ap";
import type { ApExamDetailed } from "@/types";

export function useApExams(subjectId?: string) {
	const [exams, setExams] = useState<ApExamDetailed[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchExams = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const filter = subjectId ? { subjectId } : undefined;
			const data = await apService.getExams(filter);
			setExams(data);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "AP 시험을 불러오는데 실패했습니다.";
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, [subjectId]);

	useEffect(() => {
		fetchExams();
	}, [fetchExams]);

	return { exams, isLoading, error, refresh: fetchExams };
}
