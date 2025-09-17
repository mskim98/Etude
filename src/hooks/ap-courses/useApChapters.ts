import { useState, useEffect, useCallback } from "react";
import { apService } from "@/lib/services/ap";
import type { ApChapter } from "@/types";

export function useApChapters(subjectId?: string) {
	const [chapters, setChapters] = useState<ApChapter[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchChapters = useCallback(async () => {
		if (!subjectId) {
			setChapters([]);
			return;
		}
		try {
			setIsLoading(true);
			setError(null);
			const data = await apService.getChapters(subjectId);
			setChapters(data);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "챕터를 불러오는데 실패했습니다.";
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, [subjectId]);

	useEffect(() => {
		fetchChapters();
	}, [fetchChapters]);

	return { chapters, isLoading, error, refresh: fetchChapters };
}
