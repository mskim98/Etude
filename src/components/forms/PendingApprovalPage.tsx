"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, Mail, User, RefreshCw, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth";
import type { Profile } from "@/types";

interface PendingApprovalPageProps {
	profile?: Profile | null;
}

export function PendingApprovalPage({ profile }: PendingApprovalPageProps) {
	const router = useRouter();
	const { signOut } = useAuth();
	const [isChecking, setIsChecking] = useState(false);

	const handleCheckStatus = async () => {
		setIsChecking(true);
		// Force page reload to get latest auth state
		setTimeout(() => {
			window.location.reload();
		}, 1000);
	};

	const handleSignOut = async () => {
		try {
			await signOut();
			router.push("/login");
		} catch (error) {
			console.error("Sign out error:", error);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<Card className="w-full max-w-md mx-auto">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 p-3 bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center">
						<Clock className="h-8 w-8 text-yellow-600" />
					</div>
					<CardTitle className="text-xl font-semibold text-gray-900">Approval Pending</CardTitle>
					<CardDescription className="text-gray-600">Waiting for account approval</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* User Info */}
					{profile && (
						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<User className="h-4 w-4 text-gray-500" />
								<div>
									<p className="text-sm font-medium text-gray-900">{profile.name}</p>
									<p className="text-xs text-gray-500">
										{profile.university} - {profile.major}
									</p>
								</div>
							</div>

							<div className="flex items-center gap-2">
								<Badge variant="outline" className="text-yellow-600 border-yellow-200">
									<Clock className="h-3 w-3 mr-1" />
									Pending
								</Badge>
								<Badge variant="secondary">Student</Badge>
							</div>
						</div>
					)}

					{/* Status Message */}
					<Alert>
						<Mail className="h-4 w-4" />
						<AlertDescription>
							Your account is being reviewed by an administrator. Once approved, you will have access to the LMS. This
							typically takes 1-2 business days.
						</AlertDescription>
					</Alert>

					{/* Action Buttons */}
					<div className="space-y-3">
						<Button onClick={handleCheckStatus} className="w-full" disabled={isChecking}>
							{isChecking ? (
								<>
									<RefreshCw className="h-4 w-4 mr-2 animate-spin" />
									Checking...
								</>
							) : (
								<>
									<RefreshCw className="h-4 w-4 mr-2" />
									Check Approval Status
								</>
							)}
						</Button>

						<Button variant="outline" onClick={handleSignOut} className="w-full">
							<LogOut className="h-4 w-4 mr-2" />
							Logout
						</Button>
					</div>

					{/* Contact Info */}
					<div className="text-center">
						<p className="text-xs text-gray-500">
							If you have any questions, please contact{" "}
							<a href="mailto:support@etude-lms.com" className="text-blue-600 hover:underline">
								support@etude-lms.com
							</a>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
