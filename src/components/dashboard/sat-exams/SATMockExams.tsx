"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Progress } from "../../ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Target, BookOpen, Edit3, Calculator, Play, CheckCircle2, TrendingUp, Clock, BarChart3 } from "lucide-react";
import type { Subject } from "@/types";

interface SATMockExamsProps {
	onStartExam: (examId: string) => void;
	selectedSubject?: Subject | null;
	onTabChange?: () => void;
	className?: string;
}

export function SATMockExams({ onStartExam, selectedSubject, onTabChange, className }: SATMockExamsProps) {
	// Mock SAT subjects data for exam date functionality
	const subjects = [
		{
			id: "sat-subject-1",
			name: "SAT",
			type: "SAT" as const,
			progress: 0,
			totalChapters: 0,
			examDate: new Date("2024-08-24"), // Next SAT exam date (August 2024)
		},
		{
			id: "sat-subject-2",
			name: "SAT",
			type: "SAT" as const,
			progress: 0,
			totalChapters: 0,
			examDate: new Date("2024-10-05"), // Fall SAT exam date
		},
	];

	// Mock SAT practice tests with diverse scenarios and realistic data
	const satPracticeTests = [
		// High Performers - Excellent scores
		{
			id: "sat-test-1",
			title: "SAT Practice Test 1",
			completed: true,
			attempts: 1,
			duration: 180,
			scores: {
				reading: 380,
				writing: 390,
				math: 780,
				total: 1550,
			},
			percentile: 98,
			lastAttempt: new Date("2025-01-26"),
			timeSpent: 165,
		},
		{
			id: "sat-test-2",
			title: "Official SAT Practice Test A",
			completed: true,
			attempts: 1,
			duration: 180,
			scores: {
				reading: 370,
				writing: 380,
				math: 760,
				total: 1510,
			},
			percentile: 96,
			lastAttempt: new Date("2025-01-20"),
			timeSpent: 170,
		},

		// Good Performers - Above average scores
		{
			id: "sat-test-3",
			title: "SAT Practice Test 2",
			completed: true,
			attempts: 2,
			duration: 180,
			scores: {
				reading: 350,
				writing: 370,
				math: 720,
				total: 1440,
			},
			percentile: 92,
			lastAttempt: new Date("2025-01-15"),
			timeSpent: 175,
		},
		{
			id: "sat-test-4",
			title: "Official SAT Practice Test B",
			completed: true,
			attempts: 1,
			duration: 180,
			scores: {
				reading: 340,
				writing: 360,
				math: 700,
				total: 1400,
			},
			percentile: 88,
			lastAttempt: new Date("2025-01-10"),
			timeSpent: 180,
		},

		// Average Performers - Middle range scores
		{
			id: "sat-test-5",
			title: "SAT Practice Test 3",
			completed: true,
			attempts: 3,
			duration: 180,
			scores: {
				reading: 320,
				writing: 340,
				math: 650,
				total: 1310,
			},
			percentile: 78,
			lastAttempt: new Date("2025-01-05"),
			timeSpent: 175,
		},
		{
			id: "sat-test-6",
			title: "SAT Practice Test 4",
			completed: true,
			attempts: 2,
			duration: 180,
			scores: {
				reading: 310,
				writing: 330,
				math: 620,
				total: 1260,
			},
			percentile: 72,
			lastAttempt: new Date("2024-12-28"),
			timeSpent: 180,
		},

		// Struggling Performers - Below average but improving
		{
			id: "sat-test-7",
			title: "SAT Practice Test 5",
			completed: true,
			attempts: 4,
			duration: 180,
			scores: {
				reading: 290,
				writing: 300,
				math: 580,
				total: 1170,
			},
			percentile: 58,
			lastAttempt: new Date("2024-12-20"),
			timeSpent: 180,
		},
		{
			id: "sat-test-8",
			title: "SAT Practice Test 6",
			completed: true,
			attempts: 2,
			duration: 180,
			scores: {
				reading: 280,
				writing: 290,
				math: 550,
				total: 1120,
			},
			percentile: 52,
			lastAttempt: new Date("2024-12-15"),
			timeSpent: 180,
		},

		// Incomplete Tests - Various progress states
		{
			id: "sat-test-9",
			title: "SAT Practice Test 7",
			completed: false,
			attempts: 0,
			duration: 180,
			scores: null,
			percentile: null,
			timeSpent: null,
		},
		{
			id: "sat-test-10",
			title: "SAT Practice Test 8",
			completed: false,
			attempts: 0,
			duration: 180,
			scores: null,
			percentile: null,
			timeSpent: null,
		},
		{
			id: "sat-test-11",
			title: "Official SAT Practice Test C",
			completed: false,
			attempts: 0,
			duration: 180,
			scores: null,
			percentile: null,
			timeSpent: null,
		},
		{
			id: "sat-test-12",
			title: "SAT Practice Test 9",
			completed: false,
			attempts: 0,
			duration: 180,
			scores: null,
			percentile: null,
			timeSpent: null,
		},

		// Specialized Tests
		{
			id: "sat-test-13",
			title: "SAT Math Focus Test",
			completed: true,
			attempts: 1,
			duration: 80,
			scores: {
				reading: 0,
				writing: 0,
				math: 750,
				total: 750,
			},
			percentile: 95,
			lastAttempt: new Date("2024-12-10"),
			timeSpent: 75,
		},
		{
			id: "sat-test-14",
			title: "SAT Reading & Writing Focus",
			completed: true,
			attempts: 1,
			duration: 100,
			scores: {
				reading: 380,
				writing: 390,
				math: 0,
				total: 770,
			},
			percentile: 92,
			lastAttempt: new Date("2024-12-05"),
			timeSpent: 95,
		},
		{
			id: "sat-test-15",
			title: "SAT Diagnostic Assessment",
			completed: true,
			attempts: 1,
			duration: 90,
			scores: {
				reading: 300,
				writing: 320,
				math: 600,
				total: 1220,
			},
			percentile: 68,
			lastAttempt: new Date("2024-11-30"),
			timeSpent: 85,
		},

		// Recent Tests - Different time periods
		{
			id: "sat-test-16",
			title: "SAT Practice Test 10",
			completed: false,
			attempts: 0,
			duration: 180,
			scores: null,
			percentile: null,
			timeSpent: null,
		},
		{
			id: "sat-test-17",
			title: "Official SAT Practice Test D",
			completed: false,
			attempts: 0,
			duration: 180,
			scores: null,
			percentile: null,
			timeSpent: null,
		},
		{
			id: "sat-test-18",
			title: "SAT Practice Test 11",
			completed: false,
			attempts: 0,
			duration: 180,
			scores: null,
			percentile: null,
			timeSpent: null,
		},
		{
			id: "sat-test-19",
			title: "SAT Practice Test 12",
			completed: false,
			attempts: 0,
			duration: 180,
			scores: null,
			percentile: null,
			timeSpent: null,
		},
		{
			id: "sat-test-20",
			title: "Official SAT Practice Test E",
			completed: false,
			attempts: 0,
			duration: 180,
			scores: null,
			percentile: null,
			timeSpent: null,
		},
	];

	// Calculate detailed statistics
	const getDetailedStats = () => {
		const completed = satPracticeTests.filter((test) => test.completed);
		const totalAttempts = satPracticeTests.reduce((acc, test) => acc + test.attempts, 0);

		if (completed.length === 0) {
			return {
				avgTotal: 0,
				avgReading: 0,
				avgWriting: 0,
				avgMath: 0,
				completedCount: 0,
				totalTests: satPracticeTests.length,
				avgPercentile: 0,
				totalTimeSpent: 0,
				completionRate: 0,
				trend: 0,
			};
		}

		const avgTotal = Math.round(completed.reduce((acc, test) => acc + test.scores!.total, 0) / completed.length);
		const avgReading = Math.round(completed.reduce((acc, test) => acc + test.scores!.reading, 0) / completed.length);
		const avgWriting = Math.round(completed.reduce((acc, test) => acc + test.scores!.writing, 0) / completed.length);
		const avgMath = Math.round(completed.reduce((acc, test) => acc + test.scores!.math, 0) / completed.length);
		const avgPercentile = Math.round(completed.reduce((acc, test) => acc + test.percentile!, 0) / completed.length);
		const totalTimeSpent = completed.reduce((acc, test) => acc + test.timeSpent!, 0);
		const completionRate = Math.round((completed.length / satPracticeTests.length) * 100);

		// Calculate trend (improvement) - simple calculation for demo
		const trend = completed.length > 1 ? completed[completed.length - 1].scores!.total - completed[0].scores!.total : 0;

		return {
			avgTotal,
			avgReading,
			avgWriting,
			avgMath,
			completedCount: completed.length,
			totalTests: satPracticeTests.length,
			avgPercentile,
			totalTimeSpent,
			completionRate,
			trend,
		};
	};

	const stats = getDetailedStats();

	return (
		<div className={`space-y-8 ${className}`}>
			{/* Header with Analytics */}
			<Card className="border-0 shadow-sm" style={{ backgroundColor: "var(--color-card-default-bg)" }}>
				<CardHeader
					className="pb-4 rounded-t-lg border"
					style={{
						backgroundColor: "var(--color-card-default-bg)",
						borderColor: "var(--color-card-border)",
						borderTop: "4px solid var(--color-accent)",
						borderTopLeftRadius: "0.75rem",
						borderTopRightRadius: "0.75rem",
					}}
				>
					<div className="flex items-center space-x-3">
						<div className="p-2 rounded-lg" style={{ backgroundColor: "var(--color-primary-light)" }}>
							<BarChart3 className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
						</div>
						<div>
							<CardTitle style={{ color: "var(--color-text-primary)" }}>SAT Practice Tests</CardTitle>
							<p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
								Performance Analytics & Test Management
							</p>
						</div>
					</div>
				</CardHeader>

				<CardContent>
					{/* Quick Stats Grid - Added dividers between sections */}
					<div className="space-y-6 mb-6">
						{/* Performance Stats */}
						<div>
							<h3
								className="text-sm font-semibold mb-3"
								style={{
									color: "var(--color-text-primary)",
								}}
							>
								Performance Overview
							</h3>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div
									className="text-center p-6 rounded-lg border"
									style={{
										backgroundColor: "var(--color-card-default-bg)",
										borderColor: "var(--color-card-border)",
										boxShadow: "var(--color-card-hover-shadow)",
									}}
								>
									<Target className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--color-accent)" }} />
									<div className="text-2xl font-bold mb-1" style={{ color: "var(--color-text-primary)" }}>
										{stats.avgTotal || "--"}
									</div>
									<div className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
										Avg Total Score
									</div>
								</div>

								<div
									className="text-center p-6 rounded-lg border"
									style={{
										backgroundColor: "var(--color-card-default-bg)",
										borderColor: "var(--color-card-border)",
										boxShadow: "var(--color-card-hover-shadow)",
									}}
								>
									<TrendingUp
										className="w-8 h-8 mx-auto mb-3"
										style={{ color: stats.trend >= 0 ? "var(--color-success)" : "var(--color-destructive)" }}
									/>
									<div className="text-2xl font-bold mb-1" style={{ color: "var(--color-text-primary)" }}>
										{stats.trend > 0 ? "+" : ""}
										{stats.trend || "--"}
									</div>
									<div className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
										Improvement
									</div>
								</div>

								<div
									className="text-center p-6 rounded-lg border"
									style={{
										backgroundColor: "var(--color-card-default-bg)",
										borderColor: "var(--color-card-border)",
										boxShadow: "var(--color-card-hover-shadow)",
									}}
								>
									<CheckCircle2 className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--color-accent)" }} />
									<div className="text-2xl font-bold mb-1" style={{ color: "var(--color-text-primary)" }}>
										{stats.avgPercentile || "--"}
									</div>
									<div className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
										Avg Accuracy Rate
									</div>
								</div>

								<div
									className="text-center p-6 rounded-lg border"
									style={{
										backgroundColor: "var(--color-card-default-bg)",
										borderColor: "var(--color-card-border)",
										boxShadow: "var(--color-card-hover-shadow)",
									}}
								>
									<Clock className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--color-accent)" }} />
									<div className="text-2xl font-bold mb-1" style={{ color: "var(--color-text-primary)" }}>
										{(() => {
											// Find the nearest SAT exam date
											const today = new Date();
											const satSubjects = subjects.filter((s) => s.type === "SAT");
											if (satSubjects.length === 0) return "--";

											const nearestExam = satSubjects
												.map((s) => ({
													...s,
													daysUntil: Math.ceil((s.examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
												}))
												.filter((s) => s.daysUntil > 0)
												.sort((a, b) => a.daysUntil - b.daysUntil)[0];

											if (!nearestExam) return "--";

											if (nearestExam.daysUntil === 1) return "1 day";
											if (nearestExam.daysUntil < 7) return `${nearestExam.daysUntil} days`;
											if (nearestExam.daysUntil < 30) return `${Math.ceil(nearestExam.daysUntil / 7)} weeks`;
											return `${Math.ceil(nearestExam.daysUntil / 30)} months`;
										})()}
									</div>
									<div className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
										Next Exam
									</div>
								</div>
							</div>
						</div>

						{/* Section Scores Progress */}
						<div>
							<h3
								className="text-sm font-semibold mb-3"
								style={{
									color: "var(--color-text-primary)",
								}}
							>
								Section Performance
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<BookOpen className="w-4 h-4" style={{ color: "var(--color-text-secondary)" }} />
											<span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
												Reading
											</span>
										</div>
										<span className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>
											{stats.avgReading || 0}/400
										</span>
									</div>
									<Progress
										value={(stats.avgReading || 0) / 4}
										className="h-2"
										style={{ backgroundColor: "var(--color-muted)" }}
									/>
								</div>

								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<Edit3 className="w-4 h-4" style={{ color: "var(--color-text-secondary)" }} />
											<span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
												Writing
											</span>
										</div>
										<span className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>
											{stats.avgWriting || 0}/400
										</span>
									</div>
									<Progress
										value={(stats.avgWriting || 0) / 4}
										className="h-2"
										style={{ backgroundColor: "var(--color-muted)" }}
									/>
								</div>

								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<Calculator className="w-4 h-4" style={{ color: "var(--color-text-secondary)" }} />
											<span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
												Math
											</span>
										</div>
										<span className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>
											{stats.avgMath || 0}/800
										</span>
									</div>
									<Progress
										value={(stats.avgMath || 0) / 8}
										className="h-2"
										style={{ backgroundColor: "var(--color-muted)" }}
									/>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Separator between header and tests - Made thicker */}

			{/* Practice Tests Table - Expanded */}
			<Card
				className="border rounded-lg flex-1 flex flex-col h-full min-h-0"
				style={{
					backgroundColor: "var(--color-card-default-bg)",
					borderColor: "var(--color-card-border)",
					borderTop: "4px solid var(--color-accent)",
					boxShadow: "var(--color-card-hover-shadow)",
					maxHeight: "calc(100vh - 120px)",
				}}
			>
				<CardHeader className="pb-6 flex-shrink-0">
					<CardTitle className="flex items-center space-x-3 text-2xl" style={{ color: "var(--color-text-primary)" }}>
						<Target className="w-7 h-7" style={{ color: "var(--color-accent)" }} />
						<span>Practice Tests</span>
					</CardTitle>
					<p className="text-base" style={{ color: "var(--color-text-secondary)" }}>
						Complete practice tests to track your SAT performance
					</p>
				</CardHeader>
				<CardContent className="flex-1 flex flex-col min-h-0">
					{/* Fixed Header outside scroll area */}
					<div className="mb-4 flex-shrink-0">
						<Table style={{ tableLayout: "fixed", width: "100%" }}>
							<colgroup>
								<col style={{ width: "26%" }} />
								<col style={{ width: "10%" }} />
								<col style={{ width: "12%" }} />
								<col style={{ width: "10%" }} />
								<col style={{ width: "10%" }} />
								<col style={{ width: "10%" }} />
								<col style={{ width: "8%" }} />
								<col style={{ width: "12%" }} />
							</colgroup>
							<TableHeader style={{ backgroundColor: "var(--color-muted)" }}>
								<TableRow
									className="border-b-4"
									style={{
										borderColor: "var(--color-accent)",
										height: "60px",
										backgroundColor: "var(--color-muted)",
									}}
								>
									<TableHead
										className="text-base font-semibold py-4 text-center relative rounded-tl-lg"
										style={{ color: "var(--color-text-primary)" }}
									>
										Test
										<div
											className="absolute right-0 top-3 bottom-3 w-0.5"
											style={{ backgroundColor: "rgba(51, 51, 51, 0.25)" }}
										></div>
									</TableHead>
									<TableHead
										className="text-base font-semibold py-4 text-center relative"
										style={{ color: "var(--color-text-primary)" }}
									>
										Status
										<div
											className="absolute right-0 top-3 bottom-3 w-0.5"
											style={{ backgroundColor: "rgba(51, 51, 51, 0.25)" }}
										></div>
									</TableHead>
									<TableHead
										className="text-base font-semibold py-4 text-center relative"
										style={{ color: "var(--color-text-primary)" }}
									>
										Total Score
										<div
											className="absolute right-0 top-3 bottom-3 w-0.5"
											style={{ backgroundColor: "rgba(51, 51, 51, 0.25)" }}
										></div>
									</TableHead>
									<TableHead
										className="text-base font-semibold py-4 text-center relative"
										style={{ color: "var(--color-text-primary)" }}
									>
										Reading
										<div
											className="absolute right-0 top-3 bottom-3 w-0.5"
											style={{ backgroundColor: "rgba(51, 51, 51, 0.25)" }}
										></div>
									</TableHead>
									<TableHead
										className="text-base font-semibold py-4 text-center relative"
										style={{ color: "var(--color-text-primary)" }}
									>
										Writing
										<div
											className="absolute right-0 top-3 bottom-3 w-0.5"
											style={{ backgroundColor: "rgba(51, 51, 51, 0.25)" }}
										></div>
									</TableHead>
									<TableHead
										className="text-base font-semibold py-4 text-center relative"
										style={{ color: "var(--color-text-primary)" }}
									>
										Math
										<div
											className="absolute right-0 top-3 bottom-3 w-0.5"
											style={{ backgroundColor: "rgba(51, 51, 51, 0.25)" }}
										></div>
									</TableHead>
									<TableHead
										className="text-base font-semibold py-4 text-center relative"
										style={{ color: "var(--color-text-primary)" }}
									>
										Accuracy
										<div
											className="absolute right-0 top-3 bottom-3 w-0.5"
											style={{ backgroundColor: "rgba(51, 51, 51, 0.25)" }}
										></div>
									</TableHead>
									<TableHead
										className="text-base font-semibold py-4 text-center rounded-tr-lg"
										style={{ color: "var(--color-text-primary)" }}
									>
										Action
									</TableHead>
								</TableRow>
							</TableHeader>
						</Table>
					</div>

					{/* Scrollable Body - Maximum 700px height */}
					<div className="flex-1 overflow-y-auto scrollbar-custom min-h-0 max-h-[700px]">
						<Table style={{ tableLayout: "fixed", width: "100%" }}>
							<colgroup>
								<col style={{ width: "26%" }} />
								<col style={{ width: "10%" }} />
								<col style={{ width: "12%" }} />
								<col style={{ width: "10%" }} />
								<col style={{ width: "10%" }} />
								<col style={{ width: "10%" }} />
								<col style={{ width: "8%" }} />
								<col style={{ width: "12%" }} />
							</colgroup>
							<TableBody>
								{satPracticeTests.map((test, index) => (
									<TableRow
										key={test.id}
										className="hover:shadow-lg transition-all duration-300 cursor-pointer h-20 border-b"
										style={{
											borderColor: "#e5e5e5",
											backgroundColor: test.completed ? "var(--color-primary-light)" : "transparent",
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.backgroundColor = test.completed
												? "rgba(0, 145, 179, 0.15)"
												: "var(--color-muted)";
											e.currentTarget.style.boxShadow =
												"0 8px 25px -5px rgba(0, 145, 179, 0.3), 0 10px 10px -5px rgba(0, 145, 179, 0.04)";
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.backgroundColor = test.completed
												? "var(--color-primary-light)"
												: "transparent";
											e.currentTarget.style.boxShadow = "none";
										}}
									>
										<TableCell className="py-6">
											<div className="flex items-center space-x-4">
												<div
													className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold shadow-sm transition-all duration-200 flex-shrink-0"
													style={{
														backgroundColor: test.completed ? "var(--color-accent)" : "var(--color-muted)",
														color: test.completed ? "white" : "var(--color-text-secondary)",
													}}
												>
													{index + 1}
												</div>
												<div className="flex-1 min-w-0">
													<div
														className="font-semibold text-lg truncate"
														style={{ color: "var(--color-text-primary)" }}
													>
														{test.title}
													</div>
													<div className="text-sm truncate" style={{ color: "var(--color-text-secondary)" }}>
														{test.duration} minutes • Full length test
													</div>
												</div>
											</div>
										</TableCell>

										<TableCell className="py-6 text-center">
											{test.completed ? (
												<Badge
													className="px-4 py-2 text-sm font-semibold border-0"
													style={{
														backgroundColor: "#16a34a",
														color: "white",
													}}
												>
													<CheckCircle2 className="w-4 h-4 mr-2" />
													Complete
												</Badge>
											) : (
												<Badge
													variant="outline"
													className="px-4 py-2 text-sm font-semibold"
													style={{
														color: "#666666",
														borderColor: "rgba(51, 51, 51, 0.08)",
														backgroundColor: "#f5f5f5",
													}}
												>
													Pending
												</Badge>
											)}
										</TableCell>

										<TableCell className="py-6">
											<div className="text-center">
												<div
													className="font-bold text-2xl"
													style={{ color: test.completed ? "var(--color-accent)" : "var(--color-text-tertiary)" }}
												>
													{test.scores?.total || "--"}
												</div>
												<div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
													/1600
												</div>
											</div>
										</TableCell>

										<TableCell className="py-6">
											<div className="text-center">
												<div className="font-semibold text-lg" style={{ color: "var(--color-text-primary)" }}>
													{test.scores?.reading || "--"}
												</div>
												<div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
													/400
												</div>
											</div>
										</TableCell>

										<TableCell className="py-6">
											<div className="text-center">
												<div className="font-semibold text-lg" style={{ color: "var(--color-text-primary)" }}>
													{test.scores?.writing || "--"}
												</div>
												<div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
													/400
												</div>
											</div>
										</TableCell>

										<TableCell className="py-6">
											<div className="text-center">
												<div className="font-semibold text-lg" style={{ color: "var(--color-text-primary)" }}>
													{test.scores?.math || "--"}
												</div>
												<div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
													/800
												</div>
											</div>
										</TableCell>

										<TableCell className="py-6">
											<div className="text-center">
												<div
													className="font-semibold text-lg"
													style={{
														color: test.percentile ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
													}}
												>
													{test.percentile ? `${test.percentile}%` : "--"}
												</div>
											</div>
										</TableCell>

										<TableCell className="py-6 text-center">
											<Button
												size="lg"
												className="px-4 py-3 text-base font-bold w-32 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
												onClick={() => {
													// SAT 시험 시작/리뷰 시 SAT Section Select 페이지로 이동
													onStartExam(test.id);
												}}
												style={{
													backgroundColor: test.completed ? "#16a34a" : "var(--color-accent)",
													color: "white",
													border: `2px solid ${test.completed ? "#15803d" : "var(--color-accent)"}`,
													boxShadow: test.completed
														? "0 4px 12px rgba(22, 163, 74, 0.3)"
														: "0 4px 12px rgba(0, 145, 179, 0.3)",
												}}
											>
												{test.completed ? (
													<>
														<Target className="w-5 h-5 flex-shrink-0" />
														<span>Review</span>
													</>
												) : (
													<>
														<Play className="w-5 h-5 flex-shrink-0" />
														<span>Start</span>
													</>
												)}
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
