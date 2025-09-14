import type { Database } from "./supabase";

// AP 관련 기본 타입들
export type DifficultyLevel = Database["public"]["Enums"]["difficulty_level"];
export type ChoiceType = Database["public"]["Enums"]["choice_type"];

// Supabase 테이블 타입들
export type ApRow = Database["public"]["Tables"]["ap"]["Row"];
export type ApInsert = Database["public"]["Tables"]["ap"]["Insert"];
export type ApUpdate = Database["public"]["Tables"]["ap"]["Update"];

export type ChapterRow = Database["public"]["Tables"]["chapter"]["Row"];
export type ChapterInsert = Database["public"]["Tables"]["chapter"]["Insert"];
export type ChapterUpdate = Database["public"]["Tables"]["chapter"]["Update"];

export type ApExamRow = Database["public"]["Tables"]["ap_exam"]["Row"];
export type ApExamInsert = Database["public"]["Tables"]["ap_exam"]["Insert"];
export type ApExamUpdate = Database["public"]["Tables"]["ap_exam"]["Update"];

export type ApExamQuestionRow = Database["public"]["Tables"]["ap_exam_question"]["Row"];
export type ApExamQuestionInsert = Database["public"]["Tables"]["ap_exam_question"]["Insert"];
export type ApExamQuestionUpdate = Database["public"]["Tables"]["ap_exam_question"]["Update"];

export type ApExamChoiceRow = Database["public"]["Tables"]["ap_exam_choice"]["Row"];
export type ApExamChoiceInsert = Database["public"]["Tables"]["ap_exam_choice"]["Insert"];
export type ApExamChoiceUpdate = Database["public"]["Tables"]["ap_exam_choice"]["Update"];

export type UserApResultRow = Database["public"]["Tables"]["user_ap_result"]["Row"];
export type UserApResultInsert = Database["public"]["Tables"]["user_ap_result"]["Insert"];
export type UserApResultUpdate = Database["public"]["Tables"]["user_ap_result"]["Update"];

export type UserApWrongAnswerRow = Database["public"]["Tables"]["user_ap_wrong_answer"]["Row"];
export type UserApWrongAnswerInsert = Database["public"]["Tables"]["user_ap_wrong_answer"]["Insert"];
export type UserApWrongAnswerUpdate = Database["public"]["Tables"]["user_ap_wrong_answer"]["Update"];

// UI용 확장 타입들

/**
 * AP 과목 정보 (UI 표시용)
 */
export interface ApSubject {
  /** 과목 ID */
  id: string;
  /** 과목명 */
  title: string;
  /** 과목 설명 */
  description?: string;
  /** 담당 교사 정보 */
  teacher: {
    id: string;
    name: string;
  };
  /** 활성 상태 */
  isActive: boolean;
  /** 총 챕터 수 */
  totalChapters: number;
  /** 완료된 챕터 수 */
  completedChapters: number;
  /** 진행률 (0-100) */
  progress: number;
  /** 생성일 */
  createdAt: Date;
}

/**
 * 챕터 정보 (UI 표시용)
 */
export interface Chapter {
  /** 챕터 ID */
  id: string;
  /** 챕터 번호 */
  chapterNumber: number;
  /** 챕터 제목 */
  title: string;
  /** 챕터 설명 */
  description?: string;
  /** 난이도 */
  difficulty: DifficultyLevel;
  /** 활성 상태 */
  isActive: boolean;
  /** 완료 여부 */
  isCompleted: boolean;
  /** 진행률 (0-100) */
  progress: number;
}

/**
 * AP 시험 정보 (UI 표시용)
 */
export interface ApExam {
  /** 시험 ID */
  id: string;
  /** 시험명 */
  title: string;
  /** 시험 설명 */
  description: string;
  /** 난이도 */
  difficulty: DifficultyLevel;
  /** 시험 시간 (분) */
  duration: number;
  /** 문제 수 */
  questionCount: number;
  /** 활성 상태 */
  isActive: boolean;
  /** 응시 가능 여부 */
  canTake: boolean;
  /** 이전 최고 점수 */
  bestScore?: number;
  /** 응시 횟수 */
  attemptCount: number;
}

/**
 * AP 시험 문제 (UI 표시용)
 */
export interface ApExamQuestion {
  /** 문제 ID */
  id: string;
  /** 문제 순서 */
  order: number;
  /** 문제 내용 */
  question: string;
  /** 지문 */
  passage?: string;
  /** 선택지 타입 */
  choiceType: ChoiceType;
  /** 난이도 */
  difficulty: DifficultyLevel;
  /** 주제/카테고리 */
  topic?: string;
  /** 선택지 목록 */
  choices: ApExamChoice[];
  /** 해설 (시험 완료 후 표시) */
  explanation?: string;
}

/**
 * AP 시험 선택지 (UI 표시용)
 */
export interface ApExamChoice {
  /** 선택지 ID */
  id: string;
  /** 선택지 순서 (A, B, C, D) */
  order: number;
  /** 텍스트 선택지 */
  text?: string;
  /** 이미지 선택지 URL */
  imageUrl?: string;
  /** 정답 여부 (시험 중에는 숨김) */
  isCorrect?: boolean;
}

/**
 * 사용자 AP 시험 결과 (UI 표시용)
 */
export interface UserApResult {
  /** 결과 ID */
  id: string;
  /** 시험 정보 */
  exam: {
    id: string;
    title: string;
    difficulty: DifficultyLevel;
  };
  /** 시험 시작 시간 */
  startedAt: Date;
  /** 시험 완료 시간 */
  completedAt?: Date;
  /** 실제 소요 시간 (분) */
  duration?: number;
  /** 맞힌 문제 수 */
  correctCount: number;
  /** 전체 문제 수 */
  totalCount: number;
  /** 점수 (백분율) */
  score: number;
  /** 완료 여부 */
  isCompleted: boolean;
  /** 정답률 */
  accuracy: number;
  /** 틀린 문제 수 */
  wrongCount: number;
}

/**
 * 틀린 문제 정보 (UI 표시용)
 */
export interface WrongAnswer {
  /** 문제 정보 */
  question: {
    id: string;
    order: number;
    content: string;
    topic?: string;
    difficulty: DifficultyLevel;
  };
  /** 사용자가 선택한 답 */
  userAnswer: string;
  /** 정답 */
  correctAnswer: string;
  /** 해설 */
  explanation?: string;
}

// AP 과목 생성/수정 요청 타입들

/**
 * AP 과목 생성 요청
 */
export interface CreateApSubjectRequest {
  /** 서비스 ID */
  serviceId: string;
  /** 과목명 */
  title: string;
  /** 과목 설명 */
  description?: string;
}

/**
 * 챕터 생성 요청
 */
export interface CreateChapterRequest {
  /** 과목 ID */
  subjectId: string;
  /** 챕터 번호 */
  chapterNumber: number;
  /** 챕터 제목 */
  title: string;
  /** 챕터 설명 */
  description?: string;
  /** 난이도 */
  difficulty?: DifficultyLevel;
}

/**
 * AP 시험 생성 요청
 */
export interface CreateApExamRequest {
  /** 과목 ID */
  subjectId: string;
  /** 시험명 */
  title: string;
  /** 시험 설명 */
  description: string;
  /** 시험 시간 (분) */
  duration: number;
  /** 문제 수 */
  questionCount: number;
  /** 난이도 */
  difficulty?: DifficultyLevel;
}

/**
 * 시험 답안 제출 요청
 */
export interface SubmitExamAnswersRequest {
  /** 시험 ID */
  examId: string;
  /** 답안 (문제 ID: 선택지 ID) */
  answers: Record<string, string>;
  /** 실제 소요 시간 (분) */
  duration?: number;
}

// 필터링 및 정렬 타입들

/**
 * AP 과목 필터
 */
export interface ApSubjectFilter {
  /** 담당 교사 ID */
  teacherId?: string;
  /** 난이도 */
  difficulty?: DifficultyLevel;
  /** 활성 상태 */
  isActive?: boolean;
  /** 검색어 (제목) */
  search?: string;
}

/**
 * AP 시험 필터
 */
export interface ApExamFilter {
  /** 과목 ID */
  subjectId?: string;
  /** 난이도 */
  difficulty?: DifficultyLevel;
  /** 활성 상태 */
  isActive?: boolean;
  /** 응시 가능 여부 */
  canTake?: boolean;
}

/**
 * 정렬 옵션
 */
export interface SortOption {
  /** 정렬 필드 */
  field: "title" | "difficulty" | "createdAt" | "progress" | "score";
  /** 정렬 방향 */
  order: "asc" | "desc";
}

// 서비스 인터페이스

/**
 * AP 서비스 인터페이스
 */
export interface ApService {
  // 과목 관련
  getSubjects(filter?: ApSubjectFilter): Promise<ApSubject[]>;
  getSubject(id: string): Promise<ApSubject | null>;
  createSubject(request: CreateApSubjectRequest): Promise<string>;
  
  // 챕터 관련
  getChapters(subjectId: string): Promise<Chapter[]>;
  createChapter(request: CreateChapterRequest): Promise<string>;
  
  // 시험 관련
  getExams(filter?: ApExamFilter): Promise<ApExam[]>;
  getExam(id: string): Promise<ApExam | null>;
  createExam(request: CreateApExamRequest): Promise<string>;
  
  // 문제 관련
  getExamQuestions(examId: string): Promise<ApExamQuestion[]>;
  
  // 결과 관련
  getUserResults(userId?: string): Promise<UserApResult[]>;
  submitExamAnswers(request: SubmitExamAnswersRequest): Promise<string>;
  getWrongAnswers(resultId: string): Promise<WrongAnswer[]>;
}
