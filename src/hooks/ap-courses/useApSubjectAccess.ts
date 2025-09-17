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

			const { data, error } = await supabase
				.from("user_ap_subject")
				.select(
					`
					*,
					user_service:user_service_id (
						id,
						is_active,
						service:service_id (
							id,
							service_name,
							category,
							is_active
						)
					)
				`
				)
				.eq("subject_id", subjectId)
				.eq("user_id", user.id) // 새로 추가된 user_id 필드 사용
				.single();

			if (error) {
				console.error("Error checking AP subject access:", error);
				return null;
			}

			if (!data) return null;

			// 조건 체크
			const now = new Date();
			const startAt = data.start_at ? new Date(data.start_at) : null;
			const endAt = data.end_at ? new Date(data.end_at) : null;

			const hasUserServiceAccess = data.user_service?.is_active === true;
			const hasSubjectAccess = data.is_active === true;
			const isWithinPeriod = (!startAt || startAt <= now) && (!endAt || now <= endAt);
			const isServiceActive = data.user_service?.service?.is_active === true;

			return {
				hasAccess: hasUserServiceAccess && hasSubjectAccess && isWithinPeriod,
				hasUserServiceAccess,
				hasSubjectAccess,
				isWithinPeriod,
				isServiceActive,
				startAt,
				endAt,
				subjectData: data,
			};
		},
		enabled: !!user?.id && !!subjectId,
		staleTime: 5 * 60 * 1000, // 5분
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

			const { data, error } = await supabase
				.from("ap")
				.select(
					`
					id,
					title,
					is_active,
					service:service_id (
						id,
						service_name,
						category,
						is_active
					)
				`
				)
				.eq("id", subjectId)
				.single();

			if (error) {
				console.error("Error checking service status:", error);
				return null;
			}

			return {
				isServiceActive: data.service?.is_active === true,
				isSubjectActive: data.is_active === true,
				isSystemAvailable: data.service?.is_active === true && data.is_active === true,
				serviceData: data,
			};
		},
		enabled: !!subjectId,
		staleTime: 5 * 60 * 1000, // 5분
	});
};
