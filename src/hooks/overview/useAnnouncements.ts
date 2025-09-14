/**
 * @fileoverview 공지사항 관련 React 훅
 * @description 공지사항 데이터 관리, 상태 처리, 그리고 다양한 필터링/정렬 기능을 제공합니다.
 */

import { useState, useEffect, useCallback } from "react";
import { announcementService } from "../../lib/services/announcement";
import type {
	AnnouncementItem,
	CreateAnnouncementRequest,
	UpdateAnnouncementRequest,
	UseAnnouncementsState,
	AnnouncementFilter,
	AnnouncementSort,
	UrgencyLevel,
	AnnouncementCategory,
} from "../../types/announcement";
import { useAuthStore } from "../../store/auth";

/**
 * 기본 공지사항 훅
 * 모든 공지사항을 관리하는 메인 훅입니다.
 */
export function useAnnouncements(
	initialFilter?: AnnouncementFilter,
	initialSort?: AnnouncementSort
): UseAnnouncementsState & {
	// 데이터 조작 함수들
	refresh: () => Promise<void>;
	createAnnouncement: (data: CreateAnnouncementRequest) => Promise<void>;
	updateAnnouncement: (data: UpdateAnnouncementRequest) => Promise<void>;
	deleteAnnouncement: (announcementId: string) => Promise<void>;

	// 필터링/정렬 함수들
	setFilter: (filter: AnnouncementFilter) => void;
	setSort: (sort: AnnouncementSort) => void;
	clearFilter: () => void;
} {
	// 상태 관리
	const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isRefreshing, setIsRefreshing] = useState(false);

	// 필터 및 정렬 상태
	const [filter, setFilter] = useState<AnnouncementFilter | undefined>(initialFilter);
	const [sort, setSort] = useState<AnnouncementSort>(initialSort || { field: "createdAt", order: "desc" });

	/**
	 * 공지사항 데이터를 가져오는 함수
	 */
	const fetchAnnouncements = useCallback(
		async (showRefreshing = false) => {
			try {
				if (showRefreshing) {
					setIsRefreshing(true);
				} else {
					setIsLoading(true);
				}
				setError(null);

				console.log("📢 공지사항 데이터 요청:", { filter, sort });

				const data = await announcementService.getAnnouncements(filter, sort);
				setAnnouncements(data);

				console.log(`✅ 공지사항 ${data.length}개 로드 완료`);
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "공지사항을 불러오는데 실패했습니다.";
				console.error("❌ 공지사항 로드 실패:", errorMessage);
				setError(errorMessage);
			} finally {
				setIsLoading(false);
				setIsRefreshing(false);
			}
		},
		[filter, sort]
	);

	/**
	 * 새로고침 함수
	 */
	const refresh = useCallback(async () => {
		await fetchAnnouncements(true);
	}, [fetchAnnouncements]);

	/**
	 * 공지사항 생성 함수
	 */
	const createAnnouncement = useCallback(
		async (data: CreateAnnouncementRequest) => {
			try {
				console.log("📢 공지사항 생성 요청:", data);

				await announcementService.createAnnouncement(data);

				console.log("✅ 공지사항 생성 성공 - 목록 새로고침");
				await refresh();
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "공지사항 생성에 실패했습니다.";
				console.error("❌ 공지사항 생성 실패:", errorMessage);
				throw new Error(errorMessage);
			}
		},
		[refresh]
	);

	/**
	 * 공지사항 수정 함수
	 */
	const updateAnnouncement = useCallback(
		async (data: UpdateAnnouncementRequest) => {
			try {
				console.log("📢 공지사항 수정 요청:", data);

				await announcementService.updateAnnouncement(data);

				console.log("✅ 공지사항 수정 성공 - 목록 새로고침");
				await refresh();
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "공지사항 수정에 실패했습니다.";
				console.error("❌ 공지사항 수정 실패:", errorMessage);
				throw new Error(errorMessage);
			}
		},
		[refresh]
	);

	/**
	 * 공지사항 삭제 함수
	 */
	const deleteAnnouncement = useCallback(
		async (announcementId: string) => {
			try {
				console.log("📢 공지사항 삭제 요청:", announcementId);

				await announcementService.deleteAnnouncement(announcementId);

				console.log("✅ 공지사항 삭제 성공 - 목록 새로고침");
				await refresh();
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "공지사항 삭제에 실패했습니다.";
				console.error("❌ 공지사항 삭제 실패:", errorMessage);
				throw new Error(errorMessage);
			}
		},
		[refresh]
	);

	/**
	 * 필터 초기화 함수
	 */
	const clearFilter = useCallback(() => {
		setFilter(undefined);
	}, []);

	// 초기 데이터 로드 및 필터/정렬 변경 시 재로드
	useEffect(() => {
		fetchAnnouncements();
	}, [fetchAnnouncements]);

	return {
		// 상태
		announcements,
		isLoading,
		error,
		isRefreshing,

		// 데이터 조작 함수들
		refresh,
		createAnnouncement,
		updateAnnouncement,
		deleteAnnouncement,

		// 필터링/정렬 함수들
		setFilter,
		setSort,
		clearFilter,
	};
}

/**
 * 카테고리별 공지사항 훅
 * 특정 카테고리의 공지사항만 관리합니다.
 */
export function useAnnouncementsByCategory(
	category: AnnouncementCategory,
	limit = 10
): UseAnnouncementsState & {
	refresh: () => Promise<void>;
} {
	const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const fetchAnnouncements = useCallback(
		async (showRefreshing = false) => {
			try {
				if (showRefreshing) {
					setIsRefreshing(true);
				} else {
					setIsLoading(true);
				}
				setError(null);

				console.log(`📢 ${category.toUpperCase()} 공지사항 데이터 요청 (limit: ${limit})`);

				const data = await announcementService.getAnnouncementsByCategory(category, limit);
				setAnnouncements(data);

				console.log(`✅ ${category.toUpperCase()} 공지사항 ${data.length}개 로드 완료`);
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "공지사항을 불러오는데 실패했습니다.";
				console.error(`❌ ${category.toUpperCase()} 공지사항 로드 실패:`, errorMessage);
				setError(errorMessage);
			} finally {
				setIsLoading(false);
				setIsRefreshing(false);
			}
		},
		[category, limit]
	);

	const refresh = useCallback(async () => {
		await fetchAnnouncements(true);
	}, [fetchAnnouncements]);

	useEffect(() => {
		fetchAnnouncements();
	}, [fetchAnnouncements]);

	return {
		announcements,
		isLoading,
		error,
		isRefreshing,
		refresh,
	};
}

/**
 * 긴급 공지사항 훅
 * 긴급도가 높은 공지사항만 관리합니다.
 */
export function useUrgentAnnouncements(limit = 5): UseAnnouncementsState & {
	refresh: () => Promise<void>;
} {
	const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const fetchAnnouncements = useCallback(
		async (showRefreshing = false) => {
			try {
				if (showRefreshing) {
					setIsRefreshing(true);
				} else {
					setIsLoading(true);
				}
				setError(null);

				console.log(`📢 긴급 공지사항 데이터 요청 (limit: ${limit})`);

				const data = await announcementService.getAnnouncementsByUrgency("high", limit);
				setAnnouncements(data);

				console.log(`✅ 긴급 공지사항 ${data.length}개 로드 완료`);
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "긴급 공지사항을 불러오는데 실패했습니다.";
				console.error("❌ 긴급 공지사항 로드 실패:", errorMessage);
				setError(errorMessage);
			} finally {
				setIsLoading(false);
				setIsRefreshing(false);
			}
		},
		[limit]
	);

	const refresh = useCallback(async () => {
		await fetchAnnouncements(true);
	}, [fetchAnnouncements]);

	useEffect(() => {
		fetchAnnouncements();
	}, [fetchAnnouncements]);

	return {
		announcements,
		isLoading,
		error,
		isRefreshing,
		refresh,
	};
}

/**
 * 대시보드용 공지사항 훅
 * 대시보드에 표시할 최신 공지사항들을 관리합니다.
 */
export function useDashboardAnnouncements(limit = 6): UseAnnouncementsState & {
	refresh: () => Promise<void>;
} {
	const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const fetchAnnouncements = useCallback(
		async (showRefreshing = false) => {
			try {
				if (showRefreshing) {
					setIsRefreshing(true);
				} else {
					setIsLoading(true);
				}
				setError(null);

				console.log(`📢 대시보드 공지사항 데이터 요청 (limit: ${limit})`);

				// 긴급도 우선 정렬로 가져오기
				const data = await announcementService.getAnnouncements({ limit }, { field: "urgency", order: "desc" });
				setAnnouncements(data);

				console.log(`✅ 대시보드 공지사항 ${data.length}개 로드 완료`);
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "공지사항을 불러오는데 실패했습니다.";
				console.error("❌ 대시보드 공지사항 로드 실패:", errorMessage);
				setError(errorMessage);
			} finally {
				setIsLoading(false);
				setIsRefreshing(false);
			}
		},
		[limit]
	);

	const refresh = useCallback(async () => {
		await fetchAnnouncements(true);
	}, [fetchAnnouncements]);

	useEffect(() => {
		fetchAnnouncements();
	}, [fetchAnnouncements]);

	return {
		announcements,
		isLoading,
		error,
		isRefreshing,
		refresh,
	};
}

/**
 * 관리자용 공지사항 훅
 * 관리자가 공지사항을 관리할 수 있는 모든 기능을 제공합니다.
 */
export function useAnnouncementAdmin(): {
	// 상태
	announcements: AnnouncementItem[];
	isLoading: boolean;
	error: string | null;
	isRefreshing: boolean;
	canManage: boolean;

	// 데이터 조작 함수들
	refresh: () => Promise<void>;
	createAnnouncement: (data: CreateAnnouncementRequest) => Promise<void>;
	updateAnnouncement: (data: UpdateAnnouncementRequest) => Promise<void>;
	deleteAnnouncement: (announcementId: string) => Promise<void>;

	// 필터링/정렬 함수들
	setFilter: (filter: AnnouncementFilter) => void;
	setSort: (sort: AnnouncementSort) => void;
	clearFilter: () => void;
} {
	// 인증 상태에서 권한 확인
	const { isTeacher, isAdmin } = useAuthStore();
	const canManage = isTeacher || isAdmin;

	// 기본 공지사항 훅 사용
	const announcementHook = useAnnouncements();

	return {
		...announcementHook,
		canManage,
	};
}
