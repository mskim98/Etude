import { supabase } from "./supabase";
import type { Profile } from "@/types";

export class AdminService {
	// Get all pending users (for admin approval)
	static async getPendingUsers(): Promise<Profile[]> {
		const { data, error } = await supabase
			.from("profile")
			.select("*")
			.eq("state", "pending")
			.order("created_at", { ascending: false });

		if (error) throw error;
		return (data as any) || [];
	}

	// Approve a user
	static async approveUser(userId: string): Promise<void> {
		const { error } = await supabase.from("profile").update({ state: "approve" }).eq("id", userId);

		if (error) throw error;
	}

	// Get all users (for admin management)
	static async getAllUsers(): Promise<Profile[]> {
		const { data, error } = await supabase.from("profile").select("*").order("created_at", { ascending: false });

		if (error) throw error;
		return (data as any) || [];
	}

	// Update user role
	static async updateUserRole(userId: string, role: "student" | "teacher" | "admin"): Promise<void> {
		const { error } = await supabase.from("profile").update({ role }).eq("id", userId);

		if (error) throw error;
	}

	// Bulk approve users
	static async bulkApproveUsers(userIds: string[]): Promise<void> {
		const { error } = await supabase.from("profile").update({ state: "approve" }).in("id", userIds);

		if (error) throw error;
	}
}
