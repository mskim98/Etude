"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Bell, User, Users, Calendar, AlertCircle } from "lucide-react";
import { useDashboardAnnouncements } from "../../../../hooks/overview/useAnnouncements";
import { getRelativeTimeText, getCategoryText, getAnnouncerTypeText } from "../../../../lib/services/announcement";

interface AnnouncementCardProps {
	className?: string;
}

export function AnnouncementCard({ className }: AnnouncementCardProps) {
	// 실제 공지사항 데이터 사용 (대시보드용 최대 6개)
	const { announcements, isLoading, error } = useDashboardAnnouncements(6);

	/**
	 * announcerType에 따른 타입 결정 (직접 사용)
	 */
	const getAuthorType = (announcerType: "teacher" | "admin" | "system") => {
		switch (announcerType) {
			case "teacher":
				return "Teacher";
			case "admin":
				return "Admin";
			case "system":
				return "System";
			default:
				return "Unknown";
		}
	};

	/**
	 * announcerType에 따른 아이콘 결정 (직접 사용)
	 */
	const getTypeIcon = (announcerType: "teacher" | "admin" | "system") => {
		switch (announcerType) {
			case "teacher":
				return User;
			case "admin":
				return Users;
			case "system":
				return Bell;
			default:
				return Bell;
		}
	};

	/**
	 * urgency를 priority로 매핑 (직접 사용)
	 */
	const mapUrgencyToPriority = (urgency: "low" | "medium" | "high") => {
		switch (urgency) {
			case "low":
				return "Normal";
			case "medium":
				return "Important";
			case "high":
				return "Urgent";
			default:
				return "Normal";
		}
	};

	/**
	 * priority에 따른 색상 클래스 (직접 사용)
	 */
	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "Urgent":
				return "text-destructive border-destructive";
			case "Important":
				return "text-warning border-warning";
			case "Normal":
				return "text-muted-foreground border-border";
			default:
				return "text-muted-foreground border-border";
		}
	};

	return (
		<Card className={`border shadow-sm animate-in fade-in-50 duration-500 ${className}`}>
			<CardHeader className="pb-3 rounded-t-lg bg-primary">
				<CardTitle className="flex items-center space-x-2 text-lg font-semibold text-primary-foreground">
					<Bell className="w-5 h-5" />
					<span>Announcements</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div
					className="space-y-3 overflow-y-auto scrollbar-custom pr-2"
					style={{
						height: "300px", // Fixed height instead of maxHeight
						minHeight: "360px",
					}}
				>
					{/* 로딩 상태 */}
					{isLoading && (
						<div className="flex items-center justify-center h-full">
							<div className="text-center">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
								<p className="text-muted-foreground font-medium">Loading announcements...</p>
							</div>
						</div>
					)}

					{/* 에러 상태 */}
					{error && (
						<div className="flex items-center justify-center h-full">
							<div className="text-center">
								<AlertCircle className="w-6 h-6 text-destructive mx-auto mb-2" />
								<span className="text-sm text-destructive">{error}</span>
							</div>
						</div>
					)}

					{/* 공지사항이 없는 경우 */}
					{!isLoading && !error && announcements.length === 0 && (
						<div className="flex items-center justify-center h-full">
							<div className="text-center">
								<Bell className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
								<span className="text-sm text-muted-foreground">No announcements available.</span>
							</div>
						</div>
					)}

					{/* 실제 공지사항 목록 */}
					{!isLoading &&
						!error &&
						announcements.map((announcement) => {
							const authorType = getAuthorType(announcement.announcerType);
							const TypeIcon = getTypeIcon(announcement.announcerType);
							const priority = mapUrgencyToPriority(announcement.urgency);

							return (
								<div key={announcement.id} className="p-4 rounded-lg border-2 border-muted-foreground/15 bg-card">
									<div className="flex items-start justify-between mb-2">
										<div className="flex items-center space-x-3">
											<div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary">
												<TypeIcon className="w-5 h-5 text-primary-foreground" />
											</div>
											<div>
												<div className="flex items-center space-x-2">
													<span className="font-bold text-foreground text-base">{announcement.title}</span>
													<Badge variant="outline" className={`text-xs font-semibold ${getPriorityColor(priority)}`}>
														{priority}
													</Badge>
												</div>
												<div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
													<span className="text-xs text-muted-foreground">{announcement.authorName}</span>
													<Badge
														variant="secondary"
														className="text-xs font-semibold bg-primary text-primary-foreground"
													>
														{authorType}
													</Badge>
													<Badge variant="outline" className="text-xs font-semibold border-primary text-primary">
														{getCategoryText(announcement.category)}
													</Badge>
												</div>
											</div>
										</div>
										<div className="flex items-center space-x-1 text-sm text-muted-foreground font-medium">
											<Calendar className="w-4 h-4" />
											<span>{getRelativeTimeText(announcement.createdAt)}</span>
										</div>
									</div>

									<p className="text-sm text-foreground leading-relaxed pl-12 font-medium">{announcement.content}</p>
								</div>
							);
						})}
				</div>
			</CardContent>
		</Card>
	);
}
