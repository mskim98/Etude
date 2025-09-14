import { supabase } from "./supabase";

export interface SignUpData {
	email: string;
	password: string;
	name: string;
	university?: string;
	major?: string;
}

export interface SignInData {
	email: string;
	password: string;
}

// Check if email already exists
export async function checkEmailDuplicate(email: string): Promise<boolean> {
	try {
		const { data, error } = await supabase.rpc("check_email_duplicate", {
			email_to_check: email,
		});

		if (error) {
			console.error("Error checking email duplicate:", error);
			return false;
		}

		return data as boolean;
	} catch (error) {
		console.error("Error checking email duplicate:", error);
		return false;
	}
}

// Sign up user with email confirmation
export async function signUpUser(userData: SignUpData) {
	try {
		const { data, error } = await supabase.auth.signUp({
			email: userData.email,
			password: userData.password,
			options: {
				data: {
					name: userData.name,
					university: userData.university,
					major: userData.major,
				},
				emailRedirectTo: `${window.location.origin}/auth/callback`,
			},
		});

		if (error) {
			throw error;
		}

		return { data, error: null };
	} catch (error) {
		console.error("Error signing up:", error);
		return { data: null, error };
	}
}

// Sign in user
export async function signInUser(userData: SignInData) {
	try {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: userData.email,
			password: userData.password,
		});

		if (error) {
			throw error;
		}

		return { data, error: null };
	} catch (error) {
		console.error("Error signing in:", error);
		return { data: null, error };
	}
}

// Sign out user
export async function signOutUser() {
	try {
		const { error } = await supabase.auth.signOut();

		if (error) {
			throw error;
		}

		return { error: null };
	} catch (error) {
		console.error("Error signing out:", error);
		return { error };
	}
}

// Get current user session
export async function getCurrentUser() {
	try {
		const {
			data: { session },
			error,
		} = await supabase.auth.getSession();

		if (error) {
			throw error;
		}

		return { session, error: null };
	} catch (error) {
		console.error("Error getting current user:", error);
		return { session: null, error };
	}
}

// Get user profile
export async function getUserProfile(userId: string) {
	try {
		const { data, error } = await supabase.from("profile").select("*").eq("id", userId).single();

		if (error) {
			throw error;
		}

		return { data, error: null };
	} catch (error) {
		console.error("Error getting user profile:", error);
		return { data: null, error };
	}
}

// Update user profile
export async function updateUserProfile(
	userId: string,
	updates: Partial<{
		name: string;
		university: string;
		major: string;
		gpa: number;
		ap_score: number;
		sat_score: number;
	}>
) {
	try {
		const { data, error } = await supabase.from("profile").update(updates).eq("id", userId).select().single();

		if (error) {
			throw error;
		}

		return { data, error: null };
	} catch (error) {
		console.error("Error updating user profile:", error);
		return { data: null, error };
	}
}

// Send password reset email
export async function resetPassword(email: string) {
	try {
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/auth/callback`,
		});

		if (error) {
			throw error;
		}

		return { error: null };
	} catch (error) {
		console.error("Error sending password reset email:", error);
		return { error };
	}
}
