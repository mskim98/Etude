"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { BookOpen } from "lucide-react";
import { APCourseCard } from "./APCourseCard";
import { APSubjectStats } from "./APSubjectStats";
import { ChaptersGrid } from "./ChaptersGrid";
import { PracticeExamsGrid } from "./PracticeExamsGrid";
import { useDashboardApSubjects } from "@/hooks/ap-courses/useApSubjects";
import { useApChapters } from "@/hooks/ap-courses/useApChapters";
import { useApExams } from "@/hooks/ap-courses/useApExams";
import { useApMaterialsStatus } from "@/hooks/ap-courses/useApMaterialsStatus";
import { useApSubjectAccess, useServiceStatus } from "@/hooks/ap-courses/useApSubjectAccess";
import type { ApSubject } from "../../../types";
import { CourseCardSkeleton, GridSkeleton } from "./Skeletons";
import { getDaysUntilExam as calcDaysUntilExam } from "@/lib/ap-courses/utils";
// import { useAuth } from "@/features/auth";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface APCoursesProps {
	onStartExam: (subject: ApSubject, examId?: string) => void;
	onViewResults?: (examId: string) => void;
	selectedSubject?: ApSubject | null;
	onTabChange?: () => void;
	className?: string;
}

export function APCourses({ onStartExam, onViewResults, selectedSubject, onTabChange, className }: APCoursesProps) {
	const { subjects, isLoading, error, refresh } = useDashboardApSubjects();
	const [selectedCard, setSelectedCard] = useState<string | null>(null);
	// const hasServiceAccess = useAuthStore((s) => s.hasServiceAccess);
	const [accessDialogOpen, setAccessDialogOpen] = useState(false);
	const [serviceMaintenanceDialogOpen, setServiceMaintenanceDialogOpen] = useState(false);
	const [dialogMessage, setDialogMessage] = useState("");

	// 선택된 과목의 접근 권한 및 서비스 상태 확인
	const { data: subjectAccess } = useApSubjectAccess(selectedCard || undefined);
	const { data: serviceStatus } = useServiceStatus(selectedCard || undefined);

	useEffect(() => {
		if (selectedSubject) {
			setSelectedCard(selectedSubject.id);
		}
	}, [selectedSubject]);

	const handleCardSelect = (subjectId: string) => {
		setSelectedCard(selectedCard === subjectId ? null : subjectId);
		if (onTabChange) onTabChange();
	};

	/**
	 * 새로운 조건 체크 로직
	 * 조건1: user_service + user_ap_subject is_active 체크
	 * 조건2: service + ap is_active 서비스 점검 체크
	 */
	const handleWithApAccess = async (action: () => void) => {
		try {
			// 조건1: 사용자 접근 권한 체크 (user_service + user_ap_subject)
			if (!subjectAccess?.hasAccess) {
				let message = "AP 과목 접근 권한이 없습니다.";

				if (!subjectAccess?.hasUserServiceAccess) {
					message = "AP 서비스 이용 권한이 없습니다. 관리자에게 문의해주세요.";
				} else if (!subjectAccess?.hasSubjectAccess) {
					message = "해당 AP 과목에 대한 접근 권한이 없습니다.";
				} else if (!subjectAccess?.isWithinPeriod) {
					const startAt = subjectAccess?.startAt;
					const endAt = subjectAccess?.endAt;
					if (startAt && new Date() < startAt) {
						message = `이용 기간이 아닙니다. 시작일: ${startAt.toLocaleDateString()}`;
					} else if (endAt && new Date() > endAt) {
						message = `이용 기간이 만료되었습니다. 만료일: ${endAt.toLocaleDateString()}`;
					}
				}

				setDialogMessage(message);
				setAccessDialogOpen(true);
				return;
			}

			// 조건2: 서비스 점검 상태 체크 (service + ap)
			if (!serviceStatus?.isSystemAvailable) {
				let message = "서비스 점검 중입니다.";

				if (!serviceStatus?.isServiceActive) {
					message = "AP 서비스가 일시적으로 중단되었습니다.";
				} else if (!serviceStatus?.isSubjectActive) {
					message = "해당 AP 과목이 일시적으로 중단되었습니다.";
				}

				setDialogMessage(message);
				setServiceMaintenanceDialogOpen(true);
				return;
			}

			// 모든 조건을 통과하면 액션 실행
			action();
		} catch (error) {
			console.error("Error checking AP access:", error);
			setDialogMessage("접근 권한을 확인하는 중 오류가 발생했습니다.");
			setAccessDialogOpen(true);
		}
	};

	const { chapters: selectedChapters, isLoading: chaptersLoading } = useApChapters(selectedCard || undefined);
	const { exams: selectedExams, isLoading: examsLoading } = useApExams(selectedCard || undefined);
	const { mcqActiveMap, frqActiveMap } = useApMaterialsStatus(selectedChapters);

	// const getSubjectStats = (subjectId: string) => {
	// 	const chapters = selectedCard === subjectId ? selectedChapters || [] : [];
	// 	return calcSubjectStats(chapters);
	// };

	const getDaysUntilExam = (examDate: Date) => calcDaysUntilExam(examDate);

	const availableSubjects = useMemo(() => subjects || [], [subjects]);
	const selectedSubjectData = useMemo(() => {
		return selectedCard ? availableSubjects.find((s: ApSubject) => s.id === selectedCard) : null;
	}, [availableSubjects, selectedCard]);

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
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 px-4 py-2">
						{Array.from({ length: 6 }).map((_, i) => (
							<CourseCardSkeleton key={i} />
						))}
					</div>
					<GridSkeleton rows={2} cols={3} />
				</CardContent>
			</Card>
		);
	}

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
							<button className="mt-4" onClick={() => refresh()}>
								Try Again
							</button>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<Card
				className={`border-0 shadow-sm ${className || ""}`}
				style={{ backgroundColor: "var(--color-card-default-bg)", display: "flex", flexDirection: "column" }}
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
					<div
						className="ap-courses-scroll-area grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 overflow-y-auto scrollbar-custom px-4 py-2"
						style={{
							maxHeight: selectedCard ? "240px" : "calc(45vh - 60px)",
							minHeight: selectedCard ? "240px" : "320px",
							scrollbarGutter: "stable",
						}}
					>
						{(subjects || []).map((subject: ApSubject) => {
							// const stats = getSubjectStats(subject.id);
							const daysUntilExam = getDaysUntilExam(subject.examDate);
							const isSelected = selectedCard === subject.id;
							return (
								<APCourseCard
									key={subject.id}
									id={subject.id}
									title={subject.title.replace("AP ", "")}
									progress={subject.progress}
									isSelected={isSelected}
									daysUntilExam={daysUntilExam}
									completedChapters={subject.completedChapters || 0}
									totalChapters={subject.totalChapters || 0}
									completedExams={subject.completedExams || 0}
									totalExams={subject.totalExams || 0}
									onSelect={handleCardSelect}
								/>
							);
						})}

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
									<h3 style={{ color: "var(--color-text-primary)", fontSize: "14px", fontWeight: 500 }}>
										More Courses
									</h3>
									<p style={{ color: "var(--color-text-secondary)", fontSize: "11px" }}>Coming Soon</p>
								</div>
							</div>
						</Card>
					</div>

					{selectedSubjectData && (
						<div className="space-y-6">
							<APSubjectStats subject={selectedSubjectData} />

							<ChaptersGrid
								chapters={selectedChapters || []}
								mcqActiveMap={mcqActiveMap}
								frqActiveMap={frqActiveMap}
								onStartExam={() => handleWithApAccess(() => selectedSubjectData && onStartExam(selectedSubjectData))}
							/>

							<PracticeExamsGrid
								exams={selectedExams || []}
								subjectTitle={selectedSubjectData?.title || ""}
								onStartExam={(examId: string) =>
									handleWithApAccess(() => selectedSubjectData && onStartExam(selectedSubjectData, examId))
								}
								onViewResults={onViewResults}
							/>
						</div>
					)}

					{!selectedCard && (
						<div className="text-center py-8">
							<BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" style={{ color: "var(--color-text-tertiary)" }} />
							<h3 style={{ color: "var(--color-text-secondary)", fontSize: "16px", fontWeight: 500 }}>
								Select a Course
							</h3>
							<p style={{ color: "var(--color-text-tertiary)", fontSize: "14px" }}>
								Choose an AP course above to view chapters and practice exams
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* 조건1: 사용자 접근 권한 없음 */}
			<AlertDialog open={accessDialogOpen} onOpenChange={setAccessDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>접근 권한 없음</AlertDialogTitle>
						<AlertDialogDescription>
							{dialogMessage || "이 서비스는 관리자 승인 후 이용 가능합니다. 승인 완료 후 다시 시도해 주세요."}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction onClick={() => setAccessDialogOpen(false)}>확인</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* 조건2: 서비스 점검 중 */}
			<AlertDialog open={serviceMaintenanceDialogOpen} onOpenChange={setServiceMaintenanceDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>서비스 점검 중</AlertDialogTitle>
						<AlertDialogDescription>
							{dialogMessage || "현재 서비스 점검 중입니다. 잠시 후 다시 시도해 주세요."}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction onClick={() => setServiceMaintenanceDialogOpen(false)}>확인</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
