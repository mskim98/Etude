"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { APGraphCalculator } from "../APGraphCalculator";
import { TrendingUp, X } from "lucide-react";

interface GraphToolProps {
	onClose: () => void;
	examId?: string;
	onDataChange?: (data: any) => void;
}

export function GraphTool({ onClose, examId, onDataChange }: GraphToolProps) {
	const [position, setPosition] = useState({ x: 100, y: 100 });
	const [size, setSize] = useState({ width: 1000, height: 740 });
	const [isDragging, setIsDragging] = useState(false);
	const [isResizing, setIsResizing] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
	const modalRef = useRef<HTMLDivElement>(null);

	// Global mouse event handlers for better stability
	React.useEffect(() => {
		const handleGlobalMouseMove = (e: MouseEvent) => {
			if (isDragging) {
				const newX = e.clientX - dragStart.x;
				const newY = e.clientY - dragStart.y;
				setPosition({
					x: Math.max(0, Math.min(window.innerWidth - 300, newX)),
					y: Math.max(0, Math.min(window.innerHeight - 200, newY)),
				});
			} else if (isResizing) {
				const deltaX = e.clientX - resizeStart.x;
				const deltaY = e.clientY - resizeStart.y;
				const newWidth = Math.max(800, Math.min(window.innerWidth - position.x - 50, resizeStart.width + deltaX));
				const newHeight = Math.max(600, Math.min(window.innerHeight - position.y - 50, resizeStart.height + deltaY));
				setSize({ width: newWidth, height: newHeight });

				// Dispatch custom event to notify graph calculator of resize
				if (modalRef.current) {
					const event = new CustomEvent("modal-resize", {
						detail: { width: newWidth, height: newHeight },
					});
					modalRef.current.dispatchEvent(event);
				}
			}
		};

		const handleGlobalMouseUp = () => {
			setIsDragging(false);
			setIsResizing(false);
		};

		if (isDragging || isResizing) {
			document.addEventListener("mousemove", handleGlobalMouseMove);
			document.addEventListener("mouseup", handleGlobalMouseUp);
			document.body.style.userSelect = "none"; // Prevent text selection during drag/resize
		}

		return () => {
			document.removeEventListener("mousemove", handleGlobalMouseMove);
			document.removeEventListener("mouseup", handleGlobalMouseUp);
			document.body.style.userSelect = "";
		};
	}, [isDragging, isResizing, dragStart, resizeStart, position]);

	const handleMouseDown = (e: React.MouseEvent) => {
		if (modalRef.current && !isResizing) {
			e.preventDefault();
			setIsDragging(true);
			setDragStart({
				x: e.clientX - position.x,
				y: e.clientY - position.y,
			});
		}
	};

	const handleResizeStart = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!isDragging) {
			setIsResizing(true);
			setResizeStart({
				x: e.clientX,
				y: e.clientY,
				width: size.width,
				height: size.height,
			});
		}
	};

	return (
		<div className="fixed inset-0 z-51 pointer-events-none">
			<div
				ref={modalRef}
				className="absolute bg-white rounded-lg shadow-2xl border-2 border-blue-200 pointer-events-auto overflow-hidden"
				style={{
					left: position.x,
					top: position.y,
					width: size.width,
					height: size.height,
					cursor: isDragging ? "grabbing" : "grab",
				}}
			>
				<div
					className="flex items-center justify-between p-3 border-b bg-blue-50 cursor-grab active:cursor-grabbing"
					onMouseDown={handleMouseDown}
				>
					<h3 className="font-semibold text-blue-800 flex items-center">
						<TrendingUp className="w-4 h-4 mr-2" />
						Graph Calculator
					</h3>
					<Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-blue-100">
						<X className="h-4 w-4" />
					</Button>
				</div>

				<div
					className="p-4 overflow-y-auto relative"
					style={{
						height: `calc(${size.height}px - 60px)`,
						maxHeight: `calc(${size.height}px - 60px)`,
					}}
				>
					<APGraphCalculator examId={examId} onDataChange={onDataChange} />
					{/* Resize handle for graph modal */}
					<div
						className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize opacity-50 hover:opacity-100"
						onMouseDown={handleResizeStart}
						style={{
							background: "linear-gradient(-45deg, transparent 30%, #3b82f6 30%, #3b82f6 70%, transparent 70%)",
						}}
					/>
				</div>
			</div>
		</div>
	);
}
