/**
 * AP Courses 관련 React 훅
 * 대시보드의 APCourses 컴포넌트에서 사용할 데이터 관리
 */

import { useState, useEffect, useCallback } from "react";
import { apService } from "@/lib/services/ap";
import type { ApSubject, ApChapter, ApExamDetailed, ApSubjectFilter } from "@/types";

/**
 * AP 과목 목록 관리 훅
 */
export function useApSubjects(filter?: ApSubjectFilter) {
	const [subjects, setSubjects] = useState<ApSubject[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isRefreshing, setIsRefreshing] = useState(false);

	/**
	 * AP 과목 목록 조회
	 */
	const fetchSubjects = useCallback(async () => {
		try {
			console.log("🔄 AP 과목 목록 조회 시작");
			setError(null);

			const data = await apService.getSubjects(filter);
			setSubjects(data);
			console.log("✅ AP 과목 목록 조회 성공:", data.length, "개");
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "AP 과목을 불러오는데 실패했습니다.";
			console.error("❌ AP 과목 목록 조회 실패:", errorMessage);
			setError(errorMessage);
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}, [filter]);

	/**
	 * 데이터 새로고침
	 */
	const refresh = useCallback(async () => {
		console.log("🔄 AP 과목 목록 새로고침");
		setIsRefreshing(true);
		await fetchSubjects();
	}, [fetchSubjects]);

	// 초기 데이터 로딩
	useEffect(() => {
		fetchSubjects();
	}, [fetchSubjects]);

	return {
		subjects,
		isLoading,
		error,
		isRefreshing,
		refresh,
	};
}

/**
 * 특정 AP 과목의 챕터 목록 관리 훅
 */
export function useApChapters(subjectId?: string) {
	const [chapters, setChapters] = useState<ApChapter[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	/**
	 * 챕터 목록 조회
	 */
	const fetchChapters = useCallback(async () => {
		if (!subjectId) {
			setChapters([]);
			return;
		}

		try {
			console.log("🔄 챕터 목록 조회 시작:", subjectId);
			setIsLoading(true);
			setError(null);

			const data = await apService.getChapters(subjectId);
			setChapters(data);
			console.log("✅ 챕터 목록 조회 성공:", data.length, "개");
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "챕터를 불러오는데 실패했습니다.";
			console.error("❌ 챕터 목록 조회 실패:", errorMessage);
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, [subjectId]);

	// subjectId 변경 시 데이터 재조회
	useEffect(() => {
		fetchChapters();
	}, [fetchChapters]);

	return {
		chapters,
		isLoading,
		error,
		refresh: fetchChapters,
	};
}

/**
 * AP 시험 목록 관리 훅
 */
export function useApExams(subjectId?: string) {
	const [exams, setExams] = useState<ApExamDetailed[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	/**
	 * 시험 목록 조회
	 */
	const fetchExams = useCallback(async () => {
		try {
			console.log("🔄 AP 시험 목록 조회 시작:", subjectId);
			setIsLoading(true);
			setError(null);

			const filter = subjectId ? { subjectId } : undefined;
			const data = await apService.getExams(filter);
			setExams(data);
			console.log("✅ AP 시험 목록 조회 성공:", data.length, "개");
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "AP 시험을 불러오는데 실패했습니다.";
			console.error("❌ AP 시험 목록 조회 실패:", errorMessage);
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, [subjectId]);

	// subjectId 변경 시 데이터 재조회
	useEffect(() => {
		fetchExams();
	}, [fetchExams]);

	return {
		exams,
		isLoading,
		error,
		refresh: fetchExams,
	};
}

/**
 * 대시보드용 AP 과목 요약 정보 훅
 * 진행률과 함께 제한된 개수의 과목만 반환
 */
export function useDashboardApSubjects(limit: number = 6) {
	const [subjects, setSubjects] = useState<ApSubject[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isRefreshing, setIsRefreshing] = useState(false);

	/**
	 * 대시보드용 AP 과목 조회
	 */
	const fetchDashboardSubjects = useCallback(async () => {
		try {
			console.log("🔄 대시보드용 AP 과목 조회 시작 (limit:", limit, ")");
			setError(null);

			// 활성화된 과목만 조회
			const allSubjects = await apService.getSubjects({ isActive: true });
			
			// 진행률 순으로 정렬하고 제한된 개수만 반환
			const limitedSubjects = allSubjects
				.sort((a, b) => b.progress - a.progress) // 진행률 높은 순
				.slice(0, limit);

			setSubjects(limitedSubjects);
			console.log("✅ 대시보드용 AP 과목 조회 성공:", limitedSubjects.length, "개");
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "AP 과목을 불러오는데 실패했습니다.";
			console.error("❌ 대시보드용 AP 과목 조회 실패:", errorMessage);
			setError(errorMessage);
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}, [limit]);

	/**
	 * 새로고침
	 */
	const refresh = useCallback(async () => {
		console.log("🔄 대시보드용 AP 과목 새로고침");
		setIsRefreshing(true);
		await fetchDashboardSubjects();
	}, [fetchDashboardSubjects]);

	// 초기 데이터 로딩
	useEffect(() => {
		fetchDashboardSubjects();
	}, [fetchDashboardSubjects]);

	return {
		subjects,
		isLoading,
		error,
		isRefreshing,
		refresh,
	};
}

/**
 * AP 과목별 통계 정보 계산 훅
 */
export function useApSubjectStats(subjects: ApSubject[]) {
	const stats = {
		totalSubjects: subjects.length,
		completedSubjects: subjects.filter(s => s.progress === 100).length,
		inProgressSubjects: subjects.filter(s => s.progress > 0 && s.progress < 100).length,
		notStartedSubjects: subjects.filter(s => s.progress === 0).length,
		averageProgress: subjects.length > 0 
			? Math.round(subjects.reduce((sum, s) => sum + s.progress, 0) / subjects.length)
			: 0,
	};

	return stats;
}

/**
 * AP 과목 필터링 훅
 */
export function useApSubjectFiltering(subjects: ApSubject[]) {
	const [searchTerm, setSearchTerm] = useState("");
	const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
	const [progressFilter, setProgressFilter] = useState<string>("all");

	/**
	 * 필터링된 과목 목록
	 */
	const filteredSubjects = subjects.filter(subject => {
		// 검색어 필터
		const matchesSearch = searchTerm === "" || 
			subject.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			subject.teacher.name.toLowerCase().includes(searchTerm.toLowerCase());

		// 진행률 필터
		const matchesProgress = progressFilter === "all" || 
			(progressFilter === "completed" && subject.progress === 100) ||
			(progressFilter === "in-progress" && subject.progress > 0 && subject.progress < 100) ||
			(progressFilter === "not-started" && subject.progress === 0);

		return matchesSearch && matchesProgress;
	});

	return {
		filteredSubjects,
		searchTerm,
		setSearchTerm,
		difficultyFilter,
		setDifficultyFilter,
		progressFilter,
		setProgressFilter,
	};
}
