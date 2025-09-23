"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
	Clock,
	Flag,
	ArrowLeft,
	ArrowRight,
	CheckCircle,
	Circle,
	AlertTriangle,
	RotateCcw,
	Calculator,
	Maximize2,
	Minimize2,
	X,
	Menu,
	ChevronLeft,
	ChevronRight,
	BookOpen,
	Grid3X3,
	FileText,
	Sigma,
	StickyNote,
	Check,
} from "lucide-react";
import type { Subject, ExamQuestion, ExamResult } from "@/types";

// Enhanced Tools Panel Component
function ToolsPanel({
	isExpanded,
	onToggleExpanded,
	activeTab,
	setActiveTab,
	notes,
	setNotes,
}: {
	isExpanded: boolean;
	onToggleExpanded: () => void;
	activeTab: "calculator" | "notes" | "formulas";
	setActiveTab: (tab: "calculator" | "notes" | "formulas") => void;
	notes: string;
	setNotes: (notes: string) => void;
}) {
	const calculatorRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (activeTab === "calculator") {
			// Simple calculator placeholder
			if (calculatorRef.current) {
				calculatorRef.current.innerHTML = `
					<div class="flex items-center justify-center h-full text-center p-4">
						<div>
							<div class="text-lg mb-2" style="color: var(--color-text-primary)">Calculator</div>
							<div class="text-sm" style="color: var(--color-text-secondary)">Basic calculator functionality</div>
						</div>
					</div>
				`;
			}
		}
	}, [activeTab]);

	const commonFormulas = [
		{ name: "이차방정식의 해", formula: "x = (-b ± √(b²-4ac)) / 2a" },
		{ name: "거리공식", formula: "d = √((x₂-x₁)² + (y₂-y₁)²)" },
		{ name: "원의 면적", formula: "A = πr²" },
		{ name: "구의 부피", formula: "V = (4/3)πr³" },
		{ name: "삼각함수 항등식", formula: "sin²θ + cos²θ = 1" },
		{ name: "로그 법칙", formula: "log(xy) = log(x) + log(y)" },
		{ name: "지수 법칙", formula: "aᵐ · aⁿ = aᵐ⁺ⁿ" },
		{ name: "완전제곱식", formula: "(a+b)² = a² + 2ab + b²" },
		{ name: "속력 공식", formula: "v = d/t" },
		{ name: "운동량", formula: "p = mv" },
		{ name: "일", formula: "W = Fd" },
		{ name: "전력", formula: "P = W/t = VI" },
	];

	return (
		<div
			className={`bg-white rounded-xl shadow-lg transition-all duration-300 ${
				isExpanded ? "fixed inset-4 z-50" : "w-[32rem] h-[28rem]"
			}`}
			style={{ border: "2px solid var(--color-primary)" }}
		>
			<div
				className="flex items-center justify-between p-3 border-b rounded-t-xl"
				style={{
					borderBottomColor: "var(--color-primary-light)",
					background: "linear-gradient(to right, var(--color-primary-light), var(--color-primary-light))",
				}}
			>
				<div className="flex items-center space-x-4">
					<div className="flex items-center space-x-1 bg-white rounded-lg p-1 shadow-sm">
						<Button
							variant={activeTab === "calculator" ? "default" : "ghost"}
							size="sm"
							onClick={() => setActiveTab("calculator")}
							className="h-7 px-2 text-xs"
							style={{
								backgroundColor: activeTab === "calculator" ? "var(--color-primary)" : "transparent",
								color: activeTab === "calculator" ? "white" : "var(--color-text-primary)",
							}}
						>
							<Calculator className="w-3 h-3 mr-1" />
							계산기
						</Button>
						<Button
							variant={activeTab === "notes" ? "default" : "ghost"}
							size="sm"
							onClick={() => setActiveTab("notes")}
							className="h-7 px-2 text-xs"
							style={{
								backgroundColor: activeTab === "notes" ? "var(--color-primary)" : "transparent",
								color: activeTab === "notes" ? "white" : "var(--color-text-primary)",
							}}
						>
							<StickyNote className="w-3 h-3 mr-1" />
							노트
						</Button>
						<Button
							variant={activeTab === "formulas" ? "default" : "ghost"}
							size="sm"
							onClick={() => setActiveTab("formulas")}
							className="h-7 px-2 text-xs"
							style={{
								backgroundColor: activeTab === "formulas" ? "var(--color-primary)" : "transparent",
								color: activeTab === "formulas" ? "white" : "var(--color-text-primary)",
							}}
						>
							<Sigma className="w-3 h-3 mr-1" />
							공식
						</Button>
					</div>
				</div>
				<Button
					variant="ghost"
					size="sm"
					onClick={onToggleExpanded}
					className="h-7 w-7 p-0"
					style={{
						":hover": { backgroundColor: "var(--color-primary-light)" },
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.backgroundColor = "var(--color-primary-light)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.backgroundColor = "transparent";
					}}
				>
					{isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
				</Button>
			</div>

			<div className={`${isExpanded ? "h-[calc(100%-60px)]" : "h-[calc(28rem-60px)]"}`}>
				{activeTab === "calculator" && <div ref={calculatorRef} className="w-full h-full" />}

				{activeTab === "notes" && (
					<div className="p-4 h-full">
						<Textarea
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder="시험 중 메모나 계산 과정을 적어보세요..."
							className="w-full h-full resize-none"
							style={{
								borderColor: "var(--color-border)",
								backgroundColor: "var(--color-primary-light)",
								":focus": { borderColor: "var(--color-primary)" },
							}}
							onFocus={(e) => {
								e.currentTarget.style.borderColor = "var(--color-primary)";
							}}
							onBlur={(e) => {
								e.currentTarget.style.borderColor = "var(--color-border)";
							}}
						/>
					</div>
				)}

				{activeTab === "formulas" && (
					<div className="p-4 h-full overflow-y-auto">
						<div className="space-y-3">
							{commonFormulas.map((formula, index) => (
								<div
									key={index}
									className="p-3 rounded-lg"
									style={{
										backgroundColor: "var(--color-primary-light)",
										border: "1px solid var(--color-primary)",
									}}
								>
									<div className="font-medium text-sm mb-1" style={{ color: "var(--color-text-primary)" }}>
										{formula.name}
									</div>
									<div
										className="text-sm font-mono bg-white p-2 rounded border"
										style={{
											color: "var(--color-text-secondary)",
											borderColor: "var(--color-border)",
										}}
									>
										{formula.formula}
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

interface MockExamPageProps {
	subject: Subject | null;
	onExamComplete: (result: ExamResult) => void;
	onNavigate: (page: "dashboard" | "subject") => void;
	onNavigateToSection?: (section: string) => void;
	startImmediately?: boolean; // 바로 시험 시작 여부
}

export function MockExamPage({
	subject,
	onExamComplete,
	onNavigate,
	onNavigateToSection,
	startImmediately = false,
}: MockExamPageProps) {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [timeLeft, setTimeLeft] = useState(180 * 60); // 3 hours in seconds
	const [answers, setAnswers] = useState<(number | null)[]>([]);
	const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
	const [showSubmitDialog, setShowSubmitDialog] = useState(false);
	const [examStarted, setExamStarted] = useState(startImmediately);
	const [showTools, setShowTools] = useState(false);
	const [isToolsExpanded, setIsToolsExpanded] = useState(false);
	const [showQuestionNavigator, setShowQuestionNavigator] = useState(false);
	const [activeToolTab, setActiveToolTab] = useState<"calculator" | "notes" | "formulas">("calculator");
	const [notes, setNotes] = useState("");

	// Mock exam questions with passage-based format
	const questions: ExamQuestion[] = [
		{
			id: "1",
			question:
				"The following text is adapted from William Shakespeare's 1609 poem 'Sonnet 27.' The poem is addressed to a close friend, as if he were physically present.\n\nWeary with toil, I [hurry] to my bed,\nThe dear repose for limbs with travel tired;\nBut then begins a journey in my head\nTo work my mind, when body's work's expired:\nFor then my thoughts—from far where I abide—\n[Begin] a zealous pilgrimage to thee,\nAnd keep my drooping eyelids open wide,\nLooking on darkness which the blind do see:\nSave that my soul's imaginary sight\nPresents thy shadow to my sightless view,\nWhich, like a jewel hung in ghastly night,\nMakes black night beauteous and her old face new.\nLo, thus, by day my limbs, by night my mind,\nFor thee and for myself no quiet find.\n\nWhat is the main idea of the text?",
			options: [
				"The speaker is asleep and dreaming about traveling to see the friend.",
				"The speaker is planning an upcoming trip to the friend's house.",
				"The speaker is too fatigued to continue a discussion with the friend.",
				"The speaker is thinking about the friend instead of immediately falling asleep.",
			],
			correctAnswer: 3,
			explanation:
				"The poem describes how the speaker, though physically tired, mentally 'journeys' to think about their friend, keeping their 'eyelids open wide' instead of falling asleep immediately.",
			subject: subject?.id || "",
			chapter: "Reading and Writing",
		},
		{
			id: "2",
			question:
				"In a chemical reaction, the rate of reaction is directly proportional to the concentration of reactant A and the square of the concentration of reactant B.\n\nGiven information:\n• [A] = 0.1 M\n• [B] = 0.2 M  \n• Rate constant k = 5.0 L²/(mol²·s)\n\nThe rate law for this reaction is: Rate = k[A][B]²\n\nWhat is the initial rate of reaction?",
			options: ["0.02 M/s", "0.04 M/s", "0.2 M/s", "0.4 M/s"],
			correctAnswer: 0,
			explanation: "Using Rate = k[A][B]² = 5.0 × 0.1 × (0.2)² = 5.0 × 0.1 × 0.04 = 0.02 M/s",
			subject: subject?.id || "",
			chapter: "Chemical Kinetics",
		},
		{
			id: "3",
			question:
				"A quadratic function f(x) = ax² + bx + c has its vertex at (2, -3) and passes through the point (0, 1).\n\nUsing the vertex form of a quadratic function:\nf(x) = a(x - h)² + k\n\nwhere (h, k) is the vertex of the parabola.\n\nWhat is the value of coefficient a?",
			options: ["a = 1", "a = 2", "a = -1", "a = 4"],
			correctAnswer: 0,
			explanation:
				"Using vertex form f(x) = a(x-h)² + k where vertex is (h,k) = (2,-3): f(x) = a(x-2)² - 3. Since f(0) = 1: 1 = a(0-2)² - 3 = 4a - 3, so 4a = 4, therefore a = 1.",
			subject: subject?.id || "",
			chapter: "Algebra",
		},
	];

	// Initialize answers array
	useEffect(() => {
		if (questions.length > 0 && answers.length === 0) {
			setAnswers(new Array(questions.length).fill(null));
		}
	}, [questions.length, answers.length]);

	// Timer countdown
	useEffect(() => {
		if (!examStarted || timeLeft <= 0) return;

		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					handleSubmitExam();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [examStarted, timeLeft]);

	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return `${hours}:${minutes.toString().padStart(2, "0")}`;
	};

	const handleAnswerSelect = (answerIndex: number) => {
		const newAnswers = [...answers];
		newAnswers[currentQuestion] = answerIndex;
		setAnswers(newAnswers);
	};

	const handleQuestionJump = (questionIndex: number) => {
		setCurrentQuestion(questionIndex);
		setShowQuestionNavigator(false);
	};

	const handleFlagQuestion = () => {
		const newFlagged = new Set(flaggedQuestions);
		if (flaggedQuestions.has(currentQuestion)) {
			newFlagged.delete(currentQuestion);
		} else {
			newFlagged.add(currentQuestion);
		}
		setFlaggedQuestions(newFlagged);
	};

	const handleSubmitExam = () => {
		let correctAnswers = 0;
		const mistakes: ExamResult["mistakes"] = [];

		questions.forEach((question, index) => {
			if (answers[index] === question.correctAnswer) {
				correctAnswers++;
			} else {
				mistakes.push({
					questionId: question.id,
					userAnswer: answers[index] ?? -1,
					correctAnswer: question.correctAnswer,
				});
			}
		});

		const score =
			subject?.type === "AP"
				? Math.max(1, Math.min(5, Math.round((correctAnswers / questions.length) * 5)))
				: Math.round((correctAnswers / questions.length) * 800);

		const result: ExamResult = {
			id: Date.now().toString(),
			subjectId: subject?.id || "",
			totalQuestions: questions.length,
			correctAnswers,
			score,
			timeSpent: 180 * 60 - timeLeft,
			completedAt: new Date(),
			mistakes,
		};

		onExamComplete(result);
	};

	const getAnsweredCount = () => answers.filter((answer) => answer !== null).length;

	if (!examStarted) {
		return (
			<div className="min-h-screen bg-background">
				<header className="bg-card border-b border-primary/20 px-6 py-4 shadow-sm">
					<div className="max-w-7xl mx-auto flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Button
								variant="ghost"
								onClick={() => {
									if (subject?.type === "AP" && onNavigateToSection) {
										// Extract subject name from ID for specific course navigation
										const subjectName = subject.id.replace("ap-", ""); // "ap-chemistry" -> "chemistry"
										onNavigateToSection(subjectName);
									} else if (subject?.type === "SAT" && onNavigateToSection) {
										onNavigateToSection("sat");
									} else {
										onNavigate("dashboard");
									}
								}}
								className="text-foreground hover:text-white hover:bg-primary transition-colors duration-200"
							>
								<ArrowLeft className="w-4 h-4 mr-2" />
								{subject?.type === "AP"
									? "Back to AP Courses"
									: subject?.type === "SAT"
									? "Back to SAT Exams"
									: "Back to Dashboard"}
							</Button>
						</div>
					</div>
				</header>

				<div className="max-w-4xl mx-auto p-6">
					<Card className="text-center border-primary/20 shadow-xl bg-card">
						<CardContent className="p-12">
							<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-2 ring-primary/20">
								<BookOpen className="w-8 h-8 text-primary" />
							</div>
							<h1 className="text-2xl font-semibold text-foreground mb-4">{subject?.name} Mock Exam</h1>
							<p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
								This is a full-length practice exam designed to simulate the real {subject?.type} exam experience.
								You&apos;ll have 3 hours to complete {questions.length} questions in a BlueBook-style interface with access
								to tools and formulas.
							</p>

							<div className="grid md:grid-cols-3 gap-6 mb-8">
								<div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10">
									<div className="text-2xl font-semibold text-primary">{questions.length}</div>
									<p className="text-muted-foreground">Questions</p>
								</div>
								<div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10">
									<div className="text-2xl font-semibold text-primary">3:00:00</div>
									<p className="text-muted-foreground">Time Limit</p>
								</div>
								<div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10">
									<div className="text-2xl font-semibold text-primary">
										{subject?.type === "AP" ? "1-5" : "400-800"}
									</div>
									<p className="text-muted-foreground">Score Range</p>
								</div>
							</div>

							<Alert className="mb-8 bg-primary/5 border-primary/20 shadow-sm">
								<Calculator className="h-4 w-4 text-primary" />
								<AlertDescription className="text-foreground">
									<strong className="text-primary">Tools Available:</strong> You&apos;ll have access to a calculator, notepad
									for scratch work, common formulas, and can flag questions for review. Navigate freely between
									questions during the exam.
								</AlertDescription>
							</Alert>

							<Button
								size="lg"
								onClick={() => setExamStarted(true)}
								className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md px-8 py-3 text-lg font-semibold"
							>
								Start Exam
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (showSubmitDialog) {
		const unansweredCount = questions.length - getAnsweredCount();

		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<Card className="w-full max-w-md" style={{ borderColor: "var(--color-primary)" }}>
					<CardContent className="p-8 text-center">
						<AlertTriangle className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--color-warning)" }} />
						<h2 className="text-xl font-semibold mb-4" style={{ color: "var(--color-text-primary)" }}>
							Submit Exam?
						</h2>
						<p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
							You have answered {getAnsweredCount()} out of {questions.length} questions.
						</p>
						{unansweredCount > 0 && (
							<p className="mb-6" style={{ color: "var(--color-warning)" }}>
								{unansweredCount} question{unansweredCount > 1 ? "s" : ""} remain unanswered.
							</p>
						)}
						<div className="flex space-x-3">
							<Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
								Continue Exam
							</Button>
							<Button
								onClick={handleSubmitExam}
								className="text-white transition-all duration-200"
								style={{ backgroundColor: "var(--color-primary)" }}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = "var(--color-primary-hover)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = "var(--color-primary)";
								}}
							>
								Submit Exam
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const currentQuestionData = questions[currentQuestion];
	const questionParts = currentQuestionData.question.split("\n\n");
	const questionText = questionParts[0];
	const passageText = questionParts.slice(1).join("\n\n");

	return (
		<div className="min-h-screen flex flex-col bg-background">
			{/* BlueBook Style Header */}
			<header className="bg-white px-6 py-3 flex-shrink-0" style={{ borderBottom: "2px solid var(--color-primary)" }}>
				<div className="max-w-full flex items-center justify-between">
					{/* Left section */}
					<div className="flex items-center space-x-6">
						<div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
							Section 1, Module 1: {currentQuestionData.chapter}
						</div>
					</div>

					{/* Center - Timer */}
					<div
						className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2 px-4 py-2 rounded-lg"
						style={{
							backgroundColor: "var(--color-primary-light)",
							border: "1px solid var(--color-primary)",
						}}
					>
						<Clock className="w-4 h-4" style={{ color: "var(--color-text-secondary)" }} />
						<span className="font-mono text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
							{formatTime(timeLeft)}
						</span>
					</div>

					{/* Right section */}
					<div className="flex items-center space-x-4">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setShowTools(!showTools)}
							style={{ color: "var(--color-text-secondary)" }}
							onMouseEnter={(e) => {
								e.currentTarget.style.color = "var(--color-text-primary)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.color = "var(--color-text-secondary)";
							}}
						>
							<Calculator className="w-4 h-4 mr-1" />
							Tools
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowSubmitDialog(true)}
							style={{ borderColor: "var(--color-primary)", color: "var(--color-text-primary)" }}
						>
							Submit
						</Button>
					</div>
				</div>
			</header>

			{/* Main Content Area */}
			<div className="flex-1 flex relative">
				{/* Question Navigator Overlay */}
				{showQuestionNavigator && (
					<div className="absolute inset-0 backdrop-blur-md bg-white/10 z-20 flex items-center justify-center">
						<div
							className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
							style={{ border: "2px solid var(--color-primary)" }}
						>
							<div className="flex items-center justify-between mb-6">
								<h3 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
									Question Navigator
								</h3>
								<Button variant="ghost" size="sm" onClick={() => setShowQuestionNavigator(false)}>
									<X className="w-4 h-4" />
								</Button>
							</div>

							<div className="grid grid-cols-6 gap-3 mb-6">
								{questions.map((_, index) => {
									const isAnswered = answers[index] !== null;
									const isFlagged = flaggedQuestions.has(index);
									const isCurrent = index === currentQuestion;

									return (
										<Button
											key={index}
											variant={isCurrent ? "default" : "outline"}
											size="sm"
											className={`h-12 relative ${isCurrent ? "text-white" : ""}`}
											style={{
												backgroundColor: isCurrent
													? "var(--color-primary)"
													: isAnswered
													? "var(--primary-light)"
													: "transparent",
												borderColor: isCurrent ? "var(--color-primary)" : "var(--color-primary)",
												color: isCurrent ? "white" : isAnswered ? "var(--color-primary)" : "var(--color-text-primary)",
											}}
											onMouseEnter={(e) => {
												if (!isCurrent && !isAnswered) {
													e.currentTarget.style.backgroundColor = "var(--primary-light)";
												}
											}}
											onMouseLeave={(e) => {
												if (!isCurrent && !isAnswered) {
													e.currentTarget.style.backgroundColor = "transparent";
												}
											}}
											onClick={() => handleQuestionJump(index)}
										>
											{index + 1}
											{isFlagged && <Flag className="w-3 h-3 absolute -top-1 -right-1 text-red-500 fill-current" />}
										</Button>
									);
								})}
							</div>

							<div
								className="flex items-center justify-between text-sm"
								style={{ color: "var(--color-text-secondary)" }}
							>
								<div className="flex items-center space-x-4">
									<div className="flex items-center space-x-2">
										<div
											className="w-3 h-3 rounded"
											style={{
												backgroundColor: "var(--color-primary-light)",
												border: "1px solid var(--color-primary)",
											}}
										></div>
										<span>Answered</span>
									</div>
									<div className="flex items-center space-x-2">
										<Flag className="w-3 h-3" style={{ color: "var(--color-destructive)" }} />
										<span>Flagged</span>
									</div>
								</div>
								<span>
									{getAnsweredCount()}/{questions.length} answered
								</span>
							</div>
						</div>
					</div>
				)}

				{/* Tools Overlay */}
				{showTools && (
					<div className="absolute top-4 right-4 z-30">
						<ToolsPanel
							isExpanded={isToolsExpanded}
							onToggleExpanded={() => setIsToolsExpanded(!isToolsExpanded)}
							activeTab={activeToolTab}
							setActiveTab={setActiveToolTab}
							notes={notes}
							setNotes={setNotes}
						/>
					</div>
				)}

				{/* Question Content - Split Layout */}
				<div className="flex-1 flex">
					{/* Left Panel - Passage/Context */}
					<div
						className="w-1/2 bg-white overflow-hidden flex flex-col"
						style={{ borderRight: "2px solid var(--color-primary)" }}
					>
						<div
							className="px-6 py-3"
							style={{
								backgroundColor: "var(--color-primary-light)",
								borderBottom: "1px solid var(--color-primary)",
							}}
						>
							<h3 className="font-medium flex items-center" style={{ color: "var(--color-text-primary)" }}>
								<FileText className="w-4 h-4 mr-2" />
								지문 및 자료
							</h3>
						</div>
						<div className="flex-1 p-6 overflow-y-auto">
							<div className="prose prose-gray max-w-none">
								{passageText ? (
									<div className="space-y-4">
										<div
											className="p-4 rounded-lg"
											style={{
												backgroundColor: "var(--color-primary-light)",
												borderLeft: "4px solid var(--color-primary)",
											}}
										>
											<div
												className="whitespace-pre-wrap text-base leading-relaxed"
												style={{ color: "var(--color-text-primary)" }}
											>
												{passageText}
											</div>
										</div>
									</div>
								) : (
									<div className="text-center py-12" style={{ color: "var(--color-text-secondary)" }}>
										<FileText
											className="w-12 h-12 mx-auto mb-4 opacity-50"
											style={{ color: "var(--color-text-tertiary)" }}
										/>
										<p>이 문제에는 별도의 지문이 없습니다.</p>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Right Panel - Question and Answer Choices */}
					<div className="w-1/2 bg-white flex flex-col">
						{/* Question Header */}
						<div
							className="border-b px-6 py-4"
							style={{ backgroundColor: "var(--color-primary-light)", borderColor: "var(--color-primary)" }}
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-4">
									<h3 className="font-medium" style={{ color: "var(--color-text-primary)" }}>
										Question {currentQuestion + 1} of {questions.length}
									</h3>
									<Button
										variant="ghost"
										size="sm"
										onClick={handleFlagQuestion}
										className="transition-all duration-200 hover:bg-white/50"
										style={{
											color: flaggedQuestions.has(currentQuestion)
												? "var(--color-primary)"
												: "var(--color-text-secondary)",
											backgroundColor: flaggedQuestions.has(currentQuestion) ? "rgba(0, 145, 179, 0.1)" : "transparent",
										}}
									>
										<Flag
											className="w-4 h-4 mr-1"
											style={{
												fill: flaggedQuestions.has(currentQuestion) ? "var(--color-primary)" : "none",
											}}
										/>
										Mark for Review
									</Button>
								</div>
							</div>
						</div>

						{/* Question Text */}
						<div
							className="p-6 border-b"
							style={{ borderColor: "var(--color-primary)", backgroundColor: "var(--color-primary-light)" }}
						>
							<div className="prose max-w-none">
								<div
									className="whitespace-pre-wrap text-base leading-relaxed"
									style={{ color: "var(--color-text-primary)" }}
								>
									{questionText}
								</div>
							</div>
						</div>

						{/* Answer Options */}
						<div className="flex-1 p-6 overflow-y-auto">
							<div className="space-y-3">
								{currentQuestionData.options.map((option, index) => (
									<div
										key={index}
										className={`p-4 rounded-lg border cursor-pointer transition-all ${
											answers[currentQuestion] === index
												? "border-primary ring-2 ring-primary/20"
												: "border-border hover:border-primary/30"
										}`}
										style={{
											backgroundColor: answers[currentQuestion] === index ? "var(--primary-light)" : "transparent",
										}}
										onClick={() => handleAnswerSelect(index)}
									>
										<div className="flex items-start space-x-3">
											<div className="mt-0.5">
												{answers[currentQuestion] === index ? (
													<div
														className="w-5 h-5 rounded-full flex items-center justify-center"
														style={{ backgroundColor: "var(--primary)" }}
													>
														<div className="w-2 h-2 bg-white rounded-full"></div>
													</div>
												) : (
													<div
														className="w-5 h-5 border-2 rounded-full"
														style={{ borderColor: "var(--primary)" }}
													></div>
												)}
											</div>
											<div className="flex-1">
												<span className="font-medium mr-3 text-lg" style={{ color: "var(--text-secondary)" }}>
													{String.fromCharCode(65 + index)}
												</span>
												<span className="text-base" style={{ color: "var(--text-primary)" }}>
													{option}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* BlueBook Style Footer */}
			<div className="bg-white px-6 py-4 flex-shrink-0" style={{ borderTop: "2px solid var(--color-primary)" }}>
				<div className="flex items-center justify-between">
					{/* Left - Student Name */}
					<div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
						Test Student
					</div>

					{/* Center - Navigation */}
					<div className="flex items-center justify-center space-x-4">
						<Button
							variant="outline"
							onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
							disabled={currentQuestion === 0}
							className="flex items-center space-x-2 transition-all duration-200"
							style={{
								borderColor: "var(--color-primary)",
								color: currentQuestion === 0 ? "var(--color-text-tertiary)" : "var(--color-primary)",
							}}
						>
							<ChevronLeft className="w-4 h-4" />
							<span>Previous</span>
						</Button>

						<Button
							variant="default"
							size="sm"
							className="px-6 py-3 rounded-lg text-white cursor-pointer transition-all duration-200 hover:scale-105"
							style={{
								backgroundColor: "var(--color-primary)",
								boxShadow: "0 4px 12px rgba(0, 145, 179, 0.3)",
							}}
							onClick={() => setShowQuestionNavigator(true)}
						>
							<Grid3X3 className="w-4 h-4 mr-2" />
							Question {currentQuestion + 1} / {questions.length}
						</Button>

						<Button
							onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
							disabled={currentQuestion === questions.length - 1}
							className="flex items-center space-x-2 text-white transition-all duration-200"
							style={{
								backgroundColor:
									currentQuestion === questions.length - 1 ? "var(--color-text-tertiary)" : "var(--color-primary)",
								cursor: currentQuestion === questions.length - 1 ? "not-allowed" : "pointer",
							}}
							onMouseEnter={(e) => {
								if (currentQuestion !== questions.length - 1) {
									e.currentTarget.style.backgroundColor = "var(--color-primary-hover)";
								}
							}}
							onMouseLeave={(e) => {
								if (currentQuestion !== questions.length - 1) {
									e.currentTarget.style.backgroundColor = "var(--color-primary)";
								}
							}}
						>
							<span>Next</span>
							<ChevronRight className="w-4 h-4" />
						</Button>
					</div>

					{/* Right - Progress */}
					<div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
						{Math.round(((currentQuestion + 1) / questions.length) * 100)}%
					</div>
				</div>

				{/* Progress Bar */}
				<div className="mt-4">
					<div className="w-full rounded-full h-2" style={{ backgroundColor: "var(--color-primary-light)" }}>
						<div
							className="h-2 rounded-full transition-all duration-300"
							style={{
								width: `${((currentQuestion + 1) / questions.length) * 100}%`,
								backgroundColor: "var(--color-primary)",
							}}
						></div>
					</div>
				</div>
			</div>
		</div>
	);
}
