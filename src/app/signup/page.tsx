"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupRedirect() {
	const router = useRouter();

	useEffect(() => {
		// Redirect to new auth structure
		router.replace("/auth/signup");
	}, [router]);

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="text-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
				<p className="text-gray-600">Redirecting to signup...</p>
			</div>
		</div>
	);
}
