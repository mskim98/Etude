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
