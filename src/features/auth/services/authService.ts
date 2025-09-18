import { supabase } from "@/lib/supabase";
import type { AuthUser, AuthResponse, SignUpFormData, Profile, ProfileUpdate } from "../types/auth.types";

export class AuthService {
	/**
	 * 이메일 중복 검사
	 */
	static async checkEmailExists(email: string): Promise<boolean> {
		try {
			const { data, error } = await (supabase as unknown as any).rpc("check_email_duplicate", {
				email_to_check: email,
			});

			if (error) {
				console.error("Email duplicate check error:", error);
				return false;
			}

			return data as boolean;
		} catch (error) {
			console.error("Email duplicate check exception:", error);
			return false;
		}
	}

	/**
	 * 회원가입
	 */
	static async signUp(formData: SignUpFormData): Promise<AuthResponse> {
		const { email, password, name, university, major, role = "student" } = formData;

		// 이메일 중복 검사
		const emailExists = await this.checkEmailExists(email);
		if (emailExists) {
			throw new Error("This email is already registered");
		}

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					name,
					university,
					major,
					role,
				},
				emailRedirectTo: `${window.location.origin}/auth/callback`,
			},
		});

		if (error) {
			throw new Error(error.message);
		}

		if (!data.user) {
			throw new Error("Failed to create user");
		}

		return data;
	}

	/**
	 * 로그인
	 */
	static async signIn(email: string, password: string): Promise<AuthResponse> {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			throw new Error(error.message);
		}

		if (!data.user) {
			throw new Error("Login failed");
		}

		return data;
	}

	/**
	 * 로그아웃
	 */
	static async signOut(): Promise<void> {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error("Sign out error:", error);
			// 에러가 있어도 로컬 세션은 정리
		}
		await this.clearAuthData();
	}

	/**
	 * 비밀번호 재설정
	 */
	static async resetPassword(email: string): Promise<void> {
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/auth/callback`,
		});

		if (error) {
			throw new Error(error.message);
		}
	}

	/**
	 * 현재 사용자 정보 가져오기
	 */
	static async getCurrentUser(): Promise<AuthUser | null> {
		try {
			console.log("AuthService: Getting current user...");
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();

			if (error) {
				// AuthSessionMissingError는 정상적인 상황 (로그아웃 상태)
				if (error.message.includes("Auth session missing")) {
					console.log("AuthService: No session (user not logged in)");
					return null;
				}
				console.error("AuthService: Get user error:", error);
				return null;
			}

			if (!user) {
				console.log("AuthService: No user found");
				return null;
			}

			console.log("AuthService: User found, getting profile for:", user.id);

			// 프로필 정보 가져오기
			const profile = await this.getUserProfile(user.id);

			const authUser = {
				id: user.id,
				email: user.email || "",
				profile,
			};

			console.log("AuthService: Complete user data:", authUser);
			return authUser;
		} catch (error) {
			// AuthSessionMissingError는 정상적인 상황
			if (error instanceof Error && error.message.includes("Auth session missing")) {
				console.log("AuthService: No session (user not logged in)");
				return null;
			}
			console.error("AuthService: Get current user error:", error);
			return null;
		}
	}

	/**
	 * 사용자 프로필 가져오기
	 */
	static async getUserProfile(userId: string): Promise<Profile | null> {
		try {
			console.log("AuthService: Getting profile for user:", userId);
			const { data, error } = await supabase.from("profile").select("*").eq("id", userId).single();

			if (error) {
				console.error("AuthService: Profile query error:", error);
				return null;
			}

			if (!data) {
				console.log("AuthService: No profile data found");
				return null;
			}

			console.log("AuthService: Profile loaded:", data);
			return data;
		} catch (error) {
			console.error("AuthService: Get user profile error:", error);
			return null;
		}
	}

	/**
	 * 인증 데이터 정리
	 */
	static async clearAuthData(): Promise<void> {
		try {
			// Supabase 세션 정리
			await supabase.auth.signOut();

			// localStorage 정리 (Zustand persist)
			localStorage.removeItem("auth-storage");
		} catch (error) {
			console.error("Clear auth data error:", error);
		}
	}

	/**
	 * 사용자 접근 상태 확인
	 */
	static getUserAccessStatus(profile: Profile | null): "approved" | "pending" | "expired" | "denied" | "no_profile" {
		if (!profile) return "no_profile";

		switch (profile.state) {
			case "approve":
				return "approved";
			case "pending":
				return "pending";
			case "expired":
				return "expired";
			default:
				return "denied";
		}
	}

	/**
	 * LMS 접근 가능 여부 확인
	 */
	static canAccessLMS(profile: Profile | null): boolean {
		return profile?.role === "student" && profile?.state === "approve";
	}

	/**
	 * 승인 대기 상태 확인
	 */
	static isPendingApproval(profile: Profile | null): boolean {
		return profile?.state === "pending";
	}

	/**
	 * 서비스 만료 상태 확인
	 */
	static isServiceExpired(profile: Profile | null): boolean {
		return profile?.state === "expired";
	}

	/**
	 * 사용자 프로필 업데이트
	 */
	static async updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile> {
		const { data, error } = await supabase.from("profile").update(updates).eq("id", userId).select().single();

		if (error) {
			throw new Error(error.message);
		}

		return data;
	}
}
