import type { Database } from "@/types/supabase";

// Database types
export type Profile = Database["public"]["Tables"]["profile"]["Row"];
export type ProfileUpdate = Database["public"]["Tables"]["profile"]["Update"];
export type UserRole = Database["public"]["Enums"]["user_role"];
export type UserState = Database["public"]["Enums"]["user_state"];

// Auth user interface
export interface AuthUser {
	id: string;
	email: string;
	profile?: Profile | null;
}

// Auth form interfaces
export interface LoginFormData {
	email: string;
	password: string;
}

export interface SignUpFormData {
	email: string;
	password: string;
	confirmPassword: string;
	name: string;
	university?: string;
	major?: string;
	role?: UserRole;
}

export interface ForgotPasswordFormData {
	email: string;
}

// Auth state interface
export interface AuthState {
	// State
	user: AuthUser | null;
	isLoading: boolean;
	error: string | null;

	// Computed state
	isAuthenticated: boolean;
	isAdmin: boolean;
	isTeacher: boolean;
	isStudent: boolean;
	isApproved: boolean;
	isExpired: boolean;
	isPendingApproval: boolean;

	// Actions
	setUser: (user: AuthUser | null) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	clearError: () => void;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (data: SignUpFormData) => Promise<void>;
	signOut: () => Promise<void>;
	resetPassword: (email: string) => Promise<void>;
	getUserAccessStatus: () => "approved" | "pending" | "expired" | "denied" | "no_profile";
}

// Auth service response types
export interface AuthResponse {
	user: unknown;
	session: unknown;
}

export interface AuthError {
	message: string;
	status?: number;
}
