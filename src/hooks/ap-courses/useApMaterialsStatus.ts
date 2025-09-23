import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useApMaterialsStatus(chapters?: { id: string }[]) {
	const chapterIds = chapters?.map((c: any) => c.id).filter(Boolean) || [];
	
	const mcqQuery = useQuery({
		queryKey: ["ap-mcq-status", chapterIds.sort().join(",")],
		queryFn: async () => {
			if (chapterIds.length === 0) return {};
			
			const { data: mcqs } = await supabase
				.from("ap_mcq" as any)
				.select("chapter_id, is_active")
				.in("chapter_id", chapterIds);
				
			const mcqMap: Record<string, boolean> = {};
			(mcqs || []).forEach((row: any) => {
				if (!(row.chapter_id in mcqMap)) mcqMap[row.chapter_id] = false;
				mcqMap[row.chapter_id] = mcqMap[row.chapter_id] || !!row.is_active;
			});
			return mcqMap;
		},
		enabled: chapterIds.length > 0,
		staleTime: 5 * 60 * 1000, // 5분 - MCQ 활성화 상태는 자주 변경되지 않음
		gcTime: 10 * 60 * 1000, // 10분
		retry: 2,
		refetchOnWindowFocus: false,
	});

	const frqQuery = useQuery({
		queryKey: ["ap-frq-status", chapterIds.sort().join(",")],
		queryFn: async () => {
			if (chapterIds.length === 0) return {};
			
			const { data: frqs } = await supabase
				.from("ap_frq" as any)
				.select("chapter_id, is_active")
				.in("chapter_id", chapterIds);
				
			const frqMap: Record<string, boolean> = {};
			(frqs || []).forEach((row: any) => {
				if (!(row.chapter_id in frqMap)) frqMap[row.chapter_id] = false;
				frqMap[row.chapter_id] = frqMap[row.chapter_id] || !!row.is_active;
			});
			return frqMap;
		},
		enabled: chapterIds.length > 0,
		staleTime: 5 * 60 * 1000, // 5분 - FRQ 활성화 상태는 자주 변경되지 않음
		gcTime: 10 * 60 * 1000, // 10분
		retry: 2,
		refetchOnWindowFocus: false,
	});

	return { 
		mcqActiveMap: mcqQuery.data || {}, 
		frqActiveMap: frqQuery.data || {} 
	};
}
