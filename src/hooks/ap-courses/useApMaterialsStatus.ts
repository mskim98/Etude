import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useApMaterialsStatus(chapters?: { id: string }[]) {
	const [mcqActiveMap, setMcqActiveMap] = useState<Record<string, boolean>>({});
	const [frqActiveMap, setFrqActiveMap] = useState<Record<string, boolean>>({});

	useEffect(() => {
		const fetchMaterialsStatus = async () => {
			if (!chapters || chapters.length === 0) {
				setMcqActiveMap({});
				setFrqActiveMap({});
				return;
			}
			const chapterIds = chapters.map((c: any) => c.id).filter(Boolean);
			if (chapterIds.length === 0) {
				setMcqActiveMap({});
				setFrqActiveMap({});
				return;
			}

			const { data: mcqs } = await supabase.from("ap_mcq").select("chapter_id, is_active").in("chapter_id", chapterIds);
			const mcqMap: Record<string, boolean> = {};
			(mcqs || []).forEach((row: any) => {
				if (!(row.chapter_id in mcqMap)) mcqMap[row.chapter_id] = false;
				mcqMap[row.chapter_id] = mcqMap[row.chapter_id] || !!row.is_active;
			});
			setMcqActiveMap(mcqMap);

			const { data: frqs } = await supabase.from("ap_frq").select("chapter_id, is_active").in("chapter_id", chapterIds);
			const frqMap: Record<string, boolean> = {};
			(frqs || []).forEach((row: any) => {
				if (!(row.chapter_id in frqMap)) frqMap[row.chapter_id] = false;
				frqMap[row.chapter_id] = frqMap[row.chapter_id] || !!row.is_active;
			});
			setFrqActiveMap(frqMap);
		};
		fetchMaterialsStatus();
	}, [chapters?.map((c) => c.id).join(",")]);

	return { mcqActiveMap, frqActiveMap };
}
