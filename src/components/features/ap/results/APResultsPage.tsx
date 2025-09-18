"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, RotateCcw, Target, Beaker, Brain, Dna } from "lucide-react";
import { ScoreSummaryCard } from "@/components/features/sat/results/components/ScoreSummaryCard";
import { TypeAnalysisChart } from "@/components/features/sat/results/components/TypeAnalysisChart";
import { WrongQuestionList } from "@/components/features/sat/results/components/WrongQuestionList";
import type { ExamResult, Subject, PageType } from "@/types";

interface APResultsPageProps {
	result?: ExamResult | null;
	subject?: Subject | null;
	onNavigate: (page: PageType) => void;
	onRetryExam?: () => void;
}

export function APResultsPage({ result, subject, onNavigate, onRetryExam }: APResultsPageProps) {
	// Mock data for demonstration if no result provided
	const mockResult: ExamResult = {
		id: "ap-chem-mock-1",
		subjectId: "ap-chemistry",
		totalQuestions: 60,
		correctAnswers: 42,
		score: 4,
		timeSpent: 7200, // 2 hours
		completedAt: new Date(),
		mistakes: [
			{ questionId: "1", userAnswer: 1, correctAnswer: 2 },
			{ questionId: "2", userAnswer: 0, correctAnswer: 3 },
			{ questionId: "3", userAnswer: 2, correctAnswer: 1 },
		],
	};

	const mockSubject: Subject = {
		id: "ap-chemistry",
		name: "AP Chemistry",
		type: "AP",
		progress: 75,
		totalChapters: 6,
		completedChapters: 4,
		lastScore: 4,
		icon: "🧪",
		examDate: new Date("2025-05-15"),
		sectionProgress: {
			reading: { progress: 80, completed: false, score: undefined },
			writing: { progress: 70, completed: false, score: undefined },
			math: { progress: 85, completed: false, score: undefined },
		},
	};

	const finalResult = result || mockResult;
	const finalSubject = subject || mockSubject;

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

	// Mock AP-specific question type data based on subject
	const getQuestionTypeData = () => {
		const mcqTotal = Math.round(finalResult.totalQuestions * 0.6);
		const frqTotal = finalResult.totalQuestions - mcqTotal;
		const mcqCorrect = Math.round(finalResult.correctAnswers * 0.6);
		const frqCorrect = finalResult.correctAnswers - mcqCorrect;

		switch (finalSubject.name) {
			case "AP Chemistry":
				return [
					{
						name: "Atomic Structure",
						correct: Math.round(finalResult.correctAnswers * 0.15),
						total: Math.round(finalResult.totalQuestions * 0.15),
						percentage: 0,
					},
					{
						name: "Chemical Bonding",
						correct: Math.round(finalResult.correctAnswers * 0.2),
						total: Math.round(finalResult.totalQuestions * 0.2),
						percentage: 0,
					},
					{
						name: "Thermodynamics",
						correct: Math.round(finalResult.correctAnswers * 0.15),
						total: Math.round(finalResult.totalQuestions * 0.15),
						percentage: 0,
					},
					{
						name: "Kinetics",
						correct: Math.round(finalResult.correctAnswers * 0.15),
						total: Math.round(finalResult.totalQuestions * 0.15),
						percentage: 0,
					},
					{
						name: "Equilibrium",
						correct: Math.round(finalResult.correctAnswers * 0.2),
						total: Math.round(finalResult.totalQuestions * 0.2),
						percentage: 0,
					},
					{
						name: "Acids & Bases",
						correct: Math.round(finalResult.correctAnswers * 0.15),
						total: Math.round(finalResult.totalQuestions * 0.15),
						percentage: 0,
					},
				];
			case "AP Biology":
				return [
					{
						name: "Evolution",
						correct: Math.round(finalResult.correctAnswers * 0.2),
						total: Math.round(finalResult.totalQuestions * 0.2),
						percentage: 0,
					},
					{
						name: "Cell Biology",
						correct: Math.round(finalResult.correctAnswers * 0.25),
						total: Math.round(finalResult.totalQuestions * 0.25),
						percentage: 0,
					},
					{
						name: "Genetics",
						correct: Math.round(finalResult.correctAnswers * 0.2),
						total: Math.round(finalResult.totalQuestions * 0.2),
						percentage: 0,
					},
					{
						name: "Ecology",
						correct: Math.round(finalResult.correctAnswers * 0.2),
						total: Math.round(finalResult.totalQuestions * 0.2),
						percentage: 0,
					},
					{
						name: "Energy & Communication",
						correct: Math.round(finalResult.correctAnswers * 0.15),
						total: Math.round(finalResult.totalQuestions * 0.15),
						percentage: 0,
					},
				];
			case "AP Psychology":
				return [
					{
						name: "Biological Psychology",
						correct: Math.round(finalResult.correctAnswers * 0.2),
						total: Math.round(finalResult.totalQuestions * 0.2),
						percentage: 0,
					},
					{
						name: "Learning & Memory",
						correct: Math.round(finalResult.correctAnswers * 0.2),
						total: Math.round(finalResult.totalQuestions * 0.2),
						percentage: 0,
					},
					{
						name: "Social Psychology",
						correct: Math.round(finalResult.correctAnswers * 0.15),
						total: Math.round(finalResult.totalQuestions * 0.15),
						percentage: 0,
					},
					{
						name: "Developmental Psychology",
						correct: Math.round(finalResult.correctAnswers * 0.15),
						total: Math.round(finalResult.totalQuestions * 0.15),
						percentage: 0,
					},
					{
						name: "Abnormal Psychology",
						correct: Math.round(finalResult.correctAnswers * 0.15),
						total: Math.round(finalResult.totalQuestions * 0.15),
						percentage: 0,
					},
					{
						name: "Research Methods",
						correct: Math.round(finalResult.correctAnswers * 0.15),
						total: Math.round(finalResult.totalQuestions * 0.15),
						percentage: 0,
					},
				];
			default:
				return [];
		}
	};

	const questionTypeData = getQuestionTypeData().map((item) => ({
		...item,
		percentage: item.total > 0 ? (item.correct / item.total) * 100 : 0,
	}));

	// Question format breakdown
	const mcqTotal = Math.round(finalResult.totalQuestions * 0.6);
	const frqTotal = finalResult.totalQuestions - mcqTotal;
	const mcqCorrect = Math.round(finalResult.correctAnswers * 0.6);
	const frqCorrect = finalResult.correctAnswers - mcqCorrect;

	// Mock wrong questions
	const wrongQuestions = finalResult.mistakes.map((mistake, index) => ({
		id: mistake.questionId,
		questionNumber: index + 1,
		topic: questionTypeData[index % questionTypeData.length]?.name || "General",
		questionType: Math.random() > 0.4 ? "MCQ" : ("FRQ" as "MCQ" | "FRQ"),
		userAnswer: `Option ${mistake.userAnswer + 1}`,
		correctAnswer: `Option ${mistake.correctAnswer + 1}`,
		reasoning: "Conceptual gap identified",
		difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)] as "Easy" | "Medium" | "Hard",
	}));

	const insights = {
		strengths: questionTypeData.filter((item) => item.percentage >= 75).map((item) => item.name),
		needsWork: questionTypeData.filter((item) => item.percentage < 65).map((item) => item.name),
	};

	const handleViewSolution = (questionId: string) => {
		// Mock implementation - in a real app, this would open a detailed solution modal
		console.log("View solution for question:", questionId);
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="bg-white border-b border-gray-200 px-6 py-4">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<Button variant="ghost" onClick={() => onNavigate("dashboard")}>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Dashboard
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

				{/* Chapter/Topic Analysis */}
				<div className="mb-8">
					<TypeAnalysisChart
						title="Performance by Chapter/Topic"
						data={questionTypeData}
						chartType="bar"
						insights={insights}
					/>
				</div>

				{/* Wrong Questions List */}
				<div className="mb-8">
					<WrongQuestionList questions={wrongQuestions} onViewSolution={handleViewSolution} />
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button
						size="lg"
						style={{ backgroundColor: "var(--color-accent)" }}
						className="text-white hover:opacity-90"
						onClick={onRetryExam || (() => onNavigate("dashboard"))}
					>
						<RotateCcw className="w-4 h-4 mr-2" />
						Retake Chapter Test
					</Button>
					<Button variant="outline" size="lg">
						<BookOpen className="w-4 h-4 mr-2" />
						Review Mistakes
					</Button>
					<Button variant="outline" size="lg">
						<Target className="w-4 h-4 mr-2" />
						Go to Recommended Chapter
					</Button>
				</div>
			</div>
		</div>
	);
}
