"use client";
import React, { memo } from "react";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { ChevronRight } from "lucide-react";

/**
 * 카드 형태로 AP 과목 요약 정보를 표시합니다.
 */
export interface APCourseCardProps {
	id: string;
	title: string;
	progress: number;
	isSelected: boolean;
	daysUntilExam: number;
	completedChapters: number;
	totalChapters: number;
	completedExams: number;
	totalExams: number;
	onSelect: (subjectId: string) => void;
}

export const APCourseCard = memo(function APCourseCard({
	id,
	title,
	progress,
	isSelected,
	daysUntilExam,
	completedChapters,
	totalChapters,
	completedExams,
	totalExams,
	onSelect,
}: APCourseCardProps) {
	return (
		<Card
			key={id}
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
			onClick={() => onSelect(id)}
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
								{title}
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
				<div className="mb-4">
					<div className="flex justify-between items-center mb-2">
						<span style={{ color: "var(--color-text-secondary)", fontSize: "12px" }}>Progress</span>
						<span style={{ color: "var(--color-primary)", fontSize: "12px", fontWeight: 600 }}>{progress}%</span>
					</div>
					<div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-muted)" }}>
						<div
							className="h-full transition-all duration-500 ease-out rounded-full"
							style={{ width: `${progress}%`, backgroundColor: "var(--color-primary)" }}
						/>
					</div>
				</div>

				<div className="grid grid-cols-3 gap-3">
					<div className="text-center">
						<div className="font-semibold" style={{ color: "var(--color-text-primary)", fontSize: "14px" }}>
							{progress}%
						</div>
						<div style={{ color: "var(--color-text-secondary)", fontSize: "10px", fontWeight: 500 }}>Progress</div>
					</div>
					<div className="text-center">
						<div className="font-semibold" style={{ color: "var(--color-text-primary)", fontSize: "14px" }}>
							{completedChapters}/{totalChapters}
						</div>
						<div style={{ color: "var(--color-text-secondary)", fontSize: "10px", fontWeight: 500 }}>Chapters</div>
					</div>
					<div className="text-center">
						<div className="font-semibold" style={{ color: "var(--color-text-primary)", fontSize: "14px" }}>
							{completedExams}/{totalExams}
						</div>
						<div style={{ color: "var(--color-text-secondary)", fontSize: "10px", fontWeight: 500 }}>Exams</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
});
