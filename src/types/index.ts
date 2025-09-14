// Import Supabase types with ENUM support
import type { Database } from "./supabase";

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

// Re-export Supabase Database type for convenience
export type { Database } from "./supabase";

// Convenience types from Supabase Database
export type Profile = Database["public"]["Tables"]["profile"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profile"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profile"]["Update"];

export type Service = Database["public"]["Tables"]["service"]["Row"];
export type ServiceInsert = Database["public"]["Tables"]["service"]["Insert"];
export type ServiceUpdate = Database["public"]["Tables"]["service"]["Update"];

export type UserService = Database["public"]["Tables"]["user_service"]["Row"];
export type UserServiceInsert = Database["public"]["Tables"]["user_service"]["Insert"];
export type UserServiceUpdate = Database["public"]["Tables"]["user_service"]["Update"];

export type Announcement = Database["public"]["Tables"]["announcement"]["Row"];
export type AnnouncementInsert = Database["public"]["Tables"]["announcement"]["Insert"];
export type AnnouncementUpdate = Database["public"]["Tables"]["announcement"]["Update"];

export type Schedule = Database["public"]["Tables"]["schedule"]["Row"];
export type ScheduleInsert = Database["public"]["Tables"]["schedule"]["Insert"];
export type ScheduleUpdate = Database["public"]["Tables"]["schedule"]["Update"];

// Export ENUM types for type safety
export type UserRole = Database["public"]["Enums"]["user_role"];
export type UserState = Database["public"]["Enums"]["user_state"];

// AP 관련 타입들 re-export
export type {
	// 기본 ENUM 타입들
	DifficultyLevel,
	ChoiceType,
	
	// Supabase 테이블 타입들
	ApRow,
	ApInsert,
	ApUpdate,
	ChapterRow,
	ChapterInsert,
	ChapterUpdate,
	ApExamRow,
	ApExamInsert,
	ApExamUpdate,
	ApExamQuestionRow,
	ApExamQuestionInsert,
	ApExamQuestionUpdate,
	ApExamChoiceRow,
	ApExamChoiceInsert,
	ApExamChoiceUpdate,
	UserApResultRow,
	UserApResultInsert,
	UserApResultUpdate,
	UserApWrongAnswerRow,
	UserApWrongAnswerInsert,
	UserApWrongAnswerUpdate,
	
	// UI용 확장 타입들
	ApSubject,
	Chapter as ApChapter,
	ApExam as ApExamDetailed,
	ApExamQuestion,
	ApExamChoice,
	UserApResult,
	WrongAnswer,
	
	// 요청 타입들
	CreateApSubjectRequest,
	CreateChapterRequest,
	CreateApExamRequest,
	SubmitExamAnswersRequest,
	
	// 필터 및 정렬 타입들
	ApSubjectFilter,
	ApExamFilter,
	SortOption,
	
	// 서비스 인터페이스
	ApService,
} from "./ap";

// Auth Context Types
export interface AuthUser {
	id: string;
	email: string;
	profile?: Profile;
	services?: UserService[];
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

// UI-specific types (different from database schema)
export interface UIAnnouncement {
	id: string;
	title: string;
	content: string;
	date: Date;
	priority: "Low" | "Medium" | "High";
	type: "General" | "Exam" | "System";
}

export interface UIExamSchedule {
	id: string;
	title: string;
	date: Date;
	type: "AP" | "SAT";
	location?: string;
	duration: number;
	status: "Upcoming" | "In Progress" | "Completed";
}
