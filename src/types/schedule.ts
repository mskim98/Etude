import type { Database } from "./supabase";

// 카테고리 타입 (Supabase ENUM과 동일)
export type ScheduleCategory = Database["public"]["Enums"]["exam_category"];

// Supabase Schedule 테이블 타입
export type ScheduleRow = Database["public"]["Tables"]["schedule"]["Row"];
export type ScheduleInsert = Database["public"]["Tables"]["schedule"]["Insert"];
export type ScheduleUpdate = Database["public"]["Tables"]["schedule"]["Update"];

// 프론트엔드에서 사용할 Schedule 인터페이스
export interface Schedule {
	id: string;
	title: string;
	dDay: Date; // d_day를 Date 객체로 변환
	category: ScheduleCategory;
	createdBy?: string;
	updatedBy?: string;
	deletedBy?: string;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}

// Schedule 생성 요청 인터페이스
export interface CreateScheduleRequest {
	title: string;
	dDay: Date;
	category: ScheduleCategory;
}

// Schedule 업데이트 요청 인터페이스
export interface UpdateScheduleRequest {
	id: string;
	title?: string;
	dDay?: Date;
	category?: ScheduleCategory;
}

// Schedule 응답 인터페이스 (UI 표시용)
export interface ScheduleItem {
	id: string;
	title: string;
	date: Date;
	category: ScheduleCategory;
	daysUntil: number; // D-Day 계산 결과
	status: "upcoming" | "today" | "past"; // 상태 분류
	isUrgent?: boolean; // 7일 이내 여부
}

// Schedule 서비스 응답 타입
export interface ScheduleServiceResponse {
	data: Schedule[] | null;
	error: string | null;
	loading: boolean;
}

// Schedule CRUD 함수 타입들
export interface ScheduleService {
	/**
	 * 모든 활성 일정 조회 (삭제되지 않은 일정만)
	 */
	getSchedules: () => Promise<Schedule[]>;

	/**
	 * 카테고리별 일정 조회
	 */
	getSchedulesByCategory: (category: ScheduleCategory) => Promise<Schedule[]>;

	/**
	 * 특정 일정 조회
	 */
	getScheduleById: (id: string) => Promise<Schedule | null>;

	/**
	 * 새 일정 생성 (teacher/admin만 가능)
	 */
	createSchedule: (data: CreateScheduleRequest) => Promise<string>;

	/**
	 * 일정 업데이트 (teacher/admin만 가능)
	 */
	updateSchedule: (data: UpdateScheduleRequest) => Promise<boolean>;

	/**
	 * 일정 삭제 (teacher/admin만 가능) - 논리적 삭제
	 */
	deleteSchedule: (id: string) => Promise<boolean>;

	/**
	 * D-Day 계산 유틸리티
	 */
	calculateDaysUntil: (targetDate: Date) => number;

	/**
	 * 일정 상태 계산 유틸리티
	 */
	getScheduleStatus: (targetDate: Date) => "upcoming" | "today" | "past";
}

// Hook에서 사용할 상태 타입
export interface UseScheduleState {
	schedules: ScheduleItem[];
	loading: boolean;
	error: string | null;
	refreshSchedules: () => Promise<void>;
	createSchedule: (data: CreateScheduleRequest) => Promise<boolean>;
	updateSchedule: (data: UpdateScheduleRequest) => Promise<boolean>;
	deleteSchedule: (id: string) => Promise<boolean>;
}

// ExamSchedule 컴포넌트 Props 타입
export interface ExamScheduleProps {
	schedules?: ScheduleItem[]; // 외부에서 주입 가능
	loading?: boolean;
	error?: string | null;
	onRefresh?: () => void;
	onCreateSchedule?: (data: CreateScheduleRequest) => void;
	onUpdateSchedule?: (data: UpdateScheduleRequest) => void;
	onDeleteSchedule?: (id: string) => void;
	// 관리자 기능 표시 여부
	showAdminFeatures?: boolean;
}

// Calendar 이벤트 타입 (향후 캘린더 뷰 구현 시 사용)
export interface CalendarEvent {
	id: string;
	title: string;
	date: Date;
	type: "ap" | "sat";
	description?: string;
}

// 일정 필터 옵션
export interface ScheduleFilter {
	category?: ScheduleCategory | "all";
	status?: "upcoming" | "today" | "past" | "all";
	dateRange?: {
		start: Date;
		end: Date;
	};
}

// 일정 정렬 옵션
export type ScheduleSortBy = "date" | "title" | "category" | "created_at";
export type ScheduleSortOrder = "asc" | "desc";

export interface ScheduleSort {
	sortBy: ScheduleSortBy;
	order: ScheduleSortOrder;
}
