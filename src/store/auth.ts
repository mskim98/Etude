import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthService, AuthState as AuthStateManager } from "@/lib/auth";
import type { AuthUser, UserRole, ProfileUpdate, Profile, UserService } from "@/types";

/**
 * 인증 상태 관리를 위한 Zustand Store 인터페이스
 * PROJECT_DOCUMENTATION.md 규격에 따라 React Context 대신 Zustand 사용
 */
interface AuthState {
	// 기본 상태
	user: AuthUser | null; // 현재 로그인된 사용자 정보
	isLoading: boolean; // 로딩 상태
	error: string | null; // 에러 메시지

	// 기본 액션들
	setUser: (user: AuthUser | null) => void; // 사용자 정보 설정 (computed state와 함께 업데이트)
	setLoading: (loading: boolean) => void; // 로딩 상태 설정
	setError: (error: string | null) => void; // 에러 상태 설정
	clearError: () => void; // 에러 상태 초기화

	// 인증 관련 액션들 (PROJECT_DOCUMENTATION.md 규격 준수)
	signUp: (
		email: string,
		password: string,
		name: string,
		role?: UserRole,
		university?: string,
		major?: string
	) => Promise<{ user: any; session: any }>; // 회원가입 (이메일 인증 링크 발송까지)
	signIn: (email: string, password: string) => Promise<{ user: any; session: any }>; // 로그인
	signOut: () => Promise<void>; // 로그아웃
	forceLogout: () => Promise<void>; // 강제 로그아웃 (세션 문제 시 사용)

	// 프로필 관련 액션들
	updateProfile: (updates: ProfileUpdate) => Promise<Profile>; // 프로필 정보 업데이트

	// 서비스 접근 권한 관련 액션들
	requestServiceAccess: (serviceId: string) => Promise<UserService>; // AP/SAT 서비스 접근 권한 요청
	hasServiceAccess: (serviceCategory: "ap" | "sat") => Promise<boolean>; // 서비스 접근 권한 확인

	// 비밀번호 관련 액션들
	resetPassword: (email: string) => Promise<void>; // 비밀번호 재설정 이메일 발송
	sendEmailVerification: (email: string) => Promise<void>; // 이메일 인증 발송
	checkEmailVerification: () => Promise<boolean>; // 이메일 인증 상태 확인
	clearAuthData: () => Promise<void>; // 모든 인증 데이터 초기화

	// 계산된 상태들 (사용자 정보 변경 시 자동 업데이트)
	isAuthenticated: boolean; // 인증 여부
	isAdmin: boolean; // 관리자 여부 (role === 'admin')
	isTeacher: boolean; // 교사 여부 (role === 'teacher')
	isStudent: boolean; // 학생 여부 (role === 'student')
	isApproved: boolean; // 승인 여부 (state === 'approve')
	canAccessLMS: boolean; // LMS 접근 가능 여부 (student + approve)
	isPendingApproval: boolean; // 승인 대기 여부 (state === 'pending')
	getUserAccessStatus: () => "approved" | "pending" | "denied" | "no_profile"; // 사용자 접근 상태 확인
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			// 초기 상태 설정
			user: null,
			isLoading: false,
			error: null,

			// 기본 액션들 - computed state와 함께 업데이트
			setUser: (user) => {
				// 사용자 정보 설정 시 모든 계산된 상태들을 함께 업데이트
				const newState = {
					user,
					error: null, // 사용자 설정 시 에러 초기화
					isAuthenticated: !!user, // 사용자가 있으면 인증됨
					isAdmin: user?.profile?.role === "admin", // 관리자 여부
					isTeacher: user?.profile?.role === "teacher", // 교사 여부
					isStudent: user?.profile?.role === "student", // 학생 여부
					isApproved: user?.profile?.state === "approve", // 승인 여부
					canAccessLMS: AuthService.canAccessLMS(user?.profile || null), // LMS 접근 가능 여부
					isPendingApproval: AuthService.isPendingApproval(user?.profile || null), // 승인 대기 여부
				};
				console.log("setUser 호출 - computed states 업데이트:", newState);
				set(newState);
			},
			setLoading: (isLoading) => set({ isLoading }), // 로딩 상태 설정
			setError: (error) => set({ error }), // 에러 상태 설정
			clearError: () => set({ error: null }), // 에러 상태 초기화

			// 인증 관련 액션들
			signUp: async (email, password, name, role = "student", university, major) => {
				try {
					set({ error: null, isLoading: true }); // 에러 초기화 및 로딩 시작
					// AuthService를 통해 Supabase에 회원가입 요청
					const result = await AuthService.signUp(email, password, name, role, university, major);
					return result;
				} catch (err) {
					// 에러 발생 시 사용자에게 보여줄 메시지 설정
					const errorMessage = err instanceof Error ? err.message : "회원가입에 실패했습니다";
					set({ error: errorMessage });
					throw err;
				} finally {
					set({ isLoading: false }); // 로딩 완료
				}
			},

			signIn: async (email, password) => {
				try {
					set({ error: null, isLoading: true }); // 에러 초기화 및 로딩 시작
					// AuthService를 통해 Supabase에 로그인 요청
					const result = await AuthService.signIn(email, password);
					return result;
				} catch (err) {
					// 에러 발생 시 사용자에게 보여줄 메시지 설정
					const errorMessage = err instanceof Error ? err.message : "로그인에 실패했습니다";
					set({ error: errorMessage });
					throw err;
				} finally {
					set({ isLoading: false }); // 로딩 완료
				}
			},

			signOut: async () => {
				try {
					console.log("Zustand signOut 시작");
					set({ error: null, isLoading: true });

					// Clear user state immediately
					set({ user: null });

					// Sign out from Supabase
					await AuthService.signOut();

					console.log("Zustand signOut 완료");
				} catch (err) {
					console.error("Zustand signOut 에러:", err);
					const errorMessage = err instanceof Error ? err.message : "Sign out failed";
					set({ error: errorMessage });

					// Even if signOut fails, clear the user state
					set({ user: null });
					throw err;
				} finally {
					set({ isLoading: false });
					console.log("Zustand signOut finally 블록 실행");
				}
			},

			forceLogout: async () => {
				console.log("Zustand Force logout initiated");
				set({ user: null, isLoading: false, error: null });

				// Try to clear Supabase session without waiting
				try {
					await AuthService.clearAuthData();
				} catch (err) {
					console.error("Error during force logout:", err);
				}
			},

			// Profile actions
			updateProfile: async (updates) => {
				const { user } = get();
				if (!user?.id) throw new Error("No user logged in");

				try {
					set({ error: null, isLoading: true });
					const updatedProfile = await AuthService.updateProfile(user.id, updates);

					// Update local state
					set({
						user: user
							? {
									...user,
									profile: updatedProfile,
							  }
							: null,
					});

					return updatedProfile;
				} catch (err) {
					const errorMessage = err instanceof Error ? err.message : "Profile update failed";
					set({ error: errorMessage });
					throw err;
				} finally {
					set({ isLoading: false });
				}
			},

			// Service actions
			requestServiceAccess: async (serviceId) => {
				const { user } = get();
				if (!user?.id) throw new Error("No user logged in");

				try {
					set({ error: null });
					return await AuthService.requestServiceAccess(user.id, serviceId);
				} catch (err) {
					const errorMessage = err instanceof Error ? err.message : "Service access request failed";
					set({ error: errorMessage });
					throw err;
				}
			},

			hasServiceAccess: async (serviceCategory) => {
				const { user } = get();
				if (!user?.services) return false;

				try {
					return user.services.some((service) => service.service?.category === serviceCategory && service.is_confirm);
				} catch (err) {
					console.error("Error checking service access:", err);
					return false;
				}
			},

			// Password actions
			resetPassword: async (email) => {
				try {
					set({ error: null });
					await AuthService.resetPassword(email);
				} catch (err) {
					const errorMessage = err instanceof Error ? err.message : "Password reset failed";
					set({ error: errorMessage });
					throw err;
				}
			},

			sendEmailVerification: async (email) => {
				try {
					set({ error: null });
					await AuthService.sendEmailVerification(email);
				} catch (err) {
					const errorMessage = err instanceof Error ? err.message : "Email verification failed";
					set({ error: errorMessage });
					throw err;
				}
			},

			checkEmailVerification: async () => {
				try {
					return await AuthService.isEmailVerified();
				} catch (err) {
					console.error("Error checking email verification:", err);
					return false;
				}
			},

			clearAuthData: async () => {
				try {
					set({ error: null });
					await AuthService.clearAuthData();
					set({ user: null });
				} catch (err) {
					console.error("Error clearing auth data:", err);
				}
			},

			// Computed states (as properties that update with state)
			isAuthenticated: false,
			isAdmin: false,
			isTeacher: false,
			isStudent: false,
			isApproved: false,
			canAccessLMS: false,
			isPendingApproval: false,

			getUserAccessStatus: () => {
				return AuthService.getUserAccessStatus(get().user?.profile || null);
			},
		}),
		{
			name: "auth-storage", // localStorage key
			// Only persist user data, not loading/error states
			partialize: (state) => ({ user: state.user }),
			// 데이터 복원 시 computed states도 함께 업데이트
			onRehydrateStorage: () => (state) => {
				if (state && state.user) {
					console.log("persist 데이터 복원 - computed states 재계산:", state.user.email);
					// setUser를 호출해서 computed states 업데이트
					state.setUser(state.user);
				}
			},
		}
	)
);

// Initialize auth state when store is created
let initialized = false;
export const initializeAuthStore = () => {
	if (initialized) return;
	initialized = true;

	// persist된 user 데이터가 있는지 확인하고 computed states 업데이트
	const currentState = useAuthStore.getState();
	if (currentState.user && !currentState.isAuthenticated) {
		console.log("initializeAuthStore: persist된 user 데이터 발견, computed states 업데이트");
		currentState.setUser(currentState.user);
	}

	// Initialize AuthState manager and listen to changes
	AuthStateManager.initialize();

	// Subscribe to auth state changes
	AuthStateManager.subscribe((userData) => {
		console.log("AuthState 변경 감지:", userData);
		useAuthStore.getState().setUser(userData);
		useAuthStore.getState().setLoading(false);
	});
};
