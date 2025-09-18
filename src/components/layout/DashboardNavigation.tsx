"use client";

import { useRouter, usePathname } from "next/navigation";

interface NavigationTab {
	id: string;
	label: string;
	icon: React.ReactNode;
	path: string;
}

interface DashboardNavigationProps {
	className?: string;
	isMobile?: boolean;
}

export function DashboardNavigation({ className = "", isMobile = false }: DashboardNavigationProps) {
	const router = useRouter();
	const pathname = usePathname();

	const getActiveTab = () => {
		if (pathname.includes("/ap-courses")) return "ap-courses";
		if (pathname.includes("/sat-exams")) return "sat-exams";
		return "overview";
	};

	const navigateToTab = (tab: string) => {
		router.push(`/dashboard/${tab}`);
	};

	const tabs: NavigationTab[] = [
		{
			id: "overview",
			label: "Overview",
			path: "/dashboard/overview",
			icon: (
				<svg className={`${isMobile ? "w-5 h-5" : "w-4 h-4"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
					/>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
					/>
				</svg>
			),
		},
		{
			id: "ap-courses",
			label: "AP Courses",
			path: "/dashboard/ap-courses",
			icon: (
				<svg className={`${isMobile ? "w-5 h-5" : "w-4 h-4"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
					/>
				</svg>
			),
		},
		{
			id: "sat-exams",
			label: "SAT Exams",
			path: "/dashboard/sat-exams",
			icon: (
				<svg className={`${isMobile ? "w-5 h-5" : "w-4 h-4"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
			),
		},
	];

	if (isMobile) {
		return (
			<nav className={`flex justify-center space-x-2 ${className}`}>
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => navigateToTab(tab.id)}
						className={`flex-1 flex flex-col items-center px-4 py-3 text-xs font-semibold rounded-xl transition-all duration-200 ${
							getActiveTab() === tab.id
								? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg border-2 border-blue-200"
								: "bg-transparent hover:bg-gray-100/60 text-gray-600 border-2 border-transparent"
						}`}
					>
						<div className="mb-1.5">{tab.icon}</div>
						{tab.label}
					</button>
				))}
			</nav>
		);
	}

	return (
		<nav className={`flex items-center space-x-2 ${className}`}>
			<div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200/50">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => navigateToTab(tab.id)}
						className={`relative px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 group ${
							getActiveTab() === tab.id
								? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-xl transform scale-105 border-2 border-blue-200"
								: "hover:bg-gray-100/80 hover:scale-102 text-gray-600 border-2 border-transparent"
						}`}
					>
						<span className="flex items-center space-x-2.5">
							{tab.icon}
							<span>{tab.label}</span>
						</span>
						{getActiveTab() === tab.id && (
							<div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-full bg-white/50" />
						)}
					</button>
				))}
			</div>
		</nav>
	);
}
