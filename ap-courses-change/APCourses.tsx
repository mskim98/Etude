import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ChapterBox } from "./ChapterBox";
import { APExamCard } from "./APExamCard";
import { BookOpen, TrendingUp, Award, FileText, ChevronRight, Clock, Target } from "lucide-react";
import type { Subject, APExam } from "../../App";

interface APCoursesProps {
	subjects: Subject[];
	apExams: APExam[];
	onStartExam: (subject: Subject) => void;
	selectedSubject?: Subject | null;
	onTabChange?: () => void;
	className?: string;
}

export function APCourses({ subjects, apExams, onStartExam, selectedSubject, onTabChange, className }: APCoursesProps) {
	const apSubjects = subjects.filter((s) => s.type === "AP");
	const [selectedCard, setSelectedCard] = useState<string | null>(null);

	// Auto-select card based on selected subject
	useEffect(() => {
		if (selectedSubject && selectedSubject.type === "AP") {
			setSelectedCard(selectedSubject.id);
		}
	}, [selectedSubject]);

	const handleCardSelect = (subjectId: string) => {
		setSelectedCard(selectedCard === subjectId ? null : subjectId);
		if (onTabChange) {
			onTabChange();
		}
	};

	// Mock chapter data for each AP subject
	const getChaptersForSubject = (subjectId: string) => {
		const chapterData = {
			"ap-chemistry": [
				{
					number: 1,
					title: "Atomic Structure and Properties",
					mcq: 25,
					frq: 5,
					hasVideo: true,
					completed: true,
					score: 88,
					timeSpent: 120,
					difficulty: "Medium" as const,
				},
				{
					number: 2,
					title: "Molecular and Ionic Compounds",
					mcq: 30,
					frq: 8,
					hasVideo: true,
					completed: true,
					score: 92,
					timeSpent: 95,
					difficulty: "Easy" as const,
				},
				{
					number: 3,
					title: "Intermolecular Forces",
					mcq: 28,
					frq: 6,
					hasVideo: true,
					completed: true,
					score: 76,
					timeSpent: 110,
					difficulty: "Hard" as const,
				},
				{
					number: 4,
					title: "Chemical Reactions",
					mcq: 35,
					frq: 10,
					hasVideo: true,
					completed: false,
					timeSpent: 45,
					difficulty: "Medium" as const,
				},
				{
					number: 5,
					title: "Kinetics",
					mcq: 32,
					frq: 7,
					hasVideo: true,
					completed: false,
					difficulty: "Hard" as const,
				},
				{
					number: 6,
					title: "Thermodynamics",
					mcq: 29,
					frq: 9,
					hasVideo: false,
					completed: false,
					difficulty: "Hard" as const,
				},
				{
					number: 7,
					title: "Equilibrium",
					mcq: 26,
					frq: 6,
					hasVideo: true,
					completed: false,
					difficulty: "Medium" as const,
				},
				{
					number: 8,
					title: "Acids and Bases",
					mcq: 24,
					frq: 5,
					hasVideo: true,
					completed: false,
					difficulty: "Medium" as const,
				},
				{
					number: 9,
					title: "Applications of Thermodynamics",
					mcq: 27,
					frq: 7,
					hasVideo: false,
					completed: false,
					difficulty: "Hard" as const,
				},
				{
					number: 10,
					title: "Electrochemistry and Redox",
					mcq: 31,
					frq: 8,
					hasVideo: true,
					completed: false,
					difficulty: "Hard" as const,
				},
				{
					number: 11,
					title: "Organic Chemistry",
					mcq: 22,
					frq: 4,
					hasVideo: true,
					completed: false,
					difficulty: "Medium" as const,
				},
				{
					number: 12,
					title: "Nuclear Chemistry",
					mcq: 18,
					frq: 3,
					hasVideo: false,
					completed: false,
					difficulty: "Easy" as const,
				},
			],
			"ap-biology": [
				{
					number: 1,
					title: "Chemistry of Life",
					mcq: 22,
					frq: 4,
					hasVideo: true,
					completed: true,
					score: 85,
					timeSpent: 105,
					difficulty: "Easy" as const,
				},
				{
					number: 2,
					title: "Cell Structure and Function",
					mcq: 28,
					frq: 6,
					hasVideo: true,
					completed: true,
					score: 79,
					timeSpent: 130,
					difficulty: "Medium" as const,
				},
				{
					number: 3,
					title: "Cellular Energetics",
					mcq: 26,
					frq: 5,
					hasVideo: true,
					completed: true,
					score: 91,
					timeSpent: 88,
					difficulty: "Medium" as const,
				},
				{
					number: 4,
					title: "Cell Communication",
					mcq: 24,
					frq: 7,
					hasVideo: true,
					completed: false,
					timeSpent: 25,
					difficulty: "Hard" as const,
				},
				{
					number: 5,
					title: "Heredity",
					mcq: 30,
					frq: 8,
					hasVideo: false,
					completed: false,
					difficulty: "Medium" as const,
				},
			],
			"ap-physics": [
				{
					number: 1,
					title: "Kinematics",
					mcq: 20,
					frq: 3,
					hasVideo: true,
					completed: true,
					score: 82,
					timeSpent: 90,
					difficulty: "Easy" as const,
				},
				{
					number: 2,
					title: "Dynamics",
					mcq: 25,
					frq: 5,
					hasVideo: true,
					completed: false,
					timeSpent: 30,
					difficulty: "Medium" as const,
				},
				{
					number: 3,
					title: "Circular Motion",
					mcq: 18,
					frq: 4,
					hasVideo: false,
					completed: false,
					difficulty: "Hard" as const,
				},
			],
			"ap-psychology": [
				{
					number: 1,
					title: "Biological Bases of Behavior",
					mcq: 24,
					frq: 4,
					hasVideo: true,
					completed: true,
					score: 78,
					timeSpent: 85,
					difficulty: "Medium" as const,
				},
				{
					number: 2,
					title: "Sensation and Perception",
					mcq: 28,
					frq: 5,
					hasVideo: true,
					completed: true,
					score: 84,
					timeSpent: 95,
					difficulty: "Medium" as const,
				},
				{
					number: 3,
					title: "Learning",
					mcq: 22,
					frq: 3,
					hasVideo: true,
					completed: false,
					timeSpent: 30,
					difficulty: "Easy" as const,
				},
				{
					number: 4,
					title: "Cognitive Psychology",
					mcq: 26,
					frq: 6,
					hasVideo: true,
					completed: false,
					difficulty: "Hard" as const,
				},
				{
					number: 5,
					title: "Developmental Psychology",
					mcq: 25,
					frq: 4,
					hasVideo: false,
					completed: false,
					difficulty: "Medium" as const,
				},
				{
					number: 6,
					title: "Personality",
					mcq: 20,
					frq: 3,
					hasVideo: true,
					completed: false,
					difficulty: "Easy" as const,
				},
				{
					number: 7,
					title: "Abnormal Psychology",
					mcq: 23,
					frq: 5,
					hasVideo: true,
					completed: false,
					difficulty: "Hard" as const,
				},
				{
					number: 8,
					title: "Treatment of Abnormal Behavior",
					mcq: 21,
					frq: 4,
					hasVideo: false,
					completed: false,
					difficulty: "Medium" as const,
				},
				{
					number: 9,
					title: "Social Psychology",
					mcq: 27,
					frq: 6,
					hasVideo: true,
					completed: false,
					difficulty: "Medium" as const,
				},
			],
		};

		return chapterData[subjectId as keyof typeof chapterData] || [];
	};

	// Get AP exam data for each subject using the provided apExams data
	const getExamsForSubject = (subjectId: string) => {
		const subjectMapping = {
			"ap-chemistry": "Chemistry",
			"ap-biology": "Biology",
			"ap-psychology": "Psychology",
		};

		const subjectName = subjectMapping[subjectId as keyof typeof subjectMapping];
		return apExams.filter((exam) => exam.subject === subjectName);
	};

	const getSubjectStats = (subjectId: string) => {
		const chapters = getChaptersForSubject(subjectId);
		const completed = chapters.filter((c) => c.completed).length;
		const avgScore = chapters.filter((c) => c.score).reduce((acc, c, _, arr) => acc + (c.score || 0) / arr.length, 0);

		return { completed, total: chapters.length, avgScore: Math.round(avgScore) };
	};

	const getDaysUntilExam = (examDate: Date) => {
		const now = new Date();
		const diffTime = examDate.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	const availableSubjects = apSubjects.filter((subject) =>
		["ap-chemistry", "ap-biology", "ap-psychology"].includes(subject.id)
	);

	const selectedSubjectData = selectedCard ? availableSubjects.find((s) => s.id === selectedCard) : null;

	return (
		<Card
			className={`border-0 shadow-sm ${className || ""}`}
			style={{
				backgroundColor: "var(--color-card-default-bg)",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<CardHeader
				className="pb-4 rounded-t-lg border"
				style={{
					backgroundColor: "var(--color-card-default-bg)",
					borderColor: "var(--color-card-border)",
					borderTop: "4px solid var(--color-accent)",
					borderTopLeftRadius: "0.75rem",
					borderTopRightRadius: "0.75rem",
				}}
			>
				<CardTitle className="flex items-center space-x-2" style={{ color: "var(--color-text-primary)" }}>
					<BookOpen className="w-5 h-5" style={{ color: "var(--color-subject-secondary)" }} />
					<span>AP Courses</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{/* Subject Cards Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					{availableSubjects.map((subject) => {
						const stats = getSubjectStats(subject.id);
						const daysUntilExam = getDaysUntilExam(subject.examDate);
						const isSelected = selectedCard === subject.id;

						return (
							<Card
								key={subject.id}
								className={`cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg border ${
									isSelected ? "ring-2 shadow-lg scale-105" : "hover:shadow-md"
								}`}
								style={{
									backgroundColor: "var(--color-card-default-bg)",
									borderColor: isSelected ? "var(--color-primary)" : "var(--color-card-border)",
									boxShadow: isSelected
										? "0 10px 25px -3px rgba(0, 145, 179, 0.2), 0 4px 6px -2px rgba(0, 145, 179, 0.1)"
										: "var(--color-card-hover-shadow)",
									ringColor: isSelected ? "var(--color-primary)" : "transparent",
								}}
								onClick={() => handleCardSelect(subject.id)}
							>
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div
												className="w-10 h-10 rounded-lg flex items-center justify-center"
												style={{
													backgroundColor: isSelected ? "var(--color-primary)" : "var(--color-subject-light)",
													color: isSelected ? "white" : "var(--color-text-primary)",
												}}
											>
												<span style={{ fontSize: "18px" }}>{subject.icon}</span>
											</div>
											<div>
												<h3
													className="font-medium"
													style={{
														color: isSelected ? "var(--color-primary)" : "var(--color-text-primary)",
														fontSize: "16px",
													}}
												>
													{subject.name.replace("AP ", "")}
												</h3>
												<p style={{ color: "var(--color-text-secondary)", fontSize: "12px" }}>AP Course</p>
											</div>
										</div>
										<ChevronRight
											className={`w-5 h-5 transition-transform duration-200 ${isSelected ? "rotate-90" : ""}`}
											style={{ color: "var(--color-text-tertiary)" }}
										/>
									</div>
								</CardHeader>

								<CardContent className="pt-0">
									{/* Progress Bar */}
									<div className="mb-4">
										<div className="flex justify-between items-center mb-2">
											<span style={{ color: "var(--color-text-secondary)", fontSize: "12px" }}>Progress</span>
											<span
												style={{
													color: "var(--color-primary)",
													fontSize: "12px",
													fontWeight: "600",
												}}
											>
												{subject.progress}%
											</span>
										</div>
										<div
											className="w-full h-2 rounded-full overflow-hidden"
											style={{ backgroundColor: "var(--color-muted)" }}
										>
											<div
												className="h-full transition-all duration-500 ease-out rounded-full"
												style={{
													width: `${subject.progress}%`,
													backgroundColor: "var(--color-primary)",
												}}
											/>
										</div>
									</div>

									{/* Stats Grid */}
									<div className="grid grid-cols-3 gap-3">
										<div className="text-center">
											<div className="font-semibold" style={{ color: "var(--color-text-primary)", fontSize: "14px" }}>
												{stats.completed}/{stats.total}
											</div>
											<div style={{ color: "var(--color-text-tertiary)", fontSize: "10px" }}>Chapters</div>
										</div>

										<div className="text-center">
											<div className="font-semibold" style={{ color: "var(--color-text-primary)", fontSize: "14px" }}>
												{stats.avgScore || 0}%
											</div>
											<div style={{ color: "var(--color-text-tertiary)", fontSize: "10px" }}>Avg Score</div>
										</div>

										<div className="text-center">
											<div
												className="font-semibold"
												style={{
													color: daysUntilExam <= 30 ? "var(--color-status-warning)" : "var(--color-text-primary)",
													fontSize: "14px",
												}}
											>
												{daysUntilExam}d
											</div>
											<div style={{ color: "var(--color-text-tertiary)", fontSize: "10px" }}>Until Exam</div>
										</div>
									</div>

									{/* Last Score Badge */}
									{subject.lastScore && (
										<div className="mt-3 flex justify-center">
											<Badge
												className="px-2 py-1"
												style={{
													backgroundColor:
														subject.lastScore >= 4 ? "var(--color-status-success)" : "var(--color-status-warning)",
													color: "white",
													fontSize: "11px",
												}}
											>
												Last Score: {subject.lastScore}/5
											</Badge>
										</div>
									)}
								</CardContent>
							</Card>
						);
					})}

					{/* Future Expansion Card */}
					<Card
						className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 border-2 border-dashed"
						style={{
							backgroundColor: "var(--color-card-default-bg)",
							borderColor: "var(--color-card-border)",
							opacity: 0.6,
						}}
					>
						<CardHeader className="pb-3">
							<div className="flex items-center justify-center h-16">
								<div className="text-center">
									<div
										className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2"
										style={{ backgroundColor: "var(--color-muted)" }}
									>
										<span style={{ fontSize: "18px" }}>➕</span>
									</div>
									<h3 style={{ color: "var(--color-text-secondary)", fontSize: "14px" }}>More Courses</h3>
									<p style={{ color: "var(--color-text-tertiary)", fontSize: "11px" }}>Coming Soon</p>
								</div>
							</div>
						</CardHeader>
					</Card>
				</div>

				{/* Selected Subject Details */}
				{selectedSubjectData && (
					<div className="space-y-6">
						{/* Subject Overview */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
							<div
								className="p-4 rounded-lg text-center"
								style={{
									backgroundColor: "var(--color-card-default-bg)",
									border: "1px solid var(--color-card-border)",
									boxShadow: "var(--color-card-hover-shadow)",
								}}
							>
								<TrendingUp className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--color-primary)" }} />
								<div className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
									{selectedSubjectData.progress}%
								</div>
								<div style={{ color: "var(--color-text-secondary)", fontSize: "12px" }}>Progress</div>
							</div>

							<div
								className="p-4 rounded-lg text-center"
								style={{
									backgroundColor: "var(--color-card-default-bg)",
									border: "1px solid var(--color-card-border)",
									boxShadow: "var(--color-card-hover-shadow)",
								}}
							>
								<BookOpen className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--color-primary)" }} />
								<div className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
									{getSubjectStats(selectedSubjectData.id).completed}/{getSubjectStats(selectedSubjectData.id).total}
								</div>
								<div style={{ color: "var(--color-text-secondary)", fontSize: "12px" }}>Chapters</div>
							</div>

							<div
								className="p-4 rounded-lg text-center"
								style={{
									backgroundColor: "var(--color-card-default-bg)",
									border: "1px solid var(--color-card-border)",
									boxShadow: "var(--color-card-hover-shadow)",
								}}
							>
								<Award className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--color-primary)" }} />
								<div className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
									{getSubjectStats(selectedSubjectData.id).avgScore || 0}%
								</div>
								<div style={{ color: "var(--color-text-secondary)", fontSize: "12px" }}>Avg Score</div>
							</div>

							<div
								className="p-4 rounded-lg text-center"
								style={{
									backgroundColor: "var(--color-card-default-bg)",
									border: "1px solid var(--color-card-border)",
									boxShadow: "var(--color-card-hover-shadow)",
								}}
							>
								<Clock className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--color-primary)" }} />
								<div className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
									{getDaysUntilExam(selectedSubjectData.examDate)}d
								</div>
								<div style={{ color: "var(--color-text-secondary)", fontSize: "12px" }}>Until Exam</div>
							</div>
						</div>

						{/* Content Sections */}
						<div className="space-y-8">
							{/* Study Chapters */}
							<div>
								<div className="flex items-center justify-between mb-4">
									<h4
										style={{ color: "var(--color-text-primary)", fontSize: "16px", fontWeight: "600" }}
										className="flex items-center"
									>
										<BookOpen className="w-4 h-4 mr-2" style={{ color: "var(--color-subject-secondary)" }} />
										Study Chapters
									</h4>
									<Button
										variant="outline"
										size="sm"
										onClick={() => onStartExam(selectedSubjectData)}
										style={{
											borderColor: "var(--color-primary)",
											color: "var(--color-primary)",
										}}
									>
										<Target className="w-4 h-4 mr-1" />
										Start Study
									</Button>
								</div>
								<div
									className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto scrollbar-custom px-2 py-2"
									style={{ maxHeight: "calc(55vh - 100px)" }}
								>
									{getChaptersForSubject(selectedSubjectData.id).map((chapter) => (
										<ChapterBox
											key={chapter.number}
											chapterNumber={chapter.number}
											title={chapter.title}
											mcqCount={chapter.mcq}
											frqCount={chapter.frq}
											hasVideo={chapter.hasVideo}
											completed={chapter.completed}
											score={chapter.score}
											timeSpent={chapter.timeSpent}
											difficulty={chapter.difficulty}
											onClick={() => onStartExam(selectedSubjectData)}
										/>
									))}
								</div>
							</div>

							{/* AP Practice Exams */}
							{(() => {
								const exams = getExamsForSubject(selectedSubjectData.id);
								return (
									exams.length > 0 && (
										<div>
											<div className="flex items-center justify-between mb-4">
												<h4
													style={{ color: "var(--color-text-primary)", fontSize: "16px", fontWeight: "600" }}
													className="flex items-center"
												>
													<FileText className="w-4 h-4 mr-2" style={{ color: "var(--color-subject-accent)" }} />
													Practice Exams ({exams.length} available)
												</h4>
											</div>
											<div
												className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto scrollbar-custom pr-2 pb-6"
												style={{ height: "700px" }}
											>
												{exams.map((exam) => (
													<APExamCard
														key={exam.examId}
														examId={exam.examId}
														title={exam.title}
														description={exam.description}
														duration={exam.duration}
														questionCount={exam.questionCount}
														difficulty={exam.difficulty}
														hasExplanatoryVideo={exam.hasExplanatoryVideo}
														videoLength={exam.videoLength}
														completed={exam.completed}
														score={exam.score}
														attempts={exam.attempts}
														averageScore={exam.averageScore}
														completionRate={exam.completionRate}
														lastAttempt={exam.lastAttempt}
														examDate={new Date("2025-05-15")}
														subject={exam.subject}
														onStartExam={() => onStartExam(selectedSubjectData)}
														onWatchVideo={() => console.log(`Watch video for ${exam.examId}`)}
													/>
												))}
											</div>
										</div>
									)
								);
							})()}
						</div>
					</div>
				)}

				{!selectedCard && (
					<div className="text-center py-8">
						<BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" style={{ color: "var(--color-text-tertiary)" }} />
						<h3 style={{ color: "var(--color-text-secondary)", fontSize: "16px", fontWeight: "500" }}>
							Select a Course
						</h3>
						<p style={{ color: "var(--color-text-tertiary)", fontSize: "14px" }}>
							Choose an AP course above to view chapters and practice exams
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
