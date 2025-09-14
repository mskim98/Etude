"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoginPage } from "@/components/LoginPage";
import { useAuthStore, initializeAuthStore } from "@/store/auth";

/**
 * 로그인 페이지 컴포넌트
 * 1. 이미 로그인된 사용자 자동 리다이렉트 처리
 * 2. 사용자 상태에 따른 페이지 이동 (approve → dashboard, pending → pending-approval)
 * 3. LoginPage 컴포넌트 렌더링
 */
export default function Login() {
	const router = useRouter();
	const { user, isLoading: loading, getUserAccessStatus } = useAuthStore();
	const [isRedirecting, setIsRedirecting] = useState(false);

	// AuthStore 초기화 (앱 시작 시 인증 상태 복원)
	useEffect(() => {
		initializeAuthStore();
	}, []);

	// 이미 로그인된 사용자 자동 리다이렉트 처리
	useEffect(() => {
		if (loading || isRedirecting) return;

		if (user) {
			console.log("Login 페이지: 이미 로그인된 사용자 감지", { user: user.email });
			const accessStatus = getUserAccessStatus();
			console.log("Login 페이지: 접근 상태", accessStatus);

			setIsRedirecting(true);

			// 사용자 상태에 따른 페이지 이동
			switch (accessStatus) {
				case "approved":
					console.log("Login 페이지: approved 사용자 → dashboard로 이동");
					router.push("/dashboard");
					break;
				case "pending":
					console.log("Login 페이지: pending 사용자 → pending-approval로 이동");
					router.push("/pending-approval");
					break;
				case "denied":
				case "no_profile":
					console.log("Login 페이지: denied/no_profile 사용자 → 로그인 페이지 유지");
					// 접근 거부 또는 프로필 없음 - 로그인 페이지에 머물기
					setIsRedirecting(false);
					break;
			}
		}
	}, [user, loading, isRedirecting]); // router, getUserAccessStatus 제거로 리렌더링 최소화

	/**
	 * 로그인 성공 콜백
	 * 실제 리다이렉트는 위의 useEffect에서 사용자 상태 변화 감지하여 처리
	 * race condition 방지를 위해 여기서는 수동 리다이렉트 하지 않음
	 */
	const handleLoginSuccess = () => {
		console.log("Login 성공 콜백 실행");
		// 리다이렉트는 useEffect에서 user 상태 변화 감지하여 자동 처리
	};

	if (loading || (user && isRedirecting)) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">{loading ? "로딩 중..." : "리다이렉트 중..."}</p>
				</div>
			</div>
		);
	}

	return (
		<LoginPage
			onNavigate={(page) => {
				router.push(`/${page}`);
			}}
			onLoginSuccess={handleLoginSuccess}
		/>
	);
}
