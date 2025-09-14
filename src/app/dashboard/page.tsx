"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { useAuthStore, initializeAuthStore } from "@/store/auth";
import type { Subject, APExam } from "@/types";

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
		if (loading || isRedirecting) return;

		console.log("Dashboard 페이지: 인증 상태 체크", {
			isAuthenticated,
			user: user?.email,
			loading,
			isRedirecting,
		});

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
			setIsRedirecting(true);
			router.push("/login");
			return;
		}
	}, [isAuthenticated, loading, canAccessLMS, isRedirecting]); // Removed router and getUserAccessStatus to reduce re-renders

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

	// Mock subjects data
	const subjects: Subject[] = [
		{
			id: "sat-test-4",
			name: "SAT Practice Test 4",
			type: "SAT",
			progress: 67,
			totalChapters: 3,
			completedChapters: 2,
			lastScore: undefined,
			icon: "📋",
			examDate: new Date("2025-09-05"),
			sectionProgress: {
				reading: {
					progress: 100,
					completed: true,
					score: 680,
				},
				writing: {
					progress: 0,
					completed: false,
					score: undefined,
				},
				math: {
					progress: 100,
					completed: true,
					score: 750,
				},
			},
		},
		{
			id: "ap-chemistry",
			name: "AP Chemistry",
			type: "AP",
			progress: 45,
			totalChapters: 15,
			completedChapters: 7,
			lastScore: 4,
			icon: "🧪",
			examDate: new Date("2025-05-15"),
		},
		{
			id: "ap-biology",
			name: "AP Biology",
			type: "AP",
			progress: 30,
			totalChapters: 12,
			completedChapters: 4,
			lastScore: 3,
			icon: "🧬",
			examDate: new Date("2025-05-12"),
		},
	];

	// Mock AP exams data
	const apExams: APExam[] = [
		{
			examId: "chem-001",
			title: "Atomic Structure & Bonding",
			description:
				"Comprehensive exam covering atomic theory, electron configuration, periodic trends, and chemical bonding.",
			duration: 90,
			questionCount: 45,
			difficulty: "Medium",
			hasExplanatoryVideo: true,
			videoLength: 25,
			completed: true,
			score: 4,
			attempts: 2,
			averageScore: 3.8,
			completionRate: 89,
			lastAttempt: new Date("2024-12-15"),
			subject: "Chemistry",
		},
		{
			examId: "bio-001",
			title: "Cell Biology & Metabolism",
			description:
				"Fundamental exam covering cell structure, membrane transport, cellular respiration, and photosynthesis.",
			duration: 100,
			questionCount: 50,
			difficulty: "Easy",
			hasExplanatoryVideo: true,
			videoLength: 22,
			completed: true,
			score: 3,
			attempts: 3,
			averageScore: 3.2,
			completionRate: 76,
			lastAttempt: new Date("2024-12-10"),
			subject: "Biology",
		},
	];

	const handleStartExam = (subject: Subject) => {
		// 시험 시작 로직 - 과목 타입에 따라 다른 페이지로 이동
		console.log("Starting exam for:", subject.name);
		if (subject.type === "AP") {
			router.push("/ap-exam");
		} else {
			router.push("/exam");
		}
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
				subjects={subjects}
				apExams={apExams}
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

						// Add timeout to prevent infinite loading
						const signOutPromise = signOut();
						const timeoutPromise = new Promise((_, reject) =>
							setTimeout(() => reject(new Error("로그아웃 시간이 초과되었습니다")), 5000)
						);

						await Promise.race([signOutPromise, timeoutPromise]);
						console.log("대시보드 로그아웃 완료");

						// Small delay before redirect to ensure state is cleared
						setTimeout(() => {
							router.push("/");
						}, 100);
					} catch (error) {
						console.error("대시보드 로그아웃 실패:", error);

						// If normal logout fails, try force logout
						try {
							console.log("강제 로그아웃 시도");
							await forceLogout();
						} catch (forceError) {
							console.error("강제 로그아웃도 실패:", forceError);
						}

						// 에러가 발생해도 홈페이지로 이동
						router.push("/");
					} finally {
						setIsRedirecting(false);
					}
				}}
			/>
		</div>
	);
}
