"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import functionPlot from "function-plot";
import { X, Plus } from "lucide-react";

interface GraphFunction {
	id: string;
	expression: string;
	color: string;
}

interface APGraphCalculatorProps {
	className?: string;
	examId?: string;
	onDataChange?: (data: any) => void;
}

export function APGraphCalculator({ examId, onDataChange }: APGraphCalculatorProps) {
	const [functions, setFunctions] = useState<GraphFunction[]>([{ id: "1", expression: "", color: "#2563eb" }]);
	const [graphError, setGraphError] = useState<string | null>(null);
	const [selectedFunctionId, setSelectedFunctionId] = useState<string>("1");
	const plotRef = useRef<HTMLDivElement>(null);

	// Load saved graph data on mount
	React.useEffect(() => {
		if (examId) {
			const savedData = localStorage.getItem(`graph-${examId}`);
			if (savedData) {
				try {
					const data = JSON.parse(savedData);
					if (data.functions && Array.isArray(data.functions)) {
						setFunctions(data.functions);
					}
					if (data.selectedFunctionId) {
						setSelectedFunctionId(data.selectedFunctionId);
					}
				} catch (error) {
					console.error("Failed to load graph data:", error);
				}
			}
		}
	}, [examId]);

	// Save graph data whenever it changes
	React.useEffect(() => {
		if (examId) {
			const data = {
				functions,
				selectedFunctionId,
			};
			localStorage.setItem(`graph-${examId}`, JSON.stringify(data));
			onDataChange?.(data);
		}
	}, [functions, selectedFunctionId, examId, onDataChange]);

	// Available colors for functions
	const availableColors = [
		"#2563eb", // blue
		"#dc2626", // red
		"#16a34a", // green
		"#ca8a04", // yellow
		"#9333ea", // purple
		"#c2410c", // orange
		"#0891b2", // cyan
		"#be185d", // pink
	];

	const addFunction = () => {
		if (functions.length < 8) {
			const newId = (functions.length + 1).toString();
			const newColor = availableColors[functions.length % availableColors.length];
			setFunctions([...functions, { id: newId, expression: "", color: newColor }]);
			setSelectedFunctionId(newId);
		}
	};

	const removeFunction = (id: string) => {
		if (functions.length > 1) {
			const newFunctions = functions.filter((f) => f.id !== id);
			setFunctions(newFunctions);
			// If removed function was selected, select the first one
			if (selectedFunctionId === id) {
				setSelectedFunctionId(newFunctions[0]?.id || "1");
			}
		}
	};

	const updateFunction = (id: string, expression: string) => {
		setFunctions(functions.map((f) => (f.id === id ? { ...f, expression } : f)));
	};

	const plotGraph = useCallback(() => {
		if (!plotRef.current) return;

		try {
			setGraphError(null);
			plotRef.current.innerHTML = "";

			const validFunctions = functions.filter((f) => f.expression.trim().length > 0);

			if (validFunctions.length === 0) {
				setGraphError("Please enter at least one function.");
				return;
			}

			// Get container dimensions for responsive sizing
			const container = plotRef.current;
			const containerWidth = container.clientWidth;
			const containerHeight = container.clientHeight;

			// Calculate plot dimensions with padding
			const plotWidth = Math.max(300, containerWidth - 20);
			const plotHeight = Math.max(200, containerHeight - 20);

			functionPlot({
				target: plotRef.current,
				width: plotWidth,
				height: plotHeight,
				grid: true,
				xAxis: {
					label: "x",
					domain: [-10, 10],
				},
				yAxis: {
					label: "y",
					domain: [-10, 10],
				},
				tip: {
					xLine: true,
					yLine: true,
					renderer: function (x: number, y: number) {
						return `x: ${x.toFixed(3)}, y: ${y.toFixed(3)}`;
					},
				},
				data: validFunctions.map((func, index) => ({
					fn: func.expression,
					color: func.color,
					graphType: "polyline",
					title: `f${validFunctions.length > 1 ? index + 1 : ""}(x) = ${func.expression}`,
					attr: {
						stroke: func.color,
						"stroke-width": 3,
					},
				})),
			});
		} catch (error) {
			console.error("Plotting error:", error);
			setGraphError(`Plotting error: ${error}`);
		}
	}, [functions]);

	const resetAllFunctions = () => {
		setFunctions([{ id: "1", expression: "", color: "#2563eb" }]);
		setSelectedFunctionId("1");
		setGraphError(null);
		if (plotRef.current) {
			plotRef.current.innerHTML = "";
		}
	};

	const insertFunction = (expression: string) => {
		const selectedFunction = functions.find((f) => f.id === selectedFunctionId);
		if (selectedFunction) {
			const currentExpression = selectedFunction.expression;
			const newExpression = currentExpression ? currentExpression + expression : expression;
			updateFunction(selectedFunctionId, newExpression);
		}
	};

	// Auto-plot when functions change
	useEffect(() => {
		const timeoutId = setTimeout(plotGraph, 100);
		return () => clearTimeout(timeoutId);
	}, [plotGraph]);

	// Responsive resize handling
	useEffect(() => {
		if (!plotRef.current) return;

		const resizeObserver = new ResizeObserver(() => {
			const timeoutId = setTimeout(plotGraph, 150);
			return () => clearTimeout(timeoutId);
		});

		resizeObserver.observe(plotRef.current);

		const handleWindowResize = () => {
			setTimeout(plotGraph, 150);
		};

		window.addEventListener("resize", handleWindowResize);

		return () => {
			resizeObserver.disconnect();
			window.removeEventListener("resize", handleWindowResize);
		};
	}, [plotGraph]);

	return (
		<div className="w-full h-full flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between mb-4 flex-shrink-0">
				<h4 className="text-lg font-semibold">Graph Calculator</h4>
				<Button
					onClick={addFunction}
					disabled={functions.length >= 8}
					className="bg-blue-500 text-white hover:bg-blue-600 text-sm px-3 py-1 disabled:opacity-50"
				>
					<Plus className="w-4 h-4 mr-1" />
					Add Function
				</Button>
			</div>

			{/* Main Content - Left/Right Split */}
			<div className="flex-1 flex gap-4 min-h-0">
				{/* Left Panel - Function Controls */}
				<div className="w-80 flex flex-col bg-gray-50 border rounded p-4">
					{/* Function Inputs - Flexible Height */}
					<div className="flex-1 flex flex-col mb-4 min-h-0">
						<div className="text-sm font-semibold text-gray-700 mb-3 flex-shrink-0">Functions</div>
						<div className="space-y-2 overflow-y-auto flex-1 min-h-0">
							{functions.map((func, index) => (
								<div
									key={func.id}
									className={`flex items-center gap-2 p-2 rounded border-2 cursor-pointer transition-all ${
										selectedFunctionId === func.id
											? "border-blue-400 bg-blue-50"
											: "border-gray-200 hover:border-gray-300"
									}`}
									onClick={() => setSelectedFunctionId(func.id)}
								>
									<div
										className="w-4 h-4 rounded-full border-2 border-gray-300"
										style={{ backgroundColor: func.color }}
									/>
									<span className="text-sm font-medium text-gray-600 w-12">
										f{functions.length > 1 ? index + 1 : ""}(x):
									</span>
									<Input
										type="text"
										value={func.expression}
										onChange={(e) => updateFunction(func.id, e.target.value)}
										placeholder="e.g., x^2"
										className="flex-1 text-sm bg-white"
										onKeyPress={(e) => {
											if (e.key === "Enter") {
												plotGraph();
											}
										}}
										onFocus={() => setSelectedFunctionId(func.id)}
									/>
									{functions.length > 1 && (
										<Button
											onClick={(e) => {
												e.stopPropagation();
												removeFunction(func.id);
											}}
											variant="ghost"
											size="sm"
											className="text-red-500 hover:text-red-700 p-1"
										>
											<X className="w-4 h-4" />
										</Button>
									)}
								</div>
							))}
						</div>
					</div>

					{/* Quick Functions & Operators - Fixed at bottom */}
					<div className="flex-shrink-0">
						{/* Control Buttons */}
						<div className="mb-4">
							<div className="flex gap-2">
								<Button
									onClick={plotGraph}
									className="flex-1 bg-gray-500 text-white hover:bg-gray-600 text-sm font-medium"
								>
									Center
								</Button>
								<Button
									onClick={resetAllFunctions}
									className="flex-1 bg-gray-500 text-white hover:bg-gray-600 text-sm font-medium"
								>
									Reset
								</Button>
							</div>
						</div>
						<div className="text-sm font-semibold text-gray-700 mb-2">Quick Functions</div>

						{/* Math Functions */}
						<div className="grid grid-cols-3 gap-1 mb-2">
							<Button
								onClick={() => insertFunction("x^2")}
								className="h-8 text-sm bg-gray-600 text-white hover:bg-gray-700"
							>
								x²
							</Button>
							<Button
								onClick={() => insertFunction("x^3")}
								className="h-8 text-sm bg-gray-600 text-white hover:bg-gray-700"
							>
								x³
							</Button>
							<Button
								onClick={() => insertFunction("sqrt(")}
								className="h-8 text-sm bg-gray-600 text-white hover:bg-gray-700"
							>
								√
							</Button>
						</div>

						{/* Trig Functions */}
						<div className="grid grid-cols-3 gap-1 mb-2">
							<Button
								onClick={() => insertFunction("sin(")}
								className="h-8 text-sm bg-gray-600 text-white hover:bg-gray-700"
							>
								sin
							</Button>
							<Button
								onClick={() => insertFunction("cos(")}
								className="h-8 text-sm bg-gray-600 text-white hover:bg-gray-700"
							>
								cos
							</Button>
							<Button
								onClick={() => insertFunction("tan(")}
								className="h-8 text-sm bg-gray-600 text-white hover:bg-gray-700"
							>
								tan
							</Button>
						</div>

						{/* Log Functions */}
						<div className="grid grid-cols-3 gap-1 mb-2">
							<Button
								onClick={() => insertFunction("log10(")}
								className="h-8 text-sm bg-gray-600 text-white hover:bg-gray-700"
							>
								log₁₀
							</Button>
							<Button
								onClick={() => insertFunction("log(")}
								className="h-8 text-sm bg-gray-600 text-white hover:bg-gray-700"
							>
								ln
							</Button>
							<Button
								onClick={() => insertFunction("abs(")}
								className="h-8 text-sm bg-gray-600 text-white hover:bg-gray-700"
							>
								|x|
							</Button>
						</div>

						{/* Operators - Directly attached */}
						<div className="grid grid-cols-4 gap-1 mb-2">
							<Button
								onClick={() => insertFunction("+")}
								className="h-8 text-sm bg-gray-700 text-white hover:bg-gray-800"
							>
								+
							</Button>
							<Button
								onClick={() => insertFunction("-")}
								className="h-8 text-sm bg-gray-700 text-white hover:bg-gray-800"
							>
								-
							</Button>
							<Button
								onClick={() => insertFunction("*")}
								className="h-8 text-sm bg-gray-700 text-white hover:bg-gray-800"
							>
								×
							</Button>
							<Button
								onClick={() => insertFunction("/")}
								className="h-8 text-sm bg-gray-700 text-white hover:bg-gray-800"
							>
								÷
							</Button>
						</div>

						{/* Parentheses */}
						<div className="grid grid-cols-2 gap-1">
							<Button
								onClick={() => insertFunction("(")}
								className="h-8 text-sm bg-gray-700 text-white hover:bg-gray-800"
							>
								(
							</Button>
							<Button
								onClick={() => insertFunction(")")}
								className="h-8 text-sm bg-gray-700 text-white hover:bg-gray-800"
							>
								)
							</Button>
						</div>
					</div>
				</div>

				{/* Right Panel - Graph Area */}
				<div className="flex-1 flex flex-col min-h-0">
					{/* Error Display */}
					{graphError && (
						<div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">{graphError}</div>
					)}

					{/* Graph Container - Fixed Layout */}
					<div className="flex-1 bg-white border-2 border-gray-200 rounded overflow-hidden">
						<div ref={plotRef} className="w-full h-full" />
					</div>

					{/* Usage Instructions - Fixed Height */}
					<div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
						<div className="text-sm font-semibold text-blue-800 mb-2">Usage Guide</div>
						<div className="text-xs text-blue-700 space-y-1">
							<div>• Click function input to select, then use quick buttons</div>
							<div>• Center: Draw graphs and reset view to (-10, 10)</div>
							<div>• Reset: Clear all functions and start fresh</div>
							<div>• Examples: x^2, sin(x), 2*x+1, sqrt(x), log(x)</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
