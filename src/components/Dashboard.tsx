"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInformation } from "@/components/dashboard/PersonalInformation";
import { DateSection } from "@/components/dashboard/DateSection";
import { ExamSchedule } from "@/components/dashboard/ExamSchedule";
import { Announcements } from "@/components/dashboard/Announcements";
import { SubjectProgress } from "@/components/dashboard/SubjectProgress";
import { APCourses } from "@/components/dashboard/ap-courses/APCourses";
import { SATMockExams } from "@/components/dashboard/SATMockExams";
import { BookOpen, LogOut, GraduationCap, Calendar, FileText, User } from "lucide-react";
import type { Subject, APExam } from "@/types";

interface DashboardProps {
	user: any | null;
	onStartExam: (subject: Subject) => void;
	onViewResults?: () => void;
	onNavigate?: (page: string) => void;
	onLogout: () => void;
	activeSection?: string | null;
	onSectionChange?: (section: string | null) => void;
}

export function Dashboard({
	user,
	onStartExam,
	onViewResults,
	onNavigate,
	onLogout,
	activeSection,
	onSectionChange,
}: DashboardProps) {
	const [activeTab, setActiveTab] = useState<"overview" | "ap-courses" | "sat-exams">(
		activeSection === "sat" ? "sat-exams" : "overview"
	);
	const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

	// Handle activeSection changes
	useEffect(() => {
		if (activeSection === "sat") {
			setActiveTab("sat-exams");
			// Clear the activeSection after setting the tab
			if (onSectionChange) {
				onSectionChange(null);
			}
		} else if (activeSection === "chemistry" || activeSection === "biology" || activeSection === "psychology") {
			setActiveTab("ap-courses");
			// Clear the activeSection after setting the tab
			if (onSectionChange) {
				onSectionChange(null);
			}
		}
	}, [activeSection, onSectionChange]);

	const handleStartExam = (examId: string) => {
		// SAT 시험 시작 시 SAT Section Select 페이지로 이동
		console.log("Starting SAT exam:", examId);
		if (onNavigate) {
			onNavigate("sat-section-select");
		}
	};

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
		onStartExam(subject);
	};

	return (
		<div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: "#F8FBFC" }}>
			{/* Compact Header with Inline Navigation */}
			<header className="bg-white border-b shadow-sm flex-shrink-0" style={{ borderColor: "#E1F0F3" }}>
				<div className="max-w-7xl mx-auto">
					<div className="flex items-center justify-between px-6 py-4">
						{/* Left Section: Logo, Dashboard Title, and Navigation */}
						<div className="flex items-center space-x-6">
							<div className="flex items-center space-x-3">
								<div
									className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md"
									style={{ backgroundColor: "#0091B3" }}
								>
									<BookOpen className="w-6 h-6 text-white" />
								</div>
								<span className="text-2xl font-bold" style={{ color: "#0091B3" }}>
									ETUDE
								</span>
							</div>
							<div className="h-8 w-px" style={{ backgroundColor: "#B8D4D9" }} />
							<h1 className="text-xl font-bold" style={{ color: "#0091B3" }}>
								Dashboard
							</h1>

							{/* Custom Header Navigation - Clean Design */}
							<div className="hidden md:flex">
								<nav className="flex items-center gap-1">
									<button
										onClick={(e) => {
											setActiveTab("overview");
											if (onSectionChange) onSectionChange(null);
											// Clear focus and reset styles
											e.currentTarget.blur();
											e.currentTarget.style.backgroundColor = "transparent";
											e.currentTarget.style.color = activeTab === "overview" ? "#0091B3" : "#666666";
											const icon = e.currentTarget.querySelector("svg");
											if (icon) {
												(icon as HTMLElement).style.color = activeTab === "overview" ? "#0091B3" : "#666666";
											}
										}}
										className="relative flex items-center px-3 py-2 rounded-lg transition-all duration-200 ease-in-out border-0 bg-transparent hover:scale-105 focus:outline-none cursor-pointer"
										style={{
											fontSize: "15px",
											fontWeight: activeTab === "overview" ? "600" : "500",
											color: activeTab === "overview" ? "#0091B3" : "#666666",
										}}
										onMouseEnter={(e) => {
											if (activeTab !== "overview") {
												e.currentTarget.style.backgroundColor = "var(--color-muted)";
												e.currentTarget.style.color = "var(--color-text-primary)";
												const icon = e.currentTarget.querySelector("svg");
												if (icon) {
													(icon as HTMLElement).style.color = "var(--color-accent)";
												}
											}
										}}
										onMouseLeave={(e) => {
											if (activeTab !== "overview") {
												e.currentTarget.style.backgroundColor = "transparent";
												e.currentTarget.style.color = "#666666";
												const icon = e.currentTarget.querySelector("svg");
												if (icon) {
													(icon as HTMLElement).style.color = "#666666";
												}
											}
										}}
									>
										<GraduationCap
											className="w-4 h-4 mr-2 transition-colors duration-200"
											style={{ color: activeTab === "overview" ? "#0091B3" : "#666666" }}
										/>
										<span className="relative cursor-pointer">Overview</span>
										{activeTab === "overview" && (
											<div
												className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-200"
												style={{ backgroundColor: "#0091B3" }}
											/>
										)}
									</button>

									<button
										onClick={(e) => {
											setActiveTab("ap-courses");
											if (onSectionChange) onSectionChange("ap");
											// Clear focus and reset styles
											e.currentTarget.blur();
											e.currentTarget.style.backgroundColor = "transparent";
											e.currentTarget.style.color = activeTab === "ap-courses" ? "#0091B3" : "#666666";
											const icon = e.currentTarget.querySelector("svg");
											if (icon) {
												(icon as HTMLElement).style.color = activeTab === "ap-courses" ? "#0091B3" : "#666666";
											}
										}}
										className="relative flex items-center px-3 py-2 rounded-lg transition-all duration-200 ease-in-out border-0 bg-transparent hover:scale-105 focus:outline-none cursor-pointer"
										style={{
											fontSize: "15px",
											fontWeight: activeTab === "ap-courses" ? "600" : "500",
											color: activeTab === "ap-courses" ? "#0091B3" : "#666666",
										}}
										onMouseEnter={(e) => {
											if (activeTab !== "ap-courses") {
												e.currentTarget.style.backgroundColor = "var(--color-muted)";
												e.currentTarget.style.color = "var(--color-text-primary)";
												const icon = e.currentTarget.querySelector("svg");
												if (icon) {
													(icon as HTMLElement).style.color = "var(--color-accent)";
												}
											}
										}}
										onMouseLeave={(e) => {
											if (activeTab !== "ap-courses") {
												e.currentTarget.style.backgroundColor = "transparent";
												e.currentTarget.style.color = "#666666";
												const icon = e.currentTarget.querySelector("svg");
												if (icon) {
													(icon as HTMLElement).style.color = "#666666";
												}
											}
										}}
									>
										<BookOpen
											className="w-4 h-4 mr-2 transition-colors duration-200"
											style={{ color: activeTab === "ap-courses" ? "#0091B3" : "#666666" }}
										/>
										<span className="relative cursor-pointer">AP Courses</span>
										{activeTab === "ap-courses" && (
											<div
												className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-200"
												style={{ backgroundColor: "#0091B3" }}
											/>
										)}
									</button>

									<button
										onClick={(e) => {
											setActiveTab("sat-exams");
											if (onSectionChange) onSectionChange("sat");
											// Clear focus and reset styles
											e.currentTarget.blur();
											e.currentTarget.style.backgroundColor = "transparent";
											e.currentTarget.style.color = activeTab === "sat-exams" ? "#0091B3" : "#666666";
											const icon = e.currentTarget.querySelector("svg");
											if (icon) {
												(icon as HTMLElement).style.color = activeTab === "sat-exams" ? "#0091B3" : "#666666";
											}
										}}
										className="relative flex items-center px-3 py-2 rounded-lg transition-all duration-200 ease-in-out border-0 bg-transparent hover:scale-105 focus:outline-none cursor-pointer"
										style={{
											fontSize: "15px",
											fontWeight: activeTab === "sat-exams" ? "600" : "500",
											color: activeTab === "sat-exams" ? "#0091B3" : "#666666",
										}}
										onMouseEnter={(e) => {
											if (activeTab !== "sat-exams") {
												e.currentTarget.style.backgroundColor = "var(--color-muted)";
												e.currentTarget.style.color = "var(--color-text-primary)";
												const icon = e.currentTarget.querySelector("svg");
												if (icon) {
													(icon as HTMLElement).style.color = "var(--color-accent)";
												}
											}
										}}
										onMouseLeave={(e) => {
											if (activeTab !== "sat-exams") {
												e.currentTarget.style.backgroundColor = "transparent";
												e.currentTarget.style.color = "#666666";
												const icon = e.currentTarget.querySelector("svg");
												if (icon) {
													(icon as HTMLElement).style.color = "#666666";
												}
											}
										}}
									>
										<FileText
											className="w-4 h-4 mr-2 transition-colors duration-200"
											style={{ color: activeTab === "sat-exams" ? "#0091B3" : "#666666" }}
										/>
										<span className="relative cursor-pointer">SAT Exams</span>
										{activeTab === "sat-exams" && (
											<div
												className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-200"
												style={{ backgroundColor: "#0091B3" }}
											/>
										)}
									</button>
								</nav>
							</div>
						</div>

						{/* Right Section: User Info and Logout */}
						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-2 font-semibold" style={{ color: "#2B5F75" }}>
								<User className="w-5 h-5" />
								<span className="hidden sm:inline">{user?.name}</span>
							</div>
							<Button
								variant="outline"
								onClick={onLogout}
								className="font-semibold"
								style={{ borderColor: "#4A9FCC", color: "#2B5F75" }}
							>
								<LogOut className="w-4 h-4 mr-2" />
								<span className="hidden sm:inline">Logout</span>
							</Button>
						</div>
					</div>

					{/* Mobile Navigation - Only visible on smaller screens */}
					<div className="md:hidden border-t" style={{ borderColor: "#E1F0F3" }}>
						<div className="flex justify-center py-3">
							<nav className="flex items-center gap-1">
								<button
									onClick={(e) => {
										setActiveTab("overview");
										if (onSectionChange) onSectionChange(null);
										// Clear focus and reset styles
										e.currentTarget.blur();
										e.currentTarget.style.backgroundColor = "transparent";
										e.currentTarget.style.color = activeTab === "overview" ? "#0091B3" : "#666666";
										const icon = e.currentTarget.querySelector("svg");
										if (icon) {
											(icon as HTMLElement).style.color = activeTab === "overview" ? "#0091B3" : "#666666";
										}
									}}
									className="relative flex items-center px-3 py-2 rounded-lg transition-all duration-200 ease-in-out border-0 bg-transparent hover:scale-105 focus:outline-none cursor-pointer"
									style={{
										fontSize: "14px",
										fontWeight: activeTab === "overview" ? "600" : "500",
										color: activeTab === "overview" ? "#0091B3" : "#666666",
									}}
									onMouseEnter={(e) => {
										if (activeTab !== "overview") {
											e.currentTarget.style.backgroundColor = "var(--color-muted)";
											e.currentTarget.style.color = "var(--color-text-primary)";
											const icon = e.currentTarget.querySelector("svg");
											if (icon) {
												(icon as HTMLElement).style.color = "var(--color-accent)";
											}
										}
									}}
									onMouseLeave={(e) => {
										if (activeTab !== "overview") {
											e.currentTarget.style.backgroundColor = "transparent";
											e.currentTarget.style.color = "#666666";
											const icon = e.currentTarget.querySelector("svg");
											if (icon) {
												(icon as HTMLElement).style.color = "#666666";
											}
										}
									}}
								>
									<GraduationCap
										className="w-4 h-4 mr-1.5 transition-colors duration-200"
										style={{ color: activeTab === "overview" ? "#0091B3" : "#666666" }}
									/>
									<span className="relative cursor-pointer">Overview</span>
									{activeTab === "overview" && (
										<div
											className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-200"
											style={{ backgroundColor: "#0091B3" }}
										/>
									)}
								</button>

								<button
									onClick={(e) => {
										setActiveTab("ap-courses");
										if (onSectionChange) onSectionChange("ap");
										// Clear focus and reset styles
										e.currentTarget.blur();
										e.currentTarget.style.backgroundColor = "transparent";
										e.currentTarget.style.color = activeTab === "ap-courses" ? "#0091B3" : "#666666";
										const icon = e.currentTarget.querySelector("svg");
										if (icon) {
											(icon as HTMLElement).style.color = activeTab === "ap-courses" ? "#0091B3" : "#666666";
										}
									}}
									className="relative flex items-center px-3 py-2 rounded-lg transition-all duration-200 ease-in-out border-0 bg-transparent hover:scale-105 focus:outline-none cursor-pointer"
									style={{
										fontSize: "14px",
										fontWeight: activeTab === "ap-courses" ? "600" : "500",
										color: activeTab === "ap-courses" ? "#0091B3" : "#666666",
									}}
									onMouseEnter={(e) => {
										if (activeTab !== "ap-courses") {
											e.currentTarget.style.backgroundColor = "var(--color-muted)";
											e.currentTarget.style.color = "var(--color-text-primary)";
											const icon = e.currentTarget.querySelector("svg");
											if (icon) {
												(icon as HTMLElement).style.color = "var(--color-accent)";
											}
										}
									}}
									onMouseLeave={(e) => {
										if (activeTab !== "ap-courses") {
											e.currentTarget.style.backgroundColor = "transparent";
											e.currentTarget.style.color = "#666666";
											const icon = e.currentTarget.querySelector("svg");
											if (icon) {
												(icon as HTMLElement).style.color = "#666666";
											}
										}
									}}
								>
									<BookOpen
										className="w-4 h-4 mr-1.5 transition-colors duration-200"
										style={{ color: activeTab === "ap-courses" ? "#0091B3" : "#666666" }}
									/>
									<span className="relative cursor-pointer">AP</span>
									{activeTab === "ap-courses" && (
										<div
											className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-200"
											style={{ backgroundColor: "#0091B3" }}
										/>
									)}
								</button>

								<button
									onClick={(e) => {
										setActiveTab("sat-exams");
										if (onSectionChange) onSectionChange("sat");
										// Clear focus and reset styles
										e.currentTarget.blur();
										e.currentTarget.style.backgroundColor = "transparent";
										e.currentTarget.style.color = activeTab === "sat-exams" ? "#0091B3" : "#666666";
										const icon = e.currentTarget.querySelector("svg");
										if (icon) {
											(icon as HTMLElement).style.color = activeTab === "sat-exams" ? "#0091B3" : "#666666";
										}
									}}
									className="relative flex items-center px-3 py-2 rounded-lg transition-all duration-200 ease-in-out border-0 bg-transparent hover:scale-105 focus:outline-none cursor-pointer"
									style={{
										fontSize: "14px",
										fontWeight: activeTab === "sat-exams" ? "600" : "500",
										color: activeTab === "sat-exams" ? "#0091B3" : "#666666",
									}}
									onMouseEnter={(e) => {
										if (activeTab !== "sat-exams") {
											e.currentTarget.style.backgroundColor = "var(--color-muted)";
											e.currentTarget.style.color = "var(--color-text-primary)";
											const icon = e.currentTarget.querySelector("svg");
											if (icon) {
												(icon as HTMLElement).style.color = "var(--color-accent)";
											}
										}
									}}
									onMouseLeave={(e) => {
										if (activeTab !== "sat-exams") {
											e.currentTarget.style.backgroundColor = "transparent";
											e.currentTarget.style.color = "#666666";
											const icon = e.currentTarget.querySelector("svg");
											if (icon) {
												(icon as HTMLElement).style.color = "#666666";
											}
										}
									}}
								>
									<FileText
										className="w-4 h-4 mr-1.5 transition-colors duration-200"
										style={{ color: activeTab === "sat-exams" ? "#0091B3" : "#666666" }}
									/>
									<span className="relative cursor-pointer">SAT</span>
									{activeTab === "sat-exams" && (
										<div
											className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-200"
											style={{ backgroundColor: "#0091B3" }}
										/>
									)}
								</button>
							</nav>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content Area with Flexible Height */}
			<div className="flex-1 overflow-y-auto">
				<div className="max-w-7xl mx-auto p-6">
					{/* Overview Tab */}
					{activeTab === "overview" && (
						<div className="h-full flex flex-col space-y-4" style={{ height: "calc(100vh - 120px)" }}>
							{/* Top Row - Personal Info and Date */}
							<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-shrink-0">
								<div className="lg:col-span-2">
									<PersonalInformation user={user} />
								</div>
								<DateSection />
							</div>

							{/* Middle Row - Exam Schedule and Announcements */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-shrink-0">
								<ExamSchedule />
								<Announcements />
							</div>

							{/* Bottom Row - Subject Progress - Responsive height with min 2 cards visible */}
							<div
								className="flex-1 min-h-0"
								style={{
									minHeight: "320px" /* Ensures at least 2 cards (150px each + spacing) are visible */,
									maxHeight: "calc(100vh - 520px)" /* Maintains bottom spacing */,
									height: "calc(100vh - 520px)",
								}}
							>
								<SubjectProgress
									onStartExam={onStartExam}
									onNavigateToSubject={(subject) => {
										setSelectedSubject(subject);
										if (subject.type === "AP") {
											setActiveTab("ap-courses");
										} else if (subject.type === "SAT") {
											setActiveTab("sat-exams");
										}
									}}
								/>
							</div>
						</div>
					)}

					{/* AP Courses Tab */}
					{activeTab === "ap-courses" && (
						<APCourses
							onStartExam={handleApStartExam}
							selectedSubject={selectedSubject as any}
							onTabChange={() => setSelectedSubject(null)}
						/>
					)}

					{/* SAT Exams Tab */}
					{activeTab === "sat-exams" && (
						<SATMockExams
							onStartExam={handleStartExam}
							selectedSubject={selectedSubject}
							onTabChange={() => setSelectedSubject(null)}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
