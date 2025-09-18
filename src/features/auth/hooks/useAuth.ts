import { useAuthStore } from "../store/authStore";
// import type { SignUpFormData } from "../types/auth.types"; // Currently not used

/**
 * 인증 관련 상태와 액션을 제공하는 커스텀 훅
 */
export const useAuth = () => {
	const store = useAuthStore();

	return {
		// State
		user: store.user,
		isLoading: store.isLoading,
		error: store.error,

		// Computed state
		isAuthenticated: store.isAuthenticated,
		isAdmin: store.isAdmin,
		isTeacher: store.isTeacher,
		isStudent: store.isStudent,
		isApproved: store.isApproved,
		isExpired: store.isExpired,
		isPendingApproval: store.isPendingApproval,

		// Actions
		signIn: store.signIn,
		signUp: store.signUp,
		signOut: store.signOut,
		resetPassword: store.resetPassword,
		setError: store.setError,
		clearError: store.clearError,
		getUserAccessStatus: store.getUserAccessStatus,
	};
};

/**
 * 인증 상태에 따른 리다이렉트 로직을 제공하는 훅
 */
export const useAuthRedirect = () => {
	const { isAuthenticated, getUserAccessStatus } = useAuth();

	const getRedirectPath = (): string | null => {
		console.log("useAuthRedirect: Checking redirect path...");
		console.log("useAuthRedirect: isAuthenticated:", isAuthenticated);

		if (!isAuthenticated) {
			console.log("useAuthRedirect: Not authenticated, redirect to login");
			return "/auth/login";
		}

		const status = getUserAccessStatus();
		console.log("useAuthRedirect: User access status:", status);

		switch (status) {
			case "approved":
				console.log("useAuthRedirect: Approved user, redirect to dashboard");
				return "/dashboard";
			case "pending":
				console.log("useAuthRedirect: Pending user, redirect to pending-approval");
				return "/auth/pending-approval";
			case "expired":
				console.log("useAuthRedirect: Expired user, redirect to service-expired");
				return "/auth/service-expired";
			case "denied":
			case "no_profile":
				console.log("useAuthRedirect: Denied/no profile, redirect to login");
				return "/auth/login";
			default:
				console.log("useAuthRedirect: Unknown status, no redirect");
				return null;
		}
	};

	return { getRedirectPath };
};
