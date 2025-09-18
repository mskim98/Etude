"use client";
import React from "react";
import { TrendingUp, Award, BookOpen, Calendar } from "lucide-react";
import type { ApSubject } from "@/types/ap";

interface APSubjectStatsProps {
	subject: ApSubject;
}

export function APSubjectStats({ subject }: APSubjectStatsProps) {
	// 시험일까지 남은 날짜 계산
	const getDaysUntilExam = (examDate: Date) => {
		const now = new Date();
		const diffTime = examDate.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return Math.max(diffDays, 0);
	};

	// 시험일 포맷팅 (영어)
	const formatExamDate = (examDate: Date) => {
		return examDate.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const daysUntilExam = getDaysUntilExam(subject.examDate);

	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
			<div
				className="p-4 rounded-lg text-center flex flex-col justify-center items-center"
				style={{
					backgroundColor: "var(--color-card-default-bg)",
					border: "1px solid var(--color-card-border)",
					boxShadow: "var(--color-card-hover-shadow)",
				}}
			>
				<TrendingUp className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--color-primary)" }} />
				<div className="font-semibold" style={{ color: "var(--color-text-primary)", fontSize: "18px" }}>
					{subject.progress}%
				</div>
				<div style={{ color: "var(--color-text-secondary)", fontSize: "12px" }}>progress</div>
			</div>
			<div
				className="p-4 rounded-lg text-center flex flex-col justify-center items-center"
				style={{
					backgroundColor: "var(--color-card-default-bg)",
					border: "1px solid var(--color-card-border)",
					boxShadow: "var(--color-card-hover-shadow)",
				}}
			>
				<Award className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--color-primary)" }} />
				<div className="font-semibold" style={{ color: "var(--color-text-primary)", fontSize: "18px" }}>
					{subject.completedChapters}/{subject.totalChapters}
				</div>
				<div style={{ color: "var(--color-text-secondary)", fontSize: "12px" }}>chapters</div>
			</div>
			<div
				className="p-4 rounded-lg text-center flex flex-col justify-center items-center"
				style={{
					backgroundColor: "var(--color-card-default-bg)",
					border: "1px solid var(--color-card-border)",
					boxShadow: "var(--color-card-hover-shadow)",
				}}
			>
				<BookOpen className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--color-primary)" }} />
				<div className="font-semibold" style={{ color: "var(--color-text-primary)", fontSize: "18px" }}>
					{subject.completedExams}/{subject.totalExams}
				</div>
				<div style={{ color: "var(--color-text-secondary)", fontSize: "12px" }}>exams</div>
			</div>
			<div
				className="p-4 rounded-lg text-center flex flex-col justify-center items-center"
				style={{
					backgroundColor: "var(--color-card-default-bg)",
					border: "1px solid var(--color-card-border)",
					boxShadow: "var(--color-card-hover-shadow)",
				}}
			>
				<Calendar className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--color-primary)" }} />
				<div className="font-semibold mb-1" style={{ color: "var(--color-text-primary)", fontSize: "14px" }}>
					{formatExamDate(subject.examDate)}
				</div>
				<div className="font-semibold" style={{ color: "var(--color-primary)", fontSize: "16px" }}>
					{daysUntilExam} days left
				</div>
				<div style={{ color: "var(--color-text-secondary)", fontSize: "12px" }}>exam date</div>
			</div>
		</div>
	);
}
