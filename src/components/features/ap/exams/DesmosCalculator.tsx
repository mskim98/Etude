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
	const [loadError, setLoadError] = useState<string | null>(null);
	const [isInitializing, setIsInitializing] = useState(false);

	useEffect(() => {
		let script: HTMLScriptElement | null = null;

		const loadDesmos = async () => {
			// Desmos API가 이미 로드되어 있는지 확인
			if (window.Desmos && window.Desmos.GraphingCalculator) {
				console.log("Desmos API already loaded");
				setIsLoaded(true);
				// 약간의 지연 후 초기화 (DOM이 준비될 때까지)
				setTimeout(() => initializeCalculator(), 100);
				return;
			}

			// 이미 로딩 중이면 중복 로드 방지
			if (isInitializing) return;

			setIsInitializing(true);
			setLoadError(null);

			try {
				// Desmos API 스크립트 로드 (공식 문서에 따른 정확한 URL)
				script = document.createElement("script");
				script.src = "https://www.desmos.com/api/v1.11/calculator.js?apiKey=2c8bb554a339499fa62031c68955ae65";
				script.async = true;
				script.crossOrigin = "anonymous";
				
				script.onload = () => {
					console.log("Desmos API loaded successfully");
					// API 로드 후 약간의 지연을 두고 초기화
					setTimeout(() => {
						if (window.Desmos && window.Desmos.GraphingCalculator) {
							setIsLoaded(true);
							setIsInitializing(false);
							initializeCalculator();
						} else {
							console.error("Desmos API not properly loaded");
							setLoadError("Desmos API failed to initialize properly");
							setIsInitializing(false);
						}
					}, 200);
				};
				
				script.onerror = (error) => {
					console.error("Failed to load Desmos API:", error);
					setLoadError("Failed to load Desmos calculator. Please check your internet connection and API key.");
					setIsInitializing(false);
				};

				document.head.appendChild(script);
			} catch (error) {
				console.error("Error loading Desmos script:", error);
				setLoadError("Error loading calculator");
				setIsInitializing(false);
			}
		};

		loadDesmos();

		return () => {
			// Cleanup
			if (desmosCalculatorRef.current) {
				desmosCalculatorRef.current.destroy();
				desmosCalculatorRef.current = null;
			}
			if (script && script.parentNode) {
				script.parentNode.removeChild(script);
			}
		};
	}, []);

	const initializeCalculator = () => {
		console.log("Attempting to initialize calculator...");
		console.log("Calculator ref:", calculatorRef.current);
		console.log("Window.Desmos:", window.Desmos);
		console.log("GraphingCalculator available:", window.Desmos?.GraphingCalculator);

		if (!calculatorRef.current) {
			console.error("Calculator ref not available");
			setLoadError("Calculator container not ready");
			return;
		}

		if (!window.Desmos || !window.Desmos.GraphingCalculator) {
			console.error("Desmos API not available");
			setLoadError("Desmos API not loaded");
			return;
		}

		try {
			console.log("Initializing Desmos calculator...");
			
			// 공식 문서에 따른 기본 옵션으로 시작
			desmosCalculatorRef.current = window.Desmos.GraphingCalculator(calculatorRef.current, {
				keypad: true,
				graphpaper: true,
				expressions: true,
				settingsMenu: true,
				zoomButtons: true,
				expressionsTopbar: true,
				autosize: true,
				lockViewport: false,
				showResetButtonOnGraphpaper: false,
				showGrid: true,
				showXAxis: true,
				showYAxis: true,
				xAxisNumbers: true,
				yAxisNumbers: true,
				polarMode: false,
				degreeMode: false,
				projectorMode: false,
				inequalityMode: false,
				expressionsCollapsed: false,
				images: true,
				sliders: true,
				notes: true,
				border: true,
				pointsOfInterest: true,
				trace: true,
				capExpressionSize: false,
				authorFeatures: false,
				folders: true,
				actions: 'auto',
				substitutions: true,
				links: true,
				qwertyKeyboard: true,
				distributions: true,
				restrictedFunctions: false,
				forceEnableGeometryFunctions: false,
				pasteGraphLink: false,
				pasteTableData: true,
				clearIntoDegreeMode: false,
			});

			console.log("Desmos calculator initialized successfully");
			console.log("Calculator instance:", desmosCalculatorRef.current);
			
			// AP Chemistry 관련 기본 설정
			setTimeout(() => setupChemistryDefaults(), 500);
		} catch (error) {
			console.error("Failed to initialize Desmos calculator:", error);
			setLoadError(`Failed to initialize calculator: ${error}`);
		}
	};

	const setupChemistryDefaults = () => {
		if (!desmosCalculatorRef.current) {
			console.error("Calculator not ready for chemistry setup");
			return;
		}

		try {
			console.log("Setting up chemistry defaults...");
			
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
				{ latex: "y = -\\log(x)", label: "pH = -log[H+]" },
				
				// Arrhenius 방정식
				{ latex: "y = e^{-x}", label: "Arrhenius: k = Ae^(-Ea/RT)" },
				
				// Beer's Law
				{ latex: "y = x", label: "A = εbc (Beer's Law)" },
				
				// Van't Hoff 방정식
				{ latex: "y = \\frac{1}{x}", label: "ln(K2/K1) = -ΔH°/R(1/T2 - 1/T1)" },
			];

			// 기본 화학 함수들을 추가
			chemistryFunctions.forEach((func, index) => {
				try {
					desmosCalculatorRef.current.setExpression({
						id: `chemistry_${index}`,
						latex: func.latex,
						hidden: true, // 기본적으로 숨김
						label: func.label,
					});
				} catch (exprError) {
					console.error(`Failed to add chemistry function ${index}:`, exprError);
				}
			});
			
			console.log("Chemistry defaults setup completed");
		} catch (error) {
			console.error("Failed to setup chemistry defaults:", error);
		}
	};

	const insertChemistryFunction = (latex: string, label?: string) => {
		if (!desmosCalculatorRef.current) {
			console.error("Calculator not ready for function insertion");
			return;
		}

		try {
			console.log("Inserting chemistry function:", latex);
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
					{loadError ? (
						<div className="flex items-center justify-center h-96 bg-red-50 rounded">
							<div className="text-center">
								<div className="text-red-500 text-4xl mb-4">⚠️</div>
								<p className="text-red-600 font-medium mb-2">Failed to Load Calculator</p>
								<p className="text-red-500 text-sm mb-4">{loadError}</p>
								<Button onClick={() => window.location.reload()} className="bg-red-500 text-white hover:bg-red-600">
									Reload Page
								</Button>
							</div>
						</div>
					) : !isLoaded ? (
						<div className="flex items-center justify-center h-96 bg-gray-100 rounded">
							<div className="text-center">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
								<p className="text-gray-600">{isInitializing ? "Loading Desmos Calculator..." : "Initializing..."}</p>
								<p className="text-gray-500 text-xs mt-2">This may take a few seconds on first load</p>
							</div>
						</div>
					) : (
						<div ref={calculatorRef} className="w-full" style={{ minHeight: "400px" }} />
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
