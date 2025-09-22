"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, Sigma, StickyNote } from "lucide-react";

interface ExamHeaderToolsProps {
	onCalculatorClick: () => void;
	onGraphClick: () => void;
	onFormulasClick: () => void;
	onNotesClick: () => void;
	onSubmitClick: () => void;
}

export function ExamHeaderTools({
	onCalculatorClick,
	onGraphClick,
	onFormulasClick,
	onNotesClick,
	onSubmitClick,
}: ExamHeaderToolsProps) {
	return (
		<div className="flex items-center space-x-2">
			{/* Calculator Tool */}
			<Button
				variant="ghost"
				size="sm"
				onClick={onCalculatorClick}
				style={{ color: "var(--color-text-secondary)" }}
				onMouseEnter={(e) => {
					e.currentTarget.style.color = "var(--color-text-primary)";
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.color = "var(--color-text-secondary)";
				}}
				title="Calculator"
			>
				<Calculator className="w-4 h-4" />
			</Button>

			{/* Graph Tool */}
			<Button
				variant="ghost"
				size="sm"
				onClick={onGraphClick}
				style={{ color: "var(--color-text-secondary)" }}
				onMouseEnter={(e) => {
					e.currentTarget.style.color = "var(--color-text-primary)";
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.color = "var(--color-text-secondary)";
				}}
				title="Graph Calculator"
			>
				<TrendingUp className="w-4 h-4" />
			</Button>

			{/* Formulas Tool */}
			<Button
				variant="ghost"
				size="sm"
				onClick={onFormulasClick}
				style={{ color: "var(--color-text-secondary)" }}
				onMouseEnter={(e) => {
					e.currentTarget.style.color = "var(--color-text-primary)";
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.color = "var(--color-text-secondary)";
				}}
				title="Formula Reference"
			>
				<Sigma className="w-4 h-4" />
			</Button>

			{/* Notes Tool */}
			<Button
				variant="ghost"
				size="sm"
				onClick={onNotesClick}
				style={{ color: "var(--color-text-secondary)" }}
				onMouseEnter={(e) => {
					e.currentTarget.style.color = "var(--color-text-primary)";
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.color = "var(--color-text-secondary)";
				}}
				title="Exam Notes"
			>
				<StickyNote className="w-4 h-4" />
			</Button>

			{/* Submit Button */}
			<Button
				variant="outline"
				size="sm"
				onClick={onSubmitClick}
				style={{ borderColor: "var(--color-primary)", color: "var(--color-text-primary)" }}
				className="ml-2"
			>
				Submit
			</Button>
		</div>
	);
}
