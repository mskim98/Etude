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
			let query = supabase.from("ap_subject_detail_view" as any).select("*").eq("is_active", true);

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
					completedChapters: item.completed_chapters || 0,
					totalExams: item.total_exams,
					completedExams: item.completed_exams || 0,
					progress: item.chapter_completion_rate,
					examDate: item.exam_date ? new Date(item.exam_date) : new Date("2025-05-15"),
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
				.from("ap" as any)
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

			const dataAny = data as any;
			const totalChapters = dataAny.chapters?.length || 0;
			const activeChapters = dataAny.chapters?.filter((ch: any) => ch.is_active)?.length || 0;
			const progress = totalChapters > 0 ? Math.round((activeChapters / totalChapters) * 100) : 0;

			const subject: ApSubject = {
				id: dataAny.id,
				title: dataAny.title,
				description: dataAny.description,
				teacher: {
					id: dataAny.teacher.id,
					name: dataAny.teacher.name,
				},
				isActive: dataAny.is_active,
				totalChapters,
				completedChapters: 0, // TODO: 실제 사용자 진행도 계산
				totalExams: 0, // TODO: 실제 시험 수 계산
				completedExams: 0, // TODO: 실제 완료된 시험 수 계산
				progress,
				examDate: dataAny.exam_date ? new Date(dataAny.exam_date) : new Date("2024-05-15"),
				createdAt: new Date(dataAny.created_at),
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

			const { data, error } = await supabase.rpc("create_ap_subject" as any, {
				p_service_id: request.serviceId,
				p_title: request.title,
				p_description: request.description,
			} as any);

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
				.from("ap_chapter" as any)
				.select(
					`
					*,
					user_progress:user_ap_chapter(
						chapter_done,
						mcq_done,
						frq_done,
						video_done
					)
				`
				)
				.eq("subject_id", subjectId)
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
			const chapters: ApChapter[] = data.map((item: any) => {
				const userProgress = item.user_progress?.[0] || null;
				const isCompleted = userProgress?.chapter_done || false;

				// Calculate progress based on completed components
				let progress = 0;
				if (userProgress) {
					const completedComponents = [userProgress.mcq_done, userProgress.frq_done, userProgress.video_done].filter(
						Boolean
					).length;
					progress = Math.round((completedComponents / 3) * 100);
				}

				return {
					id: item.id,
					chapterNumber: item.chapter_number,
					title: item.title,
					description: item.description,
					difficulty: item.difficulty,
					isActive: item.is_active,
					isCompleted,
					progress,
				};
			});

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

			const { data, error } = await supabase.rpc("create_chapter" as any, {
				p_subject_id: request.subjectId,
				p_chapter_number: request.chapterNumber,
				p_title: request.title,
				p_description: request.description,
				p_difficulty: request.difficulty || "normal",
			} as any);

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

			// 직접 테이블 조인으로 quantity 필드 포함
			let query = supabase
				.from("ap_exam" as any)
				.select(
					`
					*,
					subject:ap(title),
					user_results:user_ap_result(
						completed_at,
						tested_at,
						correct_amount
					)
				`
				)
				.is("deleted_at", null);

			// 필터 적용
			if (filter?.subjectId) {
				query = query.eq("subject_id", filter.subjectId);
			}
			if (filter?.difficulty) {
				query = query.eq("difficulty", filter.difficulty);
			}

			const { data, error } = await query.order("created_at", { ascending: false });

			if (error) {
				console.error("❌ AP 시험 조회 오류:", error);
				throw new Error(`AP 시험을 불러오는데 실패했습니다: ${error.message}`);
			}

			if (!data || data.length === 0) {
				console.log("🎯 조회된 AP 시험이 없습니다.");
				return [];
			}

			// 데이터 변환 - VIEW에서 미리 계산된 데이터 사용
			const exams: ApExamDetailed[] = data.map((item: any) => {
				const userResults = item.user_results || [];
				const completedResults = userResults.filter((result: any) => result.completed_at !== null);
				const isCompleted = completedResults.length > 0;
				const bestScore =
					completedResults.length > 0
						? Math.max(...completedResults.map((r: any) => r.correct_amount || 0))
						: undefined;
				const attemptCount = userResults.length;

				return {
					id: item.id,
					title: item.title,
					description: item.description,
					difficulty: item.difficulty,
					duration: item.duration,
					questionCount: item.quantity || 60, // Use quantity from ap_exam table
					isActive: item.is_active,
					canTake: true, // Simplified for now
					completed: isCompleted,
					bestScore,
					attemptCount,
				};
			});

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
				.from("ap_exam" as any)
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

			const dataAny = data as any;
			const exam: ApExamDetailed = {
				id: dataAny.id,
				title: dataAny.title,
				description: dataAny.description,
				difficulty: dataAny.difficulty,
				duration: dataAny.duration,
				questionCount: dataAny.quantity,
				isActive: dataAny.is_active,
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

			const { data, error } = await supabase.rpc("create_ap_exam" as any, {
				p_subject_id: request.subjectId,
				p_title: request.title,
				p_description: request.description,
				p_duration: request.duration,
				p_quantity: request.questionCount,
				p_difficulty: request.difficulty || "normal",
			} as any);

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
				.from("ap_exam_question" as any)
				.select(
					`
					*,
					choices:ap_exam_choice (
						id,
						choice_text,
						image_url,
						is_answer,
						choice_order
					)
				`
				)
				.eq("ap_exam_id", examId)
				.is("deleted_at", null)
				.order("question_order", { ascending: true });

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
				order: item.question_order,
				question: item.question,
				passage: item.passage,
				choiceType: item.choice_type,
				difficulty: item.difficulty,
				topic: item.topic,
				choices: item.choices
					.sort((a: any, b: any) => (a.choice_order || 0) - (b.choice_order || 0))
					.map((choice: any) => ({
						id: choice.id,
						order: choice.choice_order || 0,
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
	 * 시험 답안 제출 및 채점
	 */
	async submitExamAnswers(request: SubmitExamAnswersRequest): Promise<UserApResult> {
		try {
			console.log("📝 시험 답안 제출 시작:", request.examId);

			// 1. 시험 문제와 정답 조회
			const { data: questions, error: questionsError } = await supabase
				.from("ap_exam_question" as any)
				.select(
					`
					id,
					question_order,
					topic,
					choices:ap_exam_choice (
						id,
						choice_text,
						is_answer
					)
				`
				)
				.eq("ap_exam_id", request.examId)
				.is("deleted_at", null)
				.order("question_order", { ascending: true });

			if (questionsError) {
				console.error("❌ 시험 문제 조회 오류:", questionsError);
				throw new Error(`시험 문제를 불러오는데 실패했습니다: ${questionsError.message}`);
			}

			if (!questions || questions.length === 0) {
				throw new Error("시험 문제를 찾을 수 없습니다.");
			}

			// 2. 채점 로직
			const totalQuestions = questions.length;
			let correctAnswers = 0;
			const wrongAnswers: WrongAnswer[] = [];

			questions.forEach((question: any, index: number) => {
				const userAnswerId = request.answers[index];
				const correctChoice = question.choices.find((choice: any) => choice.is_answer);
				const userChoice = question.choices.find((choice: any) => choice.id === userAnswerId);

				if (userAnswerId === correctChoice?.id) {
					correctAnswers++;
				} else {
					wrongAnswers.push({
						questionId: question.id,
						questionNumber: question.question_order || index + 1,
						question: question.question || "",
						userAnswer: userChoice?.choice_text || "Not answered",
						correctAnswer: correctChoice?.choice_text || "N/A",
						topic: question.topic || "General",
						questionType: "MCQ",
						reasoning: "이 문제를 다시 검토해보세요.",
						difficulty: (question.difficulty === "easy"
							? "Easy"
							: question.difficulty === "normal"
							? "Medium"
							: question.difficulty === "hard"
							? "Hard"
							: "Medium") as "Easy" | "Medium" | "Hard",
					});
				}
			});

			// 3. AP 점수 계산 (1-5 스케일)
			const percentage = (correctAnswers / totalQuestions) * 100;
			let apScore: number;
			if (percentage >= 75) apScore = 5;
			else if (percentage >= 60) apScore = 4;
			else if (percentage >= 45) apScore = 3;
			else if (percentage >= 30) apScore = 2;
			else apScore = 1;

			// 4. 기존 시도 레코드 찾기 및 업데이트
			const { data: existingResult, error: findError } = await supabase
				.from("user_ap_result" as any)
				.select("id")
				.eq("user_id", request.userId)
				.eq("ap_exam_id", request.examId)
				.is("completed_at", null)
				.single();

			let resultData: any;
			if (existingResult) {
				// 기존 미완료 레코드 업데이트
				const { data: updateData, error: updateError } = await supabase
					.from("user_ap_result" as any)
					.update({
						completed_at: new Date().toISOString(), // 시험 완료 시간
						duration: `${Math.floor(request.timeSpent / 60)
							.toString()
							.padStart(2, "0")}:${String(request.timeSpent % 60).padStart(2, "0")}`,
						correct_amount: correctAnswers,
						score: apScore,
					})
					.eq("id", (existingResult as any).id)
					.select()
					.single();

				if (updateError) {
					console.error("❌ 시험 결과 업데이트 오류:", updateError);
					throw new Error(`시험 결과 업데이트에 실패했습니다: ${updateError.message}`);
				}
				resultData = updateData;
			} else {
				// 새로운 레코드 생성 (fallback)
				const { data: insertData, error: insertError } = await supabase
					.from("user_ap_result" as any)
					.insert({
						user_id: request.userId,
						ap_exam_id: request.examId,
						tested_at: new Date(Date.now() - request.timeSpent * 1000).toISOString(), // 시험 시작 시간
						completed_at: new Date().toISOString(), // 시험 완료 시간
						duration: `${Math.floor(request.timeSpent / 60)
							.toString()
							.padStart(2, "0")}:${String(request.timeSpent % 60).padStart(2, "0")}`,
						correct_amount: correctAnswers,
						score: apScore,
					})
					.select()
					.single();

				if (insertError) {
					console.error("❌ 시험 결과 저장 오류:", insertError);
					throw new Error(`시험 결과 저장에 실패했습니다: ${insertError.message}`);
				}
				resultData = insertData;
			}

			// 5. 기존 틀린 답안 삭제 후 새로 저장
			// 기존 틀린 답안 삭제
			const { error: deleteError } = await supabase
				.from("user_ap_wrong_answer" as any)
				.delete()
				.eq("ap_result_id", resultData.id);

			if (deleteError) {
				console.error("❌ 기존 틀린 답안 삭제 오류:", deleteError);
				// 삭제 실패는 치명적이지 않으므로 경고만 출력
			}

			// 새로운 틀린 답안 저장
			if (wrongAnswers.length > 0) {
				const wrongAnswerInserts = wrongAnswers.map((wrongAnswer) => ({
					ap_result_id: resultData.id,
					ap_question_id: wrongAnswer.questionId,
					user_answer: wrongAnswer.userAnswer,
				}));

				const { error: wrongAnswersError } = await supabase.from("user_ap_wrong_answer" as any).insert(wrongAnswerInserts);

				if (wrongAnswersError) {
					console.error("❌ 틀린 답안 저장 오류:", wrongAnswersError);
					// 틀린 답안 저장 실패는 치명적이지 않으므로 경고만 출력
				}
			}

			// 6. 결과 반환
			const result: UserApResult = {
				id: resultData.id,
				examId: request.examId,
				userId: request.userId,
				totalQuestions,
				correctAnswers,
				score: apScore,
				timeSpent: request.timeSpent,
				completedAt: new Date(resultData.completed_at),
				wrongAnswers,
				questionTypeAnalysis: this.calculateQuestionTypeAnalysis(questions, wrongAnswers),
			};

			console.log("📝 시험 답안 제출 성공:", result);
			return result;
		} catch (error) {
			console.error("❌ ApService.submitExamAnswers 예외 발생:", error);
			throw error;
		}
	}

	/**
	 * Duration 파싱 (interval -> 초)
	 */
	private parseDuration(duration: string): number {
		try {
			// "HH:MM:SS" 형식의 duration을 초로 변환
			const parts = duration.split(":");
			if (parts.length === 3) {
				const hours = parseInt(parts[0]) || 0;
				const minutes = parseInt(parts[1]) || 0;
				const seconds = parseInt(parts[2]) || 0;
				return hours * 3600 + minutes * 60 + seconds;
			}
			// "MM:SS" 형식의 duration을 초로 변환
			if (parts.length === 2) {
				const minutes = parseInt(parts[0]) || 0;
				const seconds = parseInt(parts[1]) || 0;
				return minutes * 60 + seconds;
			}
			return 0;
		} catch (error) {
			console.error("Duration 파싱 오류:", error);
			return 0;
		}
	}

	/**
	 * 주제별 분석 계산
	 */
	private calculateQuestionTypeAnalysis(questions: any[], wrongAnswers: WrongAnswer[]) {
		console.log("🔍 주제별 분석 계산 시작:", {
			questionsCount: questions.length,
			wrongAnswersCount: wrongAnswers.length,
		});

		const topicStats: Record<string, { correct: number; total: number }> = {};

		questions.forEach((question) => {
			const topic = question.topic || "General";
			console.log(`📝 문제 ${question.question_order}: ${topic}`);

			if (!topicStats[topic]) {
				topicStats[topic] = { correct: 0, total: 0 };
			}
			topicStats[topic].total++;

			// 틀린 답안에 없는 경우 정답으로 간주
			const isWrong = wrongAnswers.some((wa) => wa.questionId === question.id);
			if (!isWrong) {
				topicStats[topic].correct++;
			}
		});

		const result = Object.entries(topicStats).map(([name, stats]) => ({
			name,
			correct: stats.correct,
			total: stats.total,
			percentage: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
		}));

		console.log("🔍 주제별 분석 결과:", result);
		return result;
	}

	/**
	 * 결과 ID로 주제별 분석 계산
	 */
	private async calculateQuestionTypeAnalysisForResult(
		resultId: string,
		examId: string,
		correctAnswers: number,
		totalQuestions: number
	) {
		try {
			console.log("🔍 결과별 주제 분석 시작:", { resultId, examId, correctAnswers, totalQuestions });

			// 틀린 답안 조회
			const { data: wrongAnswers } = await supabase
				.from("user_ap_wrong_answer" as any)
				.select("ap_question_id")
				.eq("ap_result_id", resultId);

			// 문제와 주제 정보 조회
			const { data: questions } = await supabase
				.from("ap_exam_question" as any)
				.select("id, question_order, topic")
				.eq("ap_exam_id", examId)
				.is("deleted_at", null)
				.order("question_order", { ascending: true });

			if (!questions) return [];

			const wrongQuestionIds = wrongAnswers?.map((wa: any) => wa.ap_question_id) || [];
			console.log("🔍 틀린 문제 ID들:", wrongQuestionIds);

			const topicStats: Record<string, { correct: number; total: number }> = {};

			questions.forEach((question: any) => {
				const topic = question.topic || "General";
				console.log(
					`📝 문제 ${question.question_order} (${topic}): ${wrongQuestionIds.includes(question.id) ? "틀림" : "맞음"}`
				);

				if (!topicStats[topic]) {
					topicStats[topic] = { correct: 0, total: 0 };
				}
				topicStats[topic].total++;

				// 틀린 답안에 없는 경우 정답으로 간주
				if (!wrongQuestionIds.includes(question.id)) {
					topicStats[topic].correct++;
				}
			});

			const result = Object.entries(topicStats).map(([name, stats]) => ({
				name,
				correct: stats.correct,
				total: stats.total,
				percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
			}));

			console.log("🔍 주제별 분석 결과:", result);
			return result;
		} catch (error) {
			console.error("❌ 주제별 분석 계산 오류:", error);
			return [];
		}
	}

	/**
	 * 시험 시작 시 시도 레코드 생성 또는 업데이트 (tested_at 기록)
	 */
	async startExamAttempt(examId: string): Promise<string> {
		try {
			// 현재 사용자 ID 가져오기
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				throw new Error("User not authenticated");
			}

			// 기존 미완료 시도가 있는지 확인
			const { data: existingAttempt, error: checkError } = await supabase
				.from("user_ap_result" as any)
				.select("id")
				.eq("user_id", user.id)
				.eq("ap_exam_id", examId)
				.is("completed_at", null)
				.single();

			if (existingAttempt) {
				// 기존 미완료 시도가 있으면 tested_at 업데이트
				const { error: updateError } = await supabase
					.from("user_ap_result" as any)
					.update({
						tested_at: new Date().toISOString(),
						// completed_at은 null로 유지
					})
					.eq("id", (existingAttempt as any).id);

				if (updateError) {
					console.error("❌ 기존 시도 레코드 업데이트 오류:", updateError);
					throw new Error(`기존 시도 레코드 업데이트에 실패했습니다: ${updateError.message}`);
				}

				return (existingAttempt as any).id;
			}

			// 새로운 시도 레코드 생성
			const { data: attemptData, error: insertError } = await supabase
				.from("user_ap_result" as any)
				.insert({
					user_id: user.id,
					ap_exam_id: examId,
					tested_at: new Date().toISOString(),
					// completed_at은 null로 유지 (시험 완료 시에만 설정)
				})
				.select("id")
				.single();

			if (insertError) {
				console.error("❌ 시험 시도 레코드 생성 오류:", insertError);
				throw new Error(`시험 시도 레코드 생성에 실패했습니다: ${insertError.message}`);
			}

			return (attemptData as any).id;
		} catch (error) {
			console.error("❌ 시험 시도 시작 오류:", error);
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
				.from("user_ap_result" as any)
				.select(
					`
					id,
					user_id,
					ap_exam_id,
					tested_at,
					completed_at,
					duration,
					correct_amount,
					score,
					created_at,
					updated_at,
					exam:ap_exam_id!inner (
						id,
						title,
						difficulty,
						quantity
					)
				`
				)
				.eq("user_id", currentUserId)
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
			const results: UserApResult[] = await Promise.all(
				data.map(async (item: any) => {
					const totalQuestions = item.exam?.quantity || 0;
					const correctAnswers = item.correct_amount || 0;

					// 틀린 답안 데이터 조회
					const wrongAnswers = await this.getWrongAnswersForResult(item.id);

					return {
						id: item.id,
						examId: item.ap_exam_id,
						userId: item.user_id,
						totalQuestions,
						correctAnswers,
						score: item.score || 0,
						timeSpent:
							item.tested_at && item.completed_at
								? Math.floor((new Date(item.completed_at).getTime() - new Date(item.tested_at).getTime()) / 1000)
								: 0,
						completedAt: item.completed_at ? new Date(item.completed_at) : new Date(),
						wrongAnswers,
						questionTypeAnalysis: await this.calculateQuestionTypeAnalysisForResult(
							item.id,
							item.ap_exam_id,
							correctAnswers,
							totalQuestions
						),
					};
				})
			);

			console.log("📊 사용자 시험 결과 조회 성공:", results.length, "개");
			return results;
		} catch (error) {
			console.error("❌ ApService.getUserResults 예외 발생:", error);
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
				.from("user_ap_wrong_answer" as any)
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
				questionId: item.question.id,
				questionNumber: item.question.order_field,
				question: item.question.question,
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

	/**
	 * 결과 ID로 틀린 답안 조회 (간소화된 버전)
	 */
	private async getWrongAnswersForResult(resultId: string): Promise<WrongAnswer[]> {
		try {
			console.log("❌ 결과별 틀린 답안 조회 시작:", resultId);

			// 틀린 답안 ID 조회 (사용자 답안 포함)
			const { data: wrongAnswerIds, error: wrongAnswerError } = await supabase
				.from("user_ap_wrong_answer" as any)
				.select("ap_question_id, user_answer")
				.eq("ap_result_id", resultId);

			if (wrongAnswerError) {
				console.error("❌ 틀린 답안 ID 조회 오류:", wrongAnswerError);
				return [];
			}

			if (!wrongAnswerIds || wrongAnswerIds.length === 0) {
				console.log("❌ 틀린 문제가 없습니다.");
				return [];
			}

			// 틀린 문제들의 상세 정보 조회
			const questionIds = wrongAnswerIds.map((wa: any) => wa.ap_question_id);
			const { data: questions, error: questionsError } = await supabase
				.from("ap_exam_question" as any)
				.select("id, question_order, question, topic, difficulty")
				.in("id", questionIds)
				.is("deleted_at", null);

			// 각 문제의 정답 조회
			const correctAnswers: { [questionId: string]: string } = {};
			for (const questionId of questionIds) {
				const { data: choices, error: choicesError } = await supabase
					.from("ap_exam_choice" as any)
					.select("choice_text")
					.eq("question_id", questionId)
					.eq("is_answer", true)
					.single();

				if (!choicesError && choices) {
					correctAnswers[questionId] = (choices as any).choice_text;
					console.log(`✅ 정답 조회 성공 - 문제 ${questionId}: ${(choices as any).choice_text}`);
				} else {
					console.log(`❌ 정답 조회 실패 - 문제 ${questionId}:`, choicesError);
				}
			}

			if (questionsError) {
				console.error("❌ 틀린 문제 상세 조회 오류:", questionsError);
				return [];
			}

			// 틀린 답안 데이터 생성
			const wrongAnswers: WrongAnswer[] = wrongAnswerIds.map((wa: any, index: number) => {
				const question = questions?.find((q: any) => q.id === wa.ap_question_id);
				return {
					questionId: wa.ap_question_id,
					questionNumber: (question as any)?.question_order || 0,
					question: (question as any)?.question || "",
					userAnswer: wa.user_answer || "Not answered",
					correctAnswer: correctAnswers[wa.ap_question_id] || "N/A",
					topic: (question as any)?.topic || "General",
					questionType: "MCQ" as const,
					reasoning: "이 문제를 다시 검토해보세요.",
					difficulty: ((question as any)?.difficulty === "easy"
						? "Easy"
						: (question as any)?.difficulty === "normal"
						? "Medium"
						: (question as any)?.difficulty === "hard"
						? "Hard"
						: "Medium") as "Easy" | "Medium" | "Hard",
				};
			});

			console.log("❌ 결과별 틀린 답안 조회 성공:", wrongAnswers.length, "개");
			return wrongAnswers;
		} catch (error) {
			console.error("❌ getWrongAnswersForResult 예외 발생:", error);
			return [];
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
