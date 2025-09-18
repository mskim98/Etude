import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import { AuthService } from "../services/authService";
import type { AuthState, AuthUser, SignUpFormData } from "../types/auth.types";

// Global flag to track if rehydration is complete
let isRehydrationComplete = false;

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			// Initial state
			user: null,
			isLoading: false,
			error: null,

			// Computed state - calculated from user data
			isAuthenticated: false,
			isAdmin: false,
			isTeacher: false,
			isStudent: false,
			isApproved: false,
			isExpired: false,
			isPendingApproval: false,

			// Actions
			setUser: (user: AuthUser | null) => {
				console.log("AuthStore: Setting user:", user?.email || "null");

				// Calculate computed state
				const computedState = {
					user,
					error: null,
					isAuthenticated: !!user,
					isAdmin: user?.profile?.role === "admin",
					isTeacher: user?.profile?.role === "teacher",
					isStudent: user?.profile?.role === "student",
					isApproved: user?.profile?.state === "approve",
					isExpired: user?.profile?.state === "expired",
					isPendingApproval: user?.profile?.state === "pending",
				};

				console.log("AuthStore: Computed state:", computedState);
				set(computedState);
			},

			setLoading: (isLoading: boolean) => {
				set({ isLoading });
			},

			setError: (error: string | null) => {
				set({ error });
			},

			clearError: () => {
				set({ error: null });
			},

			signIn: async (email: string, password: string) => {
				try {
					set({ isLoading: true, error: null });

					await AuthService.signIn(email, password);

					// Get updated user data
					const user = await AuthService.getCurrentUser();
					set({ user });
				} catch (error) {
					const message = error instanceof Error ? error.message : "Login failed";
					set({ error: message });
					throw error;
				} finally {
					set({ isLoading: false });
				}
			},

			signUp: async (formData: SignUpFormData) => {
				try {
					set({ isLoading: true, error: null });

					await AuthService.signUp(formData);

					// Note: User will be null until email is verified
					set({ user: null });
				} catch (error) {
					const message = error instanceof Error ? error.message : "Sign up failed";
					set({ error: message });
					throw error;
				} finally {
					set({ isLoading: false });
				}
			},

			signOut: async () => {
				try {
					set({ isLoading: true, error: null });

					await AuthService.signOut();

					set({ user: null });
				} catch (error) {
					const message = error instanceof Error ? error.message : "Sign out failed";
					set({ error: message });

					// Clear user state even if signOut fails
					set({ user: null });
					throw error;
				} finally {
					set({ isLoading: false });
				}
			},

			resetPassword: async (email: string) => {
				try {
					set({ isLoading: true, error: null });

					await AuthService.resetPassword(email);
				} catch (error) {
					const message = error instanceof Error ? error.message : "Password reset failed";
					set({ error: message });
					throw error;
				} finally {
					set({ isLoading: false });
				}
			},

			getUserAccessStatus: () => {
				const profile = get().user?.profile;
				return AuthService.getUserAccessStatus(profile || null);
			},
		}),
		{
			name: "auth-storage",
			partialize: (state) => ({
				user: state.user,
			}),
			onRehydrateStorage: () => (state, api) => {
				if (state?.user) {
					console.log("Auth state rehydrated:", state.user.email);

					// Mark rehydration as complete first
					isRehydrationComplete = true;

					// Use a microtask to ensure this runs after the store is fully initialized
					Promise.resolve().then(() => {
						console.log("Auth state: Triggering setUser after rehydration");
						// Use the store's setUser method to ensure computed state is properly set
						useAuthStore.getState().setUser(state.user);
					});
				} else {
					isRehydrationComplete = true;
				}

				console.log("Auth rehydration complete");
			},
		}
	)
);

// Auth state manager for listening to auth changes
export class AuthStateManager {
	private static listeners: ((user: AuthUser | null) => void)[] = [];

	static subscribe(callback: (user: AuthUser | null) => void) {
		this.listeners.push(callback);
		return () => {
			this.listeners = this.listeners.filter((listener) => listener !== callback);
		};
	}

	private static notifyListeners(user: AuthUser | null) {
		this.listeners.forEach((callback) => callback(user));
	}

	static async initialize() {
		// Listen to auth state changes
		const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
			console.log("Auth state changed:", event, session?.user?.email);

			if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
				if (session?.user) {
					console.log("Getting user profile for:", session.user.id);
					const user = await AuthService.getCurrentUser();
					console.log("User profile loaded:", user);
					this.notifyListeners(user);
				}
			} else if (event === "SIGNED_OUT") {
				this.notifyListeners(null);
			}
		});

		// Initial auth check - only if rehydration is complete or no stored user
		const currentStoreUser = useAuthStore.getState().user;

		// Wait for rehydration to complete if there's a stored user
		if (currentStoreUser && !isRehydrationComplete) {
			console.log("AuthStateManager: Waiting for rehydration to complete...");
			// Check again after rehydration
			setTimeout(async () => {
				if (isRehydrationComplete) {
					const user = await AuthService.getCurrentUser();
					console.log("AuthStateManager: Post-rehydration user check:", user);

					const currentUser = useAuthStore.getState().user;
					if (!currentUser || currentUser.email !== user?.email) {
						this.notifyListeners(user);
					}
				}
			}, 200);
		} else {
			// No stored user or rehydration complete, proceed with initial check
			const user = await AuthService.getCurrentUser();
			console.log("AuthStateManager: Initial user check:", user);
			this.notifyListeners(user);
		}

		return data.subscription;
	}
}

// Initialize auth state manager
if (typeof window !== "undefined") {
	// Subscribe to auth changes first
	AuthStateManager.subscribe((user) => {
		console.log("AuthStateManager: Notifying store of user change:", user?.email);

		const currentState = useAuthStore.getState();
		console.log("AuthStateManager: Current state:", {
			currentUser: currentState.user?.email,
			isAuthenticated: currentState.isAuthenticated,
			newUser: user?.email,
		});

		// 사용자가 변경된 경우에만 업데이트
		if (currentState.user?.email !== user?.email) {
			console.log("AuthStateManager: User changed, updating store");
			useAuthStore.getState().setUser(user);
		} else {
			console.log("AuthStateManager: Same user, skipping update");
		}

		useAuthStore.getState().setLoading(false);
	});

	// Initialize after subscription is set up and rehydration is likely complete
	setTimeout(() => {
		console.log("AuthStateManager: Starting initialization...");
		AuthStateManager.initialize();
	}, 500); // Allow persist rehydration to complete first
}
