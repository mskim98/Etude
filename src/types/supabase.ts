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
						referencedRelation: "ap_subject_detail_view";
						referencedColumns: ["teacher_id"];
					},
					{
						foreignKeyName: "announcement_announced_by_fkey";
						columns: ["announced_by"];
						isOneToOne: false;
						referencedRelation: "profile";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "announcement_announced_by_fkey";
						columns: ["announced_by"];
						isOneToOne: false;
						referencedRelation: "user_ap_access_view";
						referencedColumns: ["teacher_id"];
					}
				];
			};
			profile: {
				Row: {
					ap_score: number | null;
					created_at: string;
					deleted_at: string | null;
					end_at: string | null;
					gpa: number | null;
					id: string;
					major: string | null;
					name: string;
					role: Database["public"]["Enums"]["user_role"];
					sat_score: number | null;
					start_at: string | null;
					state: Database["public"]["Enums"]["user_state"];
					university: string | null;
					updated_at: string;
				};
				Insert: {
					ap_score?: number | null;
					created_at?: string;
					deleted_at?: string | null;
					end_at?: string | null;
					gpa?: number | null;
					id: string;
					major?: string | null;
					name: string;
					role?: Database["public"]["Enums"]["user_role"];
					sat_score?: number | null;
					start_at?: string | null;
					state?: Database["public"]["Enums"]["user_state"];
					university?: string | null;
					updated_at?: string;
				};
				Update: {
					ap_score?: number | null;
					created_at?: string;
					deleted_at?: string | null;
					end_at?: string | null;
					gpa?: number | null;
					id?: string;
					major?: string | null;
					name?: string;
					role?: Database["public"]["Enums"]["user_role"];
					sat_score?: number | null;
					start_at?: string | null;
					state?: Database["public"]["Enums"]["user_state"];
					university?: string | null;
					updated_at?: string;
				};
				Relationships: [];
			};
			user_service: {
				Row: {
					created_at: string | null;
					deleted_at: string | null;
					id: string;
					is_active: boolean;
					service_id: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					created_at?: string | null;
					deleted_at?: string | null;
					id?: string;
					is_active?: boolean;
					service_id: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					created_at?: string | null;
					deleted_at?: string | null;
					id?: string;
					is_active?: boolean;
					service_id?: string;
					updated_at?: string | null;
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
			ap_subject_detail_view: {
				Row: {
					active_chapters: number | null;
					active_exams: number | null;
					chapter_completion_rate: number | null;
					completed_chapters: number | null;
					completed_exams: number | null;
					created_at: string | null;
					description: string | null;
					exam_date: string | null;
					id: string | null;
					is_active: boolean | null;
					service_active: boolean | null;
					service_category: string | null;
					service_name: string | null;
					teacher_id: string | null;
					teacher_name: string | null;
					title: string | null;
					total_chapters: number | null;
					total_exams: number | null;
					updated_at: string | null;
				};
				Relationships: [];
			};
		};
		Functions: {};
		Enums: {
			announcer_type: "teacher" | "admin" | "system";
			choice_type: "text" | "image";
			difficulty_level: "easy" | "normal" | "hard";
			exam_category: "ap" | "sat";
			question_type: "mcq" | "spr";
			sat_subject_type: "reading" | "writing" | "math";
			service_category: "ap" | "sat";
			urgency_level: "low" | "medium" | "high";
			user_role: "student" | "teacher" | "admin";
			user_state: "pending" | "approve" | "expired";
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
