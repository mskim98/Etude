"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Flag, X, ChevronLeft, ChevronRight, Grid3X3, FileText } from "lucide-react";
import type { ApExam, ApExamQuestion } from "@/types/ap";
import { CalculatorTool, GraphTool, FormulasTool, NotesTool, SubmitTool, ExamHeaderTools } from "./tools";

interface APExamPageProps {
	examData: ApExam;
	questions: ApExamQuestion[];
	onExamComplete: (result: unknown) => void;
	onGoBack: () => void;
}

export function APExamPage({ examData, questions, onExamComplete }: APExamPageProps) {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [timeLeft, setTimeLeft] = useState(examData.duration * 60); // Convert minutes to seconds
	const [answers, setAnswers] = useState<(string | null)[]>(new Array(questions.length).fill(null));
	const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
	const [showSubmitDialog, setShowSubmitDialog] = useState(false);
	const [examStartTime] = useState<Date>(new Date()); // 시험 시작 시간 기록
	const [showQuestionNavigator, setShowQuestionNavigator] = useState(false);
	const [notes, setNotes] = useState("");
	const [highlights, setHighlights] = useState<Map<number, Array<{ text: string; start: number; end: number }>>>(
		new Map()
	); // questionIndex -> highlighted text with positions

	// Tool modal states
	const [showCalculator, setShowCalculator] = useState(false);
	const [showGraph, setShowGraph] = useState(false);
	const [showFormulas, setShowFormulas] = useState(false);
	const [showNotes, setShowNotes] = useState(false);

	// Tool data states for persistence - used for saving/loading tool states
	const [, setCalculatorData] = useState<unknown>(null);
	const [, setGraphData] = useState<unknown>(null);

	// Z-index management for tool modals
	const [toolZIndexes, setToolZIndexes] = useState({
		calculator: 50,
		graph: 51,
		formulas: 52,
		notes: 53,
	});
	const [highestZIndex, setHighestZIndex] = useState(53);
	const [activeTool, setActiveTool] = useState<keyof typeof toolZIndexes | null>(null);

	// Function to bring a tool to front
	const bringToolToFront = useCallback(
		(toolName: keyof typeof toolZIndexes) => {
			const newZIndex = highestZIndex + 1;
			setToolZIndexes((prev) => ({
				...prev,
				[toolName]: newZIndex,
			}));
			setHighestZIndex(newZIndex);
			setActiveTool(toolName);
		},
		[highestZIndex]
	);

	// Define handleSubmitExam before useEffect
	const handleSubmitExam = useCallback(() => {
		// 실제 시험 경과 시간 계산 (초 단위)
		const currentTime = new Date();
		const actualTimeSpent = Math.floor((currentTime.getTime() - examStartTime.getTime()) / 1000);

		const result = {
			examId: examData.id,
			answers,
			timeSpent: actualTimeSpent, // 실제 경과 시간 사용
			flaggedQuestions: Array.from(flaggedQuestions),
			highlights: Array.from(highlights.entries()),
			notes,
		};
		onExamComplete(result);
	}, [examData.id, answers, flaggedQuestions, highlights, notes, onExamComplete, examStartTime]);

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

	// Define removeHighlight function before using it in useEffect
	const removeHighlight = useCallback(
		(questionIndex: number, highlightToRemove: { text: string; start: number; end: number }) => {
			const currentHighlights = highlights.get(questionIndex) || [];
			const newHighlights = new Map(highlights);
			newHighlights.set(
				questionIndex,
				currentHighlights.filter(
					(highlight) =>
						!(
							highlight.text === highlightToRemove.text &&
							highlight.start === highlightToRemove.start &&
							highlight.end === highlightToRemove.end
						)
				)
			);
			setHighlights(newHighlights);
		},
		[highlights]
	);

	// Register global highlight removal function
	useEffect(() => {
		(
			window as typeof window & { removeHighlight?: (questionIndex: number, highlightIndex: number) => void }
		).removeHighlight = (questionIndex: number, highlightIndex: number) => {
			try {
				const currentHighlights = highlights.get(questionIndex) || [];
				if (highlightIndex >= 0 && highlightIndex < currentHighlights.length) {
					const highlightToRemove = currentHighlights[highlightIndex];
					removeHighlight(questionIndex, highlightToRemove);
				}
			} catch (error) {
				console.error("Failed to remove highlight:", error);
			}
		};

		return () => {
			delete (window as typeof window & { removeHighlight?: (questionIndex: number, highlightIndex: number) => void })
				.removeHighlight;
		};
	}, [highlights, removeHighlight]);

	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const handleAnswerSelect = (answerIndex: string) => {
		const newAnswers = [...answers];
		// If the same answer is clicked again, deselect it
		if (newAnswers[currentQuestion] === answerIndex) {
			newAnswers[currentQuestion] = null;
		} else {
			newAnswers[currentQuestion] = answerIndex;
		}
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

	// Highlight functionality with position-based system
	const handleTextSelection = () => {
		const selection = window.getSelection();
		if (!selection || !selection.toString().trim()) return;

		// Get the passage text element to calculate positions
		const passageElement = document.querySelector("[data-passage-text]");
		if (!passageElement) return;

		const range = selection.getRangeAt(0);
		let selectedText = selection.toString().trim();

		// Check if selection is reasonable (not too large)
		const maxSelectionLength = 500; // Maximum characters for a single highlight
		if (selectedText.length > maxSelectionLength) {
			selection.removeAllRanges();
			return;
		}

		// Check if selection spans too many lines (prevent accidental full-text selection)
		const lineCount = selectedText.split("\n").length;
		if (lineCount > 10) {
			selection.removeAllRanges();
			return;
		}

		// Check if the selection is contained within the passage element
		const rangeRect = range.getBoundingClientRect();
		const passageRect = passageElement.getBoundingClientRect();

		// If selection extends far beyond the passage element, it's likely accidental
		if (rangeRect.height > passageRect.height * 0.8) {
			selection.removeAllRanges();
			return;
		}

		// Clean up selected text
		try {
			const tempDiv = document.createElement("div");
			tempDiv.innerHTML = selectedText;
			selectedText = tempDiv.textContent || tempDiv.innerText || "";
		} catch {
			selectedText = selectedText
				.replace(/<[^>]*>/g, "")
				.replace(/\s+/g, " ")
				.trim();
		}

		// Skip if the cleaned text is empty or too short
		if (!selectedText || selectedText.length < 2) {
			selection.removeAllRanges();
			return;
		}

		// Get the original passage text without HTML
		const currentQuestionData = questions[currentQuestion];
		const questionParts = currentQuestionData.question.split("\n\n");
		const passageText = currentQuestionData.passage || questionParts.slice(1).join("\n\n");

		// Calculate the actual position based on the DOM selection
		let startOffset = 0;
		try {
			// Create a range from the start of the passage element to the start of selection
			const tempRange = document.createRange();
			tempRange.setStart(passageElement, 0);
			tempRange.setEnd(range.startContainer, range.startOffset);

			// Get the text content up to the selection start
			const textBeforeSelection = tempRange.toString();

			// Clean the text before selection to match our passage text format
			const cleanTextBefore = textBeforeSelection.replace(/<[^>]*>/g, "").replace(/\s+/g, " ");

			// Find the position in the original passage text
			startOffset = cleanTextBefore.length;

			// Adjust for any whitespace differences
			while (
				startOffset > 0 &&
				passageText.substring(startOffset, startOffset + selectedText.length) !== selectedText
			) {
				startOffset--;
			}

			// If still not found, try moving forward
			if (passageText.substring(startOffset, startOffset + selectedText.length) !== selectedText) {
				const maxSearch = Math.min(startOffset + 50, passageText.length - selectedText.length);
				for (let i = startOffset; i <= maxSearch; i++) {
					if (passageText.substring(i, i + selectedText.length) === selectedText) {
						startOffset = i;
						break;
					}
				}
			}
		} catch {
			// Fallback to indexOf if DOM calculation fails
			startOffset = passageText.indexOf(selectedText);
		}

		// Verify we found the correct position
		if (startOffset === -1 || passageText.substring(startOffset, startOffset + selectedText.length) !== selectedText) {
			selection.removeAllRanges();
			return;
		}

		const endOffset = startOffset + selectedText.length;
		const currentHighlights = highlights.get(currentQuestion) || [];

		// Check for overlapping or adjacent highlights
		const overlappingHighlights: typeof currentHighlights = [];
		const nonOverlappingHighlights: typeof currentHighlights = [];

		currentHighlights.forEach((existing) => {
			// Check if highlights overlap or are adjacent (including 1 character gap for merging)
			if (!(endOffset < existing.start - 1 || startOffset > existing.end + 1)) {
				overlappingHighlights.push(existing);
			} else {
				nonOverlappingHighlights.push(existing);
			}
		});

		// Create merged highlight
		let mergedStart = startOffset;
		let mergedEnd = endOffset;

		// Extend the range to include all overlapping highlights
		overlappingHighlights.forEach((highlight) => {
			mergedStart = Math.min(mergedStart, highlight.start);
			mergedEnd = Math.max(mergedEnd, highlight.end);
		});

		// Extract the merged text from the passage
		const mergedText = passageText.substring(mergedStart, mergedEnd);

		const mergedHighlight = {
			text: mergedText,
			start: mergedStart,
			end: mergedEnd,
		};

		// Update highlights with the merged result
		const newHighlights = new Map(highlights);
		newHighlights.set(currentQuestion, [...nonOverlappingHighlights, mergedHighlight]);
		setHighlights(newHighlights);

		// Clear selection
		selection.removeAllRanges();
	};

	const clearHighlights = (questionIndex: number) => {
		const newHighlights = new Map(highlights);
		newHighlights.delete(questionIndex);
		setHighlights(newHighlights);
	};

	const renderHighlightedText = (text: string, questionIndex: number) => {
		const questionHighlights = highlights.get(questionIndex) || [];
		if (questionHighlights.length === 0) return text;

		// Sort highlights by start position (descending) to apply from end to start
		const sortedHighlights = [...questionHighlights].sort((a, b) => b.start - a.start);

		// Apply highlights from end to start to avoid position shifts
		let result = text;
		sortedHighlights.forEach((highlight, index) => {
			const highlightId = `highlight-${questionIndex}-${index}`;
			const before = result.substring(0, highlight.start);
			const highlighted = result.substring(highlight.start, highlight.end);
			const after = result.substring(highlight.end);

			// Find the original index of this highlight in the unsorted array
			const originalHighlights = highlights.get(questionIndex) || [];
			const originalIndex = originalHighlights.findIndex(
				(h) => h.text === highlight.text && h.start === highlight.start && h.end === highlight.end
			);

			result =
				before +
				`<mark 
					id="${highlightId}"
					class="highlight-item"
					style="
						background-color: #fef08a; 
						padding: 2px 4px; 
						border-radius: 4px; 
						cursor: pointer; 
						position: relative;
						transition: all 0.2s ease;
						border: 2px solid #f59e0b;
						box-shadow: 0 1px 3px rgba(245, 158, 11, 0.2);
					" 
					title="Click to remove"
					onclick="window.removeHighlight(${questionIndex}, ${originalIndex})"
					onmouseover="this.style.backgroundColor='#fde047'; this.style.borderColor='#d97706'; this.style.boxShadow='0 2px 6px rgba(245, 158, 11, 0.3)';"
					onmouseout="this.style.backgroundColor='#fef08a'; this.style.borderColor='#f59e0b'; this.style.boxShadow='0 1px 3px rgba(245, 158, 11, 0.2)';"
				>${highlighted}</mark>` +
				after;
		});

		return result;
	};

	const currentQuestionData = questions[currentQuestion];
	const questionParts = currentQuestionData.question.split("\n\n");
	const passageText = currentQuestionData.passage || questionParts.slice(1).join("\n\n");

	const handleQuestionJump = (index: number) => {
		setCurrentQuestion(index);
		setShowQuestionNavigator(false);
	};

	if (showSubmitDialog) {
		return (
			<SubmitTool
				onSubmit={handleSubmitExam}
				onCancel={() => setShowSubmitDialog(false)}
				answeredCount={getAnsweredCount()}
				totalQuestions={questions.length}
			/>
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

					{/* Right section - Header Tools */}
					<ExamHeaderTools
						showCalculator={showCalculator}
						showGraph={showGraph}
						showFormulas={showFormulas}
						showNotes={showNotes}
						onCalculatorClick={() => {
							if (showCalculator) {
								setShowCalculator(false);
								if (activeTool === "calculator") setActiveTool(null);
							} else {
								setShowCalculator(true);
								bringToolToFront("calculator");
							}
						}}
						onGraphClick={() => {
							if (showGraph) {
								setShowGraph(false);
								if (activeTool === "graph") setActiveTool(null);
							} else {
								setShowGraph(true);
								bringToolToFront("graph");
							}
						}}
						onFormulasClick={() => {
							if (showFormulas) {
								setShowFormulas(false);
								if (activeTool === "formulas") setActiveTool(null);
							} else {
								setShowFormulas(true);
								bringToolToFront("formulas");
							}
						}}
						onNotesClick={() => {
							if (showNotes) {
								setShowNotes(false);
								if (activeTool === "notes") setActiveTool(null);
							} else {
								setShowNotes(true);
								bringToolToFront("notes");
							}
						}}
						onSubmitClick={() => setShowSubmitDialog(true)}
					/>
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
											className={`h-12 w-12 flex items-center justify-center relative transition-all duration-200 ${
												isCurrent ? "text-white" : ""
											}`}
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
													e.currentTarget.style.transform = "scale(1.05)";
												}
											}}
											onMouseLeave={(e) => {
												if (!isCurrent && !isAnswered) {
													e.currentTarget.style.backgroundColor = "transparent";
													e.currentTarget.style.transform = "scale(1)";
												}
											}}
											onClick={() => handleQuestionJump(index)}
										>
											<span className="text-sm font-medium">{index + 1}</span>
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
											<div className="mb-3 flex items-center justify-end">
												<div className="flex items-center space-x-2">
													{(highlights.get(currentQuestion)?.length || 0) > 0 ? (
														<span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
															{highlights.get(currentQuestion)?.length || 0} highlights
														</span>
													) : null}
													{(highlights.get(currentQuestion)?.length || 0) > 0 ? (
														<button
															onClick={() => clearHighlights(currentQuestion)}
															className="text-xs px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 transition-colors cursor-pointer"
															title="Clear all highlights"
														>
															Clear All
														</button>
													) : null}
												</div>
											</div>
											<div
												className="whitespace-pre-wrap text-lg leading-relaxed select-text cursor-text"
												style={{
													color: "var(--color-text-primary)",
													userSelect: "text",
													WebkitUserSelect: "text",
													MozUserSelect: "text",
													msUserSelect: "text",
													lineHeight: "1.8",
													wordWrap: "break-word",
													wordBreak: "normal",
												}}
												data-passage-text
												dangerouslySetInnerHTML={{
													__html: renderHighlightedText(passageText, currentQuestion),
												}}
											/>
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
											<div className="mt-0.5 cursor-pointer">
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
											<div className="flex-1 cursor-pointer">
												<span
													className="font-medium mr-3 text-lg cursor-pointer"
													style={{ color: "var(--text-secondary)" }}
												>
													{String.fromCharCode(65 + index)}
												</span>
												<span className="text-lg cursor-pointer" style={{ color: "var(--text-primary)" }}>
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
					<div className="flex items-center justify-center space-x-3">
						{/* Previous Button */}
						<Button
							onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
							disabled={currentQuestion === 0}
							className={`
								flex items-center justify-center space-x-2 
								px-4 py-2.5 rounded-xl font-medium text-sm
								transition-all duration-300 ease-in-out
								min-w-[110px] h-11
								${
									currentQuestion === 0
										? "bg-gray-100 text-gray-400 cursor-not-allowed"
										: "bg-white text-[#0091B3] border-2 border-[#0091B3] hover:bg-[#0091B3] hover:text-white hover:shadow-lg hover:shadow-[#0091B3]/25 hover:scale-105 cursor-pointer"
								}
							`}
						>
							<ChevronLeft className={`w-4 h-4 ${currentQuestion === 0 ? "cursor-not-allowed" : "cursor-pointer"}`} />
							<span className={`text-center ${currentQuestion === 0 ? "cursor-not-allowed" : "cursor-pointer"}`}>
								Previous
							</span>
						</Button>

						{/* Question Navigator Button */}
						<Button
							onClick={() => setShowQuestionNavigator(!showQuestionNavigator)}
							className={`
								flex items-center justify-center space-x-2 
								px-6 py-2.5 rounded-xl font-medium text-sm
								border-2 transition-all duration-300 ease-in-out
								min-w-[160px] h-11 relative overflow-hidden cursor-pointer
								${
									showQuestionNavigator
										? "bg-white text-[#0091B3] border-[#0091B3] shadow-lg shadow-[#0091B3]/30 transform scale-105 hover:bg-gray-50 hover:text-[#007a9b] hover:border-[#007a9b]"
										: "bg-gradient-to-r from-[#0091B3] to-[#007a9b] text-white border-transparent shadow-lg shadow-[#0091B3]/30 hover:shadow-xl hover:shadow-[#0091B3]/40 hover:scale-105 hover:from-[#007a9b] hover:to-[#006b8a]"
								}
							`}
						>
							{/* Active indicator dot */}
							{showQuestionNavigator && (
								<div className="absolute top-1 right-1 w-2 h-2 bg-[#0091B3] rounded-full animate-pulse cursor-pointer"></div>
							)}
							<Grid3X3
								className={`w-4 h-4 transition-transform duration-300 cursor-pointer ${
									showQuestionNavigator ? "rotate-90" : ""
								}`}
							/>
							<span className="font-semibold cursor-pointer">
								{showQuestionNavigator ? "Hide Questions" : `Question ${currentQuestion + 1} / ${questions.length}`}
							</span>
						</Button>

						{/* Next Button */}
						<Button
							onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
							disabled={currentQuestion === questions.length - 1}
							className={`
								flex items-center justify-center space-x-2 
								px-4 py-2.5 rounded-xl font-medium text-sm
								transition-all duration-300 ease-in-out
								min-w-[110px] h-11
								${
									currentQuestion === questions.length - 1
										? "bg-gray-100 text-gray-400 cursor-not-allowed"
										: "bg-white text-[#0091B3] border-2 border-[#0091B3] hover:bg-[#0091B3] hover:text-white hover:shadow-lg hover:shadow-[#0091B3]/25 hover:scale-105 cursor-pointer"
								}
							`}
						>
							<span
								className={`text-center ${
									currentQuestion === questions.length - 1 ? "cursor-not-allowed" : "cursor-pointer"
								}`}
							>
								Next
							</span>
							<ChevronRight
								className={`w-4 h-4 ${
									currentQuestion === questions.length - 1 ? "cursor-not-allowed" : "cursor-pointer"
								}`}
							/>
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

			{/* Tool Modals - Always rendered for data persistence */}
			<div style={{ display: showCalculator ? "block" : "none" }}>
				<CalculatorTool
					onClose={() => {
						setShowCalculator(false);
						if (activeTool === "calculator") setActiveTool(null);
					}}
					examId={examData.id}
					onDataChange={setCalculatorData}
					onBringToFront={() => bringToolToFront("calculator")}
					zIndex={toolZIndexes.calculator}
					isActive={activeTool === "calculator"}
				/>
			</div>
			<div style={{ display: showGraph ? "block" : "none" }}>
				<GraphTool
					onClose={() => {
						setShowGraph(false);
						if (activeTool === "graph") setActiveTool(null);
					}}
					examId={examData.id}
					onDataChange={setGraphData}
					onBringToFront={() => bringToolToFront("graph")}
					zIndex={toolZIndexes.graph}
					isActive={activeTool === "graph"}
				/>
			</div>
			{showFormulas && (
				<FormulasTool
					onClose={() => {
						setShowFormulas(false);
						if (activeTool === "formulas") setActiveTool(null);
					}}
					onBringToFront={() => bringToolToFront("formulas")}
					zIndex={toolZIndexes.formulas}
					isActive={activeTool === "formulas"}
				/>
			)}
			{showNotes && (
				<NotesTool
					onClose={() => {
						setShowNotes(false);
						if (activeTool === "notes") setActiveTool(null);
					}}
					notes={notes}
					onNotesChange={setNotes}
					onBringToFront={() => bringToolToFront("notes")}
					zIndex={toolZIndexes.notes}
					isActive={activeTool === "notes"}
				/>
			)}
		</div>
	);
}
