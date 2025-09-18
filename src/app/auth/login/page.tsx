"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoginForm, useAuth, useAuthRedirect } from "@/features/auth";

export default function Login() {
	const router = useRouter();
	const { user, isLoading } = useAuth();
	const { getRedirectPath } = useAuthRedirect();
	const [isRedirecting, setIsRedirecting] = useState(false);

	// 이미 로그인된 사용자 자동 리다이렉트 처리
	useEffect(() => {
		console.log("Login useEffect:", { user: user?.email, isLoading, isRedirecting });

		if (isLoading || isRedirecting) return;

		if (user) {
			console.log("Login: User found, checking redirect path...");
			const redirectPath = getRedirectPath();
			console.log("Login: Redirect path:", redirectPath);

			if (redirectPath && redirectPath !== "/auth/login") {
				console.log("Login 페이지: 리다이렉트 →", redirectPath);
				setIsRedirecting(true);
				router.push(redirectPath);
			} else {
				console.log("Login: No redirect needed or already on login page");
			}
		} else {
			console.log("Login: No user found");
		}
	}, [user, isLoading, isRedirecting, router, getRedirectPath]);

	if (isLoading || (user && isRedirecting)) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">{isLoading ? "Loading..." : "Redirecting..."}</p>
				</div>
			</div>
		);
	}

	return <LoginForm />;
}
