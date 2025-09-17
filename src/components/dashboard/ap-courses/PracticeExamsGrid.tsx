"use client";
import React, { useMemo } from "react";
import { FileText } from "lucide-react";
import { APExamCard } from "./APExamCard";
import { Card } from "../../ui/card";

/**
 * 선택된 과목의 모의고사 목록을 카드 그리드로 표시합니다.
 */
interface PracticeExamsGridProps {
	exams: any[];
	subjectTitle: string;
	onStartExam: () => void;
}

export function PracticeExamsGrid({ exams, subjectTitle, onStartExam }: PracticeExamsGridProps) {
	if (!exams || exams.length === 0) return null;
	const sortedExams = useMemo(() => {
		const copy = [...exams];
		copy.sort((a: any, b: any) => {
			const na = parseInt(String(a.title).match(/(\d+)/)?.[1] || "0", 10);
			const nb = parseInt(String(b.title).match(/(\d+)/)?.[1] || "0", 10);
			if (na !== nb) return na - nb;
			return String(a.title).localeCompare(String(b.title));
		});
		return copy;
	}, [exams]);

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<h4
					style={{ color: "var(--color-text-primary)", fontSize: "16px", fontWeight: 600 }}
					className="flex items-center"
				>
					<FileText className="w-4 h-4 mr-2" style={{ color: "var(--color-subject-accent)" }} />
					Practice Exams
				</h4>
			</div>
			<div
				className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto scrollbar-custom px-4 pb-6"
				style={{ height: "430px", scrollbarGutter: "stable" }}
			>
				{sortedExams.map((exam: any) => (
					<APExamCard
						key={exam.id}
						examId={exam.id}
						title={exam.title}
						description={exam.description}
						duration={exam.duration}
						questionCount={exam.quantity}
						difficulty={exam.difficulty}
						hasExplanatoryVideo={false}
						videoLength={0}
						completed={false}
						score={0}
						attempts={0}
						averageScore={0}
						completionRate={0}
						lastAttempt={null}
						examDate={new Date("2025-05-15")}
						subject={subjectTitle}
						onStartExam={onStartExam}
						onWatchVideo={() => {}}
						isActive={Boolean((exam as any).isActive ?? (exam as any).is_active ?? true)}
					/>
				))}

				<Card
					className="cursor-pointer border-2 border-dashed"
					style={{
						backgroundColor: "var(--color-card-default-bg)",
						borderColor: "rgba(51, 51, 51, 0.3)",
						opacity: 0.6,
						height: "400px",
					}}
				>
					<div className="flex items-center justify-center h-full">
						<div className="text-center">
							<div
								className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3"
								style={{ backgroundColor: "var(--color-muted)" }}
							>
								<span style={{ fontSize: "20px" }}>📝</span>
							</div>
							<h3 style={{ color: "var(--color-text-primary)", fontSize: "14px", fontWeight: 500 }}>
								More Practice Exams
							</h3>
							<p style={{ color: "var(--color-text-secondary)", fontSize: "11px" }}>Coming Soon</p>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}
