import { supabase } from "./supabase";
import type {
	Profile,
	ProfileInsert,
	ProfileUpdate,
	Service,
	UserService,
	UserServiceInsert,
	UserRole,
	UserState,
	AuthUser,
} from "@/types";

// Auth helper functions
export class AuthService {
	/**
	 * 이메일 중복 검사 함수
	 * Supabase RPC 함수 check_email_duplicate를 호출하여 이메일 중복 여부 확인
	 * @param email 검사할 이메일 주소
	 * @returns boolean - true: 중복, false: 사용 가능
	 */
	static async checkEmailExists(email: string): Promise<boolean> {
		try {
			const { data, error } = await supabase.rpc("check_email_duplicate", {
				email_to_check: email,
			});

			if (error) {
				console.error("이메일 중복 검사 중 오류:", error);
				return false; // 에러 시 안전하게 false 반환
			}

			return data as boolean;
		} catch (error) {
			console.error("이메일 중복 검사 중 예외:", error);
			return false; // 예외 시 안전하게 false 반환
		}
	}

	/**
	 * 회원가입 함수
	 * 1. 이메일 중복 검사
	 * 2. Supabase Auth를 통한 사용자 생성
	 * 3. 이메일 인증 링크 발송
	 * 4. raw_user_meta_data에 사용자 정보 저장 (트리거에서 사용)
	 */
	static async signUp(
		email: string,
		password: string,
		name: string,
		role: UserRole = "student",
		university?: string,
		major?: string
	) {
		// 1. 이메일 중복 검사
		const emailExists = await this.checkEmailExists(email);
		if (emailExists) {
			throw new Error("이미 사용 중인 이메일입니다.");
		}

		// 2. Supabase Auth를 통한 회원가입
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				// 이메일 인증 완료 후 리다이렉트될 URL
				emailRedirectTo: `${window.location.origin}/auth/callback`,
				// 사용자 메타데이터 (handle_new_user 트리거에서 사용)
				data: {
					name,
					role,
					university,
					major,
				},
			},
		});

		if (error) {
			throw error;
		}
		return data;
	}

	/**
	 * 로그인 함수
	 * Supabase Auth를 통한 이메일/비밀번호 로그인
	 * @param email 이메일 주소
	 * @param password 비밀번호
	 * @returns Supabase 로그인 응답 데이터 (user, session)
	 */
	static async signIn(email: string, password: string) {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) throw error;
		return data;
	}

	/**
	 * 로그아웃 함수
	 * 1. Supabase 세션 종료
	 * 2. 로컬 스토리지 정리
	 * 3. 상태 초기화
	 */
	static async signOut() {
		console.log("AuthService.signOut 시작");

		try {
			// Supabase 세션 종료
			const { error } = await supabase.auth.signOut();
			if (error) {
				console.error("Supabase signOut 에러:", error);
				throw error;
			}
			console.log("Supabase signOut 성공");
		} catch (error) {
			console.error("AuthService.signOut 실패:", error);
			throw error;
		}
	}

	// Clear all auth data (for debugging/invalid sessions)
	static async clearAuthData() {
		try {
			// Sign out from Supabase
			await supabase.auth.signOut();

			// Clear local storage
			if (typeof window !== "undefined") {
				localStorage.removeItem("sb-vwkoswyythmekfpfgwos-auth-token");
				localStorage.removeItem("supabase.auth.token");
				// Clear any other Supabase related keys
				Object.keys(localStorage).forEach((key) => {
					if (key.startsWith("sb-") || key.includes("supabase")) {
						localStorage.removeItem(key);
					}
				});
			}
		} catch (error) {
			console.error("Error clearing auth data:", error);
		}
	}

	// Get current user
	static async getCurrentUser() {
		try {
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();

			// If there's no session, return null instead of throwing error
			if (error) {
				// Handle specific error types
				if (error.message.includes("JWT") || error.message.includes("sub claim")) {
					await AuthService.clearAuthData();
				} else if (error.message.includes("session missing") || error.message.includes("Auth session missing")) {
					// Session missing is normal when user is not logged in
					return null;
				}
				// For other errors, still throw
				throw error;
			}
			return user;
		} catch (error) {
			// If there's any error getting the user, check if it's a session error
			if (
				error instanceof Error &&
				(error.message.includes("session missing") || error.message.includes("Auth session missing"))
			) {
				// Session missing is normal when user is not logged in
				return null;
			}
			// For other errors, clear the session and throw
			await supabase.auth.signOut();
			throw error;
		}
	}

	// Get user profile
	static async getUserProfile(userId: string): Promise<Profile | null> {
		try {
			// console.log("Getting profile for user:", userId); // Debug log
			const { data, error } = await supabase.from("profile").select("*").eq("id", userId).single();

			if (error) {
				console.log("Profile query error:", {
					code: error.code,
					message: error.message,
					details: error.details,
					hint: error.hint,
				});

				if (error.code === "PGRST116") {
					console.log("Profile not found (PGRST116)");
					return null; // No rows returned
				}
				throw error;
			}

			// console.log("Profile found:", data); // Debug log
			return data;
		} catch (error) {
			console.error("Unexpected error in getUserProfile:", error);
			throw error;
		}
	}

	// Update user profile
	static async updateProfile(userId: string, updates: ProfileUpdate) {
		const { data, error } = await supabase.from("profile").update(updates).eq("id", userId).select().single();

		if (error) throw error;
		return data;
	}

	// Get user services
	static async getUserServices(userId: string): Promise<UserService[]> {
		try {
			// console.log("Getting services for user:", userId); // Debug log
			const { data, error } = await supabase
				.from("user_service")
				.select(
					`
					*,
					service:service_id (
						id,
						service_name,
						category
					)
				`
				)
				.eq("user_id", userId);

			if (error) {
				console.log("User services query error:", {
					code: error.code,
					message: error.message,
					details: error.details,
					hint: error.hint,
				});
				throw error;
			}

			// console.log("User services found:", data); // Debug log
			return data || [];
		} catch (error) {
			console.error("Unexpected error in getUserServices:", error);
			throw error;
		}
	}

	// Request service access
	static async requestServiceAccess(userId: string, serviceId: string) {
		const { data, error } = await supabase
			.from("user_service")
			.upsert({
				user_id: userId,
				service_id: serviceId,
				is_confirm: false,
			})
			.select()
			.single();

		if (error) throw error;
		return data;
	}

	// Get all services
	static async getServices(): Promise<Service[]> {
		const { data, error } = await supabase.from("service").select("*").is("deleted_at", null);

		if (error) throw error;
		return data || [];
	}

	// Check if user can access LMS (student with approve state)
	static canAccessLMS(profile: Profile | null): boolean {
		if (!profile) return false;
		return profile.role === "student" && profile.state === "approve";
	}

	// Check if user is pending approval
	static isPendingApproval(profile: Profile | null): boolean {
		if (!profile) return false;
		return profile.role === "student" && profile.state === "pending";
	}

	// Get user access status
	static getUserAccessStatus(profile: Profile | null): "approved" | "pending" | "denied" | "no_profile" {
		if (!profile) return "no_profile";

		if (profile.role === "student") {
			return profile.state === "approve" ? "approved" : "pending";
		}

		// Non-student roles are denied LMS access for now
		return "denied";
	}

	// Get complete user data (profile + services)
	static async getCompleteUserData(userId: string): Promise<AuthUser | null> {
		try {
			const user = await this.getCurrentUser();
			if (!user || user.id !== userId) return null;

			// Get profile and services, but handle errors gracefully
			let profile = null;
			let services = [];

			try {
				profile = await this.getUserProfile(userId);
			} catch (error) {
				console.error("Error getting user profile:", error);
				// Profile might not exist yet or RLS might be blocking, that's okay for now
				profile = null;
			}

			try {
				services = (await this.getUserServices(userId)) || [];
			} catch (error) {
				console.error("Error getting user services:", error);
				// Services might not exist yet or RLS might be blocking, that's okay for now
				services = [];
			}

			return {
				id: user.id,
				email: user.email || "",
				profile: profile || undefined,
				services,
			};
		} catch (error) {
			console.error("Error getting complete user data:", error);
			// If there's an error getting user data, return null instead of throwing
			return null;
		}
	}

	// Check if user has access to a service
	static async hasServiceAccess(userId: string, serviceCategory: "ap" | "sat"): Promise<boolean> {
		try {
			const services = await this.getUserServices(userId);
			return services.some(
				(userService) => userService.is_confirm && userService.service?.category === serviceCategory
			);
		} catch (error) {
			console.error("Error checking service access:", error);
			return false;
		}
	}

	// Reset password
	static async resetPassword(email: string) {
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/reset-password`,
		});

		if (error) throw error;
	}

	// Send email verification
	static async sendEmailVerification(email: string) {
		const { error } = await supabase.auth.resend({
			type: "signup",
			email: email,
			options: {
				emailRedirectTo: `${window.location.origin}/auth/callback`,
			},
		});

		if (error) throw error;
	}

	// Check if email is verified
	static async isEmailVerified(): Promise<boolean> {
		try {
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();
			if (error || !user) return false;
			return user.email_confirmed_at !== null;
		} catch (error) {
			console.error("Error checking email verification:", error);
			return false;
		}
	}
}

// Auth state management
export class AuthState {
	private static listeners: Set<(user: AuthUser | null) => void> = new Set();

	static subscribe(listener: (user: AuthUser | null) => void) {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	static notify(user: AuthUser | null) {
		this.listeners.forEach((listener) => listener(user));
	}

	static async initialize() {
		// Listen to auth state changes
		supabase.auth.onAuthStateChange(async (event, session) => {
			console.log("Auth state changed:", event, session ? "session exists" : "no session");

			if (event === "SIGNED_IN" && session?.user) {
				try {
					const userData = await AuthService.getCompleteUserData(session.user.id);
					this.notify(userData);
				} catch (error) {
					console.error("Error getting user data:", error);
					// If user data can't be retrieved, sign out and clear session
					await supabase.auth.signOut();
					this.notify(null);
				}
			} else if (event === "SIGNED_OUT") {
				console.log("User signed out, clearing state");
				this.notify(null);
			} else if (!session) {
				console.log("No session, clearing state");
				this.notify(null);
			}
		});

		// Get initial user and handle invalid sessions
		try {
			const user = await AuthService.getCurrentUser();
			if (user) {
				try {
					const userData = await AuthService.getCompleteUserData(user.id);
					this.notify(userData);
				} catch (error) {
					console.error("Error getting initial user data:", error);
					// If user data can't be retrieved, sign out and clear session
					await supabase.auth.signOut();
					this.notify(null);
				}
			} else {
				// No user found, which is normal when not logged in
				this.notify(null);
			}
		} catch (error) {
			console.error("Error getting current user:", error);
			// If there's an auth error (like invalid JWT), clear all auth data
			if (error instanceof Error && (error.message.includes("JWT") || error.message.includes("sub claim"))) {
				await AuthService.clearAuthData();
			}
			this.notify(null);
		}
	}
}
