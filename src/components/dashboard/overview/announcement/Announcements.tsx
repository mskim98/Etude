import { AnnouncementCard } from "./AnnouncementCard";

interface AnnouncementsProps {
	className?: string;
}

export function Announcements({ className }: AnnouncementsProps) {
	return <AnnouncementCard className={className} />;
}
