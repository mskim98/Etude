"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { evaluate } from "mathjs";

interface APCalculatorProps {}

export function APCalculator({}: APCalculatorProps) {
	// Calculator state
	const [calcDisplay, setCalcDisplay] = useState("0");
	const [calcValue, setCalcValue] = useState("");
	const [calcHistory, setCalcHistory] = useState<string[]>([]);
	const [isRadianMode, setIsRadianMode] = useState(true);

	const appendToCalc = (value: string) => {
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
	};

	const clearCalc = () => {
		setCalcValue("");
		setCalcDisplay("0");
	};

	const clearHistory = () => {
		setCalcHistory([]);
	};

	const deleteLast = () => {
		const newValue = calcValue.slice(0, -1);
		setCalcValue(newValue);
		setCalcDisplay(newValue || "0");
	};

	const calculate = () => {
		if (!calcValue.trim()) return;

		try {
			// Configure mathjs for the current mode
			const config = {
				number: "BigNumber",
				precision: 14,
			};

			// Convert degrees to radians if needed for trig functions
			let expression = calcValue;
			if (!isRadianMode) {
				expression = expression
					.replace(/sin\(/g, "sin(deg(")
					.replace(/cos\(/g, "cos(deg(")
					.replace(/tan\(/g, "tan(deg(");
			}

			const result = evaluate(expression, config);
			const resultStr = result.toString();

			// Add to history
			const historyEntry = `${calcValue} = ${resultStr}`;
			setCalcHistory((prev) => [...prev.slice(-9), historyEntry]); // Keep last 10 entries

			setCalcValue(resultStr);
			setCalcDisplay(resultStr);
		} catch (error) {
			setCalcDisplay(`Error: ${error}`);
			// Don't clear calcValue so user can fix the expression
		}
	};

	const insertFunction = (func: string) => {
		appendToCalc(func);
	};

	const insertConstant = (constant: string) => {
		appendToCalc(constant);
	};

	return (
		<div className="w-full h-full">
			<div className="bg-white rounded-lg p-3 h-full flex flex-col">
				<div className="flex items-center justify-between mb-3 flex-shrink-0">
					<h4 className="text-lg font-semibold">Calculator</h4>
					<div className="flex items-center gap-2">
						<Button
							onClick={() => setIsRadianMode(!isRadianMode)}
							className={`text-sm font-medium px-3 py-2 ${isRadianMode ? "bg-gray-600 text-white" : "bg-gray-200"}`}
						>
							{isRadianMode ? "RAD" : "DEG"}
						</Button>
						<Button onClick={clearHistory} className="text-sm font-medium px-3 py-2 bg-gray-600 text-white">
							Clear
						</Button>
					</div>
				</div>

				{/* Calculator Only */}
				<div className="flex-1 flex flex-col">
					{/* Calculator History */}
					{calcHistory.length > 0 && (
						<div className="mb-3 p-2 bg-gray-50 rounded text-xs max-h-20 overflow-y-auto">
							{calcHistory.map((entry, index) => (
								<div key={index} className="text-gray-600 font-mono">
									{entry}
								</div>
							))}
						</div>
					)}

					<div className="grid grid-cols-4 gap-2 text-base flex-1">
						<input
							type="text"
							value={calcDisplay}
							readOnly
							className="col-span-4 p-4 border rounded text-right text-xl font-mono bg-gray-50 mb-2"
						/>
						<Button
							onClick={clearCalc}
							className="p-3 bg-gray-600 text-white rounded hover:bg-gray-700 h-12 text-base font-medium"
						>
							C
						</Button>
						<Button
							onClick={() => appendToCalc("/")}
							className="p-3 bg-gray-500 text-white rounded hover:bg-gray-600 h-12 text-base font-medium"
						>
							÷
						</Button>
						<Button
							onClick={() => appendToCalc("*")}
							className="p-3 bg-gray-500 text-white rounded hover:bg-gray-600 h-12 text-base font-medium"
						>
							×
						</Button>
						<Button
							onClick={deleteLast}
							className="p-3 bg-gray-400 text-white rounded hover:bg-gray-500 h-12 text-base font-medium"
						>
							⌫
						</Button>
						<Button
							onClick={() => appendToCalc("7")}
							className="p-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 h-12 text-base font-medium"
						>
							7
						</Button>
						<Button
							onClick={() => appendToCalc("8")}
							className="p-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 h-12 text-base font-medium"
						>
							8
						</Button>
						<Button
							onClick={() => appendToCalc("9")}
							className="p-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 h-12 text-base font-medium"
						>
							9
						</Button>
						<Button
							onClick={() => appendToCalc("-")}
							className="p-3 bg-gray-500 text-white rounded hover:bg-gray-600 h-12 text-base font-medium"
						>
							-
						</Button>
						<Button
							onClick={() => appendToCalc("4")}
							className="p-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 h-12 text-base font-medium"
						>
							4
						</Button>
						<Button
							onClick={() => appendToCalc("5")}
							className="p-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 h-12 text-base font-medium"
						>
							5
						</Button>
						<Button
							onClick={() => appendToCalc("6")}
							className="p-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 h-12 text-base font-medium"
						>
							6
						</Button>
						<Button
							onClick={() => appendToCalc("+")}
							className="p-3 bg-gray-500 text-white rounded hover:bg-gray-600 h-12 text-base font-medium"
						>
							+
						</Button>
						<Button
							onClick={() => appendToCalc("1")}
							className="p-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 h-12 text-base font-medium"
						>
							1
						</Button>
						<Button
							onClick={() => appendToCalc("2")}
							className="p-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 h-12 text-base font-medium"
						>
							2
						</Button>
						<Button
							onClick={() => appendToCalc("3")}
							className="p-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 h-12 text-base font-medium"
						>
							3
						</Button>
						<Button
							onClick={calculate}
							className="row-span-2 p-3 bg-gray-700 text-white rounded hover:bg-gray-800 text-base font-medium"
						>
							=
						</Button>
						<Button
							onClick={() => appendToCalc("0")}
							className="col-span-2 p-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 h-12 text-base font-medium"
						>
							0
						</Button>
						<Button
							onClick={() => appendToCalc(".")}
							className="p-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 h-12 text-base font-medium"
						>
							.
						</Button>
					</div>
					{/* Advanced Math Functions */}
					<div className="mt-4 space-y-3">
						<div className="text-sm font-semibold text-gray-700 mb-2">과학 함수</div>
						<div className="grid grid-cols-4 gap-2">
							<Button
								onClick={() => insertFunction("sqrt(")}
								className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm font-medium h-10"
							>
								√
							</Button>
							<Button
								onClick={() => insertFunction("^")}
								className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm font-medium h-10"
							>
								x^y
							</Button>
							<Button
								onClick={() => insertFunction("log(")}
								className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm font-medium h-10"
							>
								ln
							</Button>
							<Button
								onClick={() => insertFunction("log10(")}
								className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm font-medium h-10"
							>
								log
							</Button>
							<Button
								onClick={() => insertFunction("sin(")}
								className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm font-medium h-10"
							>
								sin
							</Button>
							<Button
								onClick={() => insertFunction("cos(")}
								className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm font-medium h-10"
							>
								cos
							</Button>
							<Button
								onClick={() => insertFunction("tan(")}
								className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm font-medium h-10"
							>
								tan
							</Button>
							<Button
								onClick={() => insertFunction("abs(")}
								className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm font-medium h-10"
							>
								|x|
							</Button>
						</div>

						<div className="text-sm font-semibold text-gray-700 mb-2">상수 & 기타</div>
						<div className="grid grid-cols-4 gap-2">
							<Button
								onClick={() => insertConstant("pi")}
								className="p-2 bg-gray-700 text-white rounded hover:bg-gray-800 text-sm font-medium h-10"
							>
								π
							</Button>
							<Button
								onClick={() => insertConstant("e")}
								className="p-2 bg-gray-700 text-white rounded hover:bg-gray-800 text-sm font-medium h-10"
							>
								e
							</Button>
							<Button
								onClick={() => appendToCalc("(")}
								className="p-2 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm font-medium h-10"
							>
								(
							</Button>
							<Button
								onClick={() => appendToCalc(")")}
								className="p-2 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm font-medium h-10"
							>
								)
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
