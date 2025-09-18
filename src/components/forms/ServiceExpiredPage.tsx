"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AlertTriangle, Calendar, Clock, Mail, Phone } from "lucide-react";

interface ServiceExpiredPageProps {
	userName?: string;
	endDate?: string;
	onContactSupport: () => void;
	onLogout: () => void;
}

export function ServiceExpiredPage({
	userName = "Student",
	endDate = "2025-06-30",
	onContactSupport,
	onLogout,
}: ServiceExpiredPageProps) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("ko-KR", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
			<Card className="max-w-md w-full border-2 border-red-200 shadow-lg">
				<CardHeader className="text-center pb-4" style={{ backgroundColor: "#0091B3" }}>
					<div className="flex justify-center mb-4">
						<div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
							<AlertTriangle className="w-8 h-8 text-white" />
						</div>
					</div>
					<CardTitle className="text-xl font-bold text-white">Service Period Expired</CardTitle>
					<p className="text-white/80 text-sm mt-2">Your LMS access has expired</p>
				</CardHeader>

				<CardContent className="p-6 space-y-6">
					{/* User Info */}
					<div className="text-center space-y-2">
						<h3 className="text-lg font-semibold text-gray-900">Hello, {userName}</h3>
						<p className="text-gray-600">Your learning management system access has expired.</p>
					</div>

					{/* Expiry Details */}
					<div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
						<div className="flex items-center space-x-2 mb-3">
							<Calendar className="w-5 h-5 text-red-600" />
							<span className="font-semibold text-red-800">Service Period</span>
						</div>
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<span className="text-sm text-gray-600">End Date:</span>
								<Badge variant="destructive" className="font-semibold">
									{formatDate(endDate)}
								</Badge>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm text-gray-600">Status:</span>
								<Badge variant="destructive">Expired</Badge>
							</div>
						</div>
					</div>

					{/* Contact Information */}
					<div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
						<div className="flex items-center space-x-2 mb-3">
							<Mail className="w-5 h-5" style={{ color: "#0091B3" }} />
							<span className="font-semibold" style={{ color: "#0091B3" }}>
								Need to Renew?
							</span>
						</div>
						<p className="text-sm text-gray-700 mb-3">
							Contact our support team to extend your service period and continue your learning journey.
						</p>
						<div className="space-y-2 text-sm">
							<div className="flex items-center space-x-2">
								<Mail className="w-4 h-4 text-gray-500" />
								<span className="text-gray-600">support@etude-lms.com</span>
							</div>
							<div className="flex items-center space-x-2">
								<Phone className="w-4 h-4 text-gray-500" />
								<span className="text-gray-600">1588-1234</span>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="space-y-3">
						<Button onClick={onContactSupport} className="w-full text-white" style={{ backgroundColor: "#0091B3" }}>
							<Mail className="w-4 h-4 mr-2" />
							Contact Support
						</Button>
						<Button variant="outline" onClick={onLogout} className="w-full border-gray-300">
							Logout
						</Button>
					</div>

					{/* Additional Info */}
					<div className="text-center pt-4 border-t border-gray-200">
						<p className="text-xs text-gray-500">
							Thank you for using Etude LMS. We look forward to serving you again!
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
