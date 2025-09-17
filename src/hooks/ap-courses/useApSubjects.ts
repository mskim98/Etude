import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { apService } from "@/lib/services/ap";
import type { ApSubject, ApSubjectFilter } from "@/types";

export function useApSubjects(filter?: ApSubjectFilter) {
	const query = useQuery({
		queryKey: ["ap-subjects", filter],
		queryFn: () => apService.getSubjects(filter),
		staleTime: 5 * 60 * 1000, // 5분 - 과목 정보는 자주 변경되지 않음
		gcTime: 10 * 60 * 1000, // 10분
		retry: 2,
		refetchOnWindowFocus: false,
	});

	return {
		subjects: query.data || [],
		isLoading: query.isLoading,
		error: query.error?.message || null,
		isRefreshing: query.isFetching && !query.isLoading,
		refresh: query.refetch,
	};
}

export function useDashboardApSubjects(limit: number = 6) {
	const query = useQuery({
		queryKey: ["dashboard-ap-subjects", limit],
		queryFn: async () => {
			const allSubjects = await apService.getSubjects({ isActive: true });
			return allSubjects.sort((a, b) => b.progress - a.progress).slice(0, limit);
		},
		staleTime: 5 * 60 * 1000, // 5분 - 대시보드 정보는 자주 변경되지 않음
		gcTime: 10 * 60 * 1000, // 10분
		retry: 2,
		refetchOnWindowFocus: false,
		// 대시보드는 중요한 정보이므로 백그라운드에서 주기적 업데이트
		refetchInterval: 10 * 60 * 1000, // 10분마다 백그라운드 업데이트
	});

	return {
		subjects: query.data || [],
		isLoading: query.isLoading,
		error: query.error?.message || null,
		isRefreshing: query.isFetching && !query.isLoading,
		refresh: query.refetch,
	};
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
