"use client";

import { useRouter } from "next/navigation";
import { ForgotPasswordForm } from "@/features/auth";

export default function ForgotPassword() {
	const router = useRouter();

	const handleSuccess = () => {
		// Redirect to login after successful password reset request
		router.push("/auth/login");
	};

	return <ForgotPasswordForm onSuccess={handleSuccess} />;
}
