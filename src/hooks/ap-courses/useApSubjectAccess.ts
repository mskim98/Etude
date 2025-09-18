import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth";

/**
 * 사용자의 AP 과목별 접근 권한을 확인하는 훅
 *
 * 체크 조건:
 * 1. user_service.is_active = true
 * 2. user_ap_subject.is_active = true
 * 3. user_ap_subject.start_at <= now <= user_ap_subject.end_at (기간 체크)
 */
export const useApSubjectAccess = (subjectId?: string) => {
	const { user } = useAuthStore();

	return useQuery({
		queryKey: ["ap-subject-access", user?.id, subjectId],
		queryFn: async () => {
			if (!user?.id || !subjectId) return null;

			// 새로운 VIEW를 사용하여 성능 최적화
			const { data, error } = await supabase
				.from("user_ap_access_view")
				.select("*")
				.eq("subject_id", subjectId)
				.eq("user_id", user.id)
				.single();

			if (error) {
				console.error("Error checking AP subject access:", error);
				return null;
			}

			if (!data) return null;

			// VIEW에서 미리 계산된 필드들을 사용
			const startAt = data.access_start_date ? new Date(data.access_start_date) : null;
			const endAt = data.access_end_date ? new Date(data.access_end_date) : null;

			return {
				hasAccess: data.has_full_access,
				hasUserServiceAccess: data.service_access_active,
				hasSubjectAccess: data.subject_access_active,
				isWithinPeriod: data.access_period_started && data.access_period_valid,
				isServiceActive: data.service_active,
				startAt,
				endAt,
				subjectData: data,
			};
		},
		enabled: !!user?.id && !!subjectId,
		staleTime: 5 * 60 * 1000, // 5분 - 권한 정보는 자주 변경되지 않음
		gcTime: 10 * 60 * 1000, // 10분 - 메모리에서 제거되기까지의 시간
		retry: 2, // 실패 시 2번까지 재시도
		refetchOnWindowFocus: false, // 창 포커스 시 자동 재조회 비활성화
	});
};

/**
 * 서비스 및 AP 과목의 활성화 상태를 확인하는 훅
 *
 * 체크 조건:
 * 1. service.is_active = true
 * 2. ap.is_active = true
 */
export const useServiceStatus = (subjectId?: string) => {
	return useQuery({
		queryKey: ["service-status", subjectId],
		queryFn: async () => {
			if (!subjectId) return null;

			// 새로운 VIEW를 사용하여 성능 최적화
			const { data, error } = await supabase.from("ap_subject_detail_view").select("*").eq("id", subjectId).single();

			if (error) {
				console.error("Error checking service status:", error);
				return null;
			}

			return {
				isServiceActive: data.service_active,
				isSubjectActive: data.is_active,
				isSystemAvailable: data.service_active && data.is_active,
				serviceData: data,
			};
		},
		enabled: !!subjectId,
		staleTime: 5 * 60 * 1000, // 5분 - 서비스 상태는 자주 변경되지 않음
		gcTime: 10 * 60 * 1000, // 10분
		retry: 2,
		refetchOnWindowFocus: false
	});
};
