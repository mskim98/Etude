import { useState, useEffect, useCallback } from "react";
import { apService } from "@/lib/services/ap";
import type { ApSubject, ApSubjectFilter } from "@/types";

export function useApSubjects(filter?: ApSubjectFilter) {
	const [subjects, setSubjects] = useState<ApSubject[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const fetchSubjects = useCallback(async () => {
		try {
			setError(null);
			const data = await apService.getSubjects(filter);
			setSubjects(data);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "AP 과목을 불러오는데 실패했습니다.";
			setError(errorMessage);
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}, [filter]);

	const refresh = useCallback(async () => {
		setIsRefreshing(true);
		await fetchSubjects();
	}, [fetchSubjects]);

	useEffect(() => {
		fetchSubjects();
	}, [fetchSubjects]);

	return { subjects, isLoading, error, isRefreshing, refresh };
}

export function useDashboardApSubjects(limit: number = 6) {
	const [subjects, setSubjects] = useState<ApSubject[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const fetchDashboardSubjects = useCallback(async () => {
		try {
			setError(null);
			const allSubjects = await apService.getSubjects({ isActive: true });
			const limitedSubjects = allSubjects.sort((a, b) => b.progress - a.progress).slice(0, limit);
			setSubjects(limitedSubjects);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "AP 과목을 불러오는데 실패했습니다.";
			setError(errorMessage);
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}, [limit]);

	const refresh = useCallback(async () => {
		setIsRefreshing(true);
		await fetchDashboardSubjects();
	}, [fetchDashboardSubjects]);

	useEffect(() => {
		fetchDashboardSubjects();
	}, [fetchDashboardSubjects]);

	return { subjects, isLoading, error, isRefreshing, refresh };
}

export function useApSubjectStats(subjects: ApSubject[]) {
	const stats = {
		totalSubjects: subjects.length,
		completedSubjects: subjects.filter((s) => s.progress === 100).length,
		inProgressSubjects: subjects.filter((s) => s.progress > 0 && s.progress < 100).length,
		notStartedSubjects: subjects.filter((s) => s.progress === 0).length,
		averageProgress:
			subjects.length > 0 ? Math.round(subjects.reduce((sum, s) => sum + s.progress, 0) / subjects.length) : 0,
	};
	return stats;
}
