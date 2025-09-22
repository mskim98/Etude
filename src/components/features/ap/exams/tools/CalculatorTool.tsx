"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { APCalculator } from "../APCalculator";
import { Calculator, X } from "lucide-react";

interface CalculatorToolProps {
	onClose: () => void;
	examId?: string;
	onDataChange?: (data: any) => void;
	onBringToFront?: () => void;
	zIndex?: number;
	isActive?: boolean;
}

export function CalculatorTool({
	onClose,
	examId,
	onDataChange,
	onBringToFront,
	zIndex = 50,
	isActive = false,
}: CalculatorToolProps) {
	const [position, setPosition] = useState({ x: 50, y: 50 });
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
					x: Math.max(0, Math.min(window.innerWidth - 600, newX)),
					y: Math.max(0, Math.min(window.innerHeight - 700, newY)),
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

	const handleModalClick = () => {
		onBringToFront?.();
	};

	return (
		<div className="fixed inset-0 pointer-events-none" style={{ zIndex }}>
			<div
				ref={modalRef}
				className="absolute bg-white rounded-lg shadow-2xl border-2 border-blue-200 pointer-events-auto overflow-hidden"
				style={{
					left: position.x,
					top: position.y,
					width: 600,
					height: 700,
					cursor: isDragging ? "grabbing" : "grab",
				}}
				onClick={handleModalClick}
			>
				<div
					className="flex items-center justify-between p-3 border-b bg-blue-50 cursor-grab active:cursor-grabbing"
					onMouseDown={handleMouseDown}
				>
					<h3 className="font-semibold text-blue-800 flex items-center">
						<Calculator className="w-4 h-4 mr-2" />
						Calculator
					</h3>
					<Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-blue-100">
						<X className="h-4 w-4" />
					</Button>
				</div>

				<div
					className="p-4 overflow-y-auto"
					style={{
						height: "calc(700px - 60px)",
						maxHeight: "calc(700px - 60px)",
					}}
				>
					<APCalculator examId={examId} onDataChange={onDataChange} isActive={isActive} />
				</div>
			</div>
		</div>
	);
}
