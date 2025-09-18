"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { APCourses } from "@/components/dashboard/ap-courses/APCourses";
import type { Subject } from "@/types";

export default function APCoursesPage() {
	const router = useRouter();
	const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

	// Convert ApSubject to Subject for compatibility
	const handleApStartExam = (apSubject: any) => {
		const subject: Subject = {
			id: apSubject.id,
			name: apSubject.title,
			type: "AP",
			progress: apSubject.progress,
			totalChapters: apSubject.totalChapters,
			completedChapters: apSubject.completedChapters,
			icon: "📚",
			examDate: apSubject.examDate,
		};

		console.log("Starting exam for subject:", subject);
		// Navigate to exam page with subject info
		router.push(`/exam?subject=${subject.id}`);
	};

	return (
		<div>
			<APCourses
				onStartExam={handleApStartExam}
				selectedSubject={selectedSubject as any}
				onTabChange={() => setSelectedSubject(null)}
			/>
		</div>
	);
}
