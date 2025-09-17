import { useQuery } from "@tanstack/react-query";
import { apService } from "@/lib/services/ap";
import type { ApChapter } from "@/types";

export function useApChapters(subjectId?: string) {
	const query = useQuery({
		queryKey: ["ap-chapters", subjectId],
		queryFn: () => apService.getChapters(subjectId!),
		enabled: !!subjectId,
		staleTime: 5 * 60 * 1000, // 5분 - 챕터 정보는 자주 변경되지 않음
		gcTime: 10 * 60 * 1000, // 10분
		retry: 2,
		refetchOnWindowFocus: false,
	});

	return {
		chapters: query.data || [],
		isLoading: query.isLoading,
		error: query.error?.message || null,
		refresh: query.refetch,
	};
}
