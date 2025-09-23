import { supabase } from "@/lib/supabase";
import type {
	Schedule,
	ScheduleRow,
	CreateScheduleRequest,
	UpdateScheduleRequest,
	ScheduleItem,
	ScheduleService,
} from "@/types/schedule";

/**
 * Schedule 서비스 클래스
 * Supabase와 연동하여 일정 관리 기능을 제공
 * teacher/admin만 CUD 작업 가능, 모든 사용자는 읽기 가능
 */
export class ScheduleServiceImpl implements ScheduleService {
	/**
	 * Supabase 행을 프론트엔드 Schedule 객체로 변환
	 */
	private mapRowToSchedule(row: ScheduleRow): Schedule {
		return {
			id: row.id,
			title: row.title,
			dDay: new Date(row.d_day),
			category: row.category as "ap" | "sat",
			createdBy: row.created_by || undefined,
			updatedBy: row.updated_by || undefined,
			deletedBy: row.deleted_by || undefined,
			createdAt: row.created_at ? new Date(row.created_at) : undefined,
			updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
			deletedAt: row.deleted_at ? new Date(row.deleted_at) : undefined,
		};
	}

	/**
	 * Schedule을 UI용 ScheduleItem으로 변환
	 */
	private mapScheduleToItem(schedule: Schedule): ScheduleItem {
		const daysUntil = this.calculateDaysUntil(schedule.dDay);
		const status = this.getScheduleStatus(schedule.dDay);

		return {
			id: schedule.id,
			title: schedule.title,
			date: schedule.dDay,
			category: schedule.category,
			daysUntil,
			status,
			isUrgent: daysUntil <= 7 && daysUntil >= 0, // 7일 이내 && 아직 지나지 않음
		};
	}

	/**
	 * 모든 활성 일정 조회 (삭제되지 않은 일정만)
	 */
	async getSchedules(): Promise<Schedule[]> {
		try {
			console.log("ScheduleService.getSchedules 시작");

			const { data, error } = await supabase
				.from("schedule" as any)
				.select("*")
				.is("deleted_at", null) // 삭제되지 않은 일정만
				.order("d_day", { ascending: true }); // 날짜순 정렬

			if (error) {
				console.error("일정 조회 에러:", error);
				throw new Error(`일정을 불러오는데 실패했습니다: ${error.message}`);
			}

			const schedules = (data || []).map(this.mapRowToSchedule);
			console.log(`일정 조회 성공: ${schedules.length}개`);

			return schedules;
		} catch (err) {
			console.error("ScheduleService.getSchedules 에러:", err);
			throw err;
		}
	}

	/**
	 * 카테고리별 일정 조회
	 */
	async getSchedulesByCategory(category: "ap" | "sat"): Promise<Schedule[]> {
		try {
			console.log(`ScheduleService.getSchedulesByCategory 시작: ${category}`);

			const { data, error } = await supabase
				.from("schedule" as any)
				.select("*")
				.eq("category", category)
				.is("deleted_at", null)
				.order("d_day", { ascending: true });

			if (error) {
				console.error("카테고리별 일정 조회 에러:", error);
				throw new Error(`${category.toUpperCase()} 일정을 불러오는데 실패했습니다: ${error.message}`);
			}

			const schedules = (data || []).map(this.mapRowToSchedule);
			console.log(`${category} 일정 조회 성공: ${schedules.length}개`);

			return schedules;
		} catch (err) {
			console.error("ScheduleService.getSchedulesByCategory 에러:", err);
			throw err;
		}
	}

	/**
	 * 특정 일정 조회
	 */
	async getScheduleById(id: string): Promise<Schedule | null> {
		try {
			console.log(`ScheduleService.getScheduleById 시작: ${id}`);

			const { data, error } = await supabase.from("schedule" as any).select("*").eq("id", id).is("deleted_at", null).single();

			if (error) {
				if (error.code === "PGRST116") {
					// 데이터 없음
					console.log(`일정을 찾을 수 없음: ${id}`);
					return null;
				}
				console.error("특정 일정 조회 에러:", error);
				throw new Error(`일정을 불러오는데 실패했습니다: ${error.message}`);
			}

			const schedule = this.mapRowToSchedule(data);
			console.log(`일정 조회 성공: ${schedule.title}`);

			return schedule;
		} catch (err) {
			console.error("ScheduleService.getScheduleById 에러:", err);
			throw err;
		}
	}

	/**
	 * 새 일정 생성 (teacher/admin만 가능)
	 */
	async createSchedule(data: CreateScheduleRequest): Promise<string> {
		try {
			console.log("ScheduleService.createSchedule 시작:", data);

			// Supabase RPC 함수 호출 (권한 체크 포함)
			const { data: scheduleId, error } = await supabase.rpc("create_schedule" as any, {
				p_title: data.title,
				p_d_day: data.dDay.toISOString().split("T")[0], // YYYY-MM-DD 형식
				p_category: data.category,
			} as any);

			if (error) {
				console.error("일정 생성 에러:", error);
				throw new Error(`일정 생성에 실패했습니다: ${error.message}`);
			}

			console.log(`일정 생성 성공: ${scheduleId}`);
			return scheduleId;
		} catch (err) {
			console.error("ScheduleService.createSchedule 에러:", err);
			throw err;
		}
	}

	/**
	 * 일정 업데이트 (teacher/admin만 가능)
	 */
	async updateSchedule(data: UpdateScheduleRequest): Promise<boolean> {
		try {
			console.log("ScheduleService.updateSchedule 시작:", data);

			// Supabase RPC 함수 호출 (권한 체크 포함)
			const { data: success, error } = await supabase.rpc("update_schedule" as any, {
				p_schedule_id: data.id,
				p_title: data.title || null,
				p_d_day: data.dDay ? data.dDay.toISOString().split("T")[0] : null,
				p_category: data.category || null,
			} as any);

			if (error) {
				console.error("일정 업데이트 에러:", error);
				throw new Error(`일정 수정에 실패했습니다: ${error.message}`);
			}

			console.log(`일정 업데이트 성공: ${success}`);
			return success;
		} catch (err) {
			console.error("ScheduleService.updateSchedule 에러:", err);
			throw err;
		}
	}

	/**
	 * 일정 삭제 (teacher/admin만 가능) - 논리적 삭제
	 */
	async deleteSchedule(id: string): Promise<boolean> {
		try {
			console.log(`ScheduleService.deleteSchedule 시작: ${id}`);

			// Supabase RPC 함수 호출 (권한 체크 포함)
			const { data: success, error } = await supabase.rpc("delete_schedule" as any, {
				p_schedule_id: id,
			} as any);

			if (error) {
				console.error("일정 삭제 에러:", error);
				throw new Error(`일정 삭제에 실패했습니다: ${error.message}`);
			}

			console.log(`일정 삭제 성공: ${success}`);
			return success;
		} catch (err) {
			console.error("ScheduleService.deleteSchedule 에러:", err);
			throw err;
		}
	}

	/**
	 * D-Day 계산 유틸리티
	 * @param targetDate 목표 날짜
	 * @returns 남은 일수 (음수면 지난 일수)
	 */
	calculateDaysUntil(targetDate: Date): number {
		const today = new Date();
		const target = new Date(targetDate);

		// 시간 부분 제거하고 날짜만 비교
		today.setHours(0, 0, 0, 0);
		target.setHours(0, 0, 0, 0);

		const diffTime = target.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		return diffDays;
	}

	/**
	 * 일정 상태 계산 유틸리티
	 * @param targetDate 목표 날짜
	 * @returns 일정 상태
	 */
	getScheduleStatus(targetDate: Date): "upcoming" | "today" | "past" {
		const daysUntil = this.calculateDaysUntil(targetDate);

		if (daysUntil > 0) {
			return "upcoming";
		} else if (daysUntil === 0) {
			return "today";
		} else {
			return "past";
		}
	}

	/**
	 * Schedule 배열을 ScheduleItem 배열로 변환하는 헬퍼 메서드
	 */
	mapSchedulesToItems(schedules: Schedule[]): ScheduleItem[] {
		return schedules.map(this.mapScheduleToItem.bind(this));
	}
}

// 싱글톤 인스턴스 생성
export const scheduleService = new ScheduleServiceImpl();

/**
 * 일정 관련 유틸리티 함수들
 */
export const ScheduleUtils = {
	/**
	 * 일정을 날짜별로 그룹화
	 */
	groupByDate: (schedules: ScheduleItem[]): Record<string, ScheduleItem[]> => {
		return schedules.reduce((groups, schedule) => {
			const dateKey = schedule.date.toISOString().split("T")[0];
			if (!groups[dateKey]) {
				groups[dateKey] = [];
			}
			groups[dateKey].push(schedule);
			return groups;
		}, {} as Record<string, ScheduleItem[]>);
	},

	/**
	 * 일정을 카테고리별로 그룹화
	 */
	groupByCategory: (schedules: ScheduleItem[]): Record<"ap" | "sat", ScheduleItem[]> => {
		return schedules.reduce(
			(groups, schedule) => {
				groups[schedule.category].push(schedule);
				return groups;
			},
			{ ap: [], sat: [] } as Record<"ap" | "sat", ScheduleItem[]>
		);
	},

	/**
	 * 일정 필터링
	 */
	filterSchedules: (
		schedules: ScheduleItem[],
		filter: {
			category?: "ap" | "sat" | "all";
			status?: "upcoming" | "today" | "past" | "all";
		}
	): ScheduleItem[] => {
		return schedules.filter((schedule) => {
			if (filter.category && filter.category !== "all" && schedule.category !== filter.category) {
				return false;
			}
			if (filter.status && filter.status !== "all" && schedule.status !== filter.status) {
				return false;
			}
			return true;
		});
	},

	/**
	 * 일정 정렬
	 */
	sortSchedules: (
		schedules: ScheduleItem[],
		sortBy: "date" | "title" | "category" = "date",
		order: "asc" | "desc" = "asc"
	): ScheduleItem[] => {
		return [...schedules].sort((a, b) => {
			let comparison = 0;

			switch (sortBy) {
				case "date":
					comparison = a.date.getTime() - b.date.getTime();
					break;
				case "title":
					comparison = a.title.localeCompare(b.title);
					break;
				case "category":
					comparison = a.category.localeCompare(b.category);
					break;
				default:
					comparison = 0;
			}

			return order === "desc" ? -comparison : comparison;
		});
	},

	/**
	 * 긴급한 일정 (7일 이내) 필터링
	 */
	getUrgentSchedules: (schedules: ScheduleItem[]): ScheduleItem[] => {
		return schedules.filter((schedule) => schedule.isUrgent);
	},

	/**
	 * 오늘 일정 필터링
	 */
	getTodaySchedules: (schedules: ScheduleItem[]): ScheduleItem[] => {
		return schedules.filter((schedule) => schedule.status === "today");
	},

	/**
	 * 다가오는 일정 필터링 (미래)
	 */
	getUpcomingSchedules: (schedules: ScheduleItem[]): ScheduleItem[] => {
		return schedules.filter((schedule) => schedule.status === "upcoming");
	},
};
