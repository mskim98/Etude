/**
 * @fileoverview Announcement 관련 TypeScript 타입 정의
 * @description 공지사항 기능에 사용되는 모든 인터페이스와 타입들을 정의합니다.
 */

import { Database } from "./supabase";

// Supabase 테이블 타입 추출
export type AnnouncementRow = Database["public"]["Tables"]["announcement"]["Row"];
export type AnnouncementInsert = Database["public"]["Tables"]["announcement"]["Insert"];
export type AnnouncementUpdate = Database["public"]["Tables"]["announcement"]["Update"];

// 공지자 타입 (새로운 ENUM)
export type AnnouncerType = "teacher" | "admin" | "system";

// 사용자 프로필 정보 포함한 확장된 공지사항 타입
export interface Announcement {
	/** 공지사항 고유 ID */
	id: string;
	/** 공지사항 작성자 ID */
	announcedBy: string;
	/** 공지사항 제목 */
	title: string;
	/** 공지사항 내용 */
	notification: string;
	/** 긴급도 (low, medium, high) */
	urgency: UrgencyLevel;
	/** 카테고리 (ap, sat) */
	category: AnnouncementCategory;
	/** 공지자 타입 */
	announcerType: AnnouncerType;
	/** 생성일시 */
	createdAt: Date;
	/** 수정일시 */
	updatedAt: Date | null;
	/** 삭제일시 (소프트 삭제) */
	deletedAt: Date | null;
	/** 작성자 정보 (JOIN된 데이터) */
	author?: {
		id: string;
		name: string;
		role: "student" | "teacher" | "admin";
	};
}

// 공지사항 목록 아이템 (UI 컴포넌트용)
export interface AnnouncementItem {
	/** 공지사항 고유 ID */
	id: string;
	/** 공지사항 제목 */
	title: string;
	/** 공지사항 내용 */
	content: string;
	/** 긴급도 */
	urgency: UrgencyLevel;
	/** 카테고리 */
	category: AnnouncementCategory;
	/** 공지자 타입 */
	announcerType: AnnouncerType;
	/** 생성일시 */
	createdAt: Date;
	/** 작성자 이름 */
	authorName: string;
	/** 작성자 역할 */
	authorRole: "student" | "teacher" | "admin";
}

// 공지사항 생성 요청 데이터
export interface CreateAnnouncementRequest {
	/** 공지사항 제목 */
	title: string;
	/** 공지사항 내용 */
	notification: string;
	/** 긴급도 (기본값: medium) */
	urgency?: UrgencyLevel;
	/** 카테고리 (기본값: ap) */
	category?: AnnouncementCategory;
	/** 공지자 타입 (자동 결정됨) */
	announcerType?: AnnouncerType;
}

// 공지사항 수정 요청 데이터
export interface UpdateAnnouncementRequest {
	/** 수정할 공지사항 ID */
	announcementId: string;
	/** 수정할 공지사항 제목 (선택적) */
	title?: string;
	/** 수정할 공지사항 내용 (선택적) */
	notification?: string;
	/** 수정할 긴급도 (선택적) */
	urgency?: UrgencyLevel;
	/** 수정할 카테고리 (선택적) */
	category?: AnnouncementCategory;
}

// 긴급도 타입 (Supabase ENUM과 동일)
export type UrgencyLevel = Database["public"]["Enums"]["urgency_level"];

// 카테고리 타입 (Supabase ENUM과 동일)
export type AnnouncementCategory = Database["public"]["Enums"]["exam_category"];

// 긴급도 enum (편의성을 위한 상수)
export const UrgencyLevels = {
	LOW: "low" as const,
	MEDIUM: "medium" as const,
	HIGH: "high" as const,
} as const;

// 카테고리 enum (편의성을 위한 상수)
export const AnnouncementCategories = {
	AP: "ap" as const,
	SAT: "sat" as const,
} as const;

// useAnnouncements 훅의 상태 타입
export interface UseAnnouncementsState {
	/** 공지사항 목록 */
	announcements: AnnouncementItem[];
	/** 로딩 상태 */
	isLoading: boolean;
	/** 에러 상태 */
	error: string | null;
	/** 새로고침 중 상태 */
	isRefreshing: boolean;
}

// 공지사항 필터링 옵션
export interface AnnouncementFilter {
	/** 카테고리 필터 */
	category?: AnnouncementCategory;
	/** 긴급도 필터 */
	urgency?: UrgencyLevel;
	/** 작성자 역할 필터 */
	authorRole?: "teacher" | "admin";
	/** 최대 개수 제한 */
	limit?: number;
}

// 공지사항 정렬 옵션
export interface AnnouncementSort {
	/** 정렬 기준 필드 */
	field: "createdAt" | "urgency" | "category";
	/** 정렬 순서 */
	order: "asc" | "desc";
}

// 공지사항 서비스 에러 타입
export interface AnnouncementError {
	/** 에러 코드 */
	code: string;
	/** 에러 메시지 */
	message: string;
	/** 상세 에러 정보 */
	details?: unknown;
}
