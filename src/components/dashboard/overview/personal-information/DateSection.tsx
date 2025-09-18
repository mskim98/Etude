"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Calendar, Clock } from "lucide-react";

export function DateSection() {
	const currentDate = new Date();

	const currentTime = currentDate.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});

	// Get day of year for progress calculation
	const start = new Date(currentDate.getFullYear(), 0, 0);
	const diff = currentDate.getTime() - start.getTime();
	const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
	const totalDays =
		new Date(currentDate.getFullYear(), 11, 31).getTime() - new Date(currentDate.getFullYear(), 0, 1).getTime();
	const yearProgress = Math.round((dayOfYear / (totalDays / (1000 * 60 * 60 * 24))) * 100);

	return (
		<Card className="h-full border shadow-sm bg-white animate-in fade-in-50 duration-500">
			<CardHeader className="pb-6 rounded-t-lg" style={{ backgroundColor: "#0091B3" }}>
				<CardTitle className="flex items-center space-x-2 text-white text-lg font-semibold">
					<Calendar className="w-5 h-5 text-white" />
					<span>Today</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="text-center space-y-2">
					<div className="text-5xl font-bold" style={{ color: "#0091B3" }}>
						{currentDate.getDate()}
					</div>
					<div className="text-lg text-gray-800 font-semibold">
						{currentDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
					</div>
				</div>

				<div className="space-y-3 pt-3 border-t border-gray-200">
					<div className="flex items-center space-x-3 text-gray-800">
						<Clock className="w-6 h-6" style={{ color: "#0091B3" }} />
						<span className="text-lg font-semibold">{currentTime}</span>
					</div>

					<div className="text-center">
						<div className="text-sm text-gray-500 mb-2 font-medium">Day of Week</div>
						<div className="text-lg font-bold text-gray-800">
							{currentDate.toLocaleDateString("en-US", { weekday: "long" })}
						</div>
					</div>

					<div className="text-center">
						<div className="text-sm text-gray-500 mb-2 font-medium">Year Progress</div>
						<div className="text-lg font-bold" style={{ color: "#0091B3" }}>
							{yearProgress}%
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2 mt-2">
							<div
								className="rounded-full h-2 transition-all duration-300 shadow-sm"
								style={{
									width: `${yearProgress}%`,
									backgroundColor: "#0091B3",
								}}
							></div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
