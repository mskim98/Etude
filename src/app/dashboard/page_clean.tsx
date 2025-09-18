"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { useAuthStore, initializeAuthStore } from "@/store/auth";
import type { Subject } from "@/types";

export default function DashboardPage() {
	const router = useRouter();
	const {
		user,
		isAuthenticated,
		isLoading: loading,
		canAccessLMS,
		getUserAccessStatus,
		signOut,
		forceLogout,
	} = useAuthStore();
	const [isRedirecting, setIsRedirecting] = useState(false);

	// Initialize auth store
	useEffect(() => {
		initializeAuthStore();
	}, []);

	// Handle authentication and access control
	useEffect(() => {
		// 로딩 중이거나 이미 리다이렉트 중이면 아무것도 하지 않음
		if (loading || isRedirecting) return;

		console.log("Dashboard 페이지: 인증 상태 체크", {
			isAuthenticated,
			user: user?.email,
			hasProfile: !!user?.profile,
			loading,
			isRedirecting,
		});

		// 사용자가 있지만 프로필이 없으면 잠시 대기 (AuthStateManager가 로딩 중일 수 있음)
		if (user && !user.profile) {
			console.log("Dashboard 페이지: 프로필 로딩 대기 중...");
			return;
		}

		// Redirect to login if not authenticated
		if (!isAuthenticated) {
			console.log("Dashboard 페이지: 인증되지 않은 사용자 → login으로 이동");
			setIsRedirecting(true);
			router.push("/login");
			return;
		}

		// Check access permissions
		const accessStatus = getUserAccessStatus();
		console.log("Dashboard 페이지: 접근 상태", accessStatus);

		if (accessStatus === "pending") {
			console.log("Dashboard 페이지: pending 사용자 → pending-approval로 이동");
			setIsRedirecting(true);
			router.push("/pending-approval");
			return;
		}

		if (accessStatus === "denied" || accessStatus === "no_profile") {
			console.log("Dashboard 페이지: denied/no_profile 사용자 → login으로 이동");
			setIsRedirecting(true);
			router.push("/login");
			return;
		}

		console.log("Dashboard 페이지: approved 사용자 → 대시보드 표시");

		if (!canAccessLMS) {
			console.log("Dashboard 페이지: LMS 접근 권한 없음 → login으로 이동");
			setIsRedirecting(true);
			router.push("/login");
			return;
		}
	}, [isAuthenticated, loading, canAccessLMS, isRedirecting, user]); // user 추가해서 프로필 로딩 상태 감지

	// Show loading while checking authentication or redirecting
	if (loading || isRedirecting || !isAuthenticated || !canAccessLMS) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">{loading ? "로딩 중..." : "리다이렉트 중..."}</p>
				</div>
			</div>
		);
	}

	// Event handlers
	const handleStartExam = (subject: Subject) => {
		console.log("Starting exam for subject:", subject);
		// Navigate to exam page with subject info
		router.push(`/exam?subject=${subject.id}`);
	};

	const handleViewResults = () => {
		// AP 시험 결과 보기 - AP 결과 페이지로 이동
		console.log("Viewing AP exam results");
		router.push("/ap-results");
	};

	// Convert AuthUser to User type for Dashboard component
	const dashboardUser = user
		? {
				id: user.id,
				email: user.email,
				name: user.profile?.name || "User",
		  }
		: null;

	return (
		<div>
			<Dashboard
				user={dashboardUser}
				onStartExam={handleStartExam}
				onViewResults={handleViewResults}
				onNavigate={(page) => {
					// Next.js 라우팅으로 페이지 이동
					router.push(`/${page}`);
				}}
				onLogout={async () => {
					// 로그아웃 시 홈페이지로 이동
					try {
						console.log("대시보드 로그아웃 시작");
						setIsRedirecting(true);
						await signOut();
						console.log("대시보드 로그아웃 완료");
						router.push("/");
					} catch (error) {
						console.error("대시보드 로그아웃 실패:", error);
						// 강제 로그아웃 시도
						forceLogout();
						router.push("/");
					}
				}}
			/>
		</div>
	);
}
