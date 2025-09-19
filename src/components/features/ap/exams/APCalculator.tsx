"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { evaluate } from "mathjs";

interface APCalculatorProps {
	onClose: () => void;
}

export function APCalculator({ onClose }: APCalculatorProps) {
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
		<div className="w-full">
			<div className="bg-white rounded-lg p-4">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold">AP Chemistry Calculator</h3>
					<div className="flex items-center gap-2">
						<Button
							onClick={() => setIsRadianMode(!isRadianMode)}
							className={`text-xs px-2 py-1 ${isRadianMode ? "bg-blue-500 text-white" : "bg-gray-200"}`}
						>
							{isRadianMode ? "RAD" : "DEG"}
						</Button>
						<Button onClick={clearHistory} className="text-xs px-2 py-1 bg-red-500 text-white">
							Clear History
						</Button>
					</div>
				</div>

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

				<div className="grid grid-cols-4 gap-2 text-sm">
					<input
						type="text"
						value={calcDisplay}
						readOnly
						className="col-span-4 p-3 border rounded text-right text-lg font-mono bg-gray-50"
					/>
					<Button onClick={clearCalc} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
						C
					</Button>
					<Button
						onClick={() => appendToCalc("/")}
						className="p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
					>
						÷
					</Button>
					<Button
						onClick={() => appendToCalc("*")}
						className="p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
					>
						×
					</Button>
					<Button onClick={deleteLast} className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600">
						⌫
					</Button>
					<Button onClick={() => appendToCalc("7")} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
						7
					</Button>
					<Button onClick={() => appendToCalc("8")} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
						8
					</Button>
					<Button onClick={() => appendToCalc("9")} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
						9
					</Button>
					<Button
						onClick={() => appendToCalc("-")}
						className="p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
					>
						-
					</Button>
					<Button onClick={() => appendToCalc("4")} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
						4
					</Button>
					<Button onClick={() => appendToCalc("5")} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
						5
					</Button>
					<Button onClick={() => appendToCalc("6")} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
						6
					</Button>
					<Button
						onClick={() => appendToCalc("+")}
						className="p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
					>
						+
					</Button>
					<Button onClick={() => appendToCalc("1")} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
						1
					</Button>
					<Button onClick={() => appendToCalc("2")} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
						2
					</Button>
					<Button onClick={() => appendToCalc("3")} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
						3
					</Button>
					<Button onClick={calculate} className="row-span-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
						=
					</Button>
					<Button onClick={() => appendToCalc("0")} className="col-span-2 p-2 bg-gray-200 rounded hover:bg-gray-300">
						0
					</Button>
					<Button onClick={() => appendToCalc(".")} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
						.
					</Button>
				</div>
				{/* Advanced Math Functions */}
				<div className="mt-4 space-y-3">
					<div className="text-xs font-semibold text-gray-700 mb-2">과학 함수</div>
					<div className="grid grid-cols-4 gap-1">
						<Button
							onClick={() => insertFunction("sqrt(")}
							className="p-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs"
						>
							√
						</Button>
						<Button
							onClick={() => insertFunction("^")}
							className="p-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs"
						>
							x^y
						</Button>
						<Button
							onClick={() => insertFunction("log(")}
							className="p-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs"
						>
							ln
						</Button>
						<Button
							onClick={() => insertFunction("log10(")}
							className="p-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs"
						>
							log
						</Button>
						<Button
							onClick={() => insertFunction("sin(")}
							className="p-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
						>
							sin
						</Button>
						<Button
							onClick={() => insertFunction("cos(")}
							className="p-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
						>
							cos
						</Button>
						<Button
							onClick={() => insertFunction("tan(")}
							className="p-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
						>
							tan
						</Button>
						<Button
							onClick={() => insertFunction("abs(")}
							className="p-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
						>
							|x|
						</Button>
					</div>

					<div className="text-xs font-semibold text-gray-700 mb-2">상수 & 기타</div>
					<div className="grid grid-cols-4 gap-1">
						<Button
							onClick={() => insertConstant("pi")}
							className="p-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-xs"
						>
							π
						</Button>
						<Button
							onClick={() => insertConstant("e")}
							className="p-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-xs"
						>
							e
						</Button>
						<Button
							onClick={() => appendToCalc("(")}
							className="p-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-xs"
						>
							(
						</Button>
						<Button
							onClick={() => appendToCalc(")")}
							className="p-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-xs"
						>
							)
						</Button>
					</div>

					<div className="text-xs font-semibold text-gray-700 mb-2">화학 상수</div>
					<div className="grid grid-cols-2 gap-1">
						<Button
							onClick={() => insertConstant("8.314")}
							className="p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
							title="기체 상수 R"
						>
							R
						</Button>
						<Button
							onClick={() => insertConstant("6.022e23")}
							className="p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
							title="아보가드로 수"
						>
							NA
						</Button>
						<Button
							onClick={() => insertConstant("1.602e-19")}
							className="p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
							title="전자 전하"
						>
							e-
						</Button>
						<Button
							onClick={() => insertConstant("273.15")}
							className="p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
							title="절대온도"
						>
							K
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
