export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	// Allows to automatically instantiate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: "13.0.5";
	};
	public: {
		Tables: {
			announcement: {
				Row: {
					announced_by: string;
					announcer_type: Database["public"]["Enums"]["announcer_type"] | null;
					category: Database["public"]["Enums"]["exam_category"];
					created_at: string | null;
					deleted_at: string | null;
					id: string;
					notification: string;
					title: string;
					updated_at: string | null;
					urgency: Database["public"]["Enums"]["urgency_level"];
				};
				Insert: {
					announced_by: string;
					announcer_type?: Database["public"]["Enums"]["announcer_type"] | null;
					category: Database["public"]["Enums"]["exam_category"];
					created_at?: string | null;
					deleted_at?: string | null;
					id?: string;
					notification: string;
					title: string;
					updated_at?: string | null;
					urgency: Database["public"]["Enums"]["urgency_level"];
				};
				Update: {
					announced_by?: string;
					announcer_type?: Database["public"]["Enums"]["announcer_type"] | null;
					category?: Database["public"]["Enums"]["exam_category"];
					created_at?: string | null;
					deleted_at?: string | null;
					id?: string;
					notification?: string;
					title?: string;
					updated_at?: string | null;
					urgency?: Database["public"]["Enums"]["urgency_level"];
				};
				Relationships: [
					{
						foreignKeyName: "announcement_announced_by_fkey";
						columns: ["announced_by"];
						isOneToOne: false;
						referencedRelation: "profile";
						referencedColumns: ["id"];
					}
				];
			};
			profile: {
				Row: {
					ap_score: number | null;
					created_at: string;
					deleted_at: string | null;
					gpa: number | null;
					id: string;
					major: string | null;
					name: string;
					role: Database["public"]["Enums"]["user_role"];
					sat_score: number | null;
					state: Database["public"]["Enums"]["user_state"];
					university: string | null;
					updated_at: string;
				};
				Insert: {
					ap_score?: number | null;
					created_at?: string;
					deleted_at?: string | null;
					gpa?: number | null;
					id: string;
					major?: string | null;
					name: string;
					role?: Database["public"]["Enums"]["user_role"];
					sat_score?: number | null;
					state?: Database["public"]["Enums"]["user_state"];
					university?: string | null;
					updated_at?: string;
				};
				Update: {
					ap_score?: number | null;
					created_at?: string;
					deleted_at?: string | null;
					gpa?: number | null;
					id?: string;
					major?: string | null;
					name?: string;
					role?: Database["public"]["Enums"]["user_role"];
					sat_score?: number | null;
					state?: Database["public"]["Enums"]["user_state"];
					university?: string | null;
					updated_at?: string;
				};
				Relationships: [];
			};
			schedule: {
				Row: {
					category: Database["public"]["Enums"]["exam_category"];
					created_at: string | null;
					created_by: string | null;
					d_day: string;
					deleted_at: string | null;
					deleted_by: string | null;
					id: string;
					title: string;
					updated_at: string | null;
					updated_by: string | null;
				};
				Insert: {
					category: Database["public"]["Enums"]["exam_category"];
					created_at?: string | null;
					created_by?: string | null;
					d_day: string;
					deleted_at?: string | null;
					deleted_by?: string | null;
					id?: string;
					title: string;
					updated_at?: string | null;
					updated_by?: string | null;
				};
				Update: {
					category?: Database["public"]["Enums"]["exam_category"];
					created_at?: string | null;
					created_by?: string | null;
					d_day?: string;
					deleted_at?: string | null;
					deleted_by?: string | null;
					id?: string;
					title?: string;
					updated_at?: string | null;
					updated_by?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "schedule_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "profile";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "schedule_deleted_by_fkey";
						columns: ["deleted_by"];
						isOneToOne: false;
						referencedRelation: "profile";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "schedule_updated_by_fkey";
						columns: ["updated_by"];
						isOneToOne: false;
						referencedRelation: "profile";
						referencedColumns: ["id"];
					}
				];
			};
			service: {
				Row: {
					category: string;
					created_at: string;
					created_by: string;
					deleted_at: string | null;
					deleted_by: string | null;
					id: string;
					service_name: string;
					updated_at: string;
					updated_by: string;
				};
				Insert: {
					category: string;
					created_at?: string;
					created_by: string;
					deleted_at?: string | null;
					deleted_by?: string | null;
					id?: string;
					service_name: string;
					updated_at?: string;
					updated_by: string;
				};
				Update: {
					category?: string;
					created_at?: string;
					created_by?: string;
					deleted_at?: string | null;
					deleted_by?: string | null;
					id?: string;
					service_name?: string;
					updated_at?: string;
					updated_by?: string;
				};
				Relationships: [];
			};
			user_service: {
				Row: {
					id: string;
					is_confirm: boolean;
					service_id: string;
					user_id: string;
				};
				Insert: {
					id?: string;
					is_confirm?: boolean;
					service_id: string;
					user_id: string;
				};
				Update: {
					id?: string;
					is_confirm?: boolean;
					service_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_service_service_id_fkey";
						columns: ["service_id"];
						isOneToOne: false;
						referencedRelation: "service";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "user_service_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profile";
						referencedColumns: ["id"];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			check_email_duplicate: {
				Args: { email_to_check: string };
				Returns: boolean;
			};
			create_announcement: {
				Args: {
					p_announcer_type?: string;
					p_category?: string;
					p_notification: string;
					p_title: string;
					p_urgency?: string;
				};
				Returns: string;
			};
			create_schedule: {
				Args: { p_category: string; p_d_day: string; p_title: string };
				Returns: string;
			};
			delete_announcement: {
				Args: { p_announcement_id: string };
				Returns: boolean;
			};
			delete_schedule: {
				Args: { p_schedule_id: string };
				Returns: boolean;
			};
			update_announcement: {
				Args: {
					p_announcement_id: string;
					p_category?: string;
					p_notification?: string;
					p_title?: string;
					p_urgency?: string;
				};
				Returns: boolean;
			};
			update_schedule: {
				Args: {
					p_category?: string;
					p_d_day?: string;
					p_schedule_id: string;
					p_title?: string;
				};
				Returns: boolean;
			};
		};
		Enums: {
			announcer_type: "teacher" | "admin" | "system";
			exam_category: "ap" | "sat";
			urgency_level: "low" | "medium" | "high";
			user_role: "student" | "teacher" | "admin";
			user_state: "pending" | "approve";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
	? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
	? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
	? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
	? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
	: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
	? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
	: never;

export const Constants = {
	public: {
		Enums: {
			announcer_type: ["teacher", "admin", "system"],
			exam_category: ["ap", "sat"],
			urgency_level: ["low", "medium", "high"],
			user_role: ["student", "teacher", "admin"],
			user_state: ["pending", "approve"],
		},
	},
} as const;
