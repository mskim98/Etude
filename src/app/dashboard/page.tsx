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
		{
			id: "ap-physics-1",
			name: "AP Physics 1",
			type: "AP",
			progress: 60,
			totalChapters: 10,
			completedChapters: 6,
			lastScore: 4,
			icon: "⚛️",
			examDate: new Date("2025-05-12"),
		},
		{
			id: "ap-calculus-ab",
			name: "AP Calculus AB",
			type: "AP",
			progress: 75,
			totalChapters: 8,
			completedChapters: 6,
			lastScore: 5,
			icon: "📐",
			examDate: new Date("2025-05-05"),
		},
		{
			id: "ap-psychology",
			name: "AP Psychology",
			type: "AP",
			progress: 85,
			totalChapters: 14,
			completedChapters: 12,
			lastScore: 4,
			icon: "🧠",
			examDate: new Date("2025-05-09"),
		},
		{
			id: "ap-computer-science-a",
			name: "AP Computer Science A",
			type: "AP",
			progress: 40,
			totalChapters: 12,
			completedChapters: 5,
			lastScore: 3,
			icon: "💻",
			examDate: new Date("2025-05-08"),
		},
		{
			id: "ap-statistics",
			name: "AP Statistics",
			type: "AP",
			progress: 55,
			totalChapters: 11,
			completedChapters: 6,
			lastScore: 4,
			icon: "📊",
			examDate: new Date("2025-05-15"),
		},
	];

	// Mock AP exams data
	const apExams: APExam[] = [
		// Chemistry Exams
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
			examId: "chem-002",
			title: "Thermodynamics & Kinetics",
			description: "Advanced exam covering chemical thermodynamics, reaction rates, and equilibrium principles.",
			duration: 105,
			questionCount: 52,
			difficulty: "Hard",
			hasExplanatoryVideo: true,
			videoLength: 30,
			completed: false,
			attempts: 1,
			averageScore: 3.4,
			completionRate: 72,
			lastAttempt: new Date("2024-11-20"),
			subject: "Chemistry",
		},
		{
			examId: "chem-003",
			title: "Acids, Bases & Electrochemistry",
			description: "Exam focusing on acid-base reactions, pH calculations, and electrochemical processes.",
			duration: 95,
			questionCount: 48,
			difficulty: "Medium",
			hasExplanatoryVideo: true,
			videoLength: 28,
			completed: false,
			attempts: 0,
			averageScore: 3.6,
			completionRate: 78,
			subject: "Chemistry",
		},
		{
			examId: "chem-004",
			title: "Organic Chemistry Basics",
			description: "Introduction to organic chemistry including hydrocarbons, functional groups, and basic reactions.",
			duration: 85,
			questionCount: 40,
			difficulty: "Easy",
			hasExplanatoryVideo: false,
			completed: false,
			attempts: 0,
			averageScore: 4.1,
			completionRate: 85,
			subject: "Chemistry",
		},

		// Biology Exams
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
		{
			examId: "bio-002",
			title: "Genetics & Evolution",
			description: "Comprehensive exam on Mendelian genetics, molecular genetics, and evolutionary principles.",
			duration: 110,
			questionCount: 55,
			difficulty: "Hard",
			hasExplanatoryVideo: true,
			videoLength: 35,
			completed: true,
			score: 4,
			attempts: 2,
			averageScore: 3.5,
			completionRate: 68,
			lastAttempt: new Date("2024-12-05"),
			subject: "Biology",
		},
		{
			examId: "bio-003",
			title: "Ecology & Environmental Science",
			description: "Exam covering ecosystem dynamics, population ecology, and environmental interactions.",
			duration: 95,
			questionCount: 45,
			difficulty: "Medium",
			hasExplanatoryVideo: true,
			videoLength: 26,
			completed: false,
			attempts: 1,
			averageScore: 3.7,
			completionRate: 81,
			lastAttempt: new Date("2024-11-15"),
			subject: "Biology",
		},
		{
			examId: "bio-004",
			title: "Human Anatomy & Physiology",
			description: "Detailed exam on human body systems, homeostasis, and physiological processes.",
			duration: 120,
			questionCount: 60,
			difficulty: "Hard",
			hasExplanatoryVideo: true,
			videoLength: 40,
			completed: false,
			attempts: 0,
			averageScore: 3.3,
			completionRate: 74,
			subject: "Biology",
		},

		// Psychology Exams
		{
			examId: "psy-001",
			title: "Biological Bases of Behavior",
			description: "Exam covering neuroanatomy, neurotransmitters, and the biological foundations of behavior.",
			duration: 90,
			questionCount: 45,
			difficulty: "Medium",
			hasExplanatoryVideo: true,
			videoLength: 25,
			completed: true,
			score: 4,
			attempts: 1,
			averageScore: 3.6,
			completionRate: 79,
			lastAttempt: new Date("2024-12-08"),
			subject: "Psychology",
		},
		{
			examId: "psy-002",
			title: "Learning & Memory",
			description: "Comprehensive exam on classical conditioning, operant conditioning, and memory processes.",
			duration: 85,
			questionCount: 42,
			difficulty: "Easy",
			hasExplanatoryVideo: true,
			videoLength: 20,
			completed: false,
			attempts: 2,
			averageScore: 4.0,
			completionRate: 88,
			lastAttempt: new Date("2024-11-25"),
			subject: "Psychology",
		},
		{
			examId: "psy-003",
			title: "Cognitive Psychology",
			description: "Advanced exam covering perception, thinking, problem-solving, and decision-making processes.",
			duration: 100,
			questionCount: 50,
			difficulty: "Hard",
			hasExplanatoryVideo: true,
			videoLength: 32,
			completed: false,
			attempts: 0,
			averageScore: 3.4,
			completionRate: 71,
			subject: "Psychology",
		},
		{
			examId: "psy-004",
			title: "Developmental Psychology",
			description: "Exam focusing on human development across the lifespan, from infancy to old age.",
			duration: 95,
			questionCount: 48,
			difficulty: "Medium",
			hasExplanatoryVideo: false,
			completed: false,
			attempts: 0,
			averageScore: 3.8,
			completionRate: 83,
			subject: "Psychology",
		},
		{
			examId: "psy-005",
			title: "Social Psychology",
			description:
				"Comprehensive exam on social influence, group behavior, attitudes, and interpersonal relationships.",
			duration: 90,
			questionCount: 45,
			difficulty: "Medium",
			hasExplanatoryVideo: true,
			videoLength: 28,
			completed: false,
			attempts: 0,
			averageScore: 3.7,
			completionRate: 80,
			subject: "Psychology",
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
