"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ChapterBox } from "./ChapterBox";
import { APExamCard } from "./APExamCard";
import { BookOpen, TrendingUp, Award, FileText, ChevronRight, Clock } from "lucide-react";
import { useDashboardApSubjects, useApChapters, useApExams } from "@/hooks/useApCourses";
import type { ApSubject, ApExamDetailed } from "../../types";
import { supabase } from "@/lib/supabase";

interface APCoursesSupabaseProps {
	onStartExam: (subject: ApSubject) => void;
	selectedSubject?: ApSubject | null;
	onTabChange?: () => void;
	className?: string;
}

export function APCoursesSupabase({ onStartExam, selectedSubject, onTabChange, className }: APCoursesSupabaseProps) {
	const { subjects, isLoading, error, refresh } = useDashboardApSubjects();
	const [selectedCard, setSelectedCard] = useState<string | null>(null);

	// Auto-select card based on selected subject
	useEffect(() => {
		if (selectedSubject) {
			setSelectedCard(selectedSubject.id);
		}
	}, [selectedSubject]);

	const handleCardSelect = (subjectId: string) => {
		setSelectedCard(selectedCard === subjectId ? null : subjectId);
		if (onTabChange) {
			onTabChange();
		}
	};

	// Get chapters from Supabase using custom hook
	const { chapters: selectedChapters, isLoading: chaptersLoading } = useApChapters(selectedCard || undefined);

	// Per-chapter materials availability
	const [mcqActiveMap, setMcqActiveMap] = useState<Record<string, boolean>>({});
	const [frqActiveMap, setFrqActiveMap] = useState<Record<string, boolean>>({});

	useEffect(() => {
		const fetchMaterialsStatus = async () => {
			if (!selectedChapters || selectedChapters.length === 0) {
				setMcqActiveMap({});
				setFrqActiveMap({});
				return;
			}
			const chapterIds = selectedChapters.map((c: any) => c.id).filter(Boolean);
			if (chapterIds.length === 0) return;

			// MCQ status
			const { data: mcqs } = await supabase.from("ap_mcq").select("chapter_id, is_active").in("chapter_id", chapterIds);
			const mcqMap: Record<string, boolean> = {};
			(mcqs || []).forEach((row: any) => {
				if (!(row.chapter_id in mcqMap)) mcqMap[row.chapter_id] = false;
				mcqMap[row.chapter_id] = mcqMap[row.chapter_id] || !!row.is_active;
			});
			setMcqActiveMap(mcqMap);

			// FRQ status
			const { data: frqs } = await supabase.from("ap_frq").select("chapter_id, is_active").in("chapter_id", chapterIds);
			const frqMap: Record<string, boolean> = {};
			(frqs || []).forEach((row: any) => {
				if (!(row.chapter_id in frqMap)) frqMap[row.chapter_id] = false;
				frqMap[row.chapter_id] = frqMap[row.chapter_id] || !!row.is_active;
			});
			setFrqActiveMap(frqMap);
		};
		fetchMaterialsStatus();
	}, [selectedChapters]);

	// Get AP exam data for each subject using custom hook
	const { exams: selectedExams, isLoading: examsLoading } = useApExams(selectedCard || undefined);

	const getChaptersForSubject = (subjectId: string) => {
		if (selectedCard === subjectId) {
			return selectedChapters || [];
		}
		return [];
	};

	const getExamsForSubject = (subjectId: string) => {
		if (selectedCard === subjectId) {
			return selectedExams || [];
		}
		return [];
	};

	const getSubjectStats = (subjectId: string) => {
		const chapters = getChaptersForSubject(subjectId);
		const completed = chapters.filter((c) => c.isCompleted).length;
		const avgScore = chapters
			.filter((c) => c.progress > 0)
			.reduce((acc, c, _, arr) => acc + (c.progress || 0) / arr.length, 0);

		return { completed, total: chapters.length, avgScore: Math.round(avgScore) };
	};

	const getDaysUntilExam = (examDate: Date) => {
		const now = new Date();
		const diffTime = examDate.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	const availableSubjects = subjects || [];
	const selectedSubjectData = selectedCard ? availableSubjects.find((s) => s.id === selectedCard) : null;

	// Loading state
	if (isLoading || chaptersLoading || examsLoading) {
		return (
			<Card className={`border-0 shadow-sm ${className || ""}`}>
				<CardHeader
					className="pb-4 rounded-t-lg border"
					style={{
						backgroundColor: "var(--color-card-default-bg)",
						borderColor: "var(--color-card-border)",
						borderTop: "4px solid var(--color-accent)",
					}}
				>
					<CardTitle className="flex items-center space-x-2" style={{ color: "var(--color-text-primary)" }}>
						<BookOpen className="w-5 h-5" style={{ color: "var(--color-subject-secondary)" }} />
						<span>AP Courses</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center py-8">
						<div className="text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
							<p style={{ color: "var(--color-text-secondary)" }}>Loading AP courses...</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Error state
	if (error) {
		return (
			<Card className={`border-0 shadow-sm ${className || ""}`}>
				<CardHeader
					className="pb-4 rounded-t-lg border"
					style={{
						backgroundColor: "var(--color-card-default-bg)",
						borderColor: "var(--color-card-border)",
						borderTop: "4px solid var(--color-accent)",
					}}
				>
					<CardTitle className="flex items-center space-x-2" style={{ color: "var(--color-text-primary)" }}>
						<BookOpen className="w-5 h-5" style={{ color: "var(--color-subject-secondary)" }} />
						<span>AP Courses</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center py-8">
						<div className="text-center">
							<p style={{ color: "var(--color-status-error)" }}>Error loading AP courses: {error}</p>
							<Button onClick={refresh} className="mt-4">
								Try Again
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card
			className={`border-0 shadow-sm ${className || ""}`}
			style={{
				backgroundColor: "var(--color-card-default-bg)",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<CardHeader
				className="pb-4 rounded-t-lg border"
				style={{
					backgroundColor: "var(--color-card-default-bg)",
					borderColor: "var(--color-card-border)",
					borderTop: "4px solid var(--color-accent)",
				}}
			>
				<CardTitle className="flex items-center space-x-2" style={{ color: "var(--color-text-primary)" }}>
					<BookOpen className="w-5 h-5" style={{ color: "var(--color-subject-secondary)" }} />
					<span>AP Courses</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{/* Subject Cards Grid */}
				<div
					className="ap-courses-scroll-area grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 overflow-y-auto scrollbar-custom px-4 py-2"
					style={{
						maxHeight: selectedCard ? "240px" : "calc(45vh - 60px)",
						minHeight: selectedCard ? "240px" : "320px",
						scrollbarGutter: "stable",
					}}
				>
					{availableSubjects.map((subject) => {
						const stats = getSubjectStats(subject.id);
						const daysUntilExam = getDaysUntilExam(subject.examDate);
						const isSelected = selectedCard === subject.id;

						return (
							<Card
								key={subject.id}
								className={`cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg border ${
									isSelected ? "ring-2 shadow-lg scale-[1.02]" : "hover:shadow-md"
								}`}
								style={{
									backgroundColor: "var(--color-card-default-bg)",
									borderColor: isSelected ? "var(--color-primary)" : "var(--color-card-border)",
									boxShadow: isSelected
										? "0 8px 20px -3px rgba(0, 145, 179, 0.15), 0 3px 4px -2px rgba(0, 145, 179, 0.08)"
										: "var(--color-card-hover-shadow)",
									ringColor: isSelected ? "var(--color-primary)" : "transparent",
								}}
								onClick={() => handleCardSelect(subject.id)}
							>
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div
												className="w-10 h-10 rounded-lg flex items-center justify-center"
												style={{
													backgroundColor: isSelected ? "var(--color-primary)" : "var(--color-subject-light)",
													color: isSelected ? "white" : "var(--color-text-primary)",
												}}
											>
												<span style={{ fontSize: "18px" }}>📚</span>
											</div>
											<div>
												<h3
													className="font-medium"
													style={{
														color: isSelected ? "var(--color-primary)" : "var(--color-text-primary)",
														fontSize: "16px",
													}}
												>
													{subject.title.replace("AP ", "")}
												</h3>
												<p style={{ color: "var(--color-text-secondary)", fontSize: "12px" }}>AP Course</p>
											</div>
										</div>
										<ChevronRight
											className={`w-5 h-5 transition-transform duration-200 ${isSelected ? "rotate-90" : ""}`}
											style={{ color: "var(--color-text-tertiary)" }}
										/>
									</div>
								</CardHeader>

								<CardContent className="pt-0">
									{/* Progress Bar */}
									<div className="mb-4">
										<div className="flex justify-between items-center mb-2">
											<span style={{ color: "var(--color-text-secondary)", fontSize: "12px" }}>Progress</span>
											<span
												style={{
													color: "var(--color-primary)",
													fontSize: "12px",
													fontWeight: "600",
												}}
											>
												{subject.progress}%
											</span>
										</div>
										<div
											className="w-full h-2 rounded-full overflow-hidden"
											style={{ backgroundColor: "var(--color-muted)" }}
										>
											<div
												className="h-full transition-all duration-500 ease-out rounded-full"
												style={{
													width: `${subject.progress}%`,
													backgroundColor: "var(--color-primary)",
												}}
											/>
										</div>
									</div>

									{/* Stats Grid */}
									<div className="grid grid-cols-3 gap-3">
										<div className="text-center">
											<div className="font-semibold" style={{ color: "var(--color-text-primary)", fontSize: "14px" }}>
												{stats.completed}/{stats.total}
											</div>
											<div style={{ color: "var(--color-text-secondary)", fontSize: "10px", fontWeight: "500" }}>
												Chapters
											</div>
										</div>

										<div className="text-center">
											<div className="font-semibold" style={{ color: "var(--color-text-primary)", fontSize: "14px" }}>
												{stats.avgScore || 0}%
											</div>
											<div style={{ color: "var(--color-text-secondary)", fontSize: "10px", fontWeight: "500" }}>
												Avg Score
											</div>
										</div>

										<div className="text-center">
											<div
												className="font-semibold"
												style={{
													color: daysUntilExam <= 30 ? "var(--color-status-warning)" : "var(--color-text-primary)",
													fontSize: "14px",
												}}
											>
												{daysUntilExam}d
											</div>
											<div style={{ color: "var(--color-text-secondary)", fontSize: "10px", fontWeight: "500" }}>
												Until Exam
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						);
					})}

					{/* Future Expansion Card */}
					<Card
						className="cursor-pointer border-2 border-dashed"
						style={{
							backgroundColor: "var(--color-card-default-bg)",
							borderColor: "rgba(51, 51, 51, 0.3)",
							opacity: 0.6,
						}}
					>
						<div className="flex items-center justify-center h-full min-h-[200px]">
							<div className="text-center">
								<div
									className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2"
									style={{ backgroundColor: "var(--color-muted)" }}
								>
									<span style={{ fontSize: "18px" }}>➕</span>
								</div>
								<h3 style={{ color: "var(--color-text-primary)", fontSize: "14px", fontWeight: "500" }}>
									More Courses
								</h3>
								<p style={{ color: "var(--color-text-secondary)", fontSize: "11px" }}>Coming Soon</p>
							</div>
						</div>
					</Card>
				</div>

				{/* Selected Subject Details */}
				{selectedSubjectData && (
					<div className="space-y-6">
						{/* Subject Overview */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
							<div
								className="p-4 rounded-lg text-center"
								style={{
									backgroundColor: "var(--color-card-default-bg)",
									border: "1px solid var(--color-card-border)",
									boxShadow: "var(--color-card-hover-shadow)",
								}}
							>
								<TrendingUp className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--color-primary)" }} />
								<div className="font-semibold" style={{ color: "var(--color-text-primary)", fontSize: "18px" }}>
									{selectedSubjectData.progress}%
								</div>
								<div style={{ color: "var(--color-text-secondary)", fontSize: "12px" }}>Progress</div>
							</div>

							<div
								className="p-4 rounded-lg text-center"
								style={{
									backgroundColor: "var(--color-card-default-bg)",
									border: "1px solid var(--color-card-border)",
									boxShadow: "var(--color-card-hover-shadow)",
								}}
							>
								<Award className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--color-primary)" }} />
								<div className="font-semibold" style={{ color: "var(--color-text-primary)", fontSize: "18px" }}>
									{getSubjectStats(selectedSubjectData.id).completed}
								</div>
								<div style={{ color: "var(--color-text-secondary)", fontSize: "12px" }}>Chapters</div>
							</div>

							<div
								className="p-4 rounded-lg text-center"
								style={{
									backgroundColor: "var(--color-card-default-bg)",
									border: "1px solid var(--color-card-border)",
									boxShadow: "var(--color-card-hover-shadow)",
								}}
							>
								<Clock className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--color-primary)" }} />
								<div className="font-semibold" style={{ color: "var(--color-text-primary)", fontSize: "18px" }}>
									{getDaysUntilExam(selectedSubjectData.examDate)}d
								</div>
								<div style={{ color: "var(--color-text-secondary)", fontSize: "12px" }}>Until Exam</div>
							</div>

							<div
								className="p-4 rounded-lg text-center"
								style={{
									backgroundColor: "var(--color-card-default-bg)",
									border: "1px solid var(--color-card-border)",
									boxShadow: "var(--color-card-hover-shadow)",
								}}
							>
								<BookOpen className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--color-primary)" }} />
								<div className="font-semibold" style={{ color: "var(--color-text-primary)", fontSize: "18px" }}>
									{getSubjectStats(selectedSubjectData.id).total}
								</div>
								<div style={{ color: "var(--color-text-secondary)", fontSize: "12px" }}>Total</div>
							</div>
						</div>

						{/* Study Chapters */}
						{(() => {
							const chapters = getChaptersForSubject(selectedSubjectData.id);
							return (
								chapters.length > 0 && (
									<div>
										<div className="flex items-center justify-between mb-4">
											<h4
												style={{ color: "var(--color-text-primary)", fontSize: "16px", fontWeight: "600" }}
												className="flex items-center"
											>
												<BookOpen className="w-4 h-4 mr-2" style={{ color: "var(--color-subject-secondary)" }} />
												Study Chapters
											</h4>
										</div>
										<div
											className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto scrollbar-custom px-4 py-2"
											style={{
												maxHeight: "500px",
												scrollbarGutter: "stable",
											}}
										>
											{chapters.map((chapter) => (
												<ChapterBox
													key={chapter.chapterNumber}
													chapterNumber={chapter.chapterNumber}
													title={chapter.title}
													mcqCount={0} // TODO: 실제 MCQ 개수 계산
													frqCount={0} // TODO: 실제 FRQ 개수 계산
													hasVideo={false} // TODO: 실제 비디오 존재 여부 확인
													completed={chapter.isCompleted}
													score={chapter.progress}
													timeSpent={0} // TODO: 실제 학습 시간 계산
													difficulty={chapter.difficulty}
													onClick={() => onStartExam(selectedSubjectData)}
													isActive={chapter.isActive}
													mcqActive={!!mcqActiveMap[(chapter as any).id]}
													frqActive={!!frqActiveMap[(chapter as any).id]}
												/>
											))}
										</div>
									</div>
								)
							);
						})()}

						{/* AP Practice Exams */}
						{(() => {
							const exams = getExamsForSubject(selectedSubjectData.id);
							// Sort exams by trailing number in title (natural order)
							const sortedExams = [...exams].sort((a: any, b: any) => {
								const na = parseInt(String(a.title).match(/(\d+)/)?.[1] || "0", 10);
								const nb = parseInt(String(b.title).match(/(\d+)/)?.[1] || "0", 10);
								if (na !== nb) return na - nb;
								// fallback: title asc
								return String(a.title).localeCompare(String(b.title));
							});
							return (
								sortedExams.length > 0 && (
									<div>
										<div className="flex items-center justify-between mb-4">
											<h4
												style={{ color: "var(--color-text-primary)", fontSize: "16px", fontWeight: "600" }}
												className="flex items-center"
											>
												<FileText className="w-4 h-4 mr-2" style={{ color: "var(--color-subject-accent)" }} />
												Practice Exams
											</h4>
										</div>
										<div
											className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto scrollbar-custom px-4 pb-6"
											style={{
												height: "430px",
												scrollbarGutter: "stable",
											}}
										>
											{sortedExams.map((exam) => (
												<APExamCard
													key={exam.id}
													examId={exam.id}
													title={exam.title}
													description={exam.description}
													duration={exam.duration}
													questionCount={exam.quantity}
													difficulty={exam.difficulty}
													hasExplanatoryVideo={false} // TODO: 실제 비디오 존재 여부 확인
													videoLength={0} // TODO: 실제 비디오 길이 계산
													completed={false} // TODO: 실제 완료 상태 확인
													score={0} // TODO: 실제 점수 계산
													attempts={0} // TODO: 실제 시도 횟수 계산
													averageScore={0} // TODO: 실제 평균 점수 계산
													completionRate={0} // TODO: 실제 완료율 계산
													lastAttempt={null} // TODO: 실제 마지막 시도 시간 계산
													examDate={new Date("2025-05-15")}
													subject={exam.subject?.title || selectedSubjectData?.title || ""}
													onStartExam={() => onStartExam(selectedSubjectData)}
													onWatchVideo={() => console.log(`Watch video for ${exam.id}`)}
													isActive={Boolean((exam as any).isActive ?? (exam as any).is_active ?? true)}
												/>
											))}

											{/* Future Practice Exams Expansion Card */}
											<Card
												className="cursor-pointer border-2 border-dashed"
												style={{
													backgroundColor: "var(--color-card-default-bg)",
													borderColor: "rgba(51, 51, 51, 0.3)",
													opacity: 0.6,
													height: "400px",
												}}
											>
												<div className="flex items-center justify-center h-full">
													<div className="text-center">
														<div
															className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3"
															style={{ backgroundColor: "var(--color-muted)" }}
														>
															<span style={{ fontSize: "20px" }}>📝</span>
														</div>
														<h3 style={{ color: "var(--color-text-primary)", fontSize: "14px", fontWeight: "500" }}>
															More Practice Exams
														</h3>
														<p style={{ color: "var(--color-text-secondary)", fontSize: "11px" }}>Coming Soon</p>
													</div>
												</div>
											</Card>
										</div>
									</div>
								)
							);
						})()}
					</div>
				)}

				{!selectedCard && (
					<div className="text-center py-8">
						<BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" style={{ color: "var(--color-text-tertiary)" }} />
						<h3 style={{ color: "var(--color-text-secondary)", fontSize: "16px", fontWeight: "500" }}>
							Select a Course
						</h3>
						<p style={{ color: "var(--color-text-tertiary)", fontSize: "14px" }}>
							Choose an AP course above to view chapters and practice exams
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
