"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Bell, User, Users, Calendar, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useDashboardAnnouncements } from "../../hooks/overview/useAnnouncements";
import { getRelativeTimeText, getCategoryText, getAnnouncerTypeText } from "../../lib/services/announcement";

interface AnnouncementsProps {
	className?: string;
}

export function Announcements({ className }: AnnouncementsProps) {
	// 실제 공지사항 데이터 사용 (대시보드용 최대 6개)
	const { announcements, isLoading, error, isRefreshing, refresh } = useDashboardAnnouncements(6);

	/**
	 * announcerType에 따른 타입 결정 (직접 사용)
	 */
	const getAuthorType = (announcerType: "teacher" | "admin" | "system") => {
		return getAnnouncerTypeText(announcerType);
	};

	/**
	 * announcerType에 따른 아이콘 반환
	 */
	const getTypeIcon = (announcerType: "teacher" | "admin" | "system") => {
		return announcerType === "admin" || announcerType === "system" ? Users : User;
	};

	/**
	 * 긴급도를 기존 UI 형식에 맞게 변환
	 */
	const mapUrgencyToPriority = (urgency: "low" | "medium" | "high") => {
		return urgency; // 동일한 형식이므로 그대로 사용
	};

	/**
	 * 긴급도에 따른 색상 클래스 (기존 UI 스타일 유지)
	 */
	const getPriorityColor = (priority: "high" | "medium" | "low") => {
		switch (priority) {
			case "high":
				return "text-destructive border-destructive";
			case "medium":
				return "text-warning border-warning";
			case "low":
				return "text-success border-success";
			default:
				return "text-muted-foreground border-border";
		}
	};

	return (
		<Card className={`border shadow-sm ${className}`}>
			<CardHeader className="pb-3 rounded-t-lg bg-primary">
				<CardTitle className="flex items-center justify-between text-lg font-semibold text-primary-foreground">
					<div className="flex items-center space-x-2">
						<Bell className="w-5 h-5" />
						<span>Announcements</span>
					</div>

					{/* 새로고침 버튼 */}
					<Button
						variant="ghost"
						size="sm"
						onClick={refresh}
						disabled={isRefreshing}
						className="text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8 p-0"
					>
						<RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div
					className="space-y-3 overflow-y-auto scrollbar-custom pr-2"
					style={{
						maxHeight: "384px", // Standardized height
					}}
				>
					{/* 로딩 상태 */}
					{isLoading && (
						<div className="flex items-center justify-center py-8">
							<RefreshCw className="w-6 h-6 animate-spin text-primary" />
							<span className="ml-2 text-sm text-muted-foreground">Loading announcements...</span>
						</div>
					)}

					{/* 에러 상태 */}
					{error && (
						<div className="flex items-center justify-center py-8">
							<AlertCircle className="w-6 h-6 text-destructive" />
							<span className="ml-2 text-sm text-destructive">{error}</span>
						</div>
					)}

					{/* 공지사항이 없는 경우 */}
					{!isLoading && !error && announcements.length === 0 && (
						<div className="flex items-center justify-center py-8">
							<Bell className="w-6 h-6 text-muted-foreground" />
							<span className="ml-2 text-sm text-muted-foreground">No announcements available.</span>
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
