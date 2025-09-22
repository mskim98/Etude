"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, Sigma, StickyNote } from "lucide-react";

interface ExamHeaderToolsProps {
	showCalculator?: boolean;
	showGraph?: boolean;
	showFormulas?: boolean;
	showNotes?: boolean;
	onCalculatorClick: () => void;
	onGraphClick: () => void;
	onFormulasClick: () => void;
	onNotesClick: () => void;
	onSubmitClick: () => void;
}

export function ExamHeaderTools({
	showCalculator = false,
	showGraph = false,
	showFormulas = false,
	showNotes = false,
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
				style={{
					color: showCalculator ? "#ffffff" : "var(--color-text-secondary)",
					backgroundColor: showCalculator ? "var(--color-primary)" : "transparent",
					border: showCalculator ? "2px solid var(--color-primary)" : "2px solid transparent",
					boxShadow: showCalculator ? "0 2px 8px rgba(0, 145, 179, 0.3)" : "none",
					transition: "all 0.2s ease-in-out",
				}}
				onMouseEnter={(e) => {
					if (!showCalculator) {
						e.currentTarget.style.color = "#ffffff";
						e.currentTarget.style.backgroundColor = "var(--color-primary)";
						e.currentTarget.style.border = "2px solid var(--color-primary)";
						e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 145, 179, 0.4)";
						e.currentTarget.style.transform = "translateY(-1px)";
					} else {
						e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 145, 179, 0.5)";
						e.currentTarget.style.transform = "translateY(-1px)";
					}
				}}
				onMouseLeave={(e) => {
					if (!showCalculator) {
						e.currentTarget.style.color = "var(--color-text-secondary)";
						e.currentTarget.style.backgroundColor = "transparent";
						e.currentTarget.style.border = "2px solid transparent";
						e.currentTarget.style.boxShadow = "none";
						e.currentTarget.style.transform = "translateY(0)";
					} else {
						e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 145, 179, 0.3)";
						e.currentTarget.style.transform = "translateY(0)";
					}
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
				style={{
					color: showGraph ? "#ffffff" : "var(--color-text-secondary)",
					backgroundColor: showGraph ? "var(--color-primary)" : "transparent",
					border: showGraph ? "2px solid var(--color-primary)" : "2px solid transparent",
					boxShadow: showGraph ? "0 2px 8px rgba(0, 145, 179, 0.3)" : "none",
					transition: "all 0.2s ease-in-out",
				}}
				onMouseEnter={(e) => {
					if (!showGraph) {
						e.currentTarget.style.color = "#ffffff";
						e.currentTarget.style.backgroundColor = "var(--color-primary)";
						e.currentTarget.style.border = "2px solid var(--color-primary)";
						e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 145, 179, 0.4)";
						e.currentTarget.style.transform = "translateY(-1px)";
					} else {
						e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 145, 179, 0.5)";
						e.currentTarget.style.transform = "translateY(-1px)";
					}
				}}
				onMouseLeave={(e) => {
					if (!showGraph) {
						e.currentTarget.style.color = "var(--color-text-secondary)";
						e.currentTarget.style.backgroundColor = "transparent";
						e.currentTarget.style.border = "2px solid transparent";
						e.currentTarget.style.boxShadow = "none";
						e.currentTarget.style.transform = "translateY(0)";
					} else {
						e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 145, 179, 0.3)";
						e.currentTarget.style.transform = "translateY(0)";
					}
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
				style={{
					color: showFormulas ? "#ffffff" : "var(--color-text-secondary)",
					backgroundColor: showFormulas ? "var(--color-primary)" : "transparent",
					border: showFormulas ? "2px solid var(--color-primary)" : "2px solid transparent",
					boxShadow: showFormulas ? "0 2px 8px rgba(0, 145, 179, 0.3)" : "none",
					transition: "all 0.2s ease-in-out",
				}}
				onMouseEnter={(e) => {
					if (!showFormulas) {
						e.currentTarget.style.color = "#ffffff";
						e.currentTarget.style.backgroundColor = "var(--color-primary)";
						e.currentTarget.style.border = "2px solid var(--color-primary)";
						e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 145, 179, 0.4)";
						e.currentTarget.style.transform = "translateY(-1px)";
					} else {
						e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 145, 179, 0.5)";
						e.currentTarget.style.transform = "translateY(-1px)";
					}
				}}
				onMouseLeave={(e) => {
					if (!showFormulas) {
						e.currentTarget.style.color = "var(--color-text-secondary)";
						e.currentTarget.style.backgroundColor = "transparent";
						e.currentTarget.style.border = "2px solid transparent";
						e.currentTarget.style.boxShadow = "none";
						e.currentTarget.style.transform = "translateY(0)";
					} else {
						e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 145, 179, 0.3)";
						e.currentTarget.style.transform = "translateY(0)";
					}
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
				style={{
					color: showNotes ? "#ffffff" : "var(--color-text-secondary)",
					backgroundColor: showNotes ? "var(--color-primary)" : "transparent",
					border: showNotes ? "2px solid var(--color-primary)" : "2px solid transparent",
					boxShadow: showNotes ? "0 2px 8px rgba(0, 145, 179, 0.3)" : "none",
					transition: "all 0.2s ease-in-out",
				}}
				onMouseEnter={(e) => {
					if (!showNotes) {
						e.currentTarget.style.color = "#ffffff";
						e.currentTarget.style.backgroundColor = "var(--color-primary)";
						e.currentTarget.style.border = "2px solid var(--color-primary)";
						e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 145, 179, 0.4)";
						e.currentTarget.style.transform = "translateY(-1px)";
					} else {
						e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 145, 179, 0.5)";
						e.currentTarget.style.transform = "translateY(-1px)";
					}
				}}
				onMouseLeave={(e) => {
					if (!showNotes) {
						e.currentTarget.style.color = "var(--color-text-secondary)";
						e.currentTarget.style.backgroundColor = "transparent";
						e.currentTarget.style.border = "2px solid transparent";
						e.currentTarget.style.boxShadow = "none";
						e.currentTarget.style.transform = "translateY(0)";
					} else {
						e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 145, 179, 0.3)";
						e.currentTarget.style.transform = "translateY(0)";
					}
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
