"use client";
import React, { useState } from "react";
import { Card, CardContent } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { User, GraduationCap, BookOpen, Save, X, Target, TrendingUp, Edit2, Calendar } from "lucide-react";
import { useAuth, AuthService } from "@/features/auth";
import type { ProfileUpdate } from "@/types";

interface PersonalInformationProps {
	className?: string;
}

interface UserProfile {
	university: string;
	major: string;
	gpa: string;
	apScore: string;
	satScore: string;
}

export function PersonalInformation({ className }: PersonalInformationProps) {
	const { user: authUser } = useAuth();

	// Get user profile data from Supabase
	const [userProfile, setUserProfile] = useState<UserProfile>({
		university: authUser?.profile?.university || "University",
		major: authUser?.profile?.major || "Major",
		gpa: authUser?.profile?.gpa?.toString() || "0.0",
		apScore: authUser?.profile?.ap_score?.toString() || "0",
		satScore: authUser?.profile?.sat_score?.toString() || "0",
	});

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editedProfile, setEditedProfile] = useState<UserProfile>(userProfile);
	const [isLoading, setIsLoading] = useState(false);

	const handleEdit = () => {
		setEditedProfile(userProfile);
		setIsDialogOpen(true);
	};

	const handleSave = async () => {
		try {
			setIsLoading(true);
			// Update profile in Supabase
			const profileUpdate: ProfileUpdate = {
				university: editedProfile.university,
				major: editedProfile.major,
				gpa: parseFloat(editedProfile.gpa),
				ap_score: parseFloat(editedProfile.apScore),
				sat_score: parseFloat(editedProfile.satScore),
			};

			const success = await AuthService.updateProfile(authUser?.id || "", profileUpdate);

			if (success) {
				setUserProfile(editedProfile);
				setIsDialogOpen(false);
			}
		} catch (error) {
			console.error("Profile update failed:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		setEditedProfile(userProfile);
		setIsDialogOpen(false);
	};

	const getScoreIcon = (type: "AP" | "SAT" | "GPA") => {
		switch (type) {
			case "AP":
				return <BookOpen className="w-5 h-5" style={{ color: "#0091B3" }} />;
			case "SAT":
				return <Target className="w-5 h-5" style={{ color: "#0091B3" }} />;
			case "GPA":
				return <TrendingUp className="w-5 h-5" style={{ color: "#0091B3" }} />;
		}
	};

	// 실제 서비스 날짜 사용
	const serviceStartDate = authUser?.profile?.start_at || "2024-09-01";
	const serviceEndDate = authUser?.profile?.end_at || "2025-06-30";

	return (
		<>
			<Card className={`h-full border shadow-sm animate-in fade-in-50 duration-500 bg-white ${className || ""}`}>
				{/* Header with point color - same as other overview components */}
				<div className="pb-3 rounded-t-lg px-6 py-4" style={{ backgroundColor: "#0091B3" }}>
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
								<User className="w-5 h-5 text-white" />
							</div>
							<div>
								<h2 className="text-lg font-semibold text-white">{authUser?.profile?.name || "Student"}</h2>
								<Badge className="bg-white/20 text-white border-white/30 text-xs">
									{authUser?.profile?.role || "Student"}
								</Badge>
							</div>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleEdit}
							className="text-white hover:bg-white/10 border border-white/20"
						>
							<Edit2 className="w-4 h-4 mr-2" />
							Edit
						</Button>
					</div>
				</div>

				<CardContent className="p-6 space-y-4">
					{/* Academic Information */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Left: Academic Goals */}
						<div className="space-y-4">
							<div className="flex items-center space-x-2 text-gray-700">
								<GraduationCap className="w-5 h-5" style={{ color: "#0091B3" }} />
								<span className="font-semibold">Academic Goals</span>
							</div>
							<div className="space-y-3">
								<div
									className="bg-white rounded-lg p-4 border-2 border-gray-300 shadow-sm flex flex-col justify-center"
									style={{ height: "120px" }}
								>
									<div className="space-y-3">
										<div>
											<p className="text-xs font-medium text-gray-500 mb-2">Target University</p>
											<p className="font-semibold text-gray-900 text-lg">{userProfile.university}</p>
										</div>
										<div>
											<p className="text-xs font-medium text-gray-500 mb-2">Intended Major</p>
											<p className="font-semibold text-gray-900 text-lg">{userProfile.major}</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Right: Target Scores */}
						<div className="space-y-4">
							<div className="flex items-center space-x-2 text-gray-700">
								<Target className="w-5 h-5" style={{ color: "#0091B3" }} />
								<span className="font-semibold">Target Score</span>
							</div>
							<div className="grid grid-cols-3 gap-3" style={{ height: "120px" }}>
								{/* GPA */}
								<div className="bg-white rounded-lg p-4 text-center border-2 border-gray-300 shadow-sm flex flex-col justify-center">
									<div className="flex items-center justify-center mb-2">{getScoreIcon("GPA")}</div>
									<p className="text-2xl font-bold text-gray-800">{userProfile.gpa}</p>
									<p className="text-xs font-medium text-gray-500">GPA</p>
								</div>

								{/* AP Score */}
								<div className="bg-white rounded-lg p-4 text-center border-2 border-gray-300 shadow-sm flex flex-col justify-center">
									<div className="flex items-center justify-center mb-2">{getScoreIcon("AP")}</div>
									<p className="text-2xl font-bold text-gray-800">{userProfile.apScore}</p>
									<p className="text-xs font-medium text-gray-500">AP Avg</p>
								</div>

								{/* SAT Score */}
								<div className="bg-white rounded-lg p-4 text-center border-2 border-gray-300 shadow-sm flex flex-col justify-center">
									<div className="flex items-center justify-center mb-2">{getScoreIcon("SAT")}</div>
									<p className="text-2xl font-bold text-gray-800">{userProfile.satScore}</p>
									<p className="text-xs font-medium text-gray-500">SAT</p>
								</div>
							</div>
						</div>
					</div>

					{/* Service Overview Bar */}
					<div className="bg-white rounded-lg p-4 border-2 border-gray-300 shadow-sm">
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center space-x-2">
								<Calendar className="w-5 h-5" style={{ color: "#0091B3" }} />
								<span className="font-semibold text-gray-800">Service Overview</span>
							</div>
						</div>
						<div className="grid grid-cols-3 gap-3 text-center">
							<div className="bg-white rounded-lg p-3 border-2 border-gray-300 shadow-sm">
								<p className="text-xs font-medium text-gray-500">Start Date</p>
								<p className="text-sm font-bold text-gray-800">{serviceStartDate}</p>
							</div>
							<div className="bg-white rounded-lg p-3 border-2 border-gray-300 shadow-sm">
								<p className="text-xs font-medium text-gray-500">End Date</p>
								<p className="text-sm font-bold text-gray-800">{serviceEndDate}</p>
							</div>
							<div className="bg-white rounded-lg p-3 border-2 border-gray-300 shadow-sm">
								<p className="text-xs font-medium text-gray-500">Status</p>
								<p className="text-sm font-bold" style={{ color: "#0091B3" }}>
									{authUser?.profile?.state === "approve" ? "Active" : "Pending"}
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Edit Profile Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle className="flex items-center space-x-2 text-xl">
							<User className="w-6 h-6" style={{ color: "#0091B3" }} />
							<span>Edit Profile</span>
						</DialogTitle>
					</DialogHeader>

					<div className="space-y-6 py-4">
						{/* Academic Info */}
						<div className="space-y-3">
							<h3 className="text-sm font-semibold text-gray-700 flex items-center space-x-2 border-b border-gray-200 pb-2">
								<GraduationCap className="w-4 h-4" style={{ color: "#0091B3" }} />
								<span>Academic Goals</span>
							</h3>
							<div className="bg-gray-50 rounded-lg p-4 space-y-4">
								<div>
									<label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
										Target University
									</label>
									<Input
										value={editedProfile.university}
										onChange={(e) => setEditedProfile({ ...editedProfile, university: e.target.value })}
										placeholder="e.g., Stanford University"
										className="mt-2 border-gray-200 focus:border-primary focus:ring-primary"
									/>
								</div>
								<div>
									<label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Intended Major</label>
									<Input
										value={editedProfile.major}
										onChange={(e) => setEditedProfile({ ...editedProfile, major: e.target.value })}
										placeholder="e.g., Computer Science"
										className="mt-2 border-gray-200 focus:border-primary focus:ring-primary"
									/>
								</div>
							</div>
						</div>

						{/* Target Scores */}
						<div className="space-y-3">
							<h3 className="text-sm font-semibold text-gray-700 flex items-center space-x-2 border-b border-gray-200 pb-2">
								<Target className="w-4 h-4" style={{ color: "#0091B3" }} />
								<span>Target Score</span>
							</h3>
							<div className="bg-gray-50 rounded-lg p-4">
								<div className="grid grid-cols-3 gap-3">
									<div>
										<label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">GPA</label>
										<Input
											value={editedProfile.gpa}
											onChange={(e) => setEditedProfile({ ...editedProfile, gpa: e.target.value })}
											placeholder="4.0"
											className="mt-2 border-gray-200 focus:border-primary focus:ring-primary"
											type="number"
											step="0.1"
											min="0"
											max="4.0"
										/>
									</div>
									<div>
										<label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">AP Avg</label>
										<Input
											value={editedProfile.apScore}
											onChange={(e) => setEditedProfile({ ...editedProfile, apScore: e.target.value })}
											placeholder="5.0"
											className="mt-2 border-gray-200 focus:border-primary focus:ring-primary"
											type="number"
											step="0.1"
											min="1"
											max="5"
										/>
									</div>
									<div>
										<label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">SAT</label>
										<Input
											value={editedProfile.satScore}
											onChange={(e) => setEditedProfile({ ...editedProfile, satScore: e.target.value })}
											placeholder="1600"
											className="mt-2 border-gray-200 focus:border-primary focus:ring-primary"
											type="number"
											min="400"
											max="1600"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
						<Button variant="outline" onClick={handleCancel} disabled={isLoading} className="border-gray-300">
							<X className="w-4 h-4 mr-2" />
							Cancel
						</Button>
						<Button
							onClick={handleSave}
							disabled={isLoading}
							className="text-white hover:opacity-90"
							style={{ backgroundColor: "#0091B3" }}
						>
							<Save className="w-4 h-4 mr-2" />
							{isLoading ? "Saving..." : "Save Changes"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
