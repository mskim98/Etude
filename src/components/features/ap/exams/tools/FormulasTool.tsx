"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sigma, X } from "lucide-react";

interface FormulasToolProps {
	onClose: () => void;
}

export function FormulasTool({ onClose }: FormulasToolProps) {
	const [position, setPosition] = useState({ x: 150, y: 150 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const modalRef = useRef<HTMLDivElement>(null);

	// Global mouse event handlers for better stability
	React.useEffect(() => {
		const handleGlobalMouseMove = (e: MouseEvent) => {
			if (isDragging) {
				const newX = e.clientX - dragStart.x;
				const newY = e.clientY - dragStart.y;
				setPosition({
					x: Math.max(0, Math.min(window.innerWidth - 500, newX)),
					y: Math.max(0, Math.min(window.innerHeight - 400, newY)),
				});
			}
		};

		const handleGlobalMouseUp = () => {
			setIsDragging(false);
		};

		if (isDragging) {
			document.addEventListener("mousemove", handleGlobalMouseMove);
			document.addEventListener("mouseup", handleGlobalMouseUp);
			document.body.style.userSelect = "none"; // Prevent text selection during drag
		}

		return () => {
			document.removeEventListener("mousemove", handleGlobalMouseMove);
			document.removeEventListener("mouseup", handleGlobalMouseUp);
			document.body.style.userSelect = "";
		};
	}, [isDragging, dragStart]);

	const handleMouseDown = (e: React.MouseEvent) => {
		if (modalRef.current) {
			e.preventDefault();
			setIsDragging(true);
			setDragStart({
				x: e.clientX - position.x,
				y: e.clientY - position.y,
			});
		}
	};

	const formulas = [
		{
			name: "Ideal Gas Law",
			formula: "PV = nRT",
			category: "Gas Laws",
		},
		{
			name: "Molarity",
			formula: "M = mol/L",
			category: "Concentration",
		},
		{
			name: "pH",
			formula: "pH = -log[H⁺]",
			category: "Acids & Bases",
		},
		{
			name: "Kinetic Energy",
			formula: "KE = ½mv²",
			category: "Energy",
		},
		{
			name: "Enthalpy",
			formula: "ΔH = H(products) - H(reactants)",
			category: "Thermodynamics",
		},
		{
			name: "Molality",
			formula: "m = mol solute / kg solvent",
			category: "Concentration",
		},
		{
			name: "Beer's Law",
			formula: "A = εbc",
			category: "Spectroscopy",
		},
		{
			name: "Henderson-Hasselbalch",
			formula: "pH = pKa + log([A⁻]/[HA])",
			category: "Acids & Bases",
		},
		{
			name: "Nernst Equation",
			formula: "E = E° - (RT/nF)lnQ",
			category: "Electrochemistry",
		},
		{
			name: "Arrhenius Equation",
			formula: "k = Ae^(-Ea/RT)",
			category: "Kinetics",
		},
	];

	// Group formulas by category
	const groupedFormulas = formulas.reduce((acc, formula) => {
		if (!acc[formula.category]) {
			acc[formula.category] = [];
		}
		acc[formula.category].push(formula);
		return acc;
	}, {} as Record<string, typeof formulas>);

	return (
		<div className="fixed inset-0 z-52 pointer-events-none">
			<div
				ref={modalRef}
				className="absolute bg-white rounded-lg shadow-2xl border-2 border-blue-200 pointer-events-auto overflow-hidden"
				style={{
					left: position.x,
					top: position.y,
					width: 500,
					height: "auto",
					maxHeight: "80vh",
					cursor: isDragging ? "grabbing" : "grab",
				}}
			>
				<div
					className="flex items-center justify-between p-3 border-b bg-blue-50 cursor-grab active:cursor-grabbing"
					onMouseDown={handleMouseDown}
				>
					<h3 className="font-semibold text-blue-800 flex items-center">
						<Sigma className="w-4 h-4 mr-2" />
						Formula Reference
					</h3>
					<Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-blue-100">
						<X className="h-4 w-4" />
					</Button>
				</div>

				<div
					className="p-4 overflow-y-auto"
					style={{
						maxHeight: "calc(80vh - 60px)",
					}}
				>
					<div className="space-y-6">
						{Object.entries(groupedFormulas).map(([category, categoryFormulas]) => (
							<div key={category}>
								<h4 className="font-medium text-blue-800 mb-3 pb-2 border-b border-blue-200">{category}</h4>
								<div className="space-y-3">
									{categoryFormulas.map((formula, index) => (
										<div key={index} className="bg-gray-50 p-3 rounded border border-gray-200">
											<div className="font-medium mb-1 text-gray-800">{formula.name}</div>
											<div className="font-mono text-gray-600 text-sm bg-white p-2 rounded border">
												{formula.formula}
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
