export interface ChapterLike {
	id?: string;
	chapterNumber?: number;
	title?: string;
	isCompleted?: boolean;
	progress?: number;
}

export function getSubjectStats(chapters: ChapterLike[]) {
	const completed = chapters.filter((c) => c.isCompleted).length;
	const avgScore = chapters
		.filter((c) => (c.progress || 0) > 0)
		.reduce((acc, c, _, arr) => acc + (c.progress || 0) / arr.length, 0);
	return { completed, total: chapters.length, avgScore: Math.round(avgScore) };
}

export function getDaysUntilExam(examDate: Date) {
	const now = new Date();
	const diffTime = examDate.getTime() - now.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays;
}
