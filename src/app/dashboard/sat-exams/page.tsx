"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SATMockExams } from "@/components/dashboard/SATMockExams";
import type { Subject } from "@/types";

export default function SATExamsPage() {
	const router = useRouter();
	const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

	const handleStartExam = (examId: string) => {
		// SAT 시험 시작 시 SAT Section Select 페이지로 이동
		console.log("Starting SAT exam:", examId);
		router.push("/sat-section-select");
	};

	return (
		<div>
			<SATMockExams
				onStartExam={handleStartExam}
				selectedSubject={selectedSubject}
				onTabChange={() => setSelectedSubject(null)}
			/>
		</div>
	);
}
