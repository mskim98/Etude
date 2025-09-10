"use client";

import { useRouter } from "next/navigation";
import { Dashboard } from "@/components/Dashboard";
import type { User, Subject, APExam } from "@/types";

export default function DashboardPage() {
	const router = useRouter();

	// Mock user data
	const user: User = {
		id: "1",
		email: "test@test.com",
		name: "Test User",
	};

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

	return (
		<Dashboard
			user={user}
			subjects={subjects}
			apExams={apExams}
			onStartExam={handleStartExam}
			onViewResults={handleViewResults}
			onNavigate={(page) => {
				// Next.js 라우팅으로 페이지 이동
				router.push(`/${page}`);
			}}
			onLogout={() => {
				// 로그아웃 시 홈페이지로 이동
				console.log("Logout");
				router.push("/");
			}}
		/>
	);
}
