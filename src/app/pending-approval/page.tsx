"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PendingApprovalPage } from "@/components/PendingApprovalPage";
import { useAuthStore, initializeAuthStore } from "@/store/auth";

export default function PendingApprovalPageRoute() {
	const router = useRouter();
	const { user, isLoading, getUserAccessStatus } = useAuthStore();
	const [shouldRedirect, setShouldRedirect] = useState(false);

	// Initialize auth store
	useEffect(() => {
		initializeAuthStore();
	}, []);

	useEffect(() => {
		if (isLoading || shouldRedirect) return;

		if (!user) {
			// Not logged in, redirect to login
			setShouldRedirect(true);
			router.push("/login");
			return;
		}

		const accessStatus = getUserAccessStatus();

		if (accessStatus === "approved") {
			// User is approved, redirect to dashboard
			setShouldRedirect(true);
			router.push("/dashboard");
		} else if (accessStatus === "no_profile") {
			// No profile, redirect to login for re-authentication
			setShouldRedirect(true);
			router.push("/login");
		}
		// If pending or denied, stay on this page
	}, [user, isLoading, router, shouldRedirect]);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">로딩 중...</p>
				</div>
			</div>
		);
	}

	if (shouldRedirect || !user) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">리다이렉트 중...</p>
				</div>
			</div>
		);
	}

	return <PendingApprovalPage profile={user.profile} />;
}
