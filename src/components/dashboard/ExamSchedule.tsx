"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import type { Subject } from "@/types";

interface ExamScheduleProps {
	subjects: Subject[];
	className?: string;
}

export function ExamSchedule({ subjects, className }: ExamScheduleProps) {
	// Convert subjects data to exam schedule format
	const getExamTime = (subjectType: "AP" | "SAT") => {
		return subjectType === "SAT" ? "8:00 AM" : Math.random() > 0.5 ? "8:00 AM" : "12:00 PM";
	};

	const getExamLocation = (subject: Subject) => {
		if (subject.type === "SAT") return "Main Testing Center";
		if (subject.name.includes("Chemistry")) return "Science Lab A";
		if (subject.name.includes("Biology")) return "Science Lab B";
		if (subject.name.includes("Physics")) return "Physics Lab";
		if (subject.name.includes("Computer Science")) return "Computer Lab";
		if (subject.name.includes("Statistics")) return "Room 301";
		if (subject.name.includes("Calculus")) return "Room 204";
		return "Room 101";
	};

	const getSubjectColor = (subject: Subject) => {
		// 통일된 색상 시스템 - Pantone 632
		return "var(--primary)";
	};

	const allExamSchedule = subjects.map((subject) => ({
		type: subject.type,
		subject: subject.name,
		date: subject.examDate,
		time: getExamTime(subject.type),
		location: getExamLocation(subject),
		icon: subject.icon,
		color: getSubjectColor(subject),
	}));

	const calculateDaysUntil = (examDate: Date) => {
		const today = new Date("2025-09-02"); // Fixed date for consistent testing
		const timeDiff = examDate.getTime() - today.getTime();
		const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
		return daysDiff;
	};

	// Filter out past exams - only show upcoming exams
	const upcomingExams = allExamSchedule.filter((exam) => {
		const daysUntil = calculateDaysUntil(exam.date);
		return daysUntil >= 0; // Only show exams that are today or in the future
	});

	const getUrgencyLevel = (daysUntil: number) => {
		// 1주일 이하: 빨간색으로 긴급 표시
		if (daysUntil <= 7) {
			return {
				level: daysUntil === 0 ? "urgent" : "critical",
				color: "var(--destructive)",
				bgColor: "#fef2f2", // Light red background
			};
		}
		// 1주일 초과: 무채색 계열로 통일
		return {
			level: "normal",
			color: "var(--muted-foreground)",
			bgColor: "var(--muted)",
		};
	};

	const formatDayDisplay = (daysUntil: number) => {
		if (daysUntil === 0) return "D-DAY";
		if (daysUntil === 1) return "D-1";
		return `D-${daysUntil}`;
	};

	const formatDaysRemaining = (daysUntil: number) => {
		if (daysUntil === 0) return "Today";
		if (daysUntil === 1) return "1 Day Left";
		return `${daysUntil} Days Left`;
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

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
						{upcomingExams.length} Upcoming
					</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent className="bg-[rgba(0,0,0,0)]">
				<div
					className="scrollbar-custom space-y-3 overflow-y-auto pr-2"
					style={{
						maxHeight: "384px", // Standardized height
						scrollBehavior: "smooth",
					}}
				>
					{upcomingExams.length === 0 ? (
						<div className="text-center py-8">
							<Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
							<p className="text-muted-foreground font-medium">No upcoming exams scheduled</p>
						</div>
					) : (
						upcomingExams.map((exam, index) => {
							const daysUntil = calculateDaysUntil(exam.date);
							const urgency = getUrgencyLevel(daysUntil);

							return (
								<div key={index} className="p-2.5 rounded-lg border-2 border-muted-foreground/15 bg-card">
									<div className="flex items-start justify-between">
										<div className="flex items-start space-x-3">
											<div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl bg-primary text-primary-foreground">
												{exam.icon}
											</div>
											<div className="flex-1">
												<div className="flex items-center space-x-2 mb-1">
													<h3 className="font-bold text-foreground text-base">{exam.subject}</h3>
													<Badge variant="default" className="text-xs font-semibold bg-primary text-primary-foreground">
														{exam.type}
													</Badge>
												</div>
												<div className="space-y-1">
													<div className="flex items-center space-x-2 text-sm text-muted-foreground font-medium">
														<Calendar className="w-4 h-4" />
														<span>{formatDate(exam.date)}</span>
													</div>
													<div className="flex items-center space-x-2 text-sm text-muted-foreground font-medium">
														<Clock className="w-4 h-4" />
														<span>
															{exam.time} • {exam.location}
														</span>
													</div>
												</div>
											</div>
										</div>

										<div className="text-right">
											<div className="space-y-1">
												<Badge
													className={`text-lg font-bold px-3 py-1 ${daysUntil === 0 ? "animate-pulse" : ""}`}
													style={{
														backgroundColor: urgency.bgColor,
														color: urgency.color,
														border: `2px solid ${urgency.color}60`,
													}}
												>
													{formatDayDisplay(daysUntil)}
												</Badge>

												{daysUntil <= 7 && (
													<AlertCircle
														className={`w-5 h-5 mx-auto ${daysUntil === 0 ? "animate-pulse" : ""}`}
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
