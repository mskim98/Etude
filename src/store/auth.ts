import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
	id: string;
	email: string;
	name?: string;
}

interface AuthState {
	user: User | null;
	isLoading: boolean;
	setUser: (user: User | null) => void;
	setLoading: (loading: boolean) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			isLoading: false,
			setUser: (user) => set({ user }),
			setLoading: (isLoading) => set({ isLoading }),
			logout: () => set({ user: null }),
		}),
		{
			name: "auth-storage",
		}
	)
);
