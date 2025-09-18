"use client";
import React from "react";
import { Card, CardContent } from "../../../ui/card";
import { Progress } from "../../../ui/progress";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { Target, ChevronRight } from "lucide-react";
import type { Subject } from "@/types";

interface SATSubjectCardProps {
	onStartExam: (subject: Subject) => void;
	onNavigateToSubject?: (subject: Subject) => void;
}

export function SATSubjectCard({ onStartExam, onNavigateToSubject }: SATSubjectCardProps) {
	// Mock SAT subjects data (실제로는 useDashboardSatSubjects 훅 사용)
	const satSubjects: Subject[] = [
		{
			id: "sat-math",
			name: "SAT Math",
			type: "SAT",
			progress: 65,
			totalChapters: 8,
			completedChapters: 5,
			lastScore: 720,
			icon: "🔢",
			examDate: new Date("2025-12-14"),
			sectionProgress: {
				reading: { progress: 0, completed: false, score: undefined },
				writing: { progress: 0, completed: false, score: undefined },
				math: { progress: 65, completed: false, score: 720 },
			},
		},
		{
			id: "sat-reading",
			name: "SAT Reading",
			type: "SAT",
			progress: 78,
			totalChapters: 6,
			completedChapters: 4,
			lastScore: 650,
			icon: "📖",
			examDate: new Date("2025-12-14"),
			sectionProgress: {
				reading: { progress: 78, completed: false, score: 650 },
				writing: { progress: 0, completed: false, score: undefined },
				math: { progress: 0, completed: false, score: undefined },
			},
		},
	];

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

	const getProgressColor = (progress: number) => {
		return "var(--primary)"; // consistent primary blue for all progress levels
	};

	return (
		<div className="space-y-4">
			{satSubjects.map((subject) => (
				<Card
					key={subject.id}
					className="border-2 border-muted-foreground/15 bg-card hover:shadow-md transition-all duration-200 cursor-pointer group"
					onClick={() => onNavigateToSubject?.(subject)}
				>
					<CardContent className="p-4">
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center space-x-3">
								<div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary text-primary-foreground">
									<span className="text-lg">{subject.icon}</span>
								</div>
								<div>
									<h3 className="font-bold text-foreground text-sm">{subject.name}</h3>
									<Badge variant="secondary" className="text-xs font-semibold bg-green-100 text-green-800">
										{subject.type}
									</Badge>
								</div>
							</div>
							<div className="flex items-center space-x-2">
								{subject.lastScore && subject.lastScore > 0 && (
									<Badge
										variant="outline"
										className={`text-xs font-semibold ${getGradeColor(subject.lastScore, subject.type)}`}
									>
										{`${subject.lastScore}/800`}
									</Badge>
								)}
								<ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
							</div>
						</div>

						{/* Progress Bar */}
						<div className="mb-3">
							<div className="flex justify-between items-center mb-1">
								<span className="text-xs font-medium text-muted-foreground">Progress</span>
								<span className="text-xs font-bold text-primary">{subject.progress}%</span>
							</div>
							<Progress
								value={subject.progress}
								className="h-2"
								style={
									{
										"--progress-background": getProgressColor(subject.progress),
									} as React.CSSProperties
								}
							/>
						</div>

						{/* Stats Grid */}
						<div className="grid grid-cols-3 gap-2 text-center">
							<div>
								<div className="text-xs font-bold text-foreground">{subject.progress}%</div>
								<div className="text-xs text-muted-foreground">Progress</div>
							</div>
							<div>
								<div className="text-xs font-bold text-foreground">
									{subject.completedChapters}/{subject.totalChapters}
								</div>
								<div className="text-xs text-muted-foreground">Chapters</div>
							</div>
							<div>
								<div className="text-xs font-bold text-foreground">
									{subject.examDate ? (
										<>{Math.ceil((subject.examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}d</>
									) : (
										"TBA"
									)}
								</div>
								<div className="text-xs text-muted-foreground">Until Exam</div>
							</div>
						</div>

						{/* Quick Action */}
						<div className="mt-3 pt-3 border-t border-muted-foreground/10">
							<Button
								size="sm"
								className="w-full text-xs font-semibold"
								onClick={(e) => {
									e.stopPropagation();
									onStartExam(subject);
								}}
							>
								<Target className="w-3 h-3 mr-1" />
								Quick Practice
							</Button>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
