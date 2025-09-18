"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Calendar, AlertCircle } from "lucide-react";
import { useExamSchedule } from "@/hooks/overview/useExamSchedule";
import type { ScheduleItem } from "@/types/schedule";

interface ExamScheduleCardProps {
	className?: string;
	// 외부에서 일정 데이터를 주입할 수 있도록 옵션으로 제공
	schedules?: ScheduleItem[];
	loading?: boolean;
	error?: string | null;
}

export function ExamScheduleCard({
	className,
	schedules: propSchedules,
	loading: propLoading,
	error: propError,
}: ExamScheduleCardProps) {
	// 실제 데이터 훅 사용 (props로 오버라이드 가능)
	const { schedules: hookSchedules, loading: hookLoading, error: hookError } = useExamSchedule();

	// props 우선, 없으면 hook 데이터 사용
	const schedules = propSchedules || hookSchedules;
	const loading = propLoading !== undefined ? propLoading : hookLoading;
	const error = propError !== undefined ? propError : hookError;

	// 과거 일정 제외하고 현재/미래 일정만 날짜가 가까운 순서로 정렬
	const upcomingSchedules = schedules
		.filter((schedule) => schedule.status === "upcoming" || schedule.status === "today")
		.sort((a, b) => a.daysUntil - b.daysUntil); // 오늘(0) → 내일(1) → 모레(2) 순서

	// D-Day 표시 포맷
	const formatDayDisplay = (daysUntil: number) => {
		if (daysUntil === 0) return "D-DAY";
		if (daysUntil === 1) return "D-1";
		return `D-${daysUntil}`;
	};

	// 날짜 포맷팅
	const formatDate = (date: Date) => {
		return date.toLocaleDateString("ko-KR", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	return (
		<Card className={`border shadow-sm animate-in fade-in-50 duration-500 ${className}`}>
			<CardHeader className="pb-3 rounded-t-lg bg-primary">
				<CardTitle className="flex items-center space-x-2 text-lg font-semibold text-primary-foreground">
					<Calendar className="w-5 h-5" />
					<span>Exam Schedule</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div
					className="space-y-3 overflow-y-auto scrollbar-custom pr-2"
					style={{
						height: "300px", // Fixed height like Announcements
						minHeight: "360px",
					}}
				>
					{/* 로딩 상태 */}
					{loading && (
						<div className="flex items-center justify-center h-full">
							<div className="text-center">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
								<p className="text-muted-foreground font-medium">Loading schedule...</p>
							</div>
						</div>
					)}

					{/* 에러 상태 */}
					{error && (
						<div className="flex items-center justify-center h-full">
							<div className="text-center">
								<AlertCircle className="w-6 h-6 text-destructive mx-auto mb-2" />
								<span className="text-sm text-destructive">{error}</span>
							</div>
						</div>
					)}

					{/* 일정이 없는 경우 */}
					{!loading && !error && upcomingSchedules.length === 0 && (
						<div className="flex items-center justify-center h-full">
							<div className="text-center">
								<Calendar className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
								<span className="text-sm text-muted-foreground">No upcoming exams available.</span>
							</div>
						</div>
					)}

					{/* 실제 일정 목록 */}
					{!loading &&
						!error &&
						upcomingSchedules.map((schedule) => {
							return (
								<div key={schedule.id} className="p-4 rounded-lg border-2 border-muted-foreground/15 bg-card">
									<div className="flex items-start justify-between mb-2">
										<div className="flex items-center space-x-3">
											<div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary">
												<Calendar className="w-5 h-5 text-primary-foreground" />
											</div>
											<div>
												<div className="flex items-center space-x-2">
													<span className="font-bold text-foreground text-base">{schedule.title}</span>
													<Badge variant="outline" className="text-xs font-semibold bg-primary text-primary-foreground">
														{schedule.category.toUpperCase()}
													</Badge>
												</div>
												<div className="flex items-center space-x-2 mt-1">
													<span className="text-sm font-semibold text-foreground">{formatDate(schedule.date)}</span>
												</div>
											</div>
										</div>
										<div className="text-right">
											<Badge
												className={`text-lg font-bold px-3 py-1 ${schedule.daysUntil === 0 ? "animate-pulse" : ""}`}
												style={{
													backgroundColor:
														schedule.daysUntil === 0
															? "var(--destructive)"
															: schedule.daysUntil <= 3
															? "#fef2f2"
															: "var(--muted)",
													color:
														schedule.daysUntil === 0
															? "var(--destructive-foreground)"
															: schedule.daysUntil <= 3
															? "var(--destructive)"
															: "var(--muted-foreground)",
													border: `2px solid ${
														schedule.daysUntil === 0
															? "var(--destructive)"
															: schedule.daysUntil <= 3
															? "var(--destructive)"
															: "var(--muted-foreground)"
													}60`,
												}}
											>
												{formatDayDisplay(schedule.daysUntil)}
											</Badge>
										</div>
									</div>
								</div>
							);
						})}
				</div>
			</CardContent>
		</Card>
	);
}
