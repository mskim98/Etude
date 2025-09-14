import { supabase } from "./supabase";

export async function debugAuthState() {
	console.log("=== AUTH DEBUG START ===");

	try {
		// 1. Check session
		const {
			data: { session },
			error: sessionError,
		} = await supabase.auth.getSession();
		console.log("Session:", session?.user?.email || "No session");
		console.log("Session error:", sessionError);

		if (session?.user) {
			// 2. Check if user exists in auth.users
			console.log("User ID:", session.user.id);
			console.log("Email confirmed at:", session.user.email_confirmed_at);
			console.log("User metadata:", session.user.user_metadata);

			// 3. Check profile
			const { data: profile, error: profileError } = await supabase
				.from("profile")
				.select("*")
				.eq("id", session.user.id)
				.single();

			console.log("Profile:", profile);
			console.log("Profile error:", profileError);

			if (!profile && !profileError) {
				console.log("Profile query returned null without error");
			}
		}
	} catch (error) {
		console.error("Debug error:", error);
	}

	console.log("=== AUTH DEBUG END ===");
}

// Add this to window for easy access in browser console
if (typeof window !== "undefined") {
	(window as any).debugAuth = debugAuthState;
}
