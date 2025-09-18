"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, RotateCcw, Target, Edit3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScoreSummaryCard } from "./components/ScoreSummaryCard";
import { SectionScoreCard } from "./components/SectionScoreCard";
import { TypeAnalysisChart } from "./components/TypeAnalysisChart";
import { WrongQuestionList } from "./components/WrongQuestionList";
import { ConversionReferenceCard } from "./components/ConversionReferenceCard";
import type { ExamResult, Subject, PageType } from "@/types";

interface SATResultsPageProps {
	result: ExamResult | null;
	subject: Subject | null;
	onNavigate: (page: PageType) => void;
	onRetryExam: () => void;
}

type SATSection = "reading" | "writing" | "math";

export function SATResultsPage({ result, subject, onNavigate, onRetryExam }: SATResultsPageProps) {
	const [activeSection, setActiveSection] = useState<SATSection>("reading");

	if (!result || !subject) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-xl font-medium text-gray-900 mb-4">No Results Found</h2>
					<Button onClick={() => onNavigate("dashboard")}>Return to Dashboard</Button>
				</div>
			</div>
		);
	}

	// Mock SAT-specific data - in a real app, this would come from the exam result
	const totalScore = Math.round((result.correctAnswers / result.totalQuestions) * 1600);
	const mathScore = Math.round(totalScore * 0.5); // Assuming 50/50 split
	const readingWritingScore = totalScore - mathScore;

	// Mock section breakdown
	const mathCorrect = Math.round(result.correctAnswers * 0.5);
	const mathTotal = Math.round(result.totalQuestions * 0.5);
	const rwCorrect = result.correctAnswers - mathCorrect;
	const rwTotal = result.totalQuestions - mathTotal;

	// Mock section-specific data
	const readingData = [
		{
			name: "Information & Ideas",
			correct: Math.round(rwCorrect * 0.25),
			total: Math.round(rwTotal * 0.25),
			percentage: 0,
		},
		{
			name: "Craft & Structure",
			correct: Math.round(rwCorrect * 0.25),
			total: Math.round(rwTotal * 0.25),
			percentage: 0,
		},
	].map((item) => ({
		...item,
		percentage: item.total > 0 ? (item.correct / item.total) * 100 : 0,
	}));

	const writingData = [
		{
			name: "Standard English Conventions",
			correct: Math.round(rwCorrect * 0.25),
			total: Math.round(rwTotal * 0.25),
			percentage: 0,
		},
		{
			name: "Expression of Ideas",
			correct: Math.round(rwCorrect * 0.25),
			total: Math.round(rwTotal * 0.25),
			percentage: 0,
		},
	].map((item) => ({
		...item,
		percentage: item.total > 0 ? (item.correct / item.total) * 100 : 0,
	}));

	const mathData = [
		{
			name: "Algebra",
			correct: Math.round(mathCorrect * 0.35),
			total: Math.round(mathTotal * 0.35),
			percentage: 0,
		},
		{
			name: "Advanced Math",
			correct: Math.round(mathCorrect * 0.35),
			total: Math.round(mathTotal * 0.35),
			percentage: 0,
		},
		{
			name: "Problem Solving",
			correct: Math.round(mathCorrect * 0.15),
			total: Math.round(mathTotal * 0.15),
			percentage: 0,
		},
		{
			name: "Geometry",
			correct: Math.round(mathCorrect * 0.15),
			total: Math.round(mathTotal * 0.15),
			percentage: 0,
		},
	].map((item) => ({
		...item,
		percentage: item.total > 0 ? (item.correct / item.total) * 100 : 0,
	}));

	// Get current section data
	const getCurrentSectionData = () => {
		switch (activeSection) {
			case "reading":
				return readingData;
			case "writing":
				return writingData;
			case "math":
				return mathData;
			default:
				return readingData;
		}
	};

	// Get section-specific wrong questions
	const getSectionWrongQuestions = () => {
		const currentData = getCurrentSectionData();
		return result.mistakes.slice(0, Math.ceil(result.mistakes.length / 3)).map((mistake, index) => ({
			id: mistake.questionId,
			questionNumber: index + 1,
			topic: currentData[index % currentData.length].name,
			questionType: "MCQ" as "MCQ" | "FRQ",
			userAnswer: `Option ${mistake.userAnswer + 1}`,
			correctAnswer: `Option ${mistake.correctAnswer + 1}`,
			reasoning: "Misunderstanding of core concept",
			difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)] as "Easy" | "Medium" | "Hard",
		}));
	};

	const getCurrentInsights = () => {
		const currentData = getCurrentSectionData();
		return {
			strengths: currentData.filter((item) => item.percentage >= 70).map((item) => item.name),
			needsWork: currentData.filter((item) => item.percentage < 70).map((item) => item.name),
		};
	};

	const getSectionScore = () => {
		switch (activeSection) {
			case "reading":
				return Math.round(readingWritingScore * 0.5);
			case "writing":
				return Math.round(readingWritingScore * 0.5);
			case "math":
				return mathScore;
			default:
				return 0;
		}
	};

	const getSectionIcon = () => {
		switch (activeSection) {
			case "reading":
				return <BookOpen className="w-4 h-4" />;
			case "writing":
				return <Edit3 className="w-4 h-4" />;
			case "math":
				return <Target className="w-4 h-4" />;
			default:
				return <BookOpen className="w-4 h-4" />;
		}
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
							<h1 className="text-xl font-medium text-gray-900">{subject.name} Results</h1>
							<p className="text-sm text-gray-500">Completed on {result.completedAt.toLocaleDateString()}</p>
						</div>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-6 py-8">
				{/* Score Summary Strip */}
				<div className="mb-8">
					<ScoreSummaryCard
						examType="SAT"
						totalScore={totalScore}
						maxScore={1600}
						totalQuestions={result.totalQuestions}
						timeSpent={result.timeSpent}
						completedAt={result.completedAt}
						percentile={Math.round(75 + (totalScore - 1000) / 20)} // Mock percentile
					/>
				</div>

				{/* Section Tabs */}
				<div className="mb-8">
					<Tabs value={activeSection} onValueChange={(value) => setActiveSection(value as SATSection)}>
						<TabsList className="grid w-full grid-cols-3 mb-6">
							<TabsTrigger value="reading" className="flex items-center space-x-2">
								<BookOpen className="w-4 h-4" />
								<span>Reading</span>
							</TabsTrigger>
							<TabsTrigger value="writing" className="flex items-center space-x-2">
								<Edit3 className="w-4 h-4" />
								<span>Writing</span>
							</TabsTrigger>
							<TabsTrigger value="math" className="flex items-center space-x-2">
								<Target className="w-4 h-4" />
								<span>Math</span>
							</TabsTrigger>
						</TabsList>

						<TabsContent value={activeSection}>
							{/* Individual Section Score */}
							<div className="mb-8">
								<SectionScoreCard
									title={activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
									score={getSectionScore()}
									maxScore={activeSection === "math" ? 800 : 400}
									correctAnswers={activeSection === "math" ? mathCorrect : Math.round(rwCorrect * 0.5)}
									totalQuestions={activeSection === "math" ? mathTotal : Math.round(rwTotal * 0.5)}
									timeSpent={Math.round(result.timeSpent * (activeSection === "math" ? 0.4 : 0.3))}
									icon={getSectionIcon()}
								/>
							</div>

							{/* Section-specific Conversion Reference */}
							<div className="mb-8">
								<ConversionReferenceCard
									section={(activeSection.charAt(0).toUpperCase() + activeSection.slice(1)) as any}
								/>
							</div>

							{/* Section-specific Question Type Analysis */}
							<div className="mb-8">
								<TypeAnalysisChart
									title={`${
										activeSection.charAt(0).toUpperCase() + activeSection.slice(1)
									} Performance by Question Type`}
									data={getCurrentSectionData()}
									chartType="bar"
									insights={getCurrentInsights()}
								/>
							</div>

							{/* Section-specific Wrong Questions List */}
							<div className="mb-8">
								<WrongQuestionList questions={getSectionWrongQuestions()} onViewSolution={handleViewSolution} />
							</div>
						</TabsContent>
					</Tabs>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button
						size="lg"
						style={{ backgroundColor: "var(--color-accent)" }}
						className="text-white hover:opacity-90"
						onClick={onRetryExam}
					>
						<RotateCcw className="w-4 h-4 mr-2" />
						Retake Test
					</Button>
					<Button variant="outline" size="lg">
						<BookOpen className="w-4 h-4 mr-2" />
						Review Mistakes
					</Button>
					<Button variant="outline" size="lg">
						<Target className="w-4 h-4 mr-2" />
						Go to Recommended Practice
					</Button>
				</div>
			</div>
		</div>
	);
}
