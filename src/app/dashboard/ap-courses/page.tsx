"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { APCourses } from "@/components/dashboard/ap-courses/APCourses";
import { supabase } from "@/lib/supabase";
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
				// For subjects without specific examId, redirect to AP Courses page
				// The user should select a specific exam from the Practice Exams grid
				router.push(`/dashboard/ap-courses?subject=${subject.id}`);
			}
		}
	};

	// Handle viewing exam results
	const handleViewResults = async (examId: string) => {
		try {
			// Get current user
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				router.push("/auth/login");
				return;
			}

			// Get the most recent result for this exam
			const { data: results, error } = await supabase
				.from("user_ap_result")
				.select("id")
				.eq("user_id", user.id)
				.eq("ap_exam_id", examId)
				.order("completed_at", { ascending: false })
				.limit(1);

			if (error) {
				console.error("Error fetching exam results:", error);
				return;
			}

			if (results && results.length > 0) {
				// Navigate to results page with the most recent result
				router.push(`/ap-results?resultId=${results[0].id}&examId=${examId}`);
			} else {
				console.log("No results found for this exam");
				// You might want to show a message to the user
			}
		} catch (error) {
			console.error("Error in handleViewResults:", error);
		}
	};

	return (
		<div>
			<APCourses
				onStartExam={handleApStartExam}
				onViewResults={handleViewResults}
				selectedSubject={selectedSubject as Subject | null}
				onTabChange={() => setSelectedSubject(null)}
			/>
		</div>
	);
}
