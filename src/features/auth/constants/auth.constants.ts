// Auth routes
export const AUTH_ROUTES = {
	LOGIN: "/auth/login",
	SIGNUP: "/auth/signup",
	FORGOT_PASSWORD: "/auth/forgot-password",
	CALLBACK: "/auth/callback",
	PENDING_APPROVAL: "/auth/pending-approval",
	SERVICE_EXPIRED: "/auth/service-expired",
} as const;

// Dashboard routes
export const DASHBOARD_ROUTES = {
	OVERVIEW: "/dashboard/overview",
	AP_COURSES: "/dashboard/ap-courses",
	SAT_EXAMS: "/dashboard/sat-exams",
} as const;

// Auth error messages
export const AUTH_ERRORS = {
	INVALID_CREDENTIALS: "Invalid email or password",
	EMAIL_ALREADY_EXISTS: "This email is already registered",
	WEAK_PASSWORD: "Password is too weak",
	NETWORK_ERROR: "Network error. Please try again.",
	UNKNOWN_ERROR: "An unexpected error occurred",
} as const;

// User roles
export const USER_ROLES = {
	STUDENT: "student",
	TEACHER: "teacher",
	ADMIN: "admin",
} as const;

// User states
export const USER_STATES = {
	PENDING: "pending",
	APPROVE: "approve",
	EXPIRED: "expired",
} as const;

// Local storage keys
export const STORAGE_KEYS = {
	AUTH_STORAGE: "auth-storage",
} as const;
