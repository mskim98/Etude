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

					<div className="flex flex-col space-y-3">
						<Button
							onClick={onSubmit}
							className="w-full text-white transition-all duration-200"
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

						<Button
							variant="outline"
							onClick={onCancel}
							className="w-full"
							style={{
								borderColor: "var(--color-primary)",
								color: "var(--color-text-primary)",
							}}
						>
							Continue Exam
						</Button>
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
