import { ExamScheduleCard } from "./ExamScheduleCard";
import type { ScheduleItem } from "@/types/schedule";

interface ExamScheduleProps {
	className?: string;
	// 외부에서 일정 데이터를 주입할 수 있도록 옵션으로 제공
	schedules?: ScheduleItem[];
	loading?: boolean;
	error?: string | null;
}

export function ExamSchedule({ className, schedules, loading, error }: ExamScheduleProps) {
	return <ExamScheduleCard className={className} schedules={schedules} loading={loading} error={error} />;
}
