"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { APCourses } from "@/components/dashboard/ap-courses/APCourses";
import type { Subject } from "@/types";

export default function APCoursesPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

	// Check for subject parameter from URL
	useEffect(() => {
		const subjectId = searchParams.get("subject");
		if (subjectId) {
			// Create a minimal subject object for auto-selection
			const autoSelectedSubject: Subject = {
				id: subjectId,
				name: "",
				type: "AP",
				progress: 0,
				totalChapters: 0,
				completedChapters: 0,
				icon: "📚",
				examDate: new Date(),
			};
			setSelectedSubject(autoSelectedSubject);

			// Clean up URL parameter after setting the subject
			const newUrl = new URL(window.location.href);
			newUrl.searchParams.delete("subject");
			router.replace(newUrl.pathname + newUrl.search);
		}
	}, [searchParams, router]);

	// Handle AP exam start - navigate to instruction page
	const handleApStartExam = (apSubject: unknown, examId?: string) => {
		console.log("Starting exam for subject:", apSubject);

		// Type guard to ensure apSubject has id property
		if (typeof apSubject === "object" && apSubject !== null && "id" in apSubject) {
			const subject = apSubject as { id: string };

			// If examId is provided, navigate to instruction page for specific exam
			if (examId) {
				router.push(`/dashboard/ap-courses/ap-exam-instruction?examId=${examId}&subjectId=${subject.id}`);
			} else {
				// For general subject exam, use default exam
				// TODO: Implement logic to select default exam or show exam selection
				router.push(`/dashboard/ap-courses/ap-exam-instruction?examId=default&subjectId=${subject.id}`);
			}
		}
	};

	return (
		<div>
			<APCourses
				onStartExam={handleApStartExam}
				selectedSubject={selectedSubject as Subject | null}
				onTabChange={() => setSelectedSubject(null)}
			/>
		</div>
	);
}
