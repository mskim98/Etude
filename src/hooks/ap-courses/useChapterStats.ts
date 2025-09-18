import { useMemo } from "react";
import type { ApChapter } from "@/types/ap";

/**
 * 챕터 통계 및 계산된 데이터를 제공하는 훅
 */
export function useChapterStats(chapter: ApChapter) {
	return useMemo(() => {
		// 완료 상태에 따른 스타일 정보
		const completionStyle = {
			backgroundColor: chapter.isCompleted ? "#f0fdf4" : "var(--color-card-default-bg)",
			borderColor: chapter.isCompleted ? "#22c55e" : "var(--color-card-border)",
		};

		// 진행률 기반 색상
		const getProgressColor = () => {
			if (chapter.progress >= 80) return "#22c55e"; // green
			if (chapter.progress >= 60) return "#eab308"; // yellow
			if (chapter.progress > 0) return "#f97316"; // orange
			return "#6b7280"; // gray
		};

		return {
			completionStyle,
			progressColor: getProgressColor(),
			isCompleted: chapter.isCompleted,
			progressPercentage: chapter.progress,
		};
	}, [chapter.isCompleted, chapter.progress]);
}

/**
 * 여러 챕터의 통계를 제공하는 훅
 */
export function useChaptersStats(chapters: ApChapter[]) {
	return useMemo(() => {
		const completedCount = chapters.filter((ch) => ch.isCompleted).length;
		const totalCount = chapters.length;
		const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
		const averageProgress =
			totalCount > 0 ? Math.round(chapters.reduce((sum, ch) => sum + ch.progress, 0) / totalCount) : 0;

		return {
			completedCount,
			totalCount,
			completionRate,
			averageProgress,
			chapters: chapters.map((chapter) => ({
				...chapter,
				...useChapterStats(chapter),
			})),
		};
	}, [chapters]);
}
