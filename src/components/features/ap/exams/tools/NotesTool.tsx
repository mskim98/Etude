"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StickyNote, X, Save } from "lucide-react";

interface NotesToolProps {
	onClose: () => void;
	notes: string;
	onNotesChange: (notes: string) => void;
	onBringToFront?: () => void;
	zIndex?: number;
	isActive?: boolean;
}

export function NotesTool({
	onClose,
	notes,
	onNotesChange,
	onBringToFront,
	zIndex = 53,
	isActive = false,
}: NotesToolProps) {
	const [position, setPosition] = useState({ x: 200, y: 200 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [localNotes, setLocalNotes] = useState(notes);
	const [isSaving, setIsSaving] = useState(false);
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

	const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newNotes = e.target.value;
		setLocalNotes(newNotes);
		onNotesChange(newNotes);
	};

	const handleSave = () => {
		setIsSaving(true);
		// Simulate save operation
		setTimeout(() => {
			setIsSaving(false);
		}, 500);
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
					width: 500,
					height: "auto",
					maxHeight: "80vh",
					cursor: isDragging ? "grabbing" : "grab",
				}}
				onClick={handleModalClick}
			>
				<div
					className="flex items-center justify-between p-3 border-b bg-blue-50 cursor-grab active:cursor-grabbing"
					onMouseDown={handleMouseDown}
				>
					<h3 className="font-semibold text-blue-800 flex items-center">
						<StickyNote className="w-4 h-4 mr-2" />
						Exam Notes
					</h3>
					<div className="flex items-center space-x-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={handleSave}
							disabled={isSaving}
							className="hover:bg-blue-100"
							title="Save notes"
						>
							<Save className="h-4 w-4" />
						</Button>
						<Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-blue-100">
							<X className="h-4 w-4" />
						</Button>
					</div>
				</div>

				<div
					className="p-4"
					style={{
						maxHeight: "calc(80vh - 60px)",
					}}
				>
					<div className="space-y-4">
						<Textarea
							value={localNotes}
							onChange={handleNotesChange}
							placeholder="Write your exam notes here..."
							className="w-full h-64 resize-none border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
						/>
						<div className="flex items-center justify-between text-xs text-gray-500">
							<span>Notes are auto-saved as you type</span>
							<span>{localNotes.length} characters</span>
						</div>
						{localNotes.length > 0 && (
							<div className="bg-yellow-50 border border-yellow-200 rounded p-3">
								<div className="text-sm text-yellow-800">
									<strong>Tip:</strong> Use this space to jot down key concepts, calculations, or thoughts during the
									exam.
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
