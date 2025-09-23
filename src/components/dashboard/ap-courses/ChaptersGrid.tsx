"use client";
import React from "react";
import { BookOpen } from "lucide-react";
import { APChapterCard } from "./APChapterCard";
import type { Chapter } from "@/types/ap";

/**
 * 선택된 과목의 챕터 목록을 카드 그리드로 표시합니다.
 */

interface ChaptersGridProps {
	chapters: Chapter[];
	mcqActiveMap: Record<string, boolean>;
	frqActiveMap: Record<string, boolean>;
	onStartExam?: () => void; // Optional since buttons are currently disabled
}

export function ChaptersGrid({ chapters, mcqActiveMap, frqActiveMap }: ChaptersGridProps) {
	if (!chapters || chapters.length === 0) return null;
	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<h4
					style={{ color: "var(--color-text-primary)", fontSize: "16px", fontWeight: 600 }}
					className="flex items-center"
				>
					<BookOpen className="w-4 h-4 mr-2" style={{ color: "var(--color-subject-secondary)" }} />
					Study Chapters
				</h4>
			</div>
			<div
				className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto scrollbar-custom px-4 py-2"
				style={{ maxHeight: "500px", scrollbarGutter: "stable" }}
			>
				{chapters.map((chapter: Chapter) => (
					<APChapterCard
						key={chapter.chapterNumber}
						chapterNumber={chapter.chapterNumber}
						title={chapter.title}
						mcqCount={0}
						frqCount={0}
						hasVideo={false}
						completed={chapter.isCompleted}
						score={chapter.progress}
						timeSpent={0}
						difficulty={chapter.difficulty}
						isActive={chapter.isActive}
						mcqActive={!!mcqActiveMap[chapter.id]}
						frqActive={!!frqActiveMap[chapter.id]}
					/>
				))}
			</div>
		</div>
	);
}
