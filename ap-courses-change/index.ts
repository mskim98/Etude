export interface User {
	id: string;
	email: string;
	name: string;
}

export interface Subject {
	id: string;
	name: string;
	type: "AP" | "SAT";
	progress: number;
	totalChapters: number;
	completedChapters: number;
	lastScore?: number;
	icon: string;
	examDate: Date;
	sectionProgress?: {
		reading?: {
			progress: number;
			completed: boolean;
			score?: number;
		};
		writing?: {
			progress: number;
			completed: boolean;
			score?: number;
		};
		math?: {
			progress: number;
			completed: boolean;
			score?: number;
		};
	};
}

export interface APExam {
	examId: string;
	title: string;
	description: string;
	duration: number; // in minutes
	questionCount: number;
	difficulty: "Easy" | "Medium" | "Hard";
	hasExplanatoryVideo: boolean;
	videoLength?: number; // in minutes
	completed: boolean;
	score?: number; // AP score (1-5)
	attempts: number;
	averageScore: number;
	completionRate: number;
	lastAttempt?: Date;
	examDate?: Date; // AP exam date countdown
	subject: "Chemistry" | "Biology" | "Psychology"; // AP subject types
}
