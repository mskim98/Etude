"use client";

import { useRouter } from "next/navigation";
import { SATResultsPage } from "@/components/SATResultsPage";

export default function SATResults() {
	const router = useRouter();

	return (
		<SATResultsPage
			onNavigate={(page) => {
				// Next.js 라우팅으로 페이지 이동
				router.push(`/${page}`);
			}}
		/>
	);
}
