"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { evaluate } from "mathjs";

interface CalculatorData {
	display: string;
	value: string;
	history: string[];
	isRadianMode: boolean;
	savedResults: string[];
}

interface APCalculatorProps {
	examId?: string;
	onDataChange?: (data: CalculatorData) => void;
}

export function APCalculator({ examId, onDataChange }: APCalculatorProps) {
	// Calculator state with persistence
	const [calcDisplay, setCalcDisplay] = useState("0");
	const [calcValue, setCalcValue] = useState("");
	const [calcHistory, setCalcHistory] = useState<string[]>([]);
	const [isRadianMode, setIsRadianMode] = useState(true);
	const [savedResults, setSavedResults] = useState<string[]>([]);

	// Load saved calculator data on mount
	useEffect(() => {
		if (examId) {
			const savedData = localStorage.getItem(`calculator-${examId}`);
			if (savedData) {
				try {
					const data = JSON.parse(savedData);
					setCalcDisplay(data.display || "0");
					setCalcValue(data.value || "");
					setCalcHistory(data.history || []);
					setIsRadianMode(data.isRadianMode !== false);
					setSavedResults(data.savedResults || []);
				} catch (error) {
					console.error("Failed to load calculator data:", error);
				}
			}
		}
	}, [examId]);

	// Save calculator data with debouncing to prevent excessive localStorage writes
	useEffect(() => {
		if (!examId) return;

		const timeoutId = setTimeout(() => {
			const data = {
				display: calcDisplay,
				value: calcValue,
				history: calcHistory,
				isRadianMode,
				savedResults,
			};

			try {
				localStorage.setItem(`calculator-${examId}`, JSON.stringify(data));
				onDataChange?.(data);
			} catch (error) {
				console.error("Failed to save calculator data:", error);
			}
		}, 300); // 300ms debounce

		return () => clearTimeout(timeoutId);
	}, [calcDisplay, calcValue, calcHistory, isRadianMode, savedResults, examId, onDataChange]);

	// Refs for keyboard event handling
	const appendToCalcRef = useRef<((value: string) => void) | null>(null);
	const calculateRef = useRef<(() => void) | null>(null);
	const clearCalcRef = useRef<(() => void) | null>(null);
	const deleteLastRef = useRef<(() => void) | null>(null);

	// Register keyboard event listener once
	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			const key = event.key;

			// Prevent default for calculator keys
			if (/[0-9+\-*/.=]/.test(key) || key === "Enter" || key === "Escape" || key === "Backspace") {
				event.preventDefault();
			}

			// Handle numeric keys
			if (/[0-9.]/.test(key)) {
				appendToCalcRef.current?.(key);
			}
			// Handle operators
			else if (key === "+") {
				appendToCalcRef.current?.("+");
			} else if (key === "-") {
				appendToCalcRef.current?.("-");
			} else if (key === "*") {
				appendToCalcRef.current?.("*");
			} else if (key === "/") {
				appendToCalcRef.current?.("/");
			}
			// Handle special keys
			else if (key === "Enter" || key === "=") {
				calculateRef.current?.();
			} else if (key === "Escape") {
				clearCalcRef.current?.();
			} else if (key === "Backspace") {
				deleteLastRef.current?.();
			}
		};

		document.addEventListener("keydown", handleKeyPress);
		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, []); // Empty dependency array - only register once

	const appendToCalc = useCallback(
		(value: string) => {
			if (calcDisplay === "0" && value !== "." && !isNaN(Number(value))) {
				setCalcValue(value);
				setCalcDisplay(value);
			} else if (calcDisplay === "Error") {
				setCalcValue(value);
				setCalcDisplay(value);
			} else {
				const newValue = calcValue + value;
				setCalcValue(newValue);
				setCalcDisplay(newValue);
			}
		},
		[calcDisplay, calcValue]
	);

	const clearCalc = useCallback(() => {
		setCalcValue("");
		setCalcDisplay("0");
	}, []);

	const deleteLast = useCallback(() => {
		const newValue = calcValue.slice(0, -1);
		setCalcValue(newValue);
		setCalcDisplay(newValue || "0");
	}, [calcValue]);

	const calculate = useCallback(() => {
		if (!calcValue.trim()) return;

		try {
			// Configure mathjs for faster calculation with lower precision
			const config = {
				number: "number", // Use regular numbers instead of BigNumber for faster calculation
				precision: 6, // Reduced precision for faster computation
			};

			// Convert degrees to radians if needed for trig functions
			let expression = calcValue;
			if (!isRadianMode) {
				// Convert each trig function argument from degrees to radians
				// This handles sin(30), cos(45), tan(60), etc.
				expression = expression.replace(/(sin|cos|tan|asin|acos|atan)\(([^)]+)\)/g, (match, func, arg) => {
					return `${func}((${arg}) * pi / 180)`;
				});
			}

			const result = evaluate(expression, config);

			// Since we're using regular numbers now, no need for BigNumber conversion
			const numResult = result;

			// Round very small numbers to 0 to handle floating point precision issues
			const roundedResult = Math.abs(numResult) < 1e-10 ? 0 : numResult;

			// Format the result to 3 decimal places for simpler display
			let resultStr;
			if (typeof roundedResult === "number") {
				// Round to 3 decimal places
				if (Number.isInteger(roundedResult)) {
					// If it's a whole number, display without decimal places
					resultStr = roundedResult.toString();
				} else {
					// Round to 3 decimal places and remove trailing zeros
					resultStr = parseFloat(roundedResult.toFixed(3)).toString();
				}
			} else {
				resultStr = roundedResult.toString();
			}

			// Add to history
			const historyEntry = `${calcValue} = ${resultStr}`;
			setCalcHistory((prev) => [...prev.slice(-9), historyEntry]); // Keep last 10 entries

			// Automatically save result to the right panel
			setSavedResults((prev) => [...prev.slice(-9), historyEntry]); // Keep last 10 results

			setCalcValue(resultStr);
			setCalcDisplay(resultStr);
		} catch (error) {
			setCalcDisplay(`Error: ${error}`);
			// Don't clear calcValue so user can fix the expression
		}
	}, [calcValue, isRadianMode]);

	const insertFunction = useCallback(
		(func: string) => {
			appendToCalc(func);
		},
		[appendToCalc]
	);

	const insertConstant = useCallback(
		(constant: string) => {
			appendToCalc(constant);
		},
		[appendToCalc]
	);

	const clearSavedResults = useCallback(() => {
		setSavedResults([]);
	}, []);

	const deleteSavedResult = useCallback((index: number) => {
		setSavedResults((prev) => prev.filter((_, i) => i !== index));
	}, []);

	// Update refs when functions change
	useEffect(() => {
		appendToCalcRef.current = appendToCalc;
		calculateRef.current = calculate;
		clearCalcRef.current = clearCalc;
		deleteLastRef.current = deleteLast;
	});

	return (
		<div className="w-full h-full">
			<div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 h-full flex flex-col shadow-inner">
				<div className="flex items-center justify-between mb-4 flex-shrink-0">
					<h4 className="text-xl font-bold text-gray-800">Calculator</h4>
					<div className="flex items-center gap-3">
						{/* RAD/DEG Toggle Switch */}
						<div className="flex items-center gap-2">
							<span className="text-xs font-medium text-gray-600">DEG</span>
							<button
								onClick={() => setIsRadianMode(!isRadianMode)}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
									isRadianMode ? "bg-gray-600" : "bg-gray-300"
								}`}
							>
								<span
									className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
										isRadianMode ? "translate-x-6" : "translate-x-1"
									}`}
								/>
							</button>
							<span className="text-xs font-medium text-gray-600">RAD</span>
						</div>
					</div>
				</div>

				{/* Calculator Layout - 2 Columns */}
				<div className="flex-1 flex gap-4">
					{/* Left Column - Calculator */}
					<div className="flex-1 flex flex-col">
						<div className="grid grid-cols-4 gap-2 text-base flex-1">
							<div
								className="col-span-4 p-4 mb-3 text-right text-2xl font-mono bg-gradient-to-r from-gray-900 to-gray-800 
								text-green-400 rounded-xl border-2 border-gray-700 shadow-inner min-h-[60px] 
								flex items-center justify-end overflow-hidden"
							>
								<span className="truncate">{calcDisplay}</span>
							</div>
							<button
								onClick={() => appendToCalc("/")}
								className="h-12 bg-gray-600 text-white rounded-xl hover:bg-gray-700 
								font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer"
							>
								÷
							</button>
							<button
								onClick={() => appendToCalc("*")}
								className="h-12 bg-gray-600 text-white rounded-xl hover:bg-gray-700 
								font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer"
							>
								×
							</button>
							<button
								onClick={() => appendToCalc("-")}
								className="h-12 bg-gray-600 text-white rounded-xl hover:bg-gray-700 
								font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer"
							>
								−
							</button>
							<button
								onClick={() => appendToCalc("+")}
								className="h-12 bg-gray-600 text-white rounded-xl hover:bg-gray-700 
								font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer"
							>
								+
							</button>
							<button
								onClick={() => appendToCalc("7")}
								className="h-12 bg-gray-50 text-gray-900 rounded-xl hover:bg-gray-100 border-2 border-gray-300 
								font-semibold text-lg transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
							>
								7
							</button>
							<button
								onClick={() => appendToCalc("8")}
								className="h-12 bg-gray-50 text-gray-900 rounded-xl hover:bg-gray-100 border-2 border-gray-300 
								font-semibold text-lg transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
							>
								8
							</button>
							<button
								onClick={() => appendToCalc("9")}
								className="h-12 bg-gray-50 text-gray-900 rounded-xl hover:bg-gray-100 border-2 border-gray-300 
								font-semibold text-lg transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
							>
								9
							</button>
							<button
								onClick={deleteLast}
								className="h-12 bg-orange-500 text-white rounded-xl hover:bg-orange-600 
								font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer
								border-2 border-orange-400 hover:border-orange-500"
							>
								⌫
							</button>
							<button
								onClick={() => appendToCalc("4")}
								className="h-12 bg-gray-50 text-gray-900 rounded-xl hover:bg-gray-100 border-2 border-gray-300 
								font-semibold text-lg transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
							>
								4
							</button>
							<button
								onClick={() => appendToCalc("5")}
								className="h-12 bg-gray-50 text-gray-900 rounded-xl hover:bg-gray-100 border-2 border-gray-300 
								font-semibold text-lg transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
							>
								5
							</button>
							<button
								onClick={() => appendToCalc("6")}
								className="h-12 bg-gray-50 text-gray-900 rounded-xl hover:bg-gray-100 border-2 border-gray-300 
								font-semibold text-lg transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
							>
								6
							</button>
							<button
								onClick={clearCalc}
								className="h-12 bg-red-500 text-white rounded-xl hover:bg-red-600 
								font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer
								border-2 border-red-400 hover:border-red-500"
							>
								C
							</button>
							<button
								onClick={() => appendToCalc("1")}
								className="h-12 bg-gray-50 text-gray-900 rounded-xl hover:bg-gray-100 border-2 border-gray-300 
								font-semibold text-lg transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
							>
								1
							</button>
							<button
								onClick={() => appendToCalc("2")}
								className="h-12 bg-gray-50 text-gray-900 rounded-xl hover:bg-gray-100 border-2 border-gray-300 
								font-semibold text-lg transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
							>
								2
							</button>
							<button
								onClick={() => appendToCalc("3")}
								className="h-12 bg-gray-50 text-gray-900 rounded-xl hover:bg-gray-100 border-2 border-gray-300 
								font-semibold text-lg transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
							>
								3
							</button>
							<button
								onClick={calculate}
								className="row-span-2 bg-gradient-to-b from-gray-800 to-gray-900 text-white rounded-xl 
								hover:from-gray-900 hover:to-black font-bold text-xl 
								transition-all duration-200 hover:shadow-xl hover:scale-105 cursor-pointer
								border-2 border-gray-600"
							>
								=
							</button>
							<button
								onClick={() => appendToCalc("0")}
								className="col-span-2 h-12 bg-gray-50 text-gray-900 rounded-xl hover:bg-gray-100 border-2 border-gray-300 
								font-semibold text-lg transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
							>
								0
							</button>
							<button
								onClick={() => appendToCalc(".")}
								className="h-12 bg-gray-50 text-gray-900 rounded-xl hover:bg-gray-100 border-2 border-gray-300 
								font-semibold text-lg transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
							>
								.
							</button>
						</div>
						{/* Advanced Math Functions */}
						<div className="mt-4 space-y-3">
							<div className="text-sm font-bold text-gray-700 mb-3 flex items-center">
								<div className="w-2 h-2 bg-gray-600 rounded-full mr-2"></div>
								Scientific Functions
							</div>
							<div className="grid grid-cols-4 gap-2">
								<button
									onClick={() => insertFunction("sqrt(")}
									className="h-10 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 border-2 border-gray-400
									font-semibold text-sm transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
								>
									√
								</button>
								<button
									onClick={() => insertFunction("^")}
									className="h-10 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 border-2 border-gray-400
									font-semibold text-sm transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
								>
									^
								</button>
								<button
									onClick={() => insertFunction("log(")}
									className="h-10 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 border-2 border-gray-400
									font-semibold text-sm transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
								>
									log
								</button>
								<button
									onClick={() => insertFunction("log10(")}
									className="h-10 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 border-2 border-gray-400
									font-semibold text-sm transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
								>
									log₁₀
								</button>
								<button
									onClick={() => insertFunction("sin(")}
									className="h-10 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 border-2 border-gray-500
									font-semibold text-sm transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
								>
									sin
								</button>
								<button
									onClick={() => insertFunction("cos(")}
									className="h-10 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 border-2 border-gray-500
									font-semibold text-sm transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
								>
									cos
								</button>
								<button
									onClick={() => insertFunction("tan(")}
									className="h-10 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 border-2 border-gray-500
									font-semibold text-sm transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
								>
									tan
								</button>
								<button
									onClick={() => insertFunction("abs(")}
									className="h-10 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 border-2 border-gray-500
									font-semibold text-sm transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
								>
									|x|
								</button>
							</div>

							<div className="text-sm font-bold text-gray-700 mb-3 flex items-center">
								<div className="w-2 h-2 bg-gray-600 rounded-full mr-2"></div>
								Constants & Others
							</div>
							<div className="grid grid-cols-4 gap-2">
								<button
									onClick={() => insertConstant("pi")}
									className="h-10 bg-gray-400 text-white rounded-lg hover:bg-gray-500 border-2 border-gray-500
									font-semibold text-sm transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
								>
									π
								</button>
								<button
									onClick={() => insertConstant("e")}
									className="h-10 bg-gray-400 text-white rounded-lg hover:bg-gray-500 border-2 border-gray-500
									font-semibold text-sm transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
								>
									e
								</button>
								<button
									onClick={() => appendToCalc("(")}
									className="h-10 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 border-2 border-gray-500
									font-semibold text-sm transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
								>
									(
								</button>
								<button
									onClick={() => appendToCalc(")")}
									className="h-10 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 border-2 border-gray-500
									font-semibold text-sm transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
								>
									)
								</button>
							</div>
						</div>
					</div>

					{/* Right Column - Saved Results */}
					<div className="w-1/3 flex flex-col h-full">
						<div className="mb-3 flex items-center justify-between flex-shrink-0">
							<h5 className="text-sm font-bold text-gray-700">Results</h5>
							<button
								onClick={clearSavedResults}
								className="text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
							>
								Clear All
							</button>
						</div>

						{/* Saved Results List */}
						<div className="flex-1 overflow-y-auto space-y-2 max-h-[400px]">
							{savedResults.length === 0 ? (
								<div className="text-xs text-gray-500 text-center py-4">No saved results</div>
							) : (
								savedResults.map((result, index) => (
									<div
										key={index}
										className="p-2 bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors
											flex items-center justify-between group"
									>
										<div
											className="text-xs font-mono text-gray-700 break-all flex-1 cursor-pointer hover:text-gray-900"
											onClick={() => {
												const resultValue = result.split(" = ")[1];
												if (resultValue) {
													setCalcValue(resultValue);
													setCalcDisplay(resultValue);
												}
											}}
											title="Click to use this result"
										>
											{result}
										</div>
										<button
											onClick={() => deleteSavedResult(index)}
											className="ml-2 w-5 h-5 flex items-center justify-center rounded-full 
												bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer
												opacity-0 group-hover:opacity-100 text-xs"
											title="Delete this result"
										>
											×
										</button>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
