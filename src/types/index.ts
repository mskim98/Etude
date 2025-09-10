export type PageType =
	| "landing"
	| "login"
	| "signup"
	| "forgot-password"
	| "dashboard"
	| "exam"
	| "sat-results"
	| "ap-results"
	| "sat-section-select"
	| "sat-detailed-results";

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

export interface Chapter {
	id: string;
	title: string;
	completed: boolean;
	mcqCount: number;
	frqCount: number;
	hasVideo: boolean;
}

export interface ExamQuestion {
	id: string;
	question: string;
	options: string[];
	correctAnswer: number;
	explanation: string;
	subject: string;
	chapter: string;
}

export interface ExamResult {
	id: string;
	subjectId: string;
	totalQuestions: number;
	correctAnswers: number;
	score: number;
	timeSpent: number;
	completedAt: Date;
	mistakes: {
		questionId: string;
		userAnswer: number;
		correctAnswer: number;
	}[];
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

export interface SATMockExam {
	examId: string;
	title: string;
	description: string;
	duration: number; // in minutes
	questionCount: number;
	difficulty: "Easy" | "Medium" | "Hard";
	hasExplanatoryVideo: boolean;
	videoLength?: number; // in minutes
	completed: boolean;
	score?: number; // SAT score (400-1600)
	attempts: number;
	averageScore: number;
	completionRate: number;
	lastAttempt?: Date;
	examDate?: Date; // SAT exam date countdown
	sections: {
		reading: {
			questionCount: number;
			timeLimit: number;
			completed: boolean;
			score?: number;
		};
		writing: {
			questionCount: number;
			timeLimit: number;
			completed: boolean;
			score?: number;
		};
		math: {
			questionCount: number;
			timeLimit: number;
			completed: boolean;
			score?: number;
		};
	};
}

export interface MockQuestion {
	id: string;
	question: string;
	options: string[];
	correctAnswer: number;
	explanation: string;
	subject: string;
	chapter: string;
	difficulty: "Easy" | "Medium" | "Hard";
	type: "MCQ" | "FRQ";
	timeLimit?: number; // in seconds
}

export interface Announcement {
	id: string;
	title: string;
	content: string;
	date: Date;
	priority: "Low" | "Medium" | "High";
	type: "General" | "Exam" | "System";
}

export interface ExamSchedule {
	id: string;
	title: string;
	date: Date;
	type: "AP" | "SAT";
	location?: string;
	duration: number;
	status: "Upcoming" | "In Progress" | "Completed";
}
