"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	ArrowLeft,
	Target,
	Clock,
	Users,
	CheckCircle2,
	BarChart3,
	Award,
	TrendingUp,
	Eye,
	RotateCcw,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { PageType, Subject } from "@/types";

interface SATDetailedResultsPageProps {
	selectedTest: Subject | null;
	onNavigate: (page: PageType) => void;
}

export function SATDetailedResultsPage({ selectedTest, onNavigate }: SATDetailedResultsPageProps) {
	const [selectedSection, setSelectedSection] = React.useState<"reading" | "writing" | "math">("reading");
	const [chartSection, setChartSection] = React.useState<"reading" | "writing" | "math">("reading");
	const [chartDataType, setChartDataType] = React.useState<"correct" | "incorrect">("incorrect");
	if (!selectedTest) {
		return (
			<div className="container mx-auto px-6 py-8">
				<p>No test data available.</p>
			</div>
		);
	}

	// Calculate scores and completion data
	const sections = [
		{
			id: "reading",
			name: "Reading",
			score: selectedTest.sectionProgress?.reading?.score || 0,
			completed: selectedTest.sectionProgress?.reading?.completed || false,
			outOf: 800,
			percentile: 75,
			correctAnswers: 45,
			totalQuestions: 52,
			timeSpent: 63,
		},
		{
			id: "writing",
			name: "Writing & Language",
			score: selectedTest.sectionProgress?.writing?.score || 0,
			completed: selectedTest.sectionProgress?.writing?.completed || false,
			outOf: 800,
			percentile: 82,
			correctAnswers: 38,
			totalQuestions: 44,
			timeSpent: 33,
		},
		{
			id: "math",
			name: "Math",
			score: selectedTest.sectionProgress?.math?.score || 0,
			completed: selectedTest.sectionProgress?.math?.completed || false,
			outOf: 800,
			percentile: 89,
			correctAnswers: 54,
			totalQuestions: 58,
			timeSpent: 78,
		},
	];

	const completedSections = sections.filter((section) => section.completed);
	const totalScore = completedSections.reduce((sum, section) => sum + section.score, 0);
	const averagePercentile = Math.round(
		completedSections.reduce((sum, section) => sum + section.percentile, 0) / completedSections.length
	);

	// Calculate overall accuracy rate
	const totalCorrectAnswers = completedSections.reduce((sum, section) => sum + section.correctAnswers, 0);
	const totalQuestions = completedSections.reduce((sum, section) => sum + section.totalQuestions, 0);
	const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrectAnswers / totalQuestions) * 100) : 0;

	// Mock wrong questions data for demonstration
	const wrongQuestions = [
		{
			section: "Reading",
			questionNumber: 15,
			topic: "Literature Analysis",
			difficulty: "Hard",
			explanation: "This question required understanding of the author's implicit argument about social change.",
		},
		{
			section: "Math",
			questionNumber: 32,
			topic: "Algebra",
			difficulty: "Medium",
			explanation: "The equation needed to be solved using substitution method.",
		},
		{
			section: "Reading",
			questionNumber: 8,
			topic: "Vocabulary in Context",
			difficulty: "Medium",
			explanation: "The word's meaning changes based on the surrounding context.",
		},
	];

	return (
		<div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
			<div className="container mx-auto px-6 py-8">
				{/* Header */}
				<div className="mb-8">
					<Button
						variant="ghost"
						onClick={() => onNavigate("sat-section-select")}
						className="mb-4 transition-all duration-200 hover:scale-105"
						style={{ color: "var(--color-text-secondary)" }}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = "var(--color-muted)";
							e.currentTarget.style.color = "var(--color-text-primary)";
							const icon = e.currentTarget.querySelector("svg");
							if (icon) {
								(icon as HTMLElement).style.color = "var(--color-accent)";
							}
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = "transparent";
							e.currentTarget.style.color = "var(--color-text-secondary)";
							const icon = e.currentTarget.querySelector("svg");
							if (icon) {
								(icon as HTMLElement).style.color = "var(--color-text-secondary)";
							}
						}}
					>
						<ArrowLeft className="w-4 h-4 mr-2 transition-colors duration-200" />
						Back to Section Select
					</Button>

					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>
								Detailed Results
							</h1>
							<p className="text-lg" style={{ color: "var(--color-text-secondary)" }}>
								{selectedTest.name}
							</p>
						</div>
						<Badge
							className="px-4 py-2 text-sm font-medium flex items-center gap-2"
							style={{
								backgroundColor: "var(--color-status-success)",
								color: "white",
								border: "none",
							}}
						>
							<CheckCircle2 className="w-4 h-4" />
							Test Completed
						</Badge>
					</div>
				</div>

				{/* Total Score Card - Highlighted */}
				<Card
					className="mb-6 border-2 rounded-xl"
					style={{
						backgroundColor: "var(--color-card-default-bg)",
						borderColor: "var(--color-accent)",
						boxShadow: "0 8px 30px rgba(0, 145, 179, 0.15)",
					}}
				>
					<CardContent className="py-8">
						<div className="text-center">
							<div className="mb-4">
								<div
									className="inline-flex p-4 rounded-full mb-4"
									style={{
										backgroundColor: "var(--color-primary-light)",
									}}
								>
									<Target className="w-8 h-8" style={{ color: "var(--color-accent)" }} />
								</div>
							</div>
							<div className="text-6xl font-bold mb-3" style={{ color: "var(--color-accent)" }}>
								{totalScore}
							</div>
							<div className="text-xl font-medium mb-2" style={{ color: "var(--color-text-primary)" }}>
								Total SAT Score
							</div>
							<div className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
								out of 1600 points
							</div>

							{/* Score Breakdown */}
							<div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
								{sections.map((section) => (
									<div key={section.id} className="text-center">
										<div
											className="text-2xl font-bold"
											style={{
												color: section.completed ? "var(--color-accent)" : "var(--color-text-tertiary)",
											}}
										>
											{section.completed ? section.score : "---"}
										</div>
										<div
											className="text-xs"
											style={{
												color: "var(--color-text-secondary)",
											}}
										>
											{section.name}
										</div>
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Performance Metrics */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<Card
						className="border rounded-lg"
						style={{
							backgroundColor: "var(--color-card-default-bg)",
							borderColor: "var(--color-card-border)",
							boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
						}}
					>
						<CardContent className="py-6">
							<div className="text-center">
								<div
									className="inline-flex p-3 rounded-lg mb-3"
									style={{
										backgroundColor: "var(--color-primary-light)",
									}}
								>
									<Target className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
								</div>
								<div
									className="text-3xl font-bold mb-2"
									style={{
										color: "var(--color-status-success)",
									}}
								>
									{overallAccuracy}%
								</div>
								<div
									className="text-sm"
									style={{
										color: "var(--color-text-secondary)",
									}}
								>
									Accuracy Rate
								</div>
								<div
									className="text-xs mt-1"
									style={{
										color: "var(--color-text-tertiary)",
									}}
								>
									{totalCorrectAnswers}/{totalQuestions} correct
								</div>
							</div>
						</CardContent>
					</Card>

					<Card
						className="border rounded-lg"
						style={{
							backgroundColor: "var(--color-card-default-bg)",
							borderColor: "var(--color-card-border)",
							boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
						}}
					>
						<CardContent className="py-6">
							<div className="text-center">
								<div
									className="inline-flex p-3 rounded-lg mb-3"
									style={{
										backgroundColor: "var(--color-primary-light)",
									}}
								>
									<BarChart3 className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
								</div>
								<div className="text-3xl font-bold mb-2" style={{ color: "var(--color-accent)" }}>
									{averagePercentile}th
								</div>
								<div
									className="text-sm"
									style={{
										color: "var(--color-text-secondary)",
									}}
								>
									Percentile
								</div>
								<div
									className="text-xs mt-1"
									style={{
										color: "var(--color-text-tertiary)",
									}}
								>
									ranking
								</div>
							</div>
						</CardContent>
					</Card>

					<Card
						className="border rounded-lg"
						style={{
							backgroundColor: "var(--color-card-default-bg)",
							borderColor: "var(--color-card-border)",
							boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
						}}
					>
						<CardContent className="py-6">
							<div className="text-center">
								<div
									className="inline-flex p-3 rounded-lg mb-3"
									style={{
										backgroundColor: "var(--color-primary-light)",
									}}
								>
									<TrendingUp
										className="w-5 h-5"
										style={{
											color: "var(--color-status-success)",
										}}
									/>
								</div>
								<div
									className="text-3xl font-bold mb-2 flex items-center justify-center gap-1"
									style={{
										color: "var(--color-status-success)",
									}}
								>
									<span>+</span>
									<span>35</span>
								</div>
								<div
									className="text-sm"
									style={{
										color: "var(--color-text-secondary)",
									}}
								>
									Score Change
								</div>
								<div
									className="text-xs mt-1"
									style={{
										color: "var(--color-text-tertiary)",
									}}
								>
									vs previous test
								</div>
							</div>
						</CardContent>
					</Card>

					<Card
						className="border rounded-lg"
						style={{
							backgroundColor: "var(--color-card-default-bg)",
							borderColor: "var(--color-card-border)",
							boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
						}}
					>
						<CardContent className="py-6">
							<div className="text-center">
								<div
									className="inline-flex p-3 rounded-lg mb-3"
									style={{
										backgroundColor: "var(--color-primary-light)",
									}}
								>
									<Clock className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
								</div>
								<div className="text-3xl font-bold mb-2" style={{ color: "var(--color-accent)" }}>
									{completedSections.reduce((sum, section) => sum + section.timeSpent, 0)}
								</div>
								<div
									className="text-sm"
									style={{
										color: "var(--color-text-secondary)",
									}}
								>
									Minutes
								</div>
								<div
									className="text-xs mt-1"
									style={{
										color: "var(--color-text-tertiary)",
									}}
								>
									total time spent
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Section Breakdown */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
					{sections.map((section) => (
						<Card
							key={section.id}
							className="border rounded-lg"
							style={{
								backgroundColor: section.completed ? "var(--color-card-completed-bg)" : "var(--color-card-default-bg)",
								borderColor: "var(--color-card-border)",
								boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
								opacity: section.completed ? 1 : 0.6,
							}}
						>
							<CardHeader className="pb-3">
								<CardTitle className="flex items-center justify-between">
									<span
										style={{
											color: "var(--color-text-primary)",
										}}
									>
										{section.name}
									</span>
									{section.completed && (
										<Badge
											className="px-2 py-1 text-xs font-medium"
											style={{
												backgroundColor: "var(--color-status-success)",
												color: "white",
												border: "none",
											}}
										>
											Complete
										</Badge>
									)}
								</CardTitle>
							</CardHeader>
							<CardContent>
								{section.completed ? (
									<div className="space-y-4">
										<div className="text-center">
											<div
												className="text-3xl font-bold"
												style={{
													color: "var(--color-status-success)",
												}}
											>
												{section.score}
											</div>
											<div
												className="text-sm"
												style={{
													color: "var(--color-text-secondary)",
												}}
											>
												out of {section.outOf}
											</div>
										</div>

										<div className="grid grid-cols-2 gap-4 text-sm">
											<div
												className="p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
												style={{
													backgroundColor: "#ffffff",
													border: "1px solid var(--color-card-border)",
												}}
											>
												<div
													className="font-medium"
													style={{
														color: "var(--color-text-primary)",
													}}
												>
													{section.correctAnswers}/{section.totalQuestions}
												</div>
												<div
													style={{
														color: "var(--color-text-secondary)",
													}}
												>
													Correct
												</div>
											</div>
											<div
												className="p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
												style={{
													backgroundColor: "#ffffff",
													border: "1px solid var(--color-card-border)",
												}}
											>
												<div
													className="font-medium"
													style={{
														color: "var(--color-text-primary)",
													}}
												>
													{section.percentile}th
												</div>
												<div
													style={{
														color: "var(--color-text-secondary)",
													}}
												>
													Percentile
												</div>
											</div>
											<div
												className="p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
												style={{
													backgroundColor: "#ffffff",
													border: "1px solid var(--color-card-border)",
												}}
											>
												<div
													className="font-medium"
													style={{
														color: "var(--color-text-primary)",
													}}
												>
													{section.timeSpent} min
												</div>
												<div
													style={{
														color: "var(--color-text-secondary)",
													}}
												>
													Time Used
												</div>
											</div>
											<div
												className="p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
												style={{
													backgroundColor: "#ffffff",
													border: "1px solid var(--color-card-border)",
												}}
											>
												<div
													className="font-medium"
													style={{
														color: "var(--color-text-primary)",
													}}
												>
													{Math.round((section.correctAnswers / section.totalQuestions) * 100)}%
												</div>
												<div
													style={{
														color: "var(--color-text-secondary)",
													}}
												>
													Accuracy
												</div>
											</div>
										</div>
									</div>
								) : (
									<div className="text-center py-8">
										<div
											className="text-lg font-medium mb-2"
											style={{
												color: "var(--color-text-secondary)",
											}}
										>
											Not Completed
										</div>
										<div
											className="text-sm"
											style={{
												color: "var(--color-text-tertiary)",
											}}
										>
											Complete this section to see detailed results
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					))}
				</div>

				{/* Performance Analysis Chart */}
				{completedSections.length > 0 && (
					<Card
						className="mb-8 border rounded-lg"
						style={{
							backgroundColor: "var(--color-card-default-bg)",
							borderColor: "var(--color-card-border)",
							boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
						}}
					>
						<CardHeader>
							<CardTitle className="flex items-center justify-between" style={{ color: "var(--color-text-primary)" }}>
								<div className="flex items-center space-x-3">
									<div
										className="p-2 rounded-lg"
										style={{
											backgroundColor: "var(--color-primary-light)",
										}}
									>
										<BarChart3 className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
									</div>
									<span>Performance Analysis</span>
								</div>

								{/* Chart Controls */}
								<div className="flex gap-4">
									{/* Section Selection for Chart */}
									<div className="flex gap-2">
										{["reading", "writing", "math"].map((section) => (
											<Button
												key={section}
												size="sm"
												variant={chartSection === section ? "default" : "outline"}
												onClick={() => setChartSection(section as "reading" | "writing" | "math")}
												className="px-3 py-1 transition-colors duration-200"
												style={
													chartSection === section
														? {
																backgroundColor: "var(--color-primary)",
																color: "white",
																borderColor: "var(--color-primary)",
														  }
														: {
																color: "var(--color-text-secondary)",
																borderColor: "var(--color-card-border)",
														  }
												}
											>
												{section.charAt(0).toUpperCase() + section.slice(1)}
											</Button>
										))}
									</div>

									{/* Correct/Incorrect Toggle */}
									<div className="flex gap-1 bg-muted rounded-lg p-1">
										<Button
											size="sm"
											variant={chartDataType === "correct" ? "default" : "ghost"}
											onClick={() => setChartDataType("correct")}
											className="px-3 py-1 h-8 transition-colors duration-200"
											style={
												chartDataType === "correct"
													? {
															backgroundColor: "var(--color-status-success)",
															color: "white",
													  }
													: {
															color: "var(--color-text-secondary)",
													  }
											}
										>
											Correct
										</Button>
										<Button
											size="sm"
											variant={chartDataType === "incorrect" ? "default" : "ghost"}
											onClick={() => setChartDataType("incorrect")}
											className="px-3 py-1 h-8 transition-colors duration-200"
											style={
												chartDataType === "incorrect"
													? {
															backgroundColor: "var(--color-status-error)",
															color: "white",
													  }
													: {
															color: "var(--color-text-secondary)",
													  }
											}
										>
											Incorrect
										</Button>
									</div>
								</div>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="h-72 relative">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart
										data={(() => {
											// Chart data based on selected section and type
											const chartDataBySectionAndType = {
												reading: {
													correct: [
														{ category: "Main Idea", count: 8 },
														{ category: "Inference", count: 6 },
														{
															category: "Vocabulary",
															count: 12,
														},
														{
															category: "Text Structure",
															count: 7,
														},
														{ category: "Evidence", count: 9 },
														{
															category: "Data Analysis",
															count: 3,
														},
													],
													incorrect: [
														{ category: "Main Idea", count: 2 },
														{ category: "Inference", count: 4 },
														{
															category: "Vocabulary",
															count: 1,
														},
														{
															category: "Text Structure",
															count: 3,
														},
														{ category: "Evidence", count: 2 },
														{
															category: "Data Analysis",
															count: 2,
														},
													],
												},
												writing: {
													correct: [
														{ category: "Grammar", count: 11 },
														{
															category: "Punctuation",
															count: 8,
														},
														{
															category: "Transitions",
															count: 5,
														},
														{
															category: "Sentence Structure",
															count: 9,
														},
														{
															category: "Word Choice",
															count: 7,
														},
														{
															category: "Organization",
															count: 4,
														},
													],
													incorrect: [
														{ category: "Grammar", count: 3 },
														{
															category: "Punctuation",
															count: 2,
														},
														{
															category: "Transitions",
															count: 4,
														},
														{
															category: "Sentence Structure",
															count: 1,
														},
														{
															category: "Word Choice",
															count: 3,
														},
														{
															category: "Organization",
															count: 3,
														},
													],
												},
												math: {
													correct: [
														{ category: "Algebra", count: 14 },
														{ category: "Geometry", count: 8 },
														{
															category: "Statistics",
															count: 6,
														},
														{
															category: "Trigonometry",
															count: 4,
														},
														{
															category: "Functions",
															count: 10,
														},
														{
															category: "Data Analysis",
															count: 7,
														},
													],
													incorrect: [
														{ category: "Algebra", count: 2 },
														{ category: "Geometry", count: 4 },
														{
															category: "Statistics",
															count: 3,
														},
														{
															category: "Trigonometry",
															count: 5,
														},
														{ category: "Functions", count: 1 },
														{
															category: "Data Analysis",
															count: 3,
														},
													],
												},
											};

											return chartDataBySectionAndType[chartSection][chartDataType];
										})()}
										margin={{
											top: 45,
											right: 35,
											left: 25,
											bottom: 10,
										}}
										barCategoryGap="35%"
										maxBarSize={60}
									>
										{/* Gradient Definitions */}
										<defs>
											<linearGradient id="correctGradient" x1="0" y1="0" x2="0" y2="1">
												<stop offset="0%" stopColor="var(--color-status-success)" stopOpacity={0.9} />
												<stop offset="100%" stopColor="var(--color-status-success)" stopOpacity={0.6} />
											</linearGradient>
											<linearGradient id="incorrectGradient" x1="0" y1="0" x2="0" y2="1">
												<stop offset="0%" stopColor="var(--color-status-error)" stopOpacity={0.9} />
												<stop offset="100%" stopColor="var(--color-status-error)" stopOpacity={0.6} />
											</linearGradient>
											<linearGradient id="accentGradient" x1="0" y1="0" x2="0" y2="1">
												<stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.9} />
												<stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0.6} />
											</linearGradient>
											<filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
												<feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.1)" />
											</filter>
										</defs>

										{/* Subtle Grid */}
										<CartesianGrid
											strokeDasharray="2 4"
											stroke="var(--color-card-border)"
											strokeOpacity={0.4}
											vertical={false}
										/>

										{/* Enhanced Axes */}
										<XAxis
											dataKey="category"
											tick={{
												fontSize: 11,
												fill: "var(--color-text-secondary)",
												fontWeight: 500,
											}}
											axisLine={{
												stroke: "var(--color-card-border)",
												strokeWidth: 1.5,
											}}
											tickLine={{
												stroke: "var(--color-card-border)",
												strokeWidth: 1,
											}}
											angle={0}
											textAnchor="middle"
											height={45}
											interval={0}
										/>
										<YAxis
											tick={{
												fontSize: 11,
												fill: "var(--color-text-secondary)",
												fontWeight: 500,
											}}
											axisLine={{
												stroke: "var(--color-card-border)",
												strokeWidth: 1.5,
											}}
											tickLine={{
												stroke: "var(--color-card-border)",
												strokeWidth: 1,
											}}
											label={{
												value: "Questions",
												angle: 0,
												position: "top",
												offset: 15,
												style: {
													textAnchor: "start",
													fill: "var(--color-text-secondary)",
													fontSize: "12px",
													fontWeight: 600,
												},
											}}
											allowDecimals={false}
										/>

										{/* Modern Tooltip */}
										<Tooltip
											content={({ active, payload, label }) => {
												if (active && payload && payload.length) {
													return (
														<div
															className="backdrop-blur-lg rounded-xl p-4 shadow-2xl border"
															style={{
																backgroundColor: "var(--color-card-default-bg)",
																borderColor: "var(--color-card-border)",
																boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
															}}
														>
															<div className="flex items-center space-x-2 mb-2">
																<div
																	className="w-3 h-3 rounded-full"
																	style={{
																		backgroundColor:
																			chartDataType === "correct"
																				? "var(--color-status-success)"
																				: "var(--color-status-error)",
																	}}
																/>
																<span
																	className="font-medium text-sm"
																	style={{
																		color: "var(--color-text-primary)",
																	}}
																>
																	{label}
																</span>
															</div>
															<div className="flex items-center justify-between space-x-4">
																<span
																	className="text-xs capitalize"
																	style={{
																		color: "var(--color-text-secondary)",
																	}}
																>
																	{chartDataType} answers
																</span>
																<span
																	className="font-bold text-lg"
																	style={{
																		color: "var(--color-text-primary)",
																	}}
																>
																	{payload[0].value}
																</span>
															</div>
														</div>
													);
												}
												return null;
											}}
											cursor={{
												fill: "var(--color-muted)",
												fillOpacity: 0.1,
												stroke: "none",
											}}
										/>

										{/* Enhanced Bar with Gradient and Animation */}
										<Bar
											dataKey="count"
											fill={`url(#${chartDataType}Gradient)`}
											radius={[8, 8, 0, 0]}
											filter="url(#shadow)"
											animationDuration={800}
											animationBegin={0}
										/>
									</BarChart>
								</ResponsiveContainer>

								{/* Modern Chart Overlay Effects */}
								<div className="absolute inset-0 pointer-events-none">
									<div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 animate-pulse" />
								</div>
							</div>

							{/* Chart Summary */}
							<div
								className="mt-4 p-3 rounded-lg"
								style={{
									backgroundColor: "var(--color-muted)",
								}}
							>
								<div className="flex items-center justify-between text-sm">
									<span
										style={{
											color: "var(--color-text-secondary)",
										}}
									>
										Showing {chartDataType} answers for {chartSection.charAt(0).toUpperCase() + chartSection.slice(1)}{" "}
										section
									</span>
									<span
										style={{
											color: "var(--color-text-primary)",
										}}
									>
										Total:{" "}
										{(() => {
											const chartDataBySectionAndType = {
												reading: { correct: 45, incorrect: 14 },
												writing: { correct: 44, incorrect: 16 },
												math: { correct: 49, incorrect: 18 },
											};
											return chartDataBySectionAndType[chartSection][chartDataType];
										})()}{" "}
										questions
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Wrong Questions Analysis */}
				{completedSections.length > 0 && (
					<Card
						className="mb-8 border rounded-lg"
						style={{
							backgroundColor: "var(--color-card-default-bg)",
							borderColor: "var(--color-card-border)",
							boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
						}}
					>
						<CardHeader>
							<CardTitle className="flex items-center justify-between" style={{ color: "var(--color-text-primary)" }}>
								<div className="flex items-center space-x-3">
									<div
										className="p-2 rounded-lg"
										style={{
											backgroundColor: "var(--color-primary-light)",
										}}
									>
										<TrendingUp className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
									</div>
									<span>Areas for Improvement</span>
								</div>

								{/* Section Selection Buttons */}
								<div className="flex gap-2">
									{["reading", "writing", "math"].map((section) => (
										<Button
											key={section}
											size="sm"
											variant={selectedSection === section ? "default" : "outline"}
											onClick={() => setSelectedSection(section as "reading" | "writing" | "math")}
											className="px-4 py-2 transition-colors duration-200"
											style={
												selectedSection === section
													? {
															backgroundColor: "var(--color-primary)",
															color: "white",
															borderColor: "var(--color-primary)",
													  }
													: {
															color: "var(--color-text-secondary)",
															borderColor: "var(--color-card-border)",
													  }
											}
										>
											{section.charAt(0).toUpperCase() + section.slice(1)}
										</Button>
									))}
								</div>
							</CardTitle>
						</CardHeader>
						<CardContent>
							{/* Scrollable container with max 3 cards visible */}
							<div className="max-h-[400px] overflow-y-auto scrollbar-custom space-y-4 pb-6">
								{(() => {
									// Mock data for each section"s wrong questions
									const wrongQuestionsBySection = {
										reading: [
											{
												questionNumber: 12,
												difficulty: "Medium" as const,
												topic: "Main Idea",
												explanation:
													"This passage discusses the central theme of environmental conservation. Focus on identifying key supporting details.",
											},
											{
												questionNumber: 25,
												difficulty: "Hard" as const,
												topic: "Inference",
												explanation:
													"The author implies rather than states directly. Look for contextual clues to understand the underlying message.",
											},
											{
												questionNumber: 38,
												difficulty: "Easy" as const,
												topic: "Vocabulary in Context",
												explanation:
													"Consider how the word functions within the specific sentence and paragraph context.",
											},
											{
												questionNumber: 41,
												difficulty: "Medium" as const,
												topic: "Text Structure",
												explanation:
													"Analyze how the author organizes information to support their argument effectively.",
											},
										],
										writing: [
											{
												questionNumber: 8,
												difficulty: "Medium" as const,
												topic: "Grammar",
												explanation:
													"Subject-verb agreement error. Pay attention to the actual subject of the sentence, not just the nearest noun.",
											},
											{
												questionNumber: 19,
												difficulty: "Hard" as const,
												topic: "Transitions",
												explanation:
													"The transition word should show contrast, not addition. Consider the logical relationship between ideas.",
											},
											{
												questionNumber: 33,
												difficulty: "Easy" as const,
												topic: "Punctuation",
												explanation: "Comma splice error. Two independent clauses cannot be joined with just a comma.",
											},
											{
												questionNumber: 44,
												difficulty: "Medium" as const,
												topic: "Sentence Structure",
												explanation:
													"The sentence is unnecessarily wordy. Choose the most concise option that maintains clarity.",
											},
										],
										math: [
											{
												questionNumber: 15,
												difficulty: "Hard" as const,
												topic: "Quadratic Functions",
												explanation:
													"Remember to consider both positive and negative roots when solving quadratic equations.",
											},
											{
												questionNumber: 28,
												difficulty: "Medium" as const,
												topic: "Statistics",
												explanation:
													"Standard deviation measures spread. A larger standard deviation indicates more variability in the data.",
											},
											{
												questionNumber: 35,
												difficulty: "Easy" as const,
												topic: "Linear Equations",
												explanation:
													"Isolate the variable by performing the same operation on both sides of the equation.",
											},
											{
												questionNumber: 42,
												difficulty: "Hard" as const,
												topic: "Trigonometry",
												explanation:
													"Use the unit circle to find exact values of trigonometric functions at special angles.",
											},
										],
									};

									return wrongQuestionsBySection[selectedSection].map((question, index) => (
										<div
											key={index}
											className="p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
											style={{
												backgroundColor: "#ffffff",
												border: "1px solid var(--color-card-border)",
											}}
										>
											<div className="flex items-start justify-between mb-3">
												<div className="flex items-center space-x-3">
													<Badge
														className="px-2 py-1 text-xs"
														style={{
															backgroundColor: "var(--color-accent)",
															color: "white",
															border: "none",
														}}
													>
														{selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}
													</Badge>
													<span
														className="font-medium"
														style={{
															color: "var(--color-text-primary)",
														}}
													>
														Question {question.questionNumber}
													</span>
													<Badge
														className="px-2 py-1 text-xs"
														style={{
															backgroundColor:
																question.difficulty === "Hard"
																	? "var(--color-difficulty-hard)"
																	: question.difficulty === "Medium"
																	? "var(--color-difficulty-medium)"
																	: "var(--color-difficulty-easy)",
															color: "white",
															border: "none",
														}}
													>
														{question.difficulty}
													</Badge>
												</div>
												<Button
													size="sm"
													className="px-3 py-1 bg-primary hover:bg-primary-hover text-white transition-colors duration-200"
													style={{
														backgroundColor: "var(--color-primary)",
														color: "white",
													}}
												>
													<Eye className="w-3 h-3 mr-1" />
													Review
												</Button>
											</div>
											<div className="mb-2">
												<span
													className="text-sm font-medium"
													style={{
														color: "var(--color-text-secondary)",
													}}
												>
													Topic: {question.topic}
												</span>
											</div>
											<p
												className="text-sm"
												style={{
													color: "var(--color-text-secondary)",
												}}
											>
												{question.explanation}
											</p>
										</div>
									));
								})()}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button
						size="lg"
						className="px-8 py-3 flex items-center gap-3 transition-all duration-200 hover:scale-105"
						onClick={() => onNavigate("sat-section-select")}
						style={{
							backgroundColor: "var(--color-accent)",
							color: "white",
							border: "none",
						}}
					>
						<RotateCcw className="w-5 h-5" />
						<span>Retake Sections</span>
					</Button>
					<Button
						variant="outline"
						size="lg"
						className="px-8 py-3 flex items-center gap-3 transition-all duration-200 hover:scale-105"
						onClick={() => onNavigate("dashboard")}
						style={{
							borderColor: "var(--color-card-border)",
							color: "var(--color-text-primary)",
						}}
					>
						<Eye className="w-5 h-5" />
						<span>Back to Dashboard</span>
					</Button>
				</div>
			</div>
		</div>
	);
}
