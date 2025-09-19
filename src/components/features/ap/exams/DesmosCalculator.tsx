"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface DesmosCalculatorProps {
	onClose: () => void;
}

// Desmos 타입 정의
declare global {
	interface Window {
		Desmos?: {
			GraphingCalculator: (element: HTMLElement, options?: any) => any;
		};
	}
}

export function DesmosCalculator({ onClose }: DesmosCalculatorProps) {
	const calculatorRef = useRef<HTMLDivElement>(null);
	const desmosCalculatorRef = useRef<any>(null);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		// Desmos API가 이미 로드되어 있는지 확인
		if (window.Desmos) {
			initializeCalculator();
			return;
		}

		// Desmos API 스크립트 로드
		const script = document.createElement("script");
		script.src = "https://www.desmos.com/api/v1.11/calculator.js?apiKey=2c8bb554a339499fa62031c68955ae65";
		script.async = true;
		script.onload = () => {
			setIsLoaded(true);
			initializeCalculator();
		};
		script.onerror = () => {
			console.error("Failed to load Desmos API");
		};

		document.head.appendChild(script);

		return () => {
			// Cleanup
			if (desmosCalculatorRef.current) {
				desmosCalculatorRef.current.destroy();
			}
			if (script.parentNode) {
				script.parentNode.removeChild(script);
			}
		};
	}, []);

	const initializeCalculator = () => {
		if (!calculatorRef.current || !window.Desmos) return;

		try {
			desmosCalculatorRef.current = window.Desmos.GraphingCalculator(calculatorRef.current, {
				keypad: true,
				expressions: true,
				settingsMenu: true,
				zoomButtons: true,
				expressionsTopbar: true,
				autosize: true,
				lockViewport: false,
				showResetButtonOnGraphpaper: true,
				showGrid: true,
				showXAxis: true,
				showYAxis: true,
				xAxisNumbers: true,
				yAxisNumbers: true,
				polarMode: false,
				degreeMode: false,
				projectorMode: false,
				inequalityMode: false,
				lockViewport: false,
				expressionsCollapsed: false,
				administerSecretFolders: false,
				images: true,
				sliders: true,
				notes: true,
				graphpaper: true,
				expressions: true,
				settingsMenu: true,
				zoomButtons: true,
				expressionsTopbar: true,
				autosize: true,
			});

			// AP Chemistry 관련 기본 설정
			setupChemistryDefaults();
		} catch (error) {
			console.error("Failed to initialize Desmos calculator:", error);
		}
	};

	const setupChemistryDefaults = () => {
		if (!desmosCalculatorRef.current) return;

		try {
			// 기본 그래프 설정
			desmosCalculatorRef.current.setMathBounds({
				left: -10,
				right: 10,
				top: 10,
				bottom: -10,
			});

			// AP Chemistry 유용한 함수들 추가
			const chemistryFunctions = [
				// 이상기체법칙 관련
				{ latex: "y = 8.314x", label: "PV = nRT (R = 8.314)" },
				
				// pH 계산 관련
				{ latex: "y = -log(x)", label: "pH = -log[H+]" },
				
				// Arrhenius 방정식
				{ latex: "y = e^{-x}", label: "Arrhenius: k = Ae^(-Ea/RT)" },
				
				// Beer's Law
				{ latex: "y = x", label: "A = εbc (Beer's Law)" },
				
				// Van't Hoff 방정식
				{ latex: "y = 1/x", label: "ln(K2/K1) = -ΔH°/R(1/T2 - 1/T1)" },
			];

			// 기본 화학 함수들을 추가
			chemistryFunctions.forEach((func, index) => {
				desmosCalculatorRef.current.setExpression({
					id: `chemistry_${index}`,
					latex: func.latex,
					hidden: true, // 기본적으로 숨김
					label: func.label,
				});
			});
		} catch (error) {
			console.error("Failed to setup chemistry defaults:", error);
		}
	};

	const insertChemistryFunction = (latex: string, label?: string) => {
		if (!desmosCalculatorRef.current) return;

		try {
			desmosCalculatorRef.current.setExpression({
				latex,
				label,
			});
		} catch (error) {
			console.error("Failed to insert function:", error);
		}
	};

	const clearAll = () => {
		if (!desmosCalculatorRef.current) return;
		desmosCalculatorRef.current.setBlank();
	};

	const showGrid = () => {
		if (!desmosCalculatorRef.current) return;
		desmosCalculatorRef.current.updateSettings({ showGrid: true });
	};

	const hideGrid = () => {
		if (!desmosCalculatorRef.current) return;
		desmosCalculatorRef.current.updateSettings({ showGrid: false });
	};

	return (
		<div className="w-full">
			<div className="bg-white rounded-lg p-4">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold">Desmos Graphing Calculator</h3>
					<div className="flex items-center gap-2">
						<Button onClick={clearAll} className="text-xs px-2 py-1 bg-red-500 text-white">
							Clear All
						</Button>
						<Button onClick={showGrid} className="text-xs px-2 py-1 bg-blue-500 text-white">
							Show Grid
						</Button>
						<Button onClick={hideGrid} className="text-xs px-2 py-1 bg-gray-500 text-white">
							Hide Grid
						</Button>
					</div>
				</div>

				{/* AP Chemistry Quick Functions */}
				<div className="mb-4 p-3 bg-gray-50 rounded">
					<div className="text-sm font-semibold text-gray-700 mb-2">AP Chemistry Quick Functions</div>
					<div className="grid grid-cols-2 gap-2">
						<Button
							onClick={() => insertChemistryFunction("y = 8.314x", "Ideal Gas Law (PV = nRT)")}
							className="text-xs p-2 bg-blue-500 text-white hover:bg-blue-600"
						>
							Ideal Gas Law
						</Button>
						<Button
							onClick={() => insertChemistryFunction("y = -log(x)", "pH = -log[H+]")}
							className="text-xs p-2 bg-green-500 text-white hover:bg-green-600"
						>
							pH Calculation
						</Button>
						<Button
							onClick={() => insertChemistryFunction("y = e^(-x)", "Arrhenius Equation")}
							className="text-xs p-2 bg-purple-500 text-white hover:bg-purple-600"
						>
							Arrhenius
						</Button>
						<Button
							onClick={() => insertChemistryFunction("y = x", "Beer's Law")}
							className="text-xs p-2 bg-orange-500 text-white hover:bg-orange-600"
						>
							Beer's Law
						</Button>
					</div>
				</div>

				{/* Desmos Calculator Container */}
				<div className="border rounded bg-white">
					<div
						ref={calculatorRef}
						className="w-full"
						style={{ minHeight: "400px" }}
					/>
					{!isLoaded && (
						<div className="flex items-center justify-center h-96 bg-gray-100 rounded">
							<div className="text-center">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
								<p className="text-gray-600">Loading Desmos Calculator...</p>
							</div>
						</div>
					)}
				</div>

				{/* Instructions */}
				<div className="mt-4 p-3 bg-blue-50 rounded text-sm">
					<div className="font-semibold text-blue-800 mb-1">Instructions:</div>
					<ul className="text-blue-700 space-y-1 text-xs">
						<li>• Type functions directly: y = x^2, y = sin(x), y = ln(x)</li>
						<li>• Use sliders for variables: y = mx + b</li>
						<li>• Create tables: Click "+" → Table</li>
						<li>• Zoom: Mouse wheel or zoom buttons</li>
						<li>• Move graph: Click and drag</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
