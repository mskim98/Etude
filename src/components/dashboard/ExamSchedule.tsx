"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { useExamSchedule } from "@/hooks/overview/useExamSchedule";
import type { ScheduleItem } from "@/types/schedule";

interface ExamScheduleProps {
	className?: string;
	// 외부에서 일정 데이터를 주입할 수 있도록 옵션으로 제공
	schedules?: ScheduleItem[];
	loading?: boolean;
	error?: string | null;
	onRefresh?: () => void;
}

export function ExamSchedule({
	className,
	schedules: propSchedules,
	loading: propLoading,
	error: propError,
	onRefresh: propOnRefresh,
}: ExamScheduleProps) {
	// 실제 데이터 훅 사용 (props로 오버라이드 가능)
	const { schedules: hookSchedules, loading: hookLoading, error: hookError, refreshSchedules } = useExamSchedule();

	// props 우선, 없으면 hook 데이터 사용
	const schedules = propSchedules || hookSchedules;
	const loading = propLoading !== undefined ? propLoading : hookLoading;
	const error = propError !== undefined ? propError : hookError;
	const onRefresh = propOnRefresh || refreshSchedules;

	// 다가오는 일정만 필터링 (upcoming + today)
	const upcomingSchedules = schedules.filter(
		(schedule) => schedule.status === "upcoming" || schedule.status === "today"
	);

	// 아이콘 매핑 함수 (카테고리 기반)
	const getCategoryIcon = (category: "ap" | "sat") => {
		return category === "ap" ? "📚" : "📋";
	};

	// 긴급도 레벨 계산
	const getUrgencyLevel = (daysUntil: number) => {
		if (daysUntil <= 7) {
			return {
				level: daysUntil === 0 ? "urgent" : "critical",
				color: "var(--destructive)",
				bgColor: "#fef2f2",
			};
		}
		return {
			level: "normal",
			color: "var(--muted-foreground)",
			bgColor: "var(--muted)",
		};
	};

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

	// 로딩 상태 처리
	if (loading) {
		return (
			<Card className={`border shadow-sm ${className}`}>
				<CardHeader className="pb-3 rounded-t-lg bg-primary">
					<CardTitle className="flex items-center space-x-2 text-lg font-semibold text-primary-foreground">
						<Calendar className="w-5 h-5" />
						<span>Exam Schedule</span>
						<RefreshCw className="w-4 h-4 animate-spin ml-2" />
					</CardTitle>
				</CardHeader>
				<CardContent className="bg-[rgba(0,0,0,0)]">
					<div className="text-center py-8">
						<RefreshCw className="w-8 h-8 mx-auto text-muted-foreground mb-3 animate-spin" />
						<p className="text-muted-foreground font-medium">Loading schedule...</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	// 에러 상태 처리
	if (error) {
		return (
			<Card className={`border shadow-sm ${className}`}>
				<CardHeader className="pb-3 rounded-t-lg bg-primary">
					<CardTitle className="flex items-center space-x-2 text-lg font-semibold text-primary-foreground">
						<Calendar className="w-5 h-5" />
						<span>Exam Schedule</span>
						<Button
							variant="ghost"
							size="sm"
							onClick={onRefresh}
							className="ml-auto text-primary-foreground hover:bg-primary-foreground/20"
						>
							<RefreshCw className="w-4 h-4" />
						</Button>
					</CardTitle>
				</CardHeader>
				<CardContent className="bg-[rgba(0,0,0,0)]">
					<div className="text-center py-8">
						<AlertCircle className="w-8 h-8 mx-auto text-destructive mb-3" />
						<p className="text-destructive font-medium mb-2">Unable to load schedule</p>
						<p className="text-muted-foreground text-sm mb-4">{error}</p>
						<Button onClick={onRefresh} size="sm">
							Retry
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={`border shadow-sm ${className}`}>
			<CardHeader className="pb-3 rounded-t-lg bg-primary">
				<CardTitle className="flex items-center space-x-2 text-lg font-semibold text-primary-foreground">
					<Calendar className="w-5 h-5" />
					<span>Exam Schedule</span>
					<Badge
						variant="outline"
						className="text-xs font-semibold ml-2 border-primary-foreground text-primary-foreground"
					>
						{upcomingSchedules.length} 예정
					</Badge>
					<Button
						variant="ghost"
						size="sm"
						onClick={onRefresh}
						className="ml-auto text-primary-foreground hover:bg-primary-foreground/20"
						title="새로고침"
					>
						<RefreshCw className="w-4 h-4" />
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent className="bg-[rgba(0,0,0,0)]">
				<div
					className="scrollbar-custom space-y-3 overflow-y-auto pr-2"
					style={{
						maxHeight: "384px",
						scrollBehavior: "smooth",
					}}
				>
					{upcomingSchedules.length === 0 ? (
						<div className="text-center py-8">
							<Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
							<p className="text-muted-foreground font-medium">No upcoming exams</p>
							<p className="text-muted-foreground text-sm mt-1">New schedules will appear here when added</p>
						</div>
					) : (
						upcomingSchedules.map((schedule) => {
							const urgency = getUrgencyLevel(schedule.daysUntil);

							return (
								<div key={schedule.id} className="p-2.5 rounded-lg border-2 border-muted-foreground/15 bg-card">
									<div className="flex items-start justify-between">
										<div className="flex items-start space-x-3">
											<div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl bg-primary text-primary-foreground">
												{getCategoryIcon(schedule.category)}
											</div>
											<div className="flex-1">
												<div className="flex items-center space-x-2 mb-1">
													<h3 className="font-bold text-foreground text-base">{schedule.title}</h3>
													<Badge variant="default" className="text-xs font-semibold bg-primary text-primary-foreground">
														{schedule.category.toUpperCase()}
													</Badge>
												</div>
												<div className="space-y-1">
													<div className="flex items-center space-x-2 text-sm text-muted-foreground font-medium">
														<Calendar className="w-4 h-4" />
														<span>{formatDate(schedule.date)}</span>
													</div>
													<div className="flex items-center space-x-2 text-sm text-muted-foreground font-medium">
														<Clock className="w-4 h-4" />
														<span>
															{schedule.status === "today"
																? "오늘"
																: schedule.status === "upcoming"
																? `${schedule.daysUntil}일 후`
																: "지남"}
														</span>
													</div>
												</div>
											</div>
										</div>

										<div className="text-right">
											<div className="space-y-1">
												<Badge
													className={`text-lg font-bold px-3 py-1 ${schedule.daysUntil === 0 ? "animate-pulse" : ""}`}
													style={{
														backgroundColor: urgency.bgColor,
														color: urgency.color,
														border: `2px solid ${urgency.color}60`,
													}}
												>
													{formatDayDisplay(schedule.daysUntil)}
												</Badge>

												{schedule.isUrgent && (
													<AlertCircle
														className={`w-5 h-5 mx-auto ${schedule.daysUntil === 0 ? "animate-pulse" : ""}`}
														style={{ color: urgency.color }}
													/>
												)}
											</div>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>
			</CardContent>
		</Card>
	);
}
