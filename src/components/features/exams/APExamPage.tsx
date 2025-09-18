"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
	Clock,
	Flag,
	ArrowLeft,
	AlertTriangle,
	Calculator,
	Maximize2,
	Minimize2,
	X,
	ChevronLeft,
	ChevronRight,
	BookOpen,
	Grid3X3,
	FileText,
	Sigma,
	StickyNote,
} from "lucide-react";
import type { ApExam, ApExamQuestion } from "@/types/ap";

// Enhanced Tools Panel Component for AP Exams
function APToolsPanel({
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
			// Load Desmos API if not already loaded
			if (!(window as unknown as { Desmos?: unknown }).Desmos) {
				const script = document.createElement("script");
				script.src = "https://www.desmos.com/api/v1.9/calculator.js";
				script.async = true;
				script.onload = initializeCalculator;
				script.onerror = () => {
					console.error("Failed to load Desmos calculator");
					if (calculatorRef.current) {
						calculatorRef.current.innerHTML = `
              <div class="flex items-center justify-center h-full text-center p-4">
                <div>
                  <div class="text-lg mb-2" style="color: var(--color-text-primary)">Calculator Loading Failed</div>
                  <div class="text-sm" style="color: var(--color-text-secondary)">Please use an external calculator</div>
                </div>
              </div>
            `;
					}
				};
				document.head.appendChild(script);
			} else {
				initializeCalculator();
			}
		}

		function initializeCalculator() {
			const windowWithDesmos = window as unknown as { Desmos?: { GraphingCalculator: (element: HTMLElement, options: unknown) => { setExpressions: (expressions: unknown[]) => void } } };
			if (calculatorRef.current && windowWithDesmos.Desmos) {
				// Clear any existing content
				calculatorRef.current.innerHTML = "";

				try {
					const calculator = windowWithDesmos.Desmos.GraphingCalculator(calculatorRef.current, {
						keypad: true,
						settingsMenu: false,
						expressionsTopbar: true,
						pointsOfInterest: true,
						trace: true,
						border: false,
						lockViewport: false,
						expressionsCollapsed: false,
					});

					// Set a simple welcome expression
					calculator.setExpressions([
						{ id: "help", latex: "\\text{AP Chemistry Calculator}", color: "#0091B3" },
					]);
				} catch (error) {
					console.error("Failed to initialize Desmos calculator:", error);
					if (calculatorRef.current) {
						calculatorRef.current.innerHTML = `
              <div class="flex items-center justify-center h-full text-center p-4">
                <div>
                  <div class="text-lg mb-2" style="color: var(--color-text-primary)">Calculator Error</div>
                  <div class="text-sm" style="color: var(--color-text-secondary)">Please refresh the page</div>
                </div>
              </div>
            `;
					}
				}
			}
		}
	}, [activeTab]);

	if (!isExpanded) {
		return (
			<div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
				<Button
					onClick={onToggleExpanded}
					variant="default"
					size="sm"
					className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
				>
					<Calculator className="h-5 w-5" />
				</Button>
			</div>
		);
	}

	return (
		<div className="fixed right-0 top-0 h-full w-80 bg-card border-l shadow-xl z-50 flex flex-col">
			<div className="flex items-center justify-between p-4 border-b">
				<h3 className="font-semibold text-foreground">AP Exam Tools</h3>
				<Button variant="ghost" size="sm" onClick={onToggleExpanded}>
					<X className="h-4 w-4" />
				</Button>
			</div>

			<div className="flex border-b">
				<button
					onClick={() => setActiveTab("calculator")}
					className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
						activeTab === "calculator"
							? "bg-primary text-primary-foreground"
							: "text-muted-foreground hover:text-foreground hover:bg-muted"
					}`}
				>
					<Calculator className="h-4 w-4 mx-auto mb-1" />
					Calculator
				</button>
				<button
					onClick={() => setActiveTab("formulas")}
					className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
						activeTab === "formulas"
							? "bg-primary text-primary-foreground"
							: "text-muted-foreground hover:text-foreground hover:bg-muted"
					}`}
				>
					<Sigma className="h-4 w-4 mx-auto mb-1" />
					Formulas
				</button>
				<button
					onClick={() => setActiveTab("notes")}
					className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
						activeTab === "notes"
							? "bg-primary text-primary-foreground"
							: "text-muted-foreground hover:text-foreground hover:bg-muted"
					}`}
				>
					<StickyNote className="h-4 w-4 mx-auto mb-1" />
					Notes
				</button>
			</div>

			<div className="flex-1 overflow-hidden">
				{activeTab === "calculator" && (
					<div className="h-full">
						<div ref={calculatorRef} className="w-full h-full" />
					</div>
				)}

				{activeTab === "formulas" && (
					<div className="p-4 h-full overflow-y-auto">
						<h4 className="font-medium mb-3 text-foreground">AP Chemistry Formulas</h4>
						<div className="space-y-4 text-sm">
							<div className="bg-muted p-3 rounded">
								<div className="font-medium text-foreground mb-1">Ideal Gas Law</div>
								<div className="font-mono text-muted-foreground">PV = nRT</div>
							</div>
							<div className="bg-muted p-3 rounded">
								<div className="font-medium text-foreground mb-1">Molarity</div>
								<div className="font-mono text-muted-foreground">M = mol/L</div>
							</div>
							<div className="bg-muted p-3 rounded">
								<div className="font-medium text-foreground mb-1">pH</div>
								<div className="font-mono text-muted-foreground">pH = -log[H⁺]</div>
							</div>
							<div className="bg-muted p-3 rounded">
								<div className="font-medium text-foreground mb-1">Kinetic Energy</div>
								<div className="font-mono text-muted-foreground">KE = ½mv²</div>
							</div>
							<div className="bg-muted p-3 rounded">
								<div className="font-medium text-foreground mb-1">Enthalpy</div>
								<div className="font-mono text-muted-foreground">ΔH = H(products) - H(reactants)</div>
							</div>
						</div>
					</div>
				)}

				{activeTab === "notes" && (
					<div className="p-4 h-full flex flex-col">
						<h4 className="font-medium mb-3 text-foreground">Scratch Notes</h4>
						<Textarea
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder="Write your notes here..."
							className="flex-1 resize-none text-sm"
						/>
					</div>
				)}
			</div>
		</div>
	);
}

interface APExamPageProps {
	examData: ApExam;
	questions: ApExamQuestion[];
	onExamComplete: (result: unknown) => void;
	onGoBack: () => void;
}

export function APExamPage({ examData, questions, onExamComplete, onGoBack }: APExamPageProps) {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [timeLeft, setTimeLeft] = useState(examData.duration * 60); // Convert minutes to seconds
	const [answers, setAnswers] = useState<(string | null)[]>(new Array(questions.length).fill(null));
	const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
	const [showSubmitDialog, setShowSubmitDialog] = useState(false);
	const [showTools, setShowTools] = useState(false);
	const [isToolsExpanded, setIsToolsExpanded] = useState(false);
	const [showQuestionNavigator, setShowQuestionNavigator] = useState(false);
	const [activeToolTab, setActiveToolTab] = useState<"calculator" | "notes" | "formulas">("calculator");
	const [notes, setNotes] = useState("");

	// Timer effect
	useEffect(() => {
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
	}, []);

	// Auto-save answers
	useEffect(() => {
		// TODO: Implement auto-save to backend
		const saveAnswers = () => {
			localStorage.setItem(`ap-exam-${examData.id}-answers`, JSON.stringify(answers));
			localStorage.setItem(`ap-exam-${examData.id}-flagged`, JSON.stringify(Array.from(flaggedQuestions)));
		};
		
		const debounceTimer = setTimeout(saveAnswers, 1000);
		return () => clearTimeout(debounceTimer);
	}, [answers, flaggedQuestions, examData.id]);

	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const handleAnswerSelect = (answerIndex: string) => {
		const newAnswers = [...answers];
		newAnswers[currentQuestion] = answerIndex;
		setAnswers(newAnswers);
	};

	const handleFlagQuestion = () => {
		const newFlagged = new Set(flaggedQuestions);
		if (newFlagged.has(currentQuestion)) {
			newFlagged.delete(currentQuestion);
		} else {
			newFlagged.add(currentQuestion);
		}
		setFlaggedQuestions(newFlagged);
	};

	const handleSubmitExam = () => {
		const result = {
			examId: examData.id,
			answers,
			timeSpent: examData.duration * 60 - timeLeft,
			flaggedQuestions: Array.from(flaggedQuestions),
			notes,
		};
		onExamComplete(result);
	};

	const getAnsweredCount = () => {
		return answers.filter((answer) => answer !== null).length;
	};

	const currentQuestionData = questions[currentQuestion];

	if (showSubmitDialog) {
		const unansweredCount = questions.length - getAnsweredCount();
		
		return (
			<div className="min-h-screen bg-background flex items-center justify-center p-4">
				<Card className="max-w-md w-full">
					<CardContent className="p-6">
						<h2 className="text-xl font-semibold mb-4 text-foreground">Submit AP Exam</h2>
						<div className="space-y-4">
							<div className="text-sm text-muted-foreground">
								<p>You have answered {getAnsweredCount()} out of {questions.length} questions.</p>
								{unansweredCount > 0 && (
									<p className="text-destructive mt-2">
										{unansweredCount} question{unansweredCount > 1 ? "s" : ""} remain unanswered.
									</p>
								)}
							</div>
							<Alert>
								<AlertTriangle className="h-4 w-4" />
								<AlertDescription>
									Once you submit, you cannot return to the exam. Are you sure you want to submit?
								</AlertDescription>
							</Alert>
							<div className="flex gap-3">
								<Button variant="outline" onClick={() => setShowSubmitDialog(false)} className="flex-1">
									Continue Exam
								</Button>
								<Button onClick={handleSubmitExam} className="flex-1">
									Submit Exam
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b bg-card shadow-sm sticky top-0 z-30">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Button variant="ghost" onClick={onGoBack} className="text-muted-foreground hover:text-foreground">
								<ArrowLeft className="w-4 h-4 mr-2" />
								Exit Exam
							</Button>
							<div className="text-sm text-muted-foreground">
								{examData.title}
							</div>
						</div>

						<div className="flex items-center space-x-6">
							<div className="text-sm font-medium text-foreground">
								Question {currentQuestion + 1} of {questions.length}
							</div>
							<div className="text-sm font-medium text-foreground">
								<Clock className="w-4 h-4 inline mr-1" />
								{formatTime(timeLeft)}
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowTools(!showTools)}
								className="hidden md:flex"
							>
								<Calculator className="w-4 h-4 mr-2" />
								Tools
							</Button>
							<Button variant="outline" size="sm" onClick={() => setShowSubmitDialog(true)}>
								Submit Exam
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className={`max-w-6xl mx-auto p-6 transition-all duration-300 ${isToolsExpanded ? "mr-80" : ""}`}>
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Question Content */}
					<div className="lg:col-span-3">
						<Card>
							<CardContent className="p-8">
								{/* Question Header */}
								<div className="flex items-center justify-between mb-6">
									<div className="flex items-center space-x-3">
										<span className="text-sm font-medium text-muted-foreground">
											Question {currentQuestion + 1}
										</span>
										{flaggedQuestions.has(currentQuestion) && (
											<Flag className="w-4 h-4 text-yellow-500" />
										)}
									</div>
									<Button
										variant="outline"
										size="sm"
										onClick={handleFlagQuestion}
										className={flaggedQuestions.has(currentQuestion) ? "bg-yellow-50" : ""}
									>
										<Flag className="w-4 h-4 mr-2" />
										{flaggedQuestions.has(currentQuestion) ? "Unflag" : "Flag"}
									</Button>
								</div>

								{/* Question Text */}
								<div className="mb-8">
									{currentQuestionData.passage && (
										<div className="bg-muted p-6 rounded-lg mb-6">
											<h3 className="font-semibold mb-3 text-foreground">Passage</h3>
											<div className="text-sm text-muted-foreground whitespace-pre-wrap">
												{currentQuestionData.passage}
											</div>
										</div>
									)}
									<div className="text-lg text-foreground leading-relaxed">
										{currentQuestionData.question}
									</div>
								</div>

								{/* Answer Choices */}
								<div className="space-y-3">
									{currentQuestionData.choices.map((choice, index) => (
										<button
											key={choice.id}
											onClick={() => handleAnswerSelect(choice.id)}
											className={`w-full text-left p-4 rounded-lg border transition-colors ${
												answers[currentQuestion] === choice.id
													? "border-primary bg-primary/5 text-foreground"
													: "border-border hover:border-primary/50 hover:bg-muted/50 text-muted-foreground"
											}`}
										>
											<div className="flex items-start space-x-3">
												<span className="font-medium text-sm mt-0.5">
													{String.fromCharCode(65 + index)}.
												</span>
												<span className="flex-1">{choice.text}</span>
											</div>
										</button>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Question Navigator */}
					<div className="lg:col-span-1">
						<Card className="sticky top-24">
							<CardContent className="p-4">
								<h3 className="font-semibold mb-4 text-foreground">Question Navigator</h3>
								<div className="grid grid-cols-5 gap-2 mb-4">
									{questions.map((_, index) => (
										<button
											key={index}
											onClick={() => setCurrentQuestion(index)}
											className={`aspect-square text-xs font-medium rounded transition-colors ${
												index === currentQuestion
													? "bg-primary text-primary-foreground"
													: answers[index] !== null
													? "bg-green-100 text-green-800 hover:bg-green-200"
													: flaggedQuestions.has(index)
													? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
													: "bg-muted text-muted-foreground hover:bg-muted/80"
											}`}
										>
											{index + 1}
										</button>
									))}
								</div>
								<div className="text-xs text-muted-foreground space-y-1">
									<div className="flex items-center">
										<div className="w-3 h-3 bg-green-100 rounded mr-2"></div>
										Answered ({getAnsweredCount()})
									</div>
									<div className="flex items-center">
										<div className="w-3 h-3 bg-yellow-100 rounded mr-2"></div>
										Flagged ({flaggedQuestions.size})
									</div>
									<div className="flex items-center">
										<div className="w-3 h-3 bg-muted rounded mr-2"></div>
										Unanswered ({questions.length - getAnsweredCount()})
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Navigation Footer */}
				<div className="flex justify-between items-center mt-8 pt-6 border-t">
					<Button
						variant="outline"
						onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
						disabled={currentQuestion === 0}
					>
						<ChevronLeft className="w-4 h-4 mr-2" />
						Previous
					</Button>

					<div className="text-sm text-muted-foreground">
						{getAnsweredCount()} of {questions.length} answered
					</div>

					<Button
						variant="outline"
						onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
						disabled={currentQuestion === questions.length - 1}
					>
						Next
						<ChevronRight className="w-4 h-4 ml-2" />
					</Button>
				</div>
			</div>

			{/* Tools Panel */}
			{showTools && (
				<APToolsPanel
					isExpanded={isToolsExpanded}
					onToggleExpanded={setIsToolsExpanded}
					activeTab={activeToolTab}
					setActiveTab={setActiveToolTab}
					notes={notes}
					setNotes={setNotes}
				/>
			)}
		</div>
	);
}
