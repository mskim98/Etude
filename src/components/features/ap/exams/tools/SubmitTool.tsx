"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface SubmitToolProps {
	onSubmit: () => void;
	onCancel: () => void;
	answeredCount: number;
	totalQuestions: number;
}

export function SubmitTool({ onSubmit, onCancel, answeredCount, totalQuestions }: SubmitToolProps) {
	const unansweredCount = totalQuestions - answeredCount;

	return (
		<div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
			<Card className="w-full max-w-md mx-4" style={{ borderColor: "var(--color-primary)" }}>
				<CardContent className="p-8 text-center">
					<div className="mb-6">
						{unansweredCount > 0 ? (
							<AlertTriangle className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--color-warning)" }} />
						) : (
							<CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--color-success)" }} />
						)}
					</div>

					<h2 className="text-xl font-semibold mb-4" style={{ color: "var(--color-text-primary)" }}>
						{unansweredCount > 0 ? "Submit Exam?" : "Ready to Submit?"}
					</h2>

					<div className="mb-6 space-y-2">
						<p style={{ color: "var(--color-text-secondary)" }}>
							You have answered <strong>{answeredCount}</strong> out of <strong>{totalQuestions}</strong> questions.
						</p>

						{unansweredCount > 0 && (
							<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
								<p style={{ color: "var(--color-warning)" }}>
									<strong>{unansweredCount}</strong> question{unansweredCount > 1 ? "s" : ""} remain unanswered.
								</p>
							</div>
						)}

						{unansweredCount === 0 && (
							<div className="bg-green-50 border border-green-200 rounded-lg p-3">
								<p style={{ color: "var(--color-success)" }}>All questions have been answered!</p>
							</div>
						)}
					</div>

					<div className="flex flex-col space-y-4">
						{/* Submit Button */}
						<button
							onClick={onSubmit}
							className="group relative w-full h-14 overflow-hidden rounded-2xl bg-[#0091B3] px-8 
								font-semibold text-white text-lg transition-all duration-300 ease-out 
								hover:bg-[#007a9b] hover:shadow-2xl hover:shadow-[#0091B3]/25 
								focus:outline-none focus:ring-4 focus:ring-[#0091B3]/30
								active:scale-[0.98] border-0 cursor-pointer"
						>
							<div
								className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
								-skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
							></div>
							<div className="relative flex items-center h-full">
								<div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
									<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
									</svg>
								</div>
								<span className="flex-1 text-center">Submit Exam</span>
							</div>
						</button>

						{/* Continue Button */}
						<button
							onClick={onCancel}
							className="group w-full h-14 rounded-2xl border-2 border-[#0091B3] bg-transparent px-8 
								font-semibold text-[#0091B3] text-lg transition-all duration-300 ease-out 
								hover:bg-[#0091B3] hover:text-white hover:shadow-lg hover:shadow-[#0091B3]/20
								focus:outline-none focus:ring-4 focus:ring-[#0091B3]/30
								active:scale-[0.98] cursor-pointer"
						>
							<div className="flex items-center h-full">
								<div
									className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center flex-shrink-0
									transition-all duration-300 group-hover:border-white"
								>
									<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
									</svg>
								</div>
								<span className="flex-1 text-center">Continue Exam</span>
							</div>
						</button>
					</div>

					{unansweredCount > 0 && (
						<div className="mt-4 text-xs text-gray-500">
							You can still review and answer questions after submitting.
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
