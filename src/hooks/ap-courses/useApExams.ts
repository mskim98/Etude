import { useQuery } from "@tanstack/react-query";
import { apService } from "@/lib/services/ap";
import type { ApExamDetailed } from "@/types";

export function useApExams(subjectId?: string) {
	const query = useQuery({
		queryKey: ["ap-exams", subjectId],
		queryFn: () => apService.getExams(subjectId ? { subjectId } : undefined),
		enabled: !!subjectId,
		staleTime: 5 * 60 * 1000, // 5분 - 시험 정보는 자주 변경되지 않음
		gcTime: 10 * 60 * 1000, // 10분
		retry: 2,
		refetchOnWindowFocus: false,
	});

	return {
		exams: query.data || [],
		isLoading: query.isLoading,
		error: query.error?.message || null,
		refresh: query.refetch,
	};
}
