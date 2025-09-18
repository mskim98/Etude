import { Database } from "./supabase";

// Learning Materials 관련 타입 정의

// AP MCQ 관련 타입
export type ApMcqRow = Database["public"]["Tables"]["ap_mcq"]["Row"];
export type ApMcqInsert = Database["public"]["Tables"]["ap_mcq"]["Insert"];
export type ApMcqUpdate = Database["public"]["Tables"]["ap_mcq"]["Update"];

// AP FRQ 관련 타입
export type ApFrqRow = Database["public"]["Tables"]["ap_frq"]["Row"];
export type ApFrqInsert = Database["public"]["Tables"]["ap_frq"]["Insert"];
export type ApFrqUpdate = Database["public"]["Tables"]["ap_frq"]["Update"];

// AP Chapter Video 관련 타입
export type ApChapterVideoRow = Database["public"]["Tables"]["ap_chapter_video"]["Row"];
export type ApChapterVideoInsert = Database["public"]["Tables"]["ap_chapter_video"]["Insert"];
export type ApChapterVideoUpdate = Database["public"]["Tables"]["ap_chapter_video"]["Update"];

// UI용 확장 타입
export interface ApMcqQuestion extends ApMcqRow {}

export interface ApFrqQuestion extends ApFrqRow {}

export interface ApChapterVideo extends ApChapterVideoRow {}

// 요청/응답 타입
export interface CreateApMcqRequest {
	chapterId: string;
	question: string;
	passage?: string;
	choiceType?: Database["public"]["Enums"]["choice_type"];
	difficulty?: Database["public"]["Enums"]["difficulty_level"];
	topic?: string;
	explanation?: string;
	orderField?: number;
}

export interface CreateApFrqRequest {
	chapterId: string;
	question: string;
	passage?: string;
	sampleAnswer?: string;
	rubric?: string;
	maxScore?: number;
	difficulty?: Database["public"]["Enums"]["difficulty_level"];
	topic?: string;
	orderField?: number;
}

export interface CreateApChapterVideoRequest {
	chapterId: string;
	title: string;
	description?: string;
	videoUrl: string;
	thumbnailUrl?: string;
	duration?: number;
	orderField?: number;
}

// 학습 자료 서비스 인터페이스
export interface LearningMaterialsService {
	// AP MCQ 관련
	getApMcqsByChapter(chapterId: string): Promise<ApMcqQuestion[]>;
	createApMcq(request: CreateApMcqRequest): Promise<string>;
	updateApMcq(mcqId: string, updates: Partial<ApMcqUpdate>): Promise<boolean>;
	deleteApMcq(mcqId: string): Promise<boolean>;

	// AP FRQ 관련
	getApFrqsByChapter(chapterId: string): Promise<ApFrqQuestion[]>;
	createApFrq(request: CreateApFrqRequest): Promise<string>;
	updateApFrq(frqId: string, updates: Partial<ApFrqUpdate>): Promise<boolean>;
	deleteApFrq(frqId: string): Promise<boolean>;

	// Video 관련
	getVideosByChapter(chapterId: string): Promise<ApChapterVideo[]>;
	createVideo(request: CreateApChapterVideoRequest): Promise<string>;
	updateVideo(videoId: string, updates: Partial<ApChapterVideoUpdate>): Promise<boolean>;
	deleteVideo(videoId: string): Promise<boolean>;
}

// 필터링 및 정렬 옵션
export interface LearningMaterialsFilter {
	difficulty?: Database["public"]["Enums"]["difficulty_level"];
	topic?: string;
	isActive?: boolean;
}

export interface LearningMaterialsSort {
	field: "order_field" | "created_at" | "title" | "difficulty";
	direction: "asc" | "desc";
}

// 유틸리티 함수 타입
export type DifficultyColorClass = "text-green-600" | "text-yellow-600" | "text-red-600";
export type DifficultyBgClass = "bg-green-100" | "bg-yellow-100" | "bg-red-100";
