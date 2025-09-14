import { useState, useEffect, useCallback } from "react";
import { scheduleService, ScheduleUtils } from "@/lib/services/schedule";
import type { ScheduleItem, CreateScheduleRequest, UpdateScheduleRequest, UseScheduleState } from "@/types/schedule";

/**
 * ExamSchedule 컴포넌트에서 사용할 커스텀 훅
 * 일정 데이터 조회, 생성, 수정, 삭제 기능을 제공
 */
export function useExamSchedule(): UseScheduleState {
	// 상태 관리
	const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	/**
	 * 일정 데이터 새로고침
	 */
	const refreshSchedules = useCallback(async () => {
		try {
			console.log("useExamSchedule.refreshSchedules 시작");
			setLoading(true);
			setError(null);

			// 모든 일정 조회
			const fetchedSchedules = await scheduleService.getSchedules();

			// Schedule을 ScheduleItem으로 변환
			const scheduleItems = scheduleService.mapSchedulesToItems(fetchedSchedules);

			// 날짜순 정렬 (가까운 날짜부터)
			const sortedSchedules = ScheduleUtils.sortSchedules(scheduleItems, "date", "asc");

			setSchedules(sortedSchedules);
			console.log(`일정 새로고침 완료: ${sortedSchedules.length}개`);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "일정을 불러오는데 실패했습니다";
			console.error("useExamSchedule.refreshSchedules 에러:", errorMessage);
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	}, []);

	/**
	 * 새 일정 생성 (teacher/admin만 가능)
	 */
	const createSchedule = useCallback(
		async (data: CreateScheduleRequest): Promise<boolean> => {
			try {
				console.log("useExamSchedule.createSchedule 시작:", data);
				setError(null);

				// 일정 생성 요청
				const scheduleId = await scheduleService.createSchedule(data);
				console.log(`일정 생성 성공: ${scheduleId}`);

				// 일정 목록 새로고침
				await refreshSchedules();

				return true;
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "일정 생성에 실패했습니다";
				console.error("useExamSchedule.createSchedule 에러:", errorMessage);
				setError(errorMessage);
				return false;
			}
		},
		[refreshSchedules]
	);

	/**
	 * 일정 수정 (teacher/admin만 가능)
	 */
	const updateSchedule = useCallback(
		async (data: UpdateScheduleRequest): Promise<boolean> => {
			try {
				console.log("useExamSchedule.updateSchedule 시작:", data);
				setError(null);

				// 일정 수정 요청
				const success = await scheduleService.updateSchedule(data);
				console.log(`일정 수정 결과: ${success}`);

				if (success) {
					// 일정 목록 새로고침
					await refreshSchedules();
					return true;
				} else {
					throw new Error("일정 수정에 실패했습니다");
				}
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "일정 수정에 실패했습니다";
				console.error("useExamSchedule.updateSchedule 에러:", errorMessage);
				setError(errorMessage);
				return false;
			}
		},
		[refreshSchedules]
	);

	/**
	 * 일정 삭제 (teacher/admin만 가능)
	 */
	const deleteSchedule = useCallback(
		async (id: string): Promise<boolean> => {
			try {
				console.log(`useExamSchedule.deleteSchedule 시작: ${id}`);
				setError(null);

				// 일정 삭제 요청
				const success = await scheduleService.deleteSchedule(id);
				console.log(`일정 삭제 결과: ${success}`);

				if (success) {
					// 일정 목록 새로고침
					await refreshSchedules();
					return true;
				} else {
					throw new Error("일정 삭제에 실패했습니다");
				}
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "일정 삭제에 실패했습니다";
				console.error("useExamSchedule.deleteSchedule 에러:", errorMessage);
				setError(errorMessage);
				return false;
			}
		},
		[refreshSchedules]
	);

	// 컴포넌트 마운트 시 초기 데이터 로드
	useEffect(() => {
		refreshSchedules();
	}, [refreshSchedules]);

	return {
		schedules,
		loading,
		error,
		refreshSchedules,
		createSchedule,
		updateSchedule,
		deleteSchedule,
	};
}

/**
 * 특정 카테고리의 일정만 조회하는 훅
 */
export function useExamScheduleByCategory(category: "ap" | "sat") {
	const { schedules, loading, error, refreshSchedules, createSchedule, updateSchedule, deleteSchedule } =
		useExamSchedule();

	// 카테고리별로 필터링된 일정
	const filteredSchedules = ScheduleUtils.filterSchedules(schedules, { category });

	return {
		schedules: filteredSchedules,
		loading,
		error,
		refreshSchedules,
		createSchedule,
		updateSchedule,
		deleteSchedule,
	};
}

/**
 * 긴급한 일정 (7일 이내)만 조회하는 훅
 */
export function useUrgentSchedules() {
	const { schedules, loading, error, refreshSchedules } = useExamSchedule();

	// 긴급한 일정만 필터링
	const urgentSchedules = ScheduleUtils.getUrgentSchedules(schedules);

	return {
		schedules: urgentSchedules,
		loading,
		error,
		refreshSchedules,
	};
}

/**
 * 오늘 일정만 조회하는 훅
 */
export function useTodaySchedules() {
	const { schedules, loading, error, refreshSchedules } = useExamSchedule();

	// 오늘 일정만 필터링
	const todaySchedules = ScheduleUtils.getTodaySchedules(schedules);

	return {
		schedules: todaySchedules,
		loading,
		error,
		refreshSchedules,
	};
}

/**
 * 다가오는 일정 (미래)만 조회하는 훅
 */
export function useUpcomingSchedules() {
	const { schedules, loading, error, refreshSchedules } = useExamSchedule();

	// 다가오는 일정만 필터링
	const upcomingSchedules = ScheduleUtils.getUpcomingSchedules(schedules);

	return {
		schedules: upcomingSchedules,
		loading,
		error,
		refreshSchedules,
	};
}

/**
 * 관리자 기능 (CRUD) 포함 훅
 * teacher/admin 사용자를 위한 관리 기능
 */
export function useScheduleAdmin() {
	const { schedules, loading, error, refreshSchedules, createSchedule, updateSchedule, deleteSchedule } =
		useExamSchedule();

	/**
	 * 빠른 일정 생성 (오늘부터 N일 후)
	 */
	const createQuickSchedule = useCallback(
		async (title: string, daysFromNow: number, category: "ap" | "sat"): Promise<boolean> => {
			const targetDate = new Date();
			targetDate.setDate(targetDate.getDate() + daysFromNow);

			return await createSchedule({
				title,
				dDay: targetDate,
				category,
			});
		},
		[createSchedule]
	);

	/**
	 * 여러 일정 일괄 생성
	 */
	const createBulkSchedules = useCallback(
		async (schedules: CreateScheduleRequest[]): Promise<{ success: number; failed: number }> => {
			let success = 0;
			let failed = 0;

			for (const schedule of schedules) {
				try {
					const result = await createSchedule(schedule);
					if (result) {
						success++;
					} else {
						failed++;
					}
				} catch {
					failed++;
				}
			}

			return { success, failed };
		},
		[createSchedule]
	);

	return {
		schedules,
		loading,
		error,
		refreshSchedules,
		createSchedule,
		updateSchedule,
		deleteSchedule,
		createQuickSchedule,
		createBulkSchedules,
	};
}
