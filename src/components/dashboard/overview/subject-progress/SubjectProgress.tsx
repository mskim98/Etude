"use client";
import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { TrendingUp, Award, Target, ChevronRight, BookOpen, FileText, CheckCircle2 } from "lucide-react";
import type { Subject } from "@/types";
import { useDashboardApSubjects } from "@/hooks/ap-courses/useApSubjects";

interface SubjectProgressProps {
	onStartExam: (subject: Subject) => void;
	onNavigateToSubject?: (subject: Subject) => void;
	className?: string;
}

export function SubjectProgress({ onStartExam, onNavigateToSubject, className }: SubjectProgressProps) {
	const { subjects: apSubjects, isLoading, error } = useDashboardApSubjects();
	const [selectedType, setSelectedType] = useState<"ALL" | "AP" | "SAT">("ALL");
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// Mock SAT subjects for now - will be replaced with Supabase data later
	const satSubjects: Subject[] = [
		{
			id: "sat-test-4",
			name: "SAT Practice Test 4",
			type: "SAT",
			icon: "📝",
			progress: 67,
			totalChapters: 3,
			completedChapters: 2,
			examDate: new Date("2025-03-15"),
			teacher: "SAT Prep Team",
			description: "Full-length SAT practice test with detailed explanations",
		},
	];

	// Convert ApSubject to Subject for compatibility
	const convertedApSubjects: Subject[] = (apSubjects || []).map((apSubject: any) => ({
		id: apSubject.id,
		name: apSubject.title,
		type: "AP" as const,
		progress: apSubject.progress || 0,
		totalChapters: apSubject.totalChapters || 0,
		completedChapters: apSubject.completedChapters || 0,
		icon: "📚",
		examDate: apSubject.examDate || new Date("2025-05-15"),
		teacher: apSubject.teacher?.name || "Unknown",
		description: apSubject.description || "",
	}));

	const allSubjects = [...convertedApSubjects, ...satSubjects];

	const filteredSubjects =
		selectedType === "ALL" ? allSubjects : allSubjects.filter((subject) => subject.type === selectedType);

	// Loading state
	if (isLoading) {
		return (
			<Card className={`border shadow-sm animate-in fade-in-50 duration-500 ${className || ""}`}>
				<CardHeader className="pb-3 rounded-t-lg bg-primary">
					<CardTitle className="flex items-center space-x-2 text-lg font-semibold text-primary-foreground">
						<TrendingUp className="w-5 h-5" />
						<span>Subject Progress</span>
					</CardTitle>
				</CardHeader>
				<CardContent style={{ minHeight: "240px" }}>
					<div className="flex items-center justify-center h-full">
						<div className="text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
							<p className="text-muted-foreground font-medium">Loading subjects...</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Error state
	if (error) {
		return (
			<Card className={`border shadow-sm animate-in fade-in-50 duration-500 ${className || ""}`}>
				<CardHeader className="pb-3 rounded-t-lg bg-primary">
					<CardTitle className="flex items-center space-x-2 text-lg font-semibold text-primary-foreground">
						<TrendingUp className="w-5 h-5" />
						<span>Subject Progress</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center py-8">
						<div className="text-center">
							<p style={{ color: "var(--color-status-error)" }}>Error loading subjects: {error}</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	const getGradeColor = (score: number, type: "AP" | "SAT") => {
		if (type === "AP") {
			if (score >= 4) return "text-success bg-success/10 border-success";
			if (score >= 3) return "text-warning bg-warning/10 border-warning";
			return "text-destructive bg-destructive/10 border-destructive";
		} else {
			if (score >= 700) return "text-success bg-success/10 border-success";
			if (score >= 600) return "text-warning bg-warning/10 border-warning";
			return "text-destructive bg-destructive/10 border-destructive";
		}
	};

	const getSubjectColor = (subjectType: "AP" | "SAT") => {
		// 통일된 색상 시스템 사용 - Pantone 632
		return "var(--primary)"; // 모든 과목에 Pantone 632 적용
	};

	const getBadgeColor = (subjectType: "AP" | "SAT") => {
		// 통일된 monochrome + Pantone 632 색상 시스템
		return {
			backgroundColor: "var(--primary-light)",
			borderColor: "var(--primary)",
			textColor: "var(--primary)",
		};
	};

	const getDaysUntilExam = (examDate: Date) => {
		const today = new Date();
		const diffTime = examDate.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	// Combine AP and SAT subjects
	const subjects = [
		...apSubjects.map((subject) => ({
			...subject,
			type: "AP" as const,
			name: subject.title,
			icon: "📚",
		})),
		...satSubjects,
	];

	const getExamDateColor = (daysUntil: number) => {
		if (daysUntil < 0) return { color: "var(--muted-foreground)", bgColor: "var(--muted)", intensity: "low" }; // 지난 시험 - 회색
		// 1주일 이하: 빨간색으로 긴급 표시
		if (daysUntil <= 7) {
			return {
				color: "var(--destructive)",
				bgColor: "#fef2f2", // Light red background
				intensity: daysUntil === 0 ? "urgent" : "critical",
			};
		}
		// 1주일 초과: 모노크롬 계열로 통일
		return {
			color: "var(--muted-foreground)",
			bgColor: "var(--muted)",
			intensity: "normal",
		};
	};

	const formatExamDate = (daysUntil: number, examDate: Date) => {
		if (daysUntil < 0) return "시험 완료";
		if (daysUntil === 0) return "D-DAY";
		if (daysUntil === 1) return "D-1";
		if (daysUntil <= 99) return `D-${daysUntil}`;

		const month = examDate.getMonth() + 1;
		const day = examDate.getDate();
		return `${month}/${day}`;
	};

	const getProgressColor = (progress: number) => {
		// Primary blue progress bar system
		if (progress >= 80) return "var(--primary)"; // full primary blue for high progress
		if (progress >= 60) return "var(--primary)"; // primary blue for medium progress
		if (progress >= 40) return "var(--primary)"; // primary blue for medium-low progress
		return "var(--primary)"; // consistent primary blue for all progress levels
	};

	return (
		<Card
			className={`shadow-sm h-full min-h-[460px] mb-12 flex flex-col animate-in fade-in-50 duration-500 ${className}`}
			style={{
				border: "1px solid var(--color-card-border)",
			}}
		>
			<CardHeader className="pb-3 rounded-t-lg bg-primary">
				<CardTitle className="flex items-center justify-between text-primary-foreground">
					<div className="flex items-center space-x-2">
						<TrendingUp className="w-5 h-5" />
						<span className="text-lg font-semibold">Subject Progress</span>
					</div>
					<div className="flex items-center space-x-2">
						<Badge
							variant="outline"
							className="text-xs font-semibold border-primary-foreground text-primary-foreground"
						>
							{filteredSubjects.length} Subject{filteredSubjects.length !== 1 ? "s" : ""}
						</Badge>
					</div>
				</CardTitle>

				{/* Filter Buttons */}
				<div className="flex items-center space-x-2 mt-4">
					<Button
						size="sm"
						variant={selectedType === "ALL" ? "default" : "outline"}
						onClick={() => setSelectedType("ALL")}
						className={`h-8 px-3 text-xs font-semibold ${
							selectedType === "ALL"
								? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
								: "bg-primary-foreground/20 border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/30"
						}`}
					>
						All ({apSubjects.length + satSubjects.length})
					</Button>
					<Button
						size="sm"
						variant={selectedType === "AP" ? "default" : "outline"}
						onClick={() => setSelectedType("AP")}
						className={`flex items-center space-x-1 h-8 px-3 text-xs font-semibold ${
							selectedType === "AP"
								? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
								: "bg-primary-foreground/20 border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/30"
						}`}
					>
						<BookOpen className="w-3 h-3" />
						<span>AP ({apSubjects.length})</span>
					</Button>
					<Button
						size="sm"
						variant={selectedType === "SAT" ? "default" : "outline"}
						onClick={() => setSelectedType("SAT")}
						className={`flex items-center space-x-1 h-8 px-3 text-xs font-semibold ${
							selectedType === "SAT"
								? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
								: "bg-primary-foreground/20 border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/30"
						}`}
					>
						<FileText className="w-3 h-3" />
						<span>SAT ({satSubjects.length})</span>
					</Button>
				</div>
			</CardHeader>
			<CardContent className="flex-1 flex flex-col min-h-0 overflow-hidden">
				<div className="relative flex-1 min-h-0">
					{/* Scrollable Container */}
					<div
						ref={scrollContainerRef}
						className="scrollbar-custom flex flex-col space-y-4 overflow-y-auto pr-2 absolute inset-0"
						style={{
							scrollBehavior: "smooth",
							WebkitOverflowScrolling: "touch",
						}}
					>
						{filteredSubjects.map((subject) => {
							const subjectColor = getSubjectColor(subject.type);
							const progressColor = getProgressColor(subject.progress);
							const badgeColor = getBadgeColor(subject.type);
							const daysUntilExam = getDaysUntilExam(subject.examDate);
							const examDateColor = getExamDateColor(daysUntilExam);

							return subject.type === "SAT" ? (
								/* SAT Style - SAT Mock Exams inspired design */
								<div
									key={subject.id}
									className={`w-full p-4 rounded-lg border-2 border-muted-foreground/15 shadow-sm hover:bg-muted/50 transition-all cursor-pointer group ${
										subject.progress >= 70 ? "bg-primary/5" : "bg-card"
									}`}
									onClick={() => (onNavigateToSubject ? onNavigateToSubject(subject) : onStartExam(subject))}
								>
									{/* Main row */}
									<div className="flex items-center justify-between mb-4">
										{/* Left section - Test info with circular badge */}
										<div className="flex items-center space-x-4">
											<div
												className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold shadow-sm"
												style={{
													backgroundColor: subject.progress >= 70 ? "var(--color-accent)" : "var(--color-muted)",
													color: subject.progress >= 70 ? "white" : "var(--color-text-secondary)",
												}}
											>
												{subject.icon}
											</div>
											<div>
												<div className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
													{subject.name}
												</div>
												<div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
													{subject.lastScore
														? `Best Score: ${subject.lastScore} / 1600`
														: "Not started • Ready to begin"}
												</div>
											</div>
										</div>

										{/* Right section - Status and controls */}
										<div className="flex items-center space-x-4">
											{subject.progress >= 70 ? (
												<Badge
													className="px-4 py-2 text-sm font-semibold border-0"
													style={{
														backgroundColor: "#16a34a",
														color: "white",
													}}
												>
													<Target className="w-4 h-4 mr-2" />
													On Track
												</Badge>
											) : subject.progress === 0 ? (
												<Badge
													variant="outline"
													className="px-4 py-2 text-sm font-semibold"
													style={{
														color: "#0091B3",
														borderColor: "rgba(0, 145, 179, 0.2)",
														backgroundColor: "rgba(0, 145, 179, 0.05)",
													}}
												>
													Ready to Start
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
													In Progress
												</Badge>
											)}

											<ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
										</div>
									</div>

									{/* Section progress row */}
									<div className="flex items-center justify-between pt-3 border-t border-border">
										<div className="flex items-center space-x-8">
											{/* Reading progress */}
											<div className="flex items-center space-x-2">
												<BookOpen className="w-4 h-4" style={{ color: "var(--color-text-secondary)" }} />
												<div className="text-sm">
													<span style={{ color: "var(--color-text-primary)" }} className="font-medium">
														Reading
													</span>
													{(subject as any).sectionProgress?.reading === 100 && (
														<CheckCircle2
															className="w-4 h-4 ml-1 inline"
															style={{ color: "var(--color-status-success)" }}
														/>
													)}
												</div>
											</div>

											{/* Writing progress */}
											<div className="flex items-center space-x-2">
												<FileText className="w-4 h-4" style={{ color: "var(--color-text-secondary)" }} />
												<div className="text-sm">
													<span style={{ color: "var(--color-text-primary)" }} className="font-medium">
														Writing
													</span>
													{(subject as any).sectionProgress?.writing === 100 && (
														<CheckCircle2
															className="w-4 h-4 ml-1 inline"
															style={{ color: "var(--color-status-success)" }}
														/>
													)}
												</div>
											</div>

											{/* Math progress */}
											<div className="flex items-center space-x-2">
												<Target className="w-4 h-4" style={{ color: "var(--color-text-secondary)" }} />
												<div className="text-sm">
													<span style={{ color: "var(--color-text-primary)" }} className="font-medium">
														Math
													</span>
													{(subject as any).sectionProgress?.math === 100 && (
														<CheckCircle2
															className="w-4 h-4 ml-1 inline"
															style={{ color: "var(--color-status-success)" }}
														/>
													)}
												</div>
											</div>
										</div>

										{/* Current test status */}
										<div className="text-right">
											<div className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
												{subject.progress === 0 ? "Not Started" : "In Progress"}
											</div>
											<div className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
												{subject.progress === 0 ? "Click to begin" : `${subject.progress}% complete`}
											</div>
										</div>
									</div>
								</div>
							) : (
								/* AP Style - Original card design */
								<div
									key={subject.id}
									className="w-full p-3 rounded-lg bg-card hover:bg-muted/50 transition-all cursor-pointer group"
									style={{
										border: "1px solid rgba(51, 51, 51, 0.15)",
										boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
									}}
									onClick={() => (onNavigateToSubject ? onNavigateToSubject(subject) : onStartExam(subject))}
								>
									<div className="flex items-center justify-between mb-3">
										<div className="flex items-center space-x-3">
											<div
												className="w-12 h-12 rounded-lg flex items-center justify-center text-primary-foreground text-lg font-bold shadow-md"
												style={{ backgroundColor: subjectColor }}
											>
												{subject.icon}
											</div>
											<div>
												<div className="flex items-center space-x-2 mb-1">
													<h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
														{subject.name}
													</h3>
													<Badge
														variant="outline"
														className="text-xs font-semibold border-2"
														style={{
															borderColor: badgeColor.borderColor,
															color: badgeColor.textColor,
															backgroundColor: badgeColor.backgroundColor,
														}}
													>
														{subject.type}
													</Badge>
												</div>
												<div className="flex items-center space-x-2 text-sm text-muted-foreground font-medium">
													<span>
														{subject.completedChapters}/{subject.totalChapters} chapters
													</span>
												</div>
											</div>
										</div>

										<div className="text-right">
											<div className="text-xs text-muted-foreground mb-1 font-medium">
												{daysUntilExam < 0 ? "시험 상태" : "시험까지"}
											</div>
											<Badge
												className={`text-sm font-bold border-2 ${
													examDateColor.intensity === "urgent"
														? "animate-pulse"
														: examDateColor.intensity === "critical"
														? "shadow-lg"
														: ""
												}`}
												style={{
													color: examDateColor.color,
													backgroundColor: examDateColor.bgColor,
													borderColor: examDateColor.color + "60",
													fontWeight:
														examDateColor.intensity === "urgent" || examDateColor.intensity === "critical"
															? "800"
															: "700",
												}}
											>
												{formatExamDate(daysUntilExam, subject.examDate)}
											</Badge>
										</div>
									</div>

									{/* Achievement indicators moved to top */}
									<div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
										<div className="flex items-center space-x-3">
											{subject.progress >= 80 && (
												<div className="flex items-center space-x-1" style={{ color: "var(--muted-foreground)" }}>
													<Award className="w-3 h-3" />
													<span className="text-xs font-semibold">Expert Level</span>
												</div>
											)}
											{subject.completedChapters >= subject.totalChapters * 0.5 && (
												<div className="flex items-center space-x-1" style={{ color: "var(--muted-foreground)" }}>
													<Target className="w-3 h-3" />
													<span className="text-xs font-semibold">Halfway Complete</span>
												</div>
											)}
										</div>

										<ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
									</div>

									<div className="space-y-2">
										<div className="flex items-center justify-between text-sm">
											<span className="text-foreground font-medium">Progress</span>
											<span className="font-bold" style={{ color: progressColor }}>
												{subject.progress}%
											</span>
										</div>
										<div className="w-full bg-muted rounded-full h-2">
											<div
												className="h-2 rounded-full transition-all duration-500 shadow-sm"
												style={{
													width: `${subject.progress}%`,
													backgroundColor: progressColor,
												}}
											></div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
