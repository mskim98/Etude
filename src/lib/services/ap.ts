/**
 * AP 서비스 레이어
 * AP 과목, 챕터, 시험, 결과 관련 비즈니스 로직 처리
 */

import { supabase } from "@/lib/supabase";
import type {
	ApService,
	ApSubject,
	ApChapter,
	ApExamDetailed,
	ApExamQuestion,
	UserApResult,
	WrongAnswer,
	CreateApSubjectRequest,
	CreateChapterRequest,
	CreateApExamRequest,
	SubmitExamAnswersRequest,
	ApSubjectFilter,
	ApExamFilter,
	DifficultyLevel,
	ApRow,
	ChapterRow,
	ApExamRow,
	ApExamQuestionRow,
	ApExamChoiceRow,
	UserApResultRow,
} from "@/types";

/**
 * AP 서비스 구현 클래스
 */
export class ApServiceImpl implements ApService {
	/**
	 * AP 과목 목록 조회
	 */
	async getSubjects(filter?: ApSubjectFilter): Promise<ApSubject[]> {
		try {
			console.log("📚 AP 과목 목록 조회 시작:", filter);

			// 성능 최적화된 VIEW 사용
			let query = supabase.from("ap_subject_detail_view").select("*").eq("is_active", true);

			// 필터 적용
			if (filter?.teacherId) {
				query = query.eq("teacher_id", filter.teacherId);
			}
			if (filter?.search) {
				query = query.ilike("title", `%${filter.search}%`);
			}

			const { data, error } = await query;

			if (error) {
				console.error("❌ AP 과목 조회 오류:", error);
				throw new Error(`AP 과목을 불러오는데 실패했습니다: ${error.message}`);
			}

			console.log("📚 AP 과목 조회 결과:", { data, error, count: data?.length });

			if (!data || data.length === 0) {
				console.log("📚 조회된 AP 과목이 없습니다.");
				return [];
			}

			// 데이터 변환 - VIEW에서 미리 계산된 데이터 사용
			const subjects: ApSubject[] = data.map((item: any) => {
				return {
					id: item.id,
					title: item.title,
					description: item.description,
					teacher: {
						id: item.teacher_id,
						name: item.teacher_name,
					},
					isActive: item.is_active,
					totalChapters: item.total_chapters,
					completedChapters: 0, // TODO: 실제 사용자 진행도 계산
					progress: item.chapter_completion_rate,
					examDate: item.exam_date ? new Date(item.exam_date) : new Date("2024-05-15"),
					createdAt: new Date(item.created_at),
				};
			});

			console.log("📚 AP 과목 조회 성공:", subjects.length, "개");
			return subjects;
		} catch (error) {
			console.error("❌ ApService.getSubjects 예외 발생:", error);
			throw error;
		}
	}

	/**
	 * 특정 AP 과목 조회
	 */
	async getSubject(id: string): Promise<ApSubject | null> {
		try {
			console.log("📚 AP 과목 상세 조회:", id);

			const { data, error } = await supabase
				.from("ap")
				.select(
					`
					*,
					teacher:teacher_id (
						id,
						name
					),
					service:service_id (
						id,
						service_name
					),
					chapters:ap_chapter (
						id,
						is_active
					)
				`
				)
				.eq("id", id)
				.eq("is_active", true)
				.is("deleted_at", null)
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					console.log("📚 AP 과목을 찾을 수 없습니다:", id);
					return null;
				}
				throw error;
			}

			const totalChapters = data.chapters?.length || 0;
			const activeChapters = data.chapters?.filter((ch: any) => ch.is_active)?.length || 0;
			const progress = totalChapters > 0 ? Math.round((activeChapters / totalChapters) * 100) : 0;

			const subject: ApSubject = {
				id: data.id,
				title: data.title,
				description: data.description,
				teacher: {
					id: data.teacher.id,
					name: data.teacher.name,
				},
				isActive: data.is_active,
				totalChapters,
				completedChapters: 0, // TODO: 실제 사용자 진행도 계산
				progress,
				examDate: data.exam_date ? new Date(data.exam_date) : new Date("2024-05-15"),
				createdAt: new Date(data.created_at),
			};

			console.log("📚 AP 과목 상세 조회 성공:", subject.title);
			return subject;
		} catch (error) {
			console.error("❌ ApService.getSubject 예외 발생:", error);
			throw error;
		}
	}

	/**
	 * AP 과목 생성
	 */
	async createSubject(request: CreateApSubjectRequest): Promise<string> {
		try {
			console.log("📚 AP 과목 생성 시작:", request);

			const { data, error } = await supabase.rpc("create_ap_subject", {
				p_service_id: request.serviceId,
				p_title: request.title,
				p_description: request.description,
			});

			if (error) {
				console.error("❌ AP 과목 생성 오류:", error);
				throw new Error(`AP 과목 생성에 실패했습니다: ${error.message}`);
			}

			console.log("📚 AP 과목 생성 성공:", data);
			return data;
		} catch (error) {
			console.error("❌ ApService.createSubject 예외 발생:", error);
			throw error;
		}
	}

	/**
	 * 챕터 목록 조회
	 */
	async getChapters(subjectId: string): Promise<ApChapter[]> {
		try {
			console.log("📖 챕터 목록 조회 시작:", subjectId);

			const { data, error } = await supabase
				.from("ap_chapter")
				.select("*")
				.eq("subject_id", subjectId)
				// include inactive chapters as well
				/* .eq("is_active", true) */
				.is("deleted_at", null)
				.order("chapter_number", { ascending: true });

			if (error) {
				console.error("❌ 챕터 조회 오류:", error);
				throw new Error(`챕터를 불러오는데 실패했습니다: ${error.message}`);
			}

			if (!data || data.length === 0) {
				console.log("📖 조회된 챕터가 없습니다.");
				return [];
			}

			// 데이터 변환
			const chapters: ApChapter[] = data.map((item: ChapterRow) => ({
				id: item.id,
				chapterNumber: item.chapter_number,
				title: item.title,
				description: item.description,
				difficulty: item.difficulty,
				isActive: item.is_active,
				isCompleted: false, // TODO: 실제 사용자 진행도 계산
				progress: 0, // TODO: 실제 사용자 진행도 계산
			}));

			console.log("📖 챕터 조회 성공:", chapters.length, "개");
			return chapters;
		} catch (error) {
			console.error("❌ ApService.getChapters 예외 발생:", error);
			throw error;
		}
	}

	/**
	 * 챕터 생성
	 */
	async createChapter(request: CreateChapterRequest): Promise<string> {
		try {
			console.log("📖 챕터 생성 시작:", request);

			const { data, error } = await supabase.rpc("create_chapter", {
				p_subject_id: request.subjectId,
				p_chapter_number: request.chapterNumber,
				p_title: request.title,
				p_description: request.description,
				p_difficulty: request.difficulty || "normal",
			});

			if (error) {
				console.error("❌ 챕터 생성 오류:", error);
				throw new Error(`챕터 생성에 실패했습니다: ${error.message}`);
			}

			console.log("📖 챕터 생성 성공:", data);
			return data;
		} catch (error) {
			console.error("❌ ApService.createChapter 예외 발생:", error);
			throw error;
		}
	}

	/**
	 * AP 시험 목록 조회
	 */
	async getExams(filter?: ApExamFilter): Promise<ApExamDetailed[]> {
		try {
			console.log("🎯 AP 시험 목록 조회 시작:", filter);

			// 성능 최적화된 VIEW 사용
			let query = supabase.from("ap_exam_detail_view").select("*");

			// 필터 적용
			if (filter?.subjectId) {
				query = query.eq("subject_id", filter.subjectId);
			}
			if (filter?.difficulty) {
				query = query.eq("difficulty", filter.difficulty);
			}

			const { data, error } = await query;

			if (error) {
				console.error("❌ AP 시험 조회 오류:", error);
				throw new Error(`AP 시험을 불러오는데 실패했습니다: ${error.message}`);
			}

			if (!data || data.length === 0) {
				console.log("🎯 조회된 AP 시험이 없습니다.");
				return [];
			}

			// 데이터 변환 - VIEW에서 미리 계산된 데이터 사용
			const exams: ApExamDetailed[] = data.map((item: any) => ({
				id: item.id,
				title: item.title,
				description: item.description,
				difficulty: item.difficulty,
				duration: item.duration,
				questionCount: item.actual_question_count || item.declared_question_count,
				isActive: item.is_active,
				canTake: item.system_available,
				bestScore: undefined,
				attemptCount: 0,
			}));

			console.log("🎯 AP 시험 조회 성공:", exams.length, "개");
			return exams;
		} catch (error) {
			console.error("❌ ApService.getExams 예외 발생:", error);
			throw error;
		}
	}

	/**
	 * 특정 AP 시험 조회
	 */
	async getExam(id: string): Promise<ApExamDetailed | null> {
		try {
			console.log("🎯 AP 시험 상세 조회:", id);

			const { data, error } = await supabase
				.from("ap_exam")
				.select(
					`
					*,
					subject:subject_id!inner (
						id,
						title
					)
				`
				)
				.eq("id", id)
				// .eq("is_active", true) // include inactive exams
				.is("deleted_at", null)
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					console.log("🎯 AP 시험을 찾을 수 없습니다:", id);
					return null;
				}
				throw error;
			}

			const exam: ApExamDetailed = {
				id: data.id,
				title: data.title,
				description: data.description,
				difficulty: data.difficulty,
				duration: data.duration,
				questionCount: data.quantity,
				isActive: data.is_active,
				canTake: true,
				bestScore: undefined,
				attemptCount: 0,
			};

			console.log("🎯 AP 시험 상세 조회 성공:", exam.title);
			return exam;
		} catch (error) {
			console.error("❌ ApService.getExam 예외 발생:", error);
			throw error;
		}
	}

	/**
	 * AP 시험 생성
	 */
	async createExam(request: CreateApExamRequest): Promise<string> {
		try {
			console.log("🎯 AP 시험 생성 시작:", request);

			const { data, error } = await supabase.rpc("create_ap_exam", {
				p_subject_id: request.subjectId,
				p_title: request.title,
				p_description: request.description,
				p_duration: request.duration,
				p_quantity: request.questionCount,
				p_difficulty: request.difficulty || "normal",
			});

			if (error) {
				console.error("❌ AP 시험 생성 오류:", error);
				throw new Error(`AP 시험 생성에 실패했습니다: ${error.message}`);
			}

			console.log("🎯 AP 시험 생성 성공:", data);
			return data;
		} catch (error) {
			console.error("❌ ApService.createExam 예외 발생:", error);
			throw error;
		}
	}

	/**
	 * 시험 문제 목록 조회
	 */
	async getExamQuestions(examId: string): Promise<ApExamQuestion[]> {
		try {
			console.log("❓ 시험 문제 조회 시작:", examId);

			const { data, error } = await supabase
				.from("ap_exam_question")
				.select(
					`
					*,
					choices:ap_exam_choice (
						id,
						choice_text,
						image_url,
						is_answer,
						order_field
					)
				`
				)
				.eq("ap_exam_id", examId)
				.is("deleted_at", null)
				.order("order_field", { ascending: true });

			if (error) {
				console.error("❌ 시험 문제 조회 오류:", error);
				throw new Error(`시험 문제를 불러오는데 실패했습니다: ${error.message}`);
			}

			if (!data || data.length === 0) {
				console.log("❓ 조회된 시험 문제가 없습니다.");
				return [];
			}

			// 데이터 변환
			const questions: ApExamQuestion[] = data.map((item: any) => ({
				id: item.id,
				order: item.order_field,
				question: item.question,
				passage: item.passage,
				choiceType: item.choice_type,
				difficulty: item.difficulty,
				topic: item.topic,
				choices: item.choices
					.sort((a: any, b: any) => a.order_field - b.order_field)
					.map((choice: any) => ({
						id: choice.id,
						order: choice.order_field,
						text: choice.choice_text,
						imageUrl: choice.image_url,
						// 정답 여부는 시험 중에는 숨김
						// isCorrect: choice.is_answer,
					})),
				// 해설은 시험 완료 후에만 표시
				// explanation: item.explanation,
			}));

			console.log("❓ 시험 문제 조회 성공:", questions.length, "개");
			return questions;
		} catch (error) {
			console.error("❌ ApService.getExamQuestions 예외 발생:", error);
			throw error;
		}
	}

	/**
	 * 사용자 시험 결과 목록 조회
	 */
	async getUserResults(userId?: string): Promise<UserApResult[]> {
		try {
			const currentUserId = userId || (await supabase.auth.getUser()).data.user?.id;
			if (!currentUserId) {
				throw new Error("인증되지 않은 사용자입니다.");
			}

			console.log("📊 사용자 시험 결과 조회 시작:", currentUserId);

			const { data, error } = await supabase
				.from("user_ap_result")
				.select(
					`
					*,
					exam:ap_exam_id!inner (
						id,
						title,
						difficulty
					)
				`
				)
				.eq("user_id", currentUserId)
				.eq("is_completed", true)
				.order("tested_at", { ascending: false });

			if (error) {
				console.error("❌ 사용자 시험 결과 조회 오류:", error);
				throw new Error(`시험 결과를 불러오는데 실패했습니다: ${error.message}`);
			}

			if (!data || data.length === 0) {
				console.log("📊 조회된 시험 결과가 없습니다.");
				return [];
			}

			// 데이터 변환
			const results: UserApResult[] = data.map((item: any) => ({
				id: item.id,
				exam: {
					id: item.exam.id,
					title: item.exam.title,
					difficulty: item.exam.difficulty,
				},
				startedAt: new Date(item.tested_at),
				completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
				duration: item.duration ? parseInt(item.duration) : undefined,
				correctCount: item.correct_amount || 0,
				totalCount: item.total_amount,
				score: item.score || 0,
				isCompleted: item.is_completed,
				accuracy: item.total_amount > 0 ? Math.round((item.correct_amount / item.total_amount) * 100) : 0,
				wrongCount: item.total_amount - (item.correct_amount || 0),
			}));

			console.log("📊 사용자 시험 결과 조회 성공:", results.length, "개");
			return results;
		} catch (error) {
			console.error("❌ ApService.getUserResults 예외 발생:", error);
			throw error;
		}
	}

	/**
	 * 시험 답안 제출
	 */
	async submitExamAnswers(request: SubmitExamAnswersRequest): Promise<string> {
		try {
			console.log("📤 시험 답안 제출 시작:", request);

			const { data, error } = await supabase.rpc("submit_ap_exam_result", {
				p_ap_exam_id: request.examId,
				p_answers: request.answers,
				p_duration: request.duration ? `${request.duration} minutes` : null,
			});

			if (error) {
				console.error("❌ 시험 답안 제출 오류:", error);
				throw new Error(`시험 답안 제출에 실패했습니다: ${error.message}`);
			}

			console.log("📤 시험 답안 제출 성공:", data);
			return data;
		} catch (error) {
			console.error("❌ ApService.submitExamAnswers 예외 발생:", error);
			throw error;
		}
	}

	/**
	 * 틀린 문제 목록 조회
	 */
	async getWrongAnswers(resultId: string): Promise<WrongAnswer[]> {
		try {
			console.log("❌ 틀린 문제 조회 시작:", resultId);

			const { data, error } = await supabase
				.from("user_ap_wrong_answer")
				.select(
					`
					*,
					question:ap_question_id!inner (
						id,
						order_field,
						question,
						topic,
						difficulty
					)
				`
				)
				.eq("ap_result_id", resultId);

			if (error) {
				console.error("❌ 틀린 문제 조회 오류:", error);
				throw new Error(`틀린 문제를 불러오는데 실패했습니다: ${error.message}`);
			}

			if (!data || data.length === 0) {
				console.log("❌ 틀린 문제가 없습니다.");
				return [];
			}

			// 데이터 변환
			const wrongAnswers: WrongAnswer[] = data.map((item: any) => ({
				question: {
					id: item.question.id,
					order: item.question.order_field,
					content: item.question.question,
					topic: item.question.topic,
					difficulty: item.question.difficulty,
				},
				userAnswer: item.user_answer || "답 안함",
				correctAnswer: item.correct_answer || "",
				explanation: item.explanation,
			}));

			console.log("❌ 틀린 문제 조회 성공:", wrongAnswers.length, "개");
			return wrongAnswers;
		} catch (error) {
			console.error("❌ ApService.getWrongAnswers 예외 발생:", error);
			throw error;
		}
	}
}

// 싱글톤 인스턴스 생성
export const apService = new ApServiceImpl();

/**
 * 난이도별 한국어 텍스트 반환
 */
export function getDifficultyText(difficulty: DifficultyLevel): string {
	switch (difficulty) {
		case "easy":
			return "쉬움";
		case "normal":
			return "보통";
		case "hard":
			return "어려움";
		default:
			return "보통";
	}
}

/**
 * 난이도별 색상 클래스 반환
 */
export function getDifficultyColorClass(difficulty: DifficultyLevel): string {
	switch (difficulty) {
		case "easy":
			return "text-green-600 border-green-600";
		case "normal":
			return "text-yellow-600 border-yellow-600";
		case "hard":
			return "text-red-600 border-red-600";
		default:
			return "text-gray-600 border-gray-600";
	}
}

/**
 * 점수에 따른 AP 등급 계산 (1-5)
 */
export function calculateApScore(percentage: number): number {
	if (percentage >= 80) return 5;
	if (percentage >= 65) return 4;
	if (percentage >= 50) return 3;
	if (percentage >= 35) return 2;
	return 1;
}

/**
 * AP 점수에 따른 색상 클래스 반환
 */
export function getApScoreColorClass(score: number): string {
	if (score >= 4) return "text-green-600";
	if (score >= 3) return "text-yellow-600";
	return "text-red-600";
}
