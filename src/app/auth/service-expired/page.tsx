"use client";

import { useRouter } from "next/navigation";
import { ServiceExpiredPage } from "@/components/forms/ServiceExpiredPage";
import { useAuth } from "@/features/auth";

export default function ServiceExpired() {
	const router = useRouter();
	const { user, signOut } = useAuth();

	const handleContactSupport = () => {
		// Open email client or redirect to contact form
		window.open("mailto:support@etude-lms.com?subject=Service Renewal Request", "_blank");
	};

	const handleLogout = async () => {
		await signOut();
		router.push("/auth/login");
	};

	return (
		<ServiceExpiredPage
			userName={user?.profile?.name}
			endDate={user?.profile?.end_at}
			onContactSupport={handleContactSupport}
			onLogout={handleLogout}
		/>
	);
}
