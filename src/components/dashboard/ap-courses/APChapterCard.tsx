import React from "react";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { HelpCircle, FileText, Play, CheckCircle } from "lucide-react";
import { ChapterMask } from "./ChapterMask";

export interface APChapterCardProps {
	chapterNumber: number;
	title: string;
	mcqCount: number;
	frqCount: number;
	hasVideo: boolean;
	completed: boolean;
	score?: number;
	timeSpent?: number; // in minutes
	difficulty: "Easy" | "Medium" | "Hard";
	reviewCompleted?: boolean;
	className?: string;
	// Individual action handlers (removed - will be connected to other pages later)
	// onMcqClick?: () => void;
	// onFrqClick?: () => void;
	// onVideoClick?: () => void;
	// onReviewTestClick?: () => void;
	// onReviewResultClick?: () => void;
	// Status flags for availability
	isActive?: boolean; // chapter availability
	mcqActive?: boolean; // mcq availability
	frqActive?: boolean; // frq availability
}

export function APChapterCard({
	chapterNumber,
	title,
	mcqCount,
	frqCount,
	hasVideo,
	completed,
	difficulty,
	reviewCompleted = false,
	className,
	isActive = true,
	mcqActive = true,
	frqActive = true,
}: APChapterCardProps) {
	const getDifficultyColor = (diff: string) => {
		switch (diff) {
			case "Easy":
				return "bg-green-100 text-green-800 border-green-200";
			case "Medium":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "Hard":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	// const getScoreColor = (score: number) => {
	// 	if (score >= 80) return "text-green-600";
	// 	if (score >= 60) return "text-yellow-600";
	// 	return "text-red-600";
	// };

	return (
		<Card
			className={`transition-all shadow-sm ${className || ""}`}
			style={{
				backgroundColor: completed ? "#f0fdf4" : "var(--color-card-default-bg)", // Light green for completed
				border: completed ? "1px solid #22c55e" : "1px solid var(--color-card-border)", // Green border for completed
			}}
		>
			<CardContent className="p-4 relative">
				{/* Inactive chapter overlay */}
				<ChapterMask isVisible={!isActive} />

				<div className={`${!isActive ? "pointer-events-none select-none opacity-60" : ""}`}>
					<div className="flex items-start justify-between mb-3">
						<div className="flex items-start space-x-3 flex-1">
							<div
								className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm ${
									completed ? "bg-green-500 text-white" : "text-white"
								}`}
								style={{
									backgroundColor: completed ? "#22c55e" : "#4A9FCC", // Consistent green color
								}}
							>
								{completed ? <CheckCircle className="w-5 h-5" /> : chapterNumber}
							</div>
							<div className="flex-1 min-w-0">
								<h3 className="font-semibold text-gray-900 text-sm mb-1 min-h-[3.75rem] flex items-start">
									<span className="line-clamp-3">
										Chapter {chapterNumber}: {title}
									</span>
								</h3>
							</div>
						</div>

						{/* Badges moved to top-right corner */}
						<div className="flex flex-col items-end space-y-1 ml-2">
							<Badge variant="outline" className={`text-xs ${getDifficultyColor(difficulty)}`}>
								{difficulty}
							</Badge>
							{completed && (
								<div className="flex items-center space-x-1 text-green-600 text-xs">
									<CheckCircle className="w-3 h-3" />
									<span>Completed</span>
								</div>
							)}
						</div>
					</div>

					{/* Content boxes */}
					<div className="grid grid-cols-3 gap-2 mb-3">
						{/* MCQ Box */}
						<div
							className={`p-2 rounded border text-center transition-all min-h-[4.5rem] flex flex-col justify-center ${
								mcqActive && isActive ? "hover:shadow-sm/50" : "opacity-50"
							}`}
							style={{
								backgroundColor: mcqActive ? "#F0F8FF" : "#F5F5F5",
								borderColor: mcqActive ? "#4A9FCC40" : "#E5E5E5",
							}}
						>
							<HelpCircle className="w-4 h-4 mx-auto mb-1" style={{ color: "#4A9FCC" }} />
							<div className="text-xs font-semibold text-gray-900">{mcqCount} MCQ</div>
							<div className="text-xs text-gray-600">{mcqActive ? "Multiple Choice" : "Unavailable"}</div>
						</div>

						{/* FRQ Box */}
						<div
							className={`p-2 rounded border text-center transition-all min-h-[4.5rem] flex flex-col justify-center ${
								frqActive && isActive ? "hover:shadow-sm/50" : "opacity-50"
							}`}
							style={{
								backgroundColor: frqActive ? "#F0FFF8" : "#F5F5F5",
								borderColor: frqActive ? "#6BB6C740" : "#E5E5E5",
							}}
						>
							<FileText className="w-4 h-4 mx-auto mb-1" style={{ color: "#6BB6C7" }} />
							<div className="text-xs font-semibold text-gray-900">{frqCount} FRQ</div>
							<div className="text-xs text-gray-600">{frqActive ? "Free Response" : "Unavailable"}</div>
						</div>

						{/* Video Box */}
						<div
							className={`p-2 rounded border text-center transition-all min-h-[4.5rem] flex flex-col justify-center ${
								hasVideo && isActive ? "hover:shadow-sm/50" : "opacity-50"
							}`}
							style={{
								backgroundColor: hasVideo ? "#FFF8F0" : "#F5F5F5",
								borderColor: hasVideo ? "#8CC7D340" : "#E5E5E5",
							}}
						>
							<Play
								className="w-4 h-4 mx-auto mb-1"
								style={{
									color: hasVideo ? "#8CC7D3" : "#9CA3AF",
								}}
							/>
							<div className="text-xs font-semibold text-gray-900">{hasVideo ? "Video" : "No Video"}</div>
							<div className="text-xs text-gray-600">{hasVideo ? "Solutions" : "Coming Soon"}</div>
						</div>
					</div>

					{/* Chapter Review Buttons */}
					<div className="pt-4 border-t-2 border-gray-200">
						<div className="flex gap-2">
							<Button
								size="sm"
								variant={reviewCompleted ? "outline" : "default"}
								className="h-8 px-2 text-xs flex-1 flex items-center justify-center"
								disabled={reviewCompleted || !isActive}
							>
								{reviewCompleted ? "Review Complete" : "Review Test"}
							</Button>
							<Button
								size="sm"
								variant="outline"
								className="h-8 px-2 text-xs flex-1 flex items-center justify-center"
								disabled={!isActive}
							>
								Review Result
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
