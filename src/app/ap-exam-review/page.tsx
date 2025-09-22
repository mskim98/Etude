"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Flag, Grid3X3, FileText, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ReviewPayload {
	questions: Array<{
		id: string;
		questionNumber: number;
		topic: string;
		questionType: "MCQ" | "FRQ";
		userAnswer: string;
		correctAnswer: string;
	}>;
	selectedQuestionId?: string;
	meta?: {
		subjectId?: string;
		completedAt?: string | Date;
		examId?: string;
	};
}

interface Choice {
	id: string;
	choice_text: string;
	image_url?: string | null;
	is_answer?: boolean | null;
	choice_order?: number | null;
}

interface ReviewQuestion {
	id: string;
	question_order?: number | null;
	question: string;
	passage?: string | null;
	topic?: string | null;
	explanation?: string | null;
	choices: Choice[];
}

export default function ApExamReviewPage() {
	const [payload, setPayload] = React.useState<ReviewPayload | null>(null);
	const [questions, setQuestions] = React.useState<ReviewQuestion[]>([]);
	const [activeIndex, setActiveIndex] = React.useState(0);
	const [loading, setLoading] = React.useState(true);
	const [isNavOpen, setIsNavOpen] = React.useState(false);

	React.useEffect(() => {
		try {
			const raw = localStorage.getItem("ap-exam-review-payload");
			if (!raw) {
				setLoading(false);
				return;
			}
			const parsed: ReviewPayload = JSON.parse(raw);
			setPayload(parsed);

			const ids = parsed.questions.map((q) => q.id);
			if (ids.length === 0) {
				setLoading(false);
				return;
			}

			// Fetch full questions with choices by IDs
			(async () => {
				// @ts-expect-error - Supabase type issue
				const { data, error } = await supabase
					.from("ap_exam_question")
					.select(
						`id, question_order, question, passage, topic, explanation,
             choices:ap_exam_choice(id, choice_text, image_url, is_answer, choice_order)`
					)
					.in("id", ids)
					.is("deleted_at", null);

				if (error) {
					// Fallback: no questions
					setQuestions([]);
					setLoading(false);
					return;
				}

				const normalized: ReviewQuestion[] = (data || [])
					// @ts-expect-error - Dynamic data from Supabase
					.map((q: any) => ({
						id: q.id,
						question_order: q.question_order,
						question: q.question,
						passage: q.passage,
						topic: q.topic,
						explanation: q.explanation ?? null,
						// @ts-expect-error - Dynamic choice data
						choices: (q.choices || []).sort((a: any, b: any) => (a.choice_order || 0) - (b.choice_order || 0)),
					}))
					// preserve wrong question order based on payload mapping
					.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));

				setQuestions(normalized);

				if (parsed.selectedQuestionId) {
					const idx = ids.indexOf(parsed.selectedQuestionId);
					if (idx >= 0) setActiveIndex(idx);
				}

				setLoading(false);
			})();
		} catch {
			setLoading(false);
		}
	}, []);

	const goBack = () => {
		window.history.length > 1 ? window.history.back() : (window.location.href = "/ap-results");
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="text-sm text-muted-foreground">Loading review…</div>
			</div>
		);
	}

	if (!payload || payload.questions.length === 0) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
				<div className="text-center mb-4">No review data found.</div>
				<Button onClick={goBack} variant="outline">
					<ArrowLeft className="w-4 h-4 mr-2" /> Back
				</Button>
			</div>
		);
	}

	const wrong = payload.questions;
	const current = questions[activeIndex];
	const wrongMeta = wrong[activeIndex];
	const currentQuestion = activeIndex;

	return (
		<div className="min-h-screen flex flex-col bg-background">
			{/* Header (APExamPage 스타일) */}
			<header className="bg-white px-6 py-3 flex-shrink-0" style={{ borderBottom: "2px solid var(--color-primary)" }}>
				<div className="max-w-full flex items-center justify-between">
					<div className="flex items-center space-x-6">
						<Button variant="ghost" onClick={goBack}>
							<ArrowLeft className="w-4 h-4 mr-2" /> Back
						</Button>
						<div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
							Review Mode
						</div>
					</div>

					{/* Center - Timer (고정 표시) */}
					<div
						className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2 px-4 py-2 rounded-lg"
						style={{ backgroundColor: "var(--color-primary-light)", border: "1px solid var(--color-primary)" }}
					>
						<Clock className="w-4 h-4" style={{ color: "var(--color-text-secondary)" }} />
						<span className="font-mono text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
							00:00:00
						</span>
					</div>
				</div>
			</header>

			{/* Main Content Area (APExamPage 레이아웃 복제) */}
			<div className="flex-1 flex relative">
				{/* Question Content - Split Layout */}
				<div className="flex-1 flex">
					{/* Left Panel - Passage/Context */}
					<div
						className="w-1/2 bg-white overflow-hidden flex flex-col"
						style={{ borderRight: "2px solid var(--color-primary)" }}
					>
						<div
							className="px-6 py-3"
							style={{ backgroundColor: "var(--color-primary-light)", borderBottom: "1px solid var(--color-primary)" }}
						>
							<h3 className="font-medium flex items-center" style={{ color: "var(--color-text-primary)" }}>
								<FileText className="w-4 h-4 mr-2" /> 지문 및 자료
							</h3>
						</div>
						<div className="flex-1 p-6 overflow-y-auto">
							<div className="prose prose-gray max-w-none">
								{current?.passage ? (
									<div className="space-y-4">
										<div
											className="p-4 rounded-lg select-text"
											style={{
												backgroundColor: "var(--color-primary-light)",
												borderLeft: "4px solid var(--color-primary)",
											}}
										>
											<div
												className="whitespace-pre-wrap text-lg leading-relaxed select-text cursor-text"
												style={{ color: "var(--color-text-primary)", lineHeight: "1.8" }}
											>
												{current.passage}
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
										Question {current?.question_order || currentQuestion + 1}
									</h3>
									<Button variant="ghost" size="sm" className="transition-all duration-200 hover:bg-white/50" disabled>
										<Flag className="w-4 h-4 mr-1" /> Mark for Review
									</Button>
								</div>
								<div className="flex items-center space-x-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
										disabled={activeIndex === 0}
									>
										Prev
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setActiveIndex((i) => Math.min(questions.length - 1, i + 1))}
										disabled={activeIndex === questions.length - 1}
									>
										Next
									</Button>
									<Button variant="outline" size="sm" onClick={() => setIsNavOpen(true)} className="flex items-center">
										<Grid3X3 className="w-4 h-4 mr-2" /> {current?.question_order || currentQuestion + 1} /{" "}
										{questions.length}
									</Button>
								</div>
							</div>
						</div>

						{/* Answer Options - colored and non-interactive */}
						<div className="flex-1 p-6 overflow-y-auto">
							<div className="space-y-3">
								{current?.choices?.map((c, idx) => {
									const isUser = c.choice_text === wrongMeta?.userAnswer;
									const isCorrect = c.choice_text === wrongMeta?.correctAnswer;
									return (
										<div
											key={c.id}
											className={`p-4 rounded-lg border transition-all ${
												isCorrect
													? "border-green-600 bg-green-50"
													: isUser
													? "border-red-600 bg-red-50"
													: "border-border"
											}`}
											style={{ cursor: "default" }}
										>
											<div className="flex items-start space-x-3">
												<div className="mt-0.5">
													<div
														className="w-5 h-5 border-2 rounded-full"
														style={{ borderColor: "var(--primary)" }}
													></div>
												</div>
												<div className="flex-1">
													<span className="font-medium mr-3 text-lg" style={{ color: "var(--text-secondary)" }}>
														{String.fromCharCode(65 + idx)}
													</span>
													<span className="text-lg" style={{ color: "var(--text-primary)" }}>
														{c.choice_text}
													</span>
												</div>
											</div>
										</div>
									);
								})}
							</div>

							{/* Explanation Section */}
							<div className="mt-6">
								<div className="px-4 py-4 rounded-md border bg-muted/40">
									<div className="text-lg font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>
										Explanation
									</div>
									<div
										className="text-xl leading-relaxed whitespace-pre-wrap"
										style={{ color: "var(--color-text-secondary)" }}
									>
										{current?.explanation?.trim() ? current.explanation : "No explanation provided for this question."}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Navigator Overlay - APExamPage 스타일 */}
			{isNavOpen && (
				<div className="absolute inset-0 backdrop-blur-md bg-white/10 z-20 flex items-center justify-center">
					<div
						className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
						style={{ border: "2px solid var(--color-primary)" }}
					>
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
								Question Navigator
							</h3>
							<Button variant="ghost" size="sm" onClick={() => setIsNavOpen(false)}>
								<X className="w-4 h-4" />
							</Button>
						</div>

						<div className="grid grid-cols-6 gap-3 mb-6">
							{payload.questions.map((w, idx) => {
								const isCurrent = idx === activeIndex;
								return (
									<Button
										key={w.id}
										variant={isCurrent ? "default" : "outline"}
										size="sm"
										className={`h-12 w-12 flex items-center justify-center relative transition-all duration-200 ${
											isCurrent ? "text-white" : ""
										}`}
										style={{
											backgroundColor: isCurrent ? "var(--color-primary)" : "transparent",
											borderColor: "var(--color-primary)",
											color: isCurrent ? "white" : "var(--color-text-primary)",
										}}
										onClick={() => {
											setActiveIndex(idx);
											setIsNavOpen(false);
										}}
									>
										<span className="text-sm font-medium">{w.questionNumber}</span>
									</Button>
								);
							})}
						</div>

						<div className="flex items-center justify-center text-sm" style={{ color: "var(--color-text-secondary)" }}>
							<span>
								Q{wrongMeta?.questionNumber} / {wrong.length}
							</span>
						</div>
					</div>
				</div>
			)}

			{/* Footer Navigation */}
			<div className="bg-white px-6 py-4 flex-shrink-0" style={{ borderTop: "2px solid var(--color-primary)" }}>
				<div className="flex items-center justify-between">
					<div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
						Review Only Wrong Questions
					</div>
					<div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
						{activeIndex + 1} / {questions.length}
					</div>
				</div>
			</div>
		</div>
	);
}
