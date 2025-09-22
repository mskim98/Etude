"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";

interface ScoreSummaryCardProps {
	examType: "SAT" | "AP";
	totalScore?: number;
	maxScore?: number;
	correctAnswers?: number;
	totalQuestions: number;
	timeSpent: number;
	completedAt: Date;
	percentile?: number;
}

export function ScoreSummaryCard({
	examType,
	totalScore,
	maxScore,
	correctAnswers,
	totalQuestions,
	timeSpent,
	completedAt,
	percentile,
}: ScoreSummaryCardProps) {
	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const remainingSeconds = Math.floor(seconds % 60);

		if (hours > 0) {
			return `${hours}h ${minutes}m ${remainingSeconds}s`;
		} else if (minutes > 0) {
			return `${minutes}m ${remainingSeconds}s`;
		} else {
			return `${remainingSeconds}s`;
		}
	};

	const getScoreColor = () => {
		if (examType === "SAT") {
			const score = totalScore || 0;
			if (score >= 1400) return "text-green-600";
			if (score >= 1200) return "text-blue-600";
			if (score >= 1000) return "text-yellow-600";
			return "text-gray-600";
		} else {
			const percentage = correctAnswers ? (correctAnswers / totalQuestions) * 100 : 0;
			if (percentage >= 85) return "text-green-600";
			if (percentage >= 70) return "text-[#0091B3]";
			if (percentage >= 55) return "text-yellow-600";
			return "text-gray-600";
		}
	};

	return (
		<Card className="border-2" style={{ borderColor: "var(--color-accent)" }}>
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<CardTitle className="text-2xl text-gray-900">Exam Results</CardTitle>
					<Badge variant="secondary" className="text-sm">
						{completedAt.toLocaleDateString()}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Primary Score Display */}
				<div className="text-center">
					{examType === "SAT" ? (
						<div>
							<div className={`text-5xl font-bold mb-3 ${getScoreColor()}`}>{totalScore}</div>
							<div className="text-lg text-gray-500">out of {maxScore}</div>
							{percentile && <div className="text-base text-gray-400 mt-2">{percentile}th percentile</div>}
						</div>
					) : (
						<div>
							<div className={`text-5xl font-bold mb-3 ${getScoreColor()}`}>{correctAnswers}</div>
							<div className="text-lg text-gray-500">out of {totalQuestions} correct</div>
							<div className="text-base text-gray-400 mt-2">
								{correctAnswers ? Math.round((correctAnswers / totalQuestions) * 100) : 0}% accuracy
							</div>
						</div>
					)}
				</div>

				{/* Progress Bar for AP exams */}
				{examType === "AP" && correctAnswers !== undefined && (
					<div className="space-y-2">
						<Progress value={(correctAnswers / totalQuestions) * 100} className="h-3" />
					</div>
				)}

				{/* Detailed Breakdown for AP exams */}
				{examType === "AP" && correctAnswers !== undefined && (
					<div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
						<div className="flex items-center space-x-2">
							<CheckCircle className="w-5 h-5 text-green-500" />
							<div>
								<div className="text-sm text-gray-500">Correct</div>
								<div className="text-base font-medium">{correctAnswers}</div>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<XCircle className="w-5 h-5 text-red-500" />
							<div>
								<div className="text-sm text-gray-500">Incorrect</div>
								<div className="text-base font-medium">{totalQuestions - correctAnswers}</div>
							</div>
						</div>
					</div>
				)}

				{/* Quick Stats */}
				<div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
					<div className="flex items-center space-x-3">
						<TrendingUp className="w-5 h-5 text-gray-400" />
						<div>
							<div className="text-sm text-gray-500">Total Questions</div>
							<div className="text-lg font-medium">{totalQuestions}</div>
						</div>
					</div>
					<div className="flex items-center space-x-3">
						<Clock className="w-5 h-5 text-gray-400" />
						<div>
							<div className="text-sm text-gray-500">Time Spent</div>
							<div className="text-lg font-medium">{formatTime(timeSpent)}</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
