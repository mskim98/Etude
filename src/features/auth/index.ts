// Components
export { LoginForm } from "./components/LoginForm";
export { SignUpForm } from "./components/SignUpForm";
export { ForgotPasswordForm } from "./components/ForgotPasswordForm";

// Hooks
export { useAuth, useAuthRedirect } from "./hooks/useAuth";
export { useLoginForm, useSignUpForm, useForgotPasswordForm } from "./hooks/useAuthForm";

// Store
export { useAuthStore, AuthStateManager } from "./store/authStore";

// Services
export { AuthService } from "./services/authService";

// Types
export type {
	AuthUser,
	AuthState,
	LoginFormData,
	SignUpFormData,
	ForgotPasswordFormData,
	AuthResponse,
	AuthError,
	Profile,
	UserRole,
	UserState,
} from "./types/auth.types";

// Utils
export {
	loginSchema,
	signUpSchema,
	forgotPasswordSchema,
	validateEmail,
	validatePassword,
	getPasswordStrength,
} from "./utils/validation";

// Constants
export {
	AUTH_ROUTES,
	DASHBOARD_ROUTES,
	AUTH_ERRORS,
	USER_ROLES,
	USER_STATES,
	STORAGE_KEYS,
} from "./constants/auth.constants";
