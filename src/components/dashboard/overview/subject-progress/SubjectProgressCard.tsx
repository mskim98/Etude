"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { TrendingUp, BookOpen, FileText } from "lucide-react";
import type { Subject } from "@/types";
import { APSubjectCard } from "./APSubjectCard";
import { SATSubjectCard } from "./SATSubjectCard";
import { useDashboardApSubjects } from "@/hooks/ap-courses/useApSubjects";

interface SubjectProgressCardProps {
	onStartExam: (subject: Subject) => void;
	onNavigateToSubject?: (subject: Subject) => void;
	className?: string;
}

export function SubjectProgressCard({ onStartExam, onNavigateToSubject, className }: SubjectProgressCardProps) {
	const [selectedType, setSelectedType] = useState<"ALL" | "AP" | "SAT">("ALL");

	// AP 과목 데이터 가져오기 (개수 확인용)
	const { subjects: apSubjects, isLoading, error } = useDashboardApSubjects();

	// Mock SAT subjects count
	const satSubjectsCount = 2;

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

	const totalSubjects = (apSubjects?.length || 0) + satSubjectsCount;

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
							{selectedType === "ALL"
								? `${totalSubjects} Subject${totalSubjects !== 1 ? "s" : ""}`
								: selectedType === "AP"
								? `${apSubjects?.length || 0} Subject${(apSubjects?.length || 0) !== 1 ? "s" : ""}`
								: `${satSubjectsCount} Subjects`}
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
						All ({totalSubjects})
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
						<span>AP ({apSubjects?.length || 0})</span>
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
						<span>SAT ({satSubjectsCount})</span>
					</Button>
				</div>
			</CardHeader>

			<CardContent className="flex-1 overflow-hidden">
				<div
					className="h-full overflow-y-auto scrollbar-custom space-y-4 pr-2"
					style={{
						minHeight: "320px",
						maxHeight: "calc(100vh - 520px)",
						height: "calc(100vh - 520px)",
					}}
				>
					{selectedType === "ALL" && (
						<>
							<APSubjectCard onStartExam={onStartExam} onNavigateToSubject={onNavigateToSubject} />
							<SATSubjectCard onStartExam={onStartExam} onNavigateToSubject={onNavigateToSubject} />
						</>
					)}
					{selectedType === "AP" && (
						<APSubjectCard onStartExam={onStartExam} onNavigateToSubject={onNavigateToSubject} />
					)}
					{selectedType === "SAT" && (
						<SATSubjectCard onStartExam={onStartExam} onNavigateToSubject={onNavigateToSubject} />
					)}
				</div>
			</CardContent>
		</Card>
	);
}
