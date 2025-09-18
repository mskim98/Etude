"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PersonalInformation } from "@/components/dashboard/PersonalInformation";
import { DateSection } from "@/components/dashboard/DateSection";
import { ExamSchedule } from "@/components/dashboard/ExamSchedule";
import { Announcements } from "@/components/dashboard/Announcements";
import { SubjectProgress } from "@/components/dashboard/SubjectProgress";
import { useAuthStore } from "@/store/auth";
import type { Subject } from "@/types";

export default function OverviewPage() {
	const router = useRouter();
	const { user } = useAuthStore();
	const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

	const handleStartExam = (subject: Subject) => {
		console.log("Starting exam for subject:", subject);
		// Navigate to exam page with subject info
		router.push(`/exam?subject=${subject.id}`);
	};

	return (
		<div className="h-full flex flex-col space-y-4" style={{ height: "calc(100vh - 200px)" }}>
			{/* Top Row - Personal Info and Date */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-shrink-0">
				<div className="lg:col-span-2">
					<PersonalInformation user={user} />
				</div>
				<DateSection />
			</div>

			{/* Middle Row - Exam Schedule and Announcements */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-shrink-0">
				<ExamSchedule />
				<Announcements />
			</div>

			{/* Bottom Row - Subject Progress */}
			<div
				className="flex-1 min-h-0"
				style={{
					minHeight: "320px",
					maxHeight: "calc(100vh - 520px)",
					height: "calc(100vh - 520px)",
				}}
			>
				<SubjectProgress
					onStartExam={handleStartExam}
					onNavigateToSubject={(subject) => {
						setSelectedSubject(subject);
						if (subject.type === "AP") {
							router.push("/dashboard/ap-courses");
						} else if (subject.type === "SAT") {
							router.push("/dashboard/sat-exams");
						}
					}}
				/>
			</div>
		</div>
	);
}
