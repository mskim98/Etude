"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { APCalculator } from "./APCalculator";
import { DesmosCalculator } from "./DesmosCalculator";
import {
	Clock,
	Flag,
	AlertTriangle,
	Calculator,
	X,
	ChevronLeft,
	ChevronRight,
	Grid3X3,
	FileText,
	Sigma,
	StickyNote,
	TrendingUp,
} from "lucide-react";
import type { ApExam, ApExamQuestion } from "@/types/ap";

// Simple tool modals for header buttons
function ToolModal({
	isOpen,
	onClose,
	type,
	notes,
	setNotes,
}: {
	isOpen: boolean;
	onClose: () => void;
	type: "calculator" | "formulas" | "notes" | "graphing";
	notes: string;
	setNotes: (notes: string) => void;
}) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
			<div
				className={`bg-white rounded-lg shadow-xl w-full max-h-[80vh] overflow-y-auto ${
					type === "graphing" ? "max-w-2xl" : "max-w-md"
				}`}
			>
				<div className="flex items-center justify-between p-4 border-b">
					<h3 className="font-semibold">
						{type === "calculator" && "계산기"}
						{type === "formulas" && "공식 참조"}
						{type === "notes" && "메모장"}
						{type === "graphing" && "그래프 계산기"}
					</h3>
					<Button variant="ghost" size="sm" onClick={onClose}>
						<X className="h-4 w-4" />
					</Button>
				</div>

				<div className="p-4">
					{type === "calculator" && <DesmosCalculator onClose={onClose} />}

					{type === "formulas" && (
						<div className="space-y-4 text-sm">
							<div className="bg-gray-50 p-3 rounded">
								<div className="font-medium mb-1">Ideal Gas Law</div>
								<div className="font-mono text-gray-600">PV = nRT</div>
							</div>
							<div className="bg-gray-50 p-3 rounded">
								<div className="font-medium mb-1">Molarity</div>
								<div className="font-mono text-gray-600">M = mol/L</div>
							</div>
							<div className="bg-gray-50 p-3 rounded">
								<div className="font-medium mb-1">pH</div>
								<div className="font-mono text-gray-600">pH = -log[H⁺]</div>
							</div>
							<div className="bg-gray-50 p-3 rounded">
								<div className="font-medium mb-1">Kinetic Energy</div>
								<div className="font-mono text-gray-600">KE = ½mv²</div>
							</div>
							<div className="bg-gray-50 p-3 rounded">
								<div className="font-medium mb-1">Enthalpy</div>
								<div className="font-mono text-gray-600">ΔH = H(products) - H(reactants)</div>
							</div>
							<div className="bg-gray-50 p-3 rounded">
								<div className="font-medium mb-1">Molality</div>
								<div className="font-mono text-gray-600">m = mol solute / kg solvent</div>
							</div>
							<div className="bg-gray-50 p-3 rounded">
								<div className="font-medium mb-1">Beer's Law</div>
								<div className="font-mono text-gray-600">A = εbc</div>
							</div>
						</div>
					)}

					{type === "notes" && (
						<div>
							<Textarea
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder="시험 중 메모를 작성하세요..."
								className="w-full h-64 resize-none"
							/>
							<p className="text-xs text-gray-500 mt-2">메모는 자동으로 저장됩니다.</p>
						</div>
					)}

					{type === "graphing" && <APCalculator onClose={onClose} />}
				</div>
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
	const [showQuestionNavigator, setShowQuestionNavigator] = useState(false);
	const [activeToolModal, setActiveToolModal] = useState<"calculator" | "notes" | "formulas" | "graphing" | null>(null);
	const [notes, setNotes] = useState("");
	const [highlights, setHighlights] = useState<Map<number, string[]>>(new Map()); // questionIndex -> highlighted text array

	// Define handleSubmitExam before useEffect
	const handleSubmitExam = useCallback(() => {
		const result = {
			examId: examData.id,
			answers,
			timeSpent: examData.duration * 60 - timeLeft,
			flaggedQuestions: Array.from(flaggedQuestions),
			highlights: Array.from(highlights.entries()),
			notes,
		};
		onExamComplete(result);
	}, [examData.id, answers, timeLeft, flaggedQuestions, highlights, notes, onExamComplete, examData.duration]);

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
	}, [handleSubmitExam]);

	// Auto-save answers, flags, and highlights
	useEffect(() => {
		// TODO: Implement auto-save to backend
		const saveData = () => {
			localStorage.setItem(`ap-exam-${examData.id}-answers`, JSON.stringify(answers));
			localStorage.setItem(`ap-exam-${examData.id}-flagged`, JSON.stringify(Array.from(flaggedQuestions)));
			localStorage.setItem(`ap-exam-${examData.id}-highlights`, JSON.stringify(Array.from(highlights.entries())));
			localStorage.setItem(`ap-exam-${examData.id}-notes`, notes);
		};

		const debounceTimer = setTimeout(saveData, 1000);
		return () => clearTimeout(debounceTimer);
	}, [answers, flaggedQuestions, highlights, notes, examData.id]);

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

	const getAnsweredCount = () => {
		return answers.filter((answer) => answer !== null).length;
	};

	// Highlight functionality
	const handleTextSelection = () => {
		const selection = window.getSelection();
		if (selection && selection.toString().trim()) {
			const selectedText = selection.toString().trim();
			const currentHighlights = highlights.get(currentQuestion) || [];

			if (!currentHighlights.includes(selectedText)) {
				const newHighlights = new Map(highlights);
				newHighlights.set(currentQuestion, [...currentHighlights, selectedText]);
				setHighlights(newHighlights);
			}

			// Clear selection
			selection.removeAllRanges();
		}
	};

	const removeHighlight = (questionIndex: number, textToRemove: string) => {
		const currentHighlights = highlights.get(questionIndex) || [];
		const newHighlights = new Map(highlights);
		newHighlights.set(
			questionIndex,
			currentHighlights.filter((text) => text !== textToRemove)
		);
		setHighlights(newHighlights);
	};

	const renderHighlightedText = (text: string, questionIndex: number) => {
		const questionHighlights = highlights.get(questionIndex) || [];
		if (questionHighlights.length === 0) return text;

		let highlightedText = text;
		questionHighlights.forEach((highlight) => {
			const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
			highlightedText = highlightedText.replace(
				regex,
				`<mark style="background-color: #fef08a; padding: 2px 4px; border-radius: 3px;" title="하이라이트된 텍스트">$1</mark>`
			);
		});

		return highlightedText;
	};

	const currentQuestionData = questions[currentQuestion];
	const questionParts = currentQuestionData.question.split("\n\n");
	const questionText = questionParts[0];
	const passageText = currentQuestionData.passage || questionParts.slice(1).join("\n\n");

	const handleQuestionJump = (index: number) => {
		setCurrentQuestion(index);
		setShowQuestionNavigator(false);
	};

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

	return (
		<div className="min-h-screen flex flex-col bg-background">
			{/* BlueBook Style Header */}
			<header className="bg-white px-6 py-3 flex-shrink-0" style={{ borderBottom: "2px solid var(--color-primary)" }}>
				<div className="max-w-full flex items-center justify-between">
					{/* Left section */}
					<div className="flex items-center space-x-6">
						<div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
							Section 1, Module 1: {examData.title}
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

					{/* Right section - Tools reordered: Calculator, Graphing, Formulas, Notes */}
					<div className="flex items-center space-x-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setActiveToolModal("calculator")}
							style={{ color: "var(--color-text-secondary)" }}
							onMouseEnter={(e) => {
								e.currentTarget.style.color = "var(--color-text-primary)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.color = "var(--color-text-secondary)";
							}}
							title="계산기"
						>
							<Calculator className="w-4 h-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setActiveToolModal("graphing")}
							style={{ color: "var(--color-text-secondary)" }}
							onMouseEnter={(e) => {
								e.currentTarget.style.color = "var(--color-text-primary)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.color = "var(--color-text-secondary)";
							}}
							title="그래프 계산기"
						>
							<TrendingUp className="w-4 h-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setActiveToolModal("formulas")}
							style={{ color: "var(--color-text-secondary)" }}
							onMouseEnter={(e) => {
								e.currentTarget.style.color = "var(--color-text-primary)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.color = "var(--color-text-secondary)";
							}}
							title="공식 참조"
						>
							<Sigma className="w-4 h-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setActiveToolModal("notes")}
							style={{ color: "var(--color-text-secondary)" }}
							onMouseEnter={(e) => {
								e.currentTarget.style.color = "var(--color-text-primary)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.color = "var(--color-text-secondary)";
							}}
							title="메모장"
						>
							<StickyNote className="w-4 h-4" />
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
											className="p-4 rounded-lg select-text"
											style={{
												backgroundColor: "var(--color-primary-light)",
												borderLeft: "4px solid var(--color-primary)",
											}}
											onMouseUp={handleTextSelection}
										>
											<div className="mb-3 flex items-center justify-between">
												<span className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
													지문 (텍스트를 드래그하여 하이라이트)
												</span>
												{highlights.get(currentQuestion)?.length ? (
													<span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
														{highlights.get(currentQuestion)?.length}개 하이라이트
													</span>
												) : null}
											</div>
											<div
												className="whitespace-pre-wrap text-base leading-relaxed select-text"
												style={{ color: "var(--color-text-primary)" }}
												dangerouslySetInnerHTML={{
													__html: renderHighlightedText(passageText, currentQuestion),
												}}
											/>
										</div>

										{/* Highlight Management */}
										{highlights.get(currentQuestion)?.length ? (
											<div className="mt-4">
												<h4 className="text-sm font-medium mb-2" style={{ color: "var(--color-text-primary)" }}>
													하이라이트된 텍스트:
												</h4>
												<div className="space-y-2">
													{highlights.get(currentQuestion)?.map((highlight, index) => (
														<div
															key={index}
															className="flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-200"
														>
															<span className="text-sm text-yellow-800 flex-1 truncate">{highlight}</span>
															<button
																onClick={() => removeHighlight(currentQuestion, highlight)}
																className="ml-2 text-red-500 hover:text-red-700 text-sm"
																title="하이라이트 제거"
															>
																<X className="w-3 h-3" />
															</button>
														</div>
													))}
												</div>
											</div>
										) : null}
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
								{currentQuestionData.choices.map((choice, index) => (
									<div
										key={choice.id}
										className={`p-4 rounded-lg border cursor-pointer transition-all ${
											answers[currentQuestion] === choice.id
												? "border-primary ring-2 ring-primary/20"
												: "border-border hover:border-primary/30"
										}`}
										style={{
											backgroundColor: answers[currentQuestion] === choice.id ? "var(--primary-light)" : "transparent",
										}}
										onClick={() => handleAnswerSelect(choice.id)}
									>
										<div className="flex items-start space-x-3">
											<div className="mt-0.5">
												{answers[currentQuestion] === choice.id ? (
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
													{choice.text}
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

			{/* Tool Modals */}
			<ToolModal
				isOpen={activeToolModal !== null}
				onClose={() => setActiveToolModal(null)}
				type={activeToolModal || "calculator"}
				notes={notes}
				setNotes={setNotes}
			/>
		</div>
	);
}
