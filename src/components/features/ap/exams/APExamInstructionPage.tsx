"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Clock,
	FileText,
	AlertTriangle,
	CheckCircle,
	ArrowLeft,
	Play,
	BookOpen,
	Target,
	Timer,
	Users,
	Flag,
} from "lucide-react";
import type { ApExam } from "@/types/ap";

interface APExamInstructionPageProps {
	examData: ApExam;
	onStartExam: () => void;
	onGoBack: () => void;
}

export function APExamInstructionPage({ examData, onStartExam, onGoBack }: APExamInstructionPageProps) {
	const formatDuration = (minutes: number): string => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours > 0) {
			return `${hours}:${mins.toString().padStart(2, "0")}:00`;
		}
		return `${mins}:00`;
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b bg-card shadow-sm">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Button
								variant="ghost"
								onClick={onGoBack}
								className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
							>
								<ArrowLeft className="w-4 h-4" />
								Back to AP Courses
							</Button>
						</div>
						<Badge variant="secondary" className="px-3 py-1">
							<Flag className="w-3 h-3 mr-1" />
							AP Practice Exam
						</Badge>
					</div>
				</div>
			</header>

			{/* Main Content - BlueBook Style */}
			<div className="max-w-4xl mx-auto p-6">
				<Card className="text-center border-primary/20 shadow-xl bg-card">
					<CardContent className="p-12">
						<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-2 ring-primary/20">
							<BookOpen className="w-8 h-8 text-primary" />
						</div>
						<h1 className="text-2xl font-semibold text-foreground mb-4">{examData.title}</h1>
						<p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
							This is a full-length practice exam designed to simulate the real AP exam experience. You'll have{" "}
							{formatDuration(examData.duration)} to complete {examData.questionCount} questions in a BlueBook-style
							interface with access to tools and formulas.
						</p>

						<div className="grid md:grid-cols-3 gap-6 mb-8">
							<div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10">
								<div className="text-2xl font-semibold text-primary">{examData.questionCount}</div>
								<p className="text-muted-foreground">Questions</p>
							</div>
							<div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10">
								<div className="text-2xl font-semibold text-primary">{formatDuration(examData.duration)}</div>
								<p className="text-muted-foreground">Time Limit</p>
							</div>
							<div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10">
								<div className="text-2xl font-semibold text-primary">1-5</div>
								<p className="text-muted-foreground">AP Score Range</p>
							</div>
						</div>

						<Alert className="mb-8 bg-primary/5 border-primary/20 shadow-sm">
							<AlertTriangle className="h-4 w-4" />
							<AlertDescription className="text-left">
								<strong>Important Instructions:</strong>
								<ul className="mt-2 space-y-1 text-sm">
									<li>• This exam simulates the real AP testing environment</li>
									<li>• You have access to a graphing calculator and reference formulas</li>
									<li>• Your answers are automatically saved as you work</li>
									<li>• You can review and change answers before submitting</li>
									<li>• Once you start, the timer cannot be paused</li>
								</ul>
							</AlertDescription>
						</Alert>

						<div className="space-y-4">
							<Button
								onClick={onStartExam}
								size="lg"
								className="px-8 py-3 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
								disabled={!examData.canTake}
							>
								<Play className="w-5 h-5 mr-2" />
								{examData.completed ? "Retake Exam" : "Begin Exam"}
							</Button>

							{examData.completed && examData.bestScore && (
								<div className="text-sm text-muted-foreground">Previous Best Score: {examData.bestScore}/5</div>
							)}
						</div>

						<div className="mt-8 pt-6 border-t border-border">
							<p className="text-xs text-muted-foreground">
								This practice exam is designed to help you prepare for the official AP exam. Results are for practice
								purposes only.
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Additional Information Cards */}
				<div className="grid md:grid-cols-2 gap-6 mt-8">
					<Card className="border-primary/10">
						<CardHeader className="pb-3">
							<CardTitle className="text-lg flex items-center gap-2">
								<Target className="w-5 h-5 text-primary" />
								Exam Features
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-sm">
							<div className="flex items-start gap-2">
								<CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
								<span>Built-in graphing calculator</span>
							</div>
							<div className="flex items-start gap-2">
								<CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
								<span>Reference sheet access</span>
							</div>
							<div className="flex items-start gap-2">
								<CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
								<span>Question flagging and review</span>
							</div>
							<div className="flex items-start gap-2">
								<CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
								<span>Auto-save functionality</span>
							</div>
						</CardContent>
					</Card>

					<Card className="border-primary/10">
						<CardHeader className="pb-3">
							<CardTitle className="text-lg flex items-center gap-2">
								<Clock className="w-5 h-5 text-primary" />
								Time Management
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Total Time:</span>
								<span className="font-medium">{formatDuration(examData.duration)}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Per Question:</span>
								<span className="font-medium">~{Math.round(examData.duration / examData.questionCount)} min</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Difficulty:</span>
								<Badge variant="outline" className="text-xs">
									{examData.difficulty}
								</Badge>
							</div>
							{examData.attemptCount > 0 && (
								<div className="flex justify-between">
									<span className="text-muted-foreground">Attempts:</span>
									<span className="font-medium">{examData.attemptCount}</span>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
