export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      job_applications: {
        Row: {
          applicant_id: string
          cover_letter: string | null
          created_at: string | null
          id: string
          job_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          applicant_id: string
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          job_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          applicant_id?: string
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          job_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          created_at: string | null
          description: string
          employer_id: string
          id: string
          job_type: string
          location: string | null
          requirements: string[] | null
          salary_max: number | null
          salary_min: number | null
          skills: string[] | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          employer_id: string
          id?: string
          job_type: string
          location?: string | null
          requirements?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          skills?: string[] | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          employer_id?: string
          id?: string
          job_type?: string
          location?: string | null
          requirements?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          skills?: string[] | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_deposits: {
        Row: {
          amount: number
          created_at: string | null
          employer_id: string
          id: string
          job_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          employer_id: string
          id?: string
          job_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          employer_id?: string
          id?: string
          job_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_deposits_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          location: string | null
          phone: string | null
          skills: string[] | null
          updated_at: string | null
          user_type: string
          username: string | null
          verified: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          location?: string | null
          phone?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_type?: string
          username?: string | null
          verified?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          location?: string | null
          phone?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_type?: string
          username?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          job_id: string
          rating: number
          reviewee_id: string
          reviewer_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          job_id: string
          rating: number
          reviewee_id: string
          reviewer_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          job_id?: string
          rating?: number
          reviewee_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
