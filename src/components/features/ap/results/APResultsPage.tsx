"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, BookOpen, RotateCcw, Target, Beaker, Brain, Dna } from "lucide-react";
import { ScoreSummaryCard } from "@/components/features/sat/results/components/ScoreSummaryCard";
// import { QuestionsToReview } from "./components/QuestionsToReview";
import type { ExamResult, Subject, PageType } from "@/types";

interface APResultsPageProps {
	result?: ExamResult | null;
	subject?: Subject | null;
	onNavigate: (page: PageType) => void;
	onRetryExam?: () => void;
}

export function APResultsPage({ result, subject, onNavigate, onRetryExam }: APResultsPageProps) {
	// 상태 제거: 차트 타입 토글 불필요

	// Use provided result and subject data
	const finalResult = result;
	const finalSubject = subject;

	if (!finalResult || !finalSubject) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-xl font-medium text-gray-900 mb-4">No Results Found</h2>
					<Button onClick={() => onNavigate("dashboard")}>Return to Dashboard</Button>
				</div>
			</div>
		);
	}

	// Get subject-specific icon
	const getSubjectIcon = () => {
		switch (finalSubject.name) {
			case "AP Chemistry":
				return <Beaker className="w-4 h-4" />;
			case "AP Biology":
				return <Dna className="w-4 h-4" />;
			case "AP Psychology":
				return <Brain className="w-4 h-4" />;
			default:
				return <BookOpen className="w-4 h-4" />;
		}
	};

	// 성과 분석 데이터
	const rawQuestionTypeData = finalResult.questionTypeAnalysis || [];

	// AP Chemistry 5개 핵심 주제별 성과 데이터 (백분율 계산 포함)
	const questionTypeData = rawQuestionTypeData.map((item) => ({
		...item,
		percentage: item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0,
	}));

	// 하드코딩된 주제 확인/로그 제거 (실데이터 기반 표시)

	const wrongQuestions =
		finalResult.mistakes?.map((mistake, index) => ({
			id: mistake.questionId,
			questionNumber: index + 1,
			topic: mistake.topic || "General",
			questionType: mistake.questionType || "MCQ",
			userAnswer: mistake.userAnswer,
			correctAnswer: mistake.correctAnswer,
			reasoning: mistake.reasoning || "Conceptual gap identified",
			difficulty: mistake.difficulty || "Medium",
		})) || [];

	// 차트 제거: 토픽별 맞힘/틀림 카운트로 대체

	const handleViewSolution = (questionId: string) => {
		try {
			const payload = {
				questions: wrongQuestions,
				selectedQuestionId: questionId,
				meta: {
					subjectId: finalResult.subjectId,
					completedAt: finalResult.completedAt,
				},
			};
			localStorage.setItem("ap-exam-review-payload", JSON.stringify(payload));
			window.location.assign("/ap-exam-review");
		} catch {
			// noop
		}
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="bg-white border-b border-gray-200 px-6 py-4">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<Button variant="ghost" onClick={() => onNavigate("dashboard")}>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to AP Courses
						</Button>
						<div>
							<h1 className="text-xl font-medium text-gray-900 flex items-center space-x-2">
								{getSubjectIcon()}
								<span>{finalSubject.name} Results</span>
							</h1>
							<p className="text-sm text-gray-500">Completed on {finalResult.completedAt.toLocaleDateString()}</p>
						</div>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-6 py-8">
				{/* Score Summary Strip */}
				<div className="mb-8">
					<ScoreSummaryCard
						examType="AP"
						correctAnswers={finalResult.correctAnswers}
						totalQuestions={finalResult.totalQuestions}
						timeSpent={finalResult.timeSpent}
						completedAt={finalResult.completedAt}
					/>
				</div>

				{/* Multiple Choice Questions section removed - functionality integrated into ScoreSummaryCard */}

				{/* Exam Result (Integrated) */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Target className="w-6 h-6" />
								<span className="text-xl font-semibold">Exam Result</span>
							</div>
							<Button
								size="lg"
								onClick={() => handleViewSolution(wrongQuestions[0]?.id)}
								disabled={wrongQuestions.length === 0}
							>
								Review All ({wrongQuestions.length})
							</Button>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							{/* Topic table */}
							<div className="lg:col-span-3">
								<div className="rounded-md border overflow-hidden">
									<div className="hidden md:grid grid-cols-5 bg-muted/50 text-sm font-semibold text-muted-foreground px-5 py-3">
										<div className="col-span-2">Topic</div>
										<div className="text-green-700">Correct</div>
										<div className="text-red-700">Wrong</div>
										<div>Total</div>
									</div>
									<div className="max-h-[420px] overflow-y-auto divide-y">
										{questionTypeData.length === 0 ? (
											<div className="text-base text-muted-foreground px-5 py-8">No topic analysis available.</div>
										) : (
											questionTypeData.map((item) => {
												const wrong = item.total - item.correct;
												const acc = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
												return (
													<div key={item.name} className="px-3 py-3">
														{/* Summary row */}
														<div className="grid grid-cols-1 md:grid-cols-5 gap-3 px-2 items-center">
															<div className="md:col-span-2">
																<div className="text-base font-semibold">{item.name}</div>
																<div className="text-sm text-muted-foreground">Accuracy {acc}%</div>
															</div>
															<div className="text-green-700 text-base font-medium">{item.correct}</div>
															<div className="text-red-700 text-base font-medium">{wrong}</div>
															<div className="text-base font-medium">{item.total}</div>
														</div>

														{/* removed per request: no inline wrong list */}
													</div>
												);
											})
										)}
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
				{/* end Exam Result */}

				{/* AP Chemistry Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button
						size="lg"
						style={{ backgroundColor: "var(--color-accent)" }}
						className="text-white hover:opacity-90"
						onClick={onRetryExam || (() => onNavigate("dashboard"))}
					>
						<RotateCcw className="w-4 h-4 mr-2" />
						Retake Exam
					</Button>
					<Button variant="outline" size="lg" onClick={() => onNavigate("dashboard")}>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to AP Chemistry
					</Button>
				</div>
			</div>
		</div>
	);
}
