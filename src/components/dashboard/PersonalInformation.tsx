"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { User, GraduationCap, BookOpen, Save, X } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import type { ProfileUpdate } from "@/types";
import type { User as UserType } from "@/types";

interface PersonalInformationProps {
	user: UserType | null;
}

interface UserProfile {
	name: string;
	targetUniversity: string;
	targetMajor: string;
	currentGPA: string;
	apScore: string;
	satScore: string;
}

export function PersonalInformation({ user }: PersonalInformationProps) {
	const { user: authUser, updateProfile } = useAuthStore();

	// Get user profile data from Supabase
	const [userProfile, setUserProfile] = useState<UserProfile>({
		name: authUser?.profile?.name || user?.name || "Test Student",
		targetUniversity: authUser?.profile?.university || "Stanford University",
		targetMajor: authUser?.profile?.major || "Computer Science",
		currentGPA: authUser?.profile?.gpa?.toString() || "3.85",
		apScore: authUser?.profile?.ap_score?.toString() || "5",
		satScore: authUser?.profile?.sat_score?.toString() || "1500+",
	});

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editedProfile, setEditedProfile] = useState<UserProfile>(userProfile);

	const handleEdit = () => {
		setEditedProfile(userProfile);
		setIsDialogOpen(true);
	};

	const handleSave = async () => {
		try {
			// Update profile in Supabase
			const profileUpdate: ProfileUpdate = {
				name: editedProfile.name,
				university: editedProfile.targetUniversity,
				major: editedProfile.targetMajor,
				gpa: parseFloat(editedProfile.currentGPA),
				ap_score: parseFloat(editedProfile.apScore),
				sat_score: parseFloat(editedProfile.satScore),
			};
			await updateProfile(profileUpdate);

			setUserProfile(editedProfile);
			setIsDialogOpen(false);
			console.log("Profile updated:", editedProfile);
		} catch (error) {
			console.error("Failed to update profile:", error);
		}
	};

	const handleCancel = () => {
		setEditedProfile(userProfile);
		setIsDialogOpen(false);
	};

	const handleInputChange = (field: keyof UserProfile, value: string) => {
		setEditedProfile((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	return (
		<>
			<Card
				className="h-full border shadow-sm"
				style={{ backgroundColor: "var(--primary)", borderColor: "var(--primary-hover)" }}
			>
				<CardHeader className="pb-3">
					<CardTitle className="flex items-center justify-between text-white text-lg font-semibold">
						<div className="flex items-center space-x-2">
							<User className="w-5 h-5" />
							<span>Personal Information</span>
						</div>
						<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
							<DialogTrigger asChild>
								<button
									className="p-2 rounded-lg transition-all duration-200 bg-white/10 hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30"
									onClick={handleEdit}
									aria-label="Edit personal information"
								>
									<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
										/>
									</svg>
								</button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px] bg-card border border-primary/20">
								<DialogHeader>
									<DialogTitle className="flex items-center space-x-2 text-foreground">
										<User className="w-5 h-5 text-primary" />
										<span>Edit Personal Information</span>
									</DialogTitle>
								</DialogHeader>
								<div className="space-y-4 py-4">
									{/* Name */}
									<div className="space-y-2">
										<label className="text-sm font-medium text-foreground">Full Name</label>
										<Input
											value={editedProfile.name}
											onChange={(e) => handleInputChange("name", e.target.value)}
											className="bg-background border-border text-foreground"
											placeholder="Enter your full name"
										/>
									</div>

									{/* Target University */}
									<div className="space-y-2">
										<label className="text-sm font-medium text-foreground">Target University</label>
										<Input
											value={editedProfile.targetUniversity}
											onChange={(e) => handleInputChange("targetUniversity", e.target.value)}
											className="bg-background border-border text-foreground"
											placeholder="Enter target university"
										/>
									</div>

									{/* Target Major */}
									<div className="space-y-2">
										<label className="text-sm font-medium text-foreground">Target Major</label>
										<Input
											value={editedProfile.targetMajor}
											onChange={(e) => handleInputChange("targetMajor", e.target.value)}
											className="bg-background border-border text-foreground"
											placeholder="Enter target major"
										/>
									</div>

									{/* Current GPA */}
									<div className="space-y-2">
										<label className="text-sm font-medium text-foreground">Current GPA</label>
										<Input
											value={editedProfile.currentGPA}
											onChange={(e) => handleInputChange("currentGPA", e.target.value)}
											className="bg-background border-border text-foreground"
											placeholder="Enter current GPA (e.g., 3.85)"
										/>
									</div>

									{/* Score Goals - Separated */}
									<div className="grid grid-cols-2 gap-4">
										{/* AP Score */}
										<div className="space-y-2">
											<label className="text-sm font-medium text-foreground">Target AP Score</label>
											<Input
												value={editedProfile.apScore}
												onChange={(e) => handleInputChange("apScore", e.target.value)}
												className="bg-background border-border text-foreground"
												placeholder="e.g., 5"
											/>
										</div>

										{/* SAT Score */}
										<div className="space-y-2">
											<label className="text-sm font-medium text-foreground">Target SAT Score</label>
											<Input
												value={editedProfile.satScore}
												onChange={(e) => handleInputChange("satScore", e.target.value)}
												className="bg-background border-border text-foreground"
												placeholder="e.g., 1500+"
											/>
										</div>
									</div>

									{/* Action Buttons */}
									<div className="flex justify-end space-x-2 pt-4">
										<Button
											variant="outline"
											onClick={handleCancel}
											className="border-border text-foreground hover:bg-muted"
										>
											<X className="w-4 h-4 mr-2" />
											Cancel
										</Button>
										<Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary-hover">
											<Save className="w-4 h-4 mr-2" />
											Save Changes
										</Button>
									</div>
								</div>
							</DialogContent>
						</Dialog>
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="space-y-2">
						<div className="flex items-center space-x-3">
							<div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center text-white">
								<User className="w-6 h-6" />
							</div>
							<div>
								<h3 className="font-bold text-white text-lg">{userProfile.name}</h3>
								<p className="text-sm text-white/90 font-medium">Student ID: STU2024001</p>
							</div>
						</div>

						<div className="space-y-3 pt-3 border-t border-white/30">
							<div className="flex items-center justify-between">
								<span className="text-base text-white font-medium">Target University</span>
								<Badge className="bg-white/25 text-white border-white/40 font-semibold text-sm px-3 py-1">
									{userProfile.targetUniversity}
								</Badge>
							</div>

							<div className="flex items-center justify-between">
								<span className="text-base text-white font-medium">Target Major</span>
								<div className="flex items-center space-x-2 text-white">
									<GraduationCap className="w-5 h-5" />
									<span className="text-base font-semibold">{userProfile.targetMajor}</span>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<span className="text-base text-white font-medium">Current GPA</span>
								<span className="text-xl font-bold text-white">{userProfile.currentGPA}</span>
							</div>

							<div className="flex items-center justify-between">
								<span className="text-base text-white font-medium">Target Scores</span>
								<div className="flex items-center space-x-2 text-white">
									<BookOpen className="w-5 h-5" />
									<div className="flex items-center space-x-2">
										<Badge className="bg-white/25 text-white border-white/40 text-sm font-bold px-3 py-1">
											AP: {userProfile.apScore}
										</Badge>
										<Badge className="bg-white/25 text-white border-white/40 text-sm font-bold px-3 py-1">
											SAT: {userProfile.satScore}
										</Badge>
									</div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
