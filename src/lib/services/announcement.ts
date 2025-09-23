/**
 * @fileoverview Announcement 서비스 레이어 구현
 * @description 공지사항 관련 모든 비즈니스 로직과 Supabase 상호작용을 담당합니다.
 */

import { supabase } from "../supabase";
import type {
	Announcement,
	AnnouncementItem,
	CreateAnnouncementRequest,
	UpdateAnnouncementRequest,
	AnnouncementFilter,
	AnnouncementSort,
	UrgencyLevel,
	AnnouncementCategory,
	AnnouncementError,
	AnnouncerType,
} from "../../types/announcement";

/**
 * 공지사항 서비스 인터페이스
 * 공지사항 관련 모든 작업을 정의합니다.
 */
interface AnnouncementService {
	/**
	 * 공지사항 목록 조회
	 * @param filter 필터링 옵션
	 * @param sort 정렬 옵션
	 * @returns 공지사항 목록
	 */
	getAnnouncements(filter?: AnnouncementFilter, sort?: AnnouncementSort): Promise<AnnouncementItem[]>;

	/**
	 * 카테고리별 공지사항 조회
	 * @param category 카테고리 (ap/sat)
	 * @param limit 최대 개수
	 * @returns 카테고리별 공지사항 목록
	 */
	getAnnouncementsByCategory(category: AnnouncementCategory, limit?: number): Promise<AnnouncementItem[]>;

	/**
	 * 긴급도별 공지사항 조회
	 * @param urgency 긴급도
	 * @param limit 최대 개수
	 * @returns 긴급도별 공지사항 목록
	 */
	getAnnouncementsByUrgency(urgency: UrgencyLevel, limit?: number): Promise<AnnouncementItem[]>;

	/**
	 * 공지사항 생성
	 * @param data 생성할 공지사항 데이터
	 * @returns 생성된 공지사항 ID
	 */
	createAnnouncement(data: CreateAnnouncementRequest): Promise<string>;

	/**
	 * 공지사항 수정
	 * @param data 수정할 공지사항 데이터
	 * @returns 수정 성공 여부
	 */
	updateAnnouncement(data: UpdateAnnouncementRequest): Promise<boolean>;

	/**
	 * 공지사항 삭제 (소프트 삭제)
	 * @param announcementId 삭제할 공지사항 ID
	 * @returns 삭제 성공 여부
	 */
	deleteAnnouncement(announcementId: string): Promise<boolean>;
}

/**
 * 공지사항 서비스 구현 클래스
 * Supabase를 사용하여 공지사항 관련 모든 작업을 처리합니다.
 */
export class AnnouncementServiceImpl implements AnnouncementService {
	/**
	 * 공지사항 목록 조회 (작성자 정보 포함)
	 * @param filter 필터링 옵션
	 * @param sort 정렬 옵션
	 * @returns 공지사항 목록
	 */
	async getAnnouncements(
		filter?: AnnouncementFilter,
		sort: AnnouncementSort = { field: "createdAt", order: "desc" }
	): Promise<AnnouncementItem[]> {
		try {
			console.log("📢 공지사항 목록 조회 시작:", { filter, sort });

			// 인증 상태 확인
			const {
				data: { user },
				error: authError,
			} = await supabase.auth.getUser();
			console.log("📢 인증 상태:", { user: user?.email, authError });

			// 간단한 카운트 쿼리로 데이터 존재 확인
			const { count, error: countError } = await supabase
				.from("announcement")
				.select("*", { count: "exact", head: true })
				.is("deleted_at", null);
			console.log("📢 공지사항 총 개수:", { count, countError });

			// 기본 쿼리: 공지사항과 작성자 정보 조인
			let query = supabase
				.from("announcement")
				.select(
					`
					id,
					title,
					notification,
					urgency,
					category,
					announcer_type,
					created_at,
					announced_by,
					profile:announced_by (
						id,
						name,
						role
					)
				`
				)
				.is("deleted_at", null); // 삭제되지 않은 공지사항만

			// 카테고리 필터 적용
			if (filter?.category) {
				query = query.eq("category", filter.category);
			}

			// 긴급도 필터 적용
			if (filter?.urgency) {
				query = query.eq("urgency", filter.urgency);
			}

			// 정렬 적용
			if (sort.field === "urgency") {
				// 긴급도는 high > medium > low 순서
				const urgencyOrder = sort.order === "desc" ? ["high", "medium", "low"] : ["low", "medium", "high"];
				// Supabase에서는 CASE WHEN을 사용한 정렬이 제한적이므로 클라이언트에서 처리
			} else {
				query = query.order(sort.field === "createdAt" ? "created_at" : sort.field, {
					ascending: sort.order === "asc",
				});
			}

			// 최대 개수 제한
			if (filter?.limit) {
				query = query.limit(filter.limit);
			}

			const { data, error } = await query;

			console.log("📢 Supabase 쿼리 결과:", { data, error });

			if (error) {
				console.error("❌ 공지사항 조회 오류:", error);
				throw new Error(`공지사항을 불러오는데 실패했습니다: ${error.message}`);
			}

			if (!data || data.length === 0) {
				console.log("📢 조회된 공지사항이 없습니다.", { data });
				return [];
			}

			// 데이터 변환 및 추가 정렬 처리
			let announcements: AnnouncementItem[] = data.map((item) => ({
				id: item.id,
				title: item.title,
				content: item.notification,
				urgency: item.urgency as UrgencyLevel,
				category: item.category as AnnouncementCategory,
				announcerType: item.announcer_type as AnnouncerType,
				createdAt: new Date(item.created_at!),
				authorName: (item.profile as any)?.name || "System",
				authorRole: (item.profile as any)?.role || "admin",
			}));

			// 긴급도 정렬 (클라이언트에서 처리)
			if (sort.field === "urgency") {
				const urgencyPriority = { high: 3, medium: 2, low: 1 };
				announcements.sort((a, b) => {
					const priorityA = urgencyPriority[a.urgency];
					const priorityB = urgencyPriority[b.urgency];
					return sort.order === "desc" ? priorityB - priorityA : priorityA - priorityB;
				});
			}

			// 작성자 역할 필터 (클라이언트에서 처리)
			if (filter?.authorRole) {
				announcements = announcements.filter((announcement) => announcement.authorRole === filter.authorRole);
			}

			console.log(`✅ 공지사항 ${announcements.length}개 조회 성공`);
			return announcements;
		} catch (error) {
			console.error("❌ 공지사항 조회 중 오류:", error);
			throw error instanceof Error ? error : new Error("공지사항 조회 중 알 수 없는 오류가 발생했습니다.");
		}
	}

	/**
	 * 카테고리별 공지사항 조회
	 * @param category 카테고리
	 * @param limit 최대 개수
	 * @returns 카테고리별 공지사항 목록
	 */
	async getAnnouncementsByCategory(category: AnnouncementCategory, limit = 10): Promise<AnnouncementItem[]> {
		return this.getAnnouncements({ category, limit }, { field: "createdAt", order: "desc" });
	}

	/**
	 * 긴급도별 공지사항 조회
	 * @param urgency 긴급도
	 * @param limit 최대 개수
	 * @returns 긴급도별 공지사항 목록
	 */
	async getAnnouncementsByUrgency(urgency: UrgencyLevel, limit = 10): Promise<AnnouncementItem[]> {
		return this.getAnnouncements({ urgency, limit }, { field: "createdAt", order: "desc" });
	}

	/**
	 * 공지사항 생성
	 * @param data 생성할 공지사항 데이터
	 * @returns 생성된 공지사항 ID
	 */
	async createAnnouncement(data: CreateAnnouncementRequest): Promise<string> {
		try {
			console.log("📢 공지사항 생성 시작:", data);

			// Supabase RPC 함수 호출
			const { data: result, error } = await supabase.rpc("create_announcement" as any, {
				p_title: data.title,
				p_notification: data.notification,
				p_urgency: data.urgency || "medium",
				p_category: data.category || "ap",
			} as any);

			if (error) {
				console.error("❌ 공지사항 생성 오류:", error);
				throw new Error(`공지사항 생성에 실패했습니다: ${error.message}`);
			}

			if (!result) {
				throw new Error("공지사항 생성에 실패했습니다: 결과가 없습니다.");
			}

			console.log("✅ 공지사항 생성 성공:", result);
			return result;
		} catch (error) {
			console.error("❌ 공지사항 생성 중 오류:", error);
			throw error instanceof Error ? error : new Error("공지사항 생성 중 알 수 없는 오류가 발생했습니다.");
		}
	}

	/**
	 * 공지사항 수정
	 * @param data 수정할 공지사항 데이터
	 * @returns 수정 성공 여부
	 */
	async updateAnnouncement(data: UpdateAnnouncementRequest): Promise<boolean> {
		try {
			console.log("📢 공지사항 수정 시작:", data);

			// Supabase RPC 함수 호출
			const { data: result, error } = await supabase.rpc("update_announcement" as any, {
				p_announcement_id: data.announcementId,
				p_title: data.title || null,
				p_notification: data.notification || null,
				p_urgency: data.urgency || null,
				p_category: data.category || null,
			} as any);

			if (error) {
				console.error("❌ 공지사항 수정 오류:", error);
				throw new Error(`공지사항 수정에 실패했습니다: ${error.message}`);
			}

			console.log("✅ 공지사항 수정 성공:", result);
			return result || false;
		} catch (error) {
			console.error("❌ 공지사항 수정 중 오류:", error);
			throw error instanceof Error ? error : new Error("공지사항 수정 중 알 수 없는 오류가 발생했습니다.");
		}
	}

	/**
	 * 공지사항 삭제 (소프트 삭제)
	 * @param announcementId 삭제할 공지사항 ID
	 * @returns 삭제 성공 여부
	 */
	async deleteAnnouncement(announcementId: string): Promise<boolean> {
		try {
			console.log("📢 공지사항 삭제 시작:", announcementId);

			// Supabase RPC 함수 호출
			const { data: result, error } = await supabase.rpc("delete_announcement" as any, {
				p_announcement_id: announcementId,
			} as any);

			if (error) {
				console.error("❌ 공지사항 삭제 오류:", error);
				throw new Error(`공지사항 삭제에 실패했습니다: ${error.message}`);
			}

			console.log("✅ 공지사항 삭제 성공:", result);
			return result || false;
		} catch (error) {
			console.error("❌ 공지사항 삭제 중 오류:", error);
			throw error instanceof Error ? error : new Error("공지사항 삭제 중 알 수 없는 오류가 발생했습니다.");
		}
	}
}

// 유틸리티 함수들

/**
 * 긴급도를 영어로 변환
 * @param urgency 긴급도
 * @returns 영어 긴급도
 */
export function getUrgencyText(urgency: UrgencyLevel): string {
	switch (urgency) {
		case "high":
			return "High";
		case "medium":
			return "Medium";
		case "low":
			return "Low";
		default:
			return "Medium";
	}
}

/**
 * 카테고리를 영어로 변환
 * @param category 카테고리
 * @returns 영어 카테고리
 */
export function getCategoryText(category: AnnouncementCategory): string {
	switch (category) {
		case "ap":
			return "AP";
		case "sat":
			return "SAT";
		default:
			return "General";
	}
}

/**
 * 공지자 타입을 영어로 변환
 * @param announcerType 공지자 타입
 * @returns 영어 공지자 타입
 */
export function getAnnouncerTypeText(announcerType: AnnouncerType): string {
	switch (announcerType) {
		case "admin":
			return "Operations Team";
		case "teacher":
			return "Teacher";
		default:
			return "Operations Team";
	}
}

/**
 * 긴급도에 따른 색상 클래스 반환
 * @param urgency 긴급도
 * @returns Tailwind CSS 색상 클래스
 */
export function getUrgencyColorClass(urgency: UrgencyLevel): string {
	switch (urgency) {
		case "high":
			return "text-red-600 bg-red-50 border-red-200";
		case "medium":
			return "text-orange-600 bg-orange-50 border-orange-200";
		case "low":
			return "text-green-600 bg-green-50 border-green-200";
		default:
			return "text-gray-600 bg-gray-50 border-gray-200";
	}
}

/**
 * 날짜를 상대적 시간으로 변환 (영어)
 * @param date 날짜
 * @returns 상대적 시간 문자열
 */
export function getRelativeTimeText(date: Date): string {
	const now = new Date();
	const diffInMs = now.getTime() - date.getTime();
	const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
	const diffInHours = Math.floor(diffInMinutes / 60);
	const diffInDays = Math.floor(diffInHours / 24);

	if (diffInMinutes < 60) {
		return `${diffInMinutes} min ago`;
	} else if (diffInHours < 24) {
		return `${diffInHours} hr ago`;
	} else if (diffInDays < 7) {
		return `${diffInDays} days ago`;
	} else {
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	}
}

// 싱글톤 인스턴스 생성 및 내보내기
export const announcementService = new AnnouncementServiceImpl();
