"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore, initializeAuthStore } from "@/store/auth";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
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

		console.log("Dashboard Layout: 인증 상태 체크", {
			isAuthenticated,
			user: user?.email,
			hasProfile: !!user?.profile,
			loading,
			isRedirecting,
		});

		// 사용자가 있지만 프로필이 없으면 잠시 대기 (AuthStateManager가 로딩 중일 수 있음)
		if (user && !user.profile) {
			console.log("Dashboard Layout: 프로필 로딩 대기 중...");
			return;
		}

		// Redirect to login if not authenticated
		if (!isAuthenticated) {
			console.log("Dashboard Layout: 인증되지 않은 사용자 → login으로 이동");
			setIsRedirecting(true);
			router.push("/login");
			return;
		}

		// Check access permissions
		const accessStatus = getUserAccessStatus();
		console.log("Dashboard Layout: 접근 상태", accessStatus);

		if (accessStatus === "pending") {
			console.log("Dashboard Layout: pending 사용자 → pending-approval로 이동");
			setIsRedirecting(true);
			router.push("/pending-approval");
			return;
		}

		if (accessStatus === "denied" || accessStatus === "no_profile") {
			console.log("Dashboard Layout: denied/no_profile 사용자 → login으로 이동");
			setIsRedirecting(true);
			router.push("/login");
			return;
		}

		console.log("Dashboard Layout: approved 사용자 → 대시보드 표시");

		if (!canAccessLMS) {
			console.log("Dashboard Layout: LMS 접근 권한 없음 → login으로 이동");
			setIsRedirecting(true);
			router.push("/login");
			return;
		}
	}, [isAuthenticated, loading, canAccessLMS, isRedirecting, user]);

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

	const handleLogout = async () => {
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
	};

	// Navigation functions moved to DashboardNavigation component

	return (
		<div className="min-h-screen" style={{ backgroundColor: "#faf9f7" }}>
			{/* Modern Educational Header */}
			<header className="relative">
				{/* Background with gradient */}
				<div
					className="absolute inset-0"
					style={{
						background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
						borderBottom: "1px solid #e2e8f0",
					}}
				/>

				{/* Accent stripe */}
				<div
					className="absolute bottom-0 left-0 right-0 h-1"
					style={{
						background: "linear-gradient(90deg, #0091B3 0%, #00a8cc 50%, #0091B3 100%)",
					}}
				/>

				<div className="relative max-w-7xl mx-auto px-6">
					<div className="flex justify-between items-center h-20">
						{/* Logo & Brand Section */}
						<div className="flex items-center space-x-6">
							<div className="flex items-center space-x-4">
								{/* Enhanced Logo */}
								<div className="relative">
									<div
										className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-all duration-300"
										style={{
											background: "linear-gradient(135deg, #0091B3 0%, #00a8cc 100%)",
											boxShadow: "0 10px 25px rgba(0, 145, 179, 0.3)",
										}}
									>
										<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2.5}
												d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
											/>
										</svg>
									</div>
									{/* Glow effect */}
									<div
										className="absolute inset-0 rounded-2xl opacity-20 blur-xl"
										style={{ backgroundColor: "#0091B3" }}
									/>
								</div>

								{/* Brand Text */}
								<div>
									<h1 className="text-3xl font-bold tracking-tight" style={{ color: "#0091B3" }}>
										ETUDE
									</h1>
									<p className="text-sm font-medium text-gray-500 -mt-1.5">LMS</p>
								</div>
							</div>
						</div>

						{/* Center Navigation Pills */}
						<DashboardNavigation className="hidden md:flex" />

						{/* User Profile Section */}
						<div className="flex items-center space-x-4">
							{/* User Avatar & Info */}
							<div className="flex items-center space-x-3">
								<div
									className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white"
									style={{
										background: "linear-gradient(135deg, #0091B3 0%, #00a8cc 100%)",
										boxShadow: "0 4px 12px rgba(0, 145, 179, 0.3)",
									}}
								>
									{(user?.profile?.name || user?.email || "U").charAt(0).toUpperCase()}
								</div>
								<div className="hidden sm:block">
									<p className="text-sm font-bold text-gray-900">{user?.profile?.name || "User"}</p>
									<p className="text-xs font-medium text-gray-500 capitalize">{user?.profile?.role || "Student"}</p>
								</div>
							</div>

							{/* Logout Button */}
							<button
								onClick={handleLogout}
								className="flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
									/>
								</svg>
								<span className="hidden sm:inline">Logout</span>
							</button>
						</div>
					</div>

					{/* Mobile Navigation */}
					<div className="md:hidden border-t border-gray-100 bg-gray-50/50">
						<div className="px-4 py-3">
							<DashboardNavigation isMobile={true} />
						</div>
					</div>
				</div>
			</header>

			{/* Page Content */}
			<main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
		</div>
	);
}
