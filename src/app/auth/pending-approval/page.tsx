"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PendingApprovalPage } from "@/components/forms/PendingApprovalPage";
import { useAuth, useAuthRedirect } from "@/features/auth";

export default function PendingApprovalPageRoute() {
	const router = useRouter();
	const { user, isLoading } = useAuth();
	const { getRedirectPath } = useAuthRedirect();
	const [shouldRedirect, setShouldRedirect] = useState(false);

	useEffect(() => {
		if (isLoading || shouldRedirect) return;

		if (!user) {
			setShouldRedirect(true);
			router.push("/auth/login");
			return;
		}

		const redirectPath = getRedirectPath();
		if (redirectPath && redirectPath !== "/auth/pending-approval") {
			setShouldRedirect(true);
			router.push(redirectPath);
		}
	}, [user, isLoading, router, shouldRedirect, getRedirectPath]);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	if (shouldRedirect || !user) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Redirecting...</p>
				</div>
			</div>
		);
	}

	return <PendingApprovalPage profile={user.profile} />;
}
