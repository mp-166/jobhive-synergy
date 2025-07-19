// Enhanced TypeScript types for Empower Platform
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
      // Enhanced existing tables
      job_applications: {
        Row: {
          applicant_id: string
          cover_letter: string | null
          created_at: string | null
          id: string
          job_id: string
          status: string
          updated_at: string | null
          // New fields
          expected_start_date: string | null
          availability: string | null
          proposed_rate: number | null
          portfolio_url: string | null
          auto_matched: boolean | null
        }
        Insert: {
          applicant_id: string
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          job_id: string
          status?: string
          updated_at?: string | null
          expected_start_date?: string | null
          availability?: string | null
          proposed_rate?: number | null
          portfolio_url?: string | null
          auto_matched?: boolean | null
        }
        Update: {
          applicant_id?: string
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          job_id?: string
          status?: string
          updated_at?: string | null
          expected_start_date?: string | null
          availability?: string | null
          proposed_rate?: number | null
          portfolio_url?: string | null
          auto_matched?: boolean | null
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
          // New fields
          duration_type: string | null
          duration_value: number | null
          start_date: string | null
          end_date: string | null
          workers_needed: number | null
          workers_hired: number | null
          urgency_level: string | null
          category: string | null
          subcategory: string | null
          contact_phone: string | null
          auto_match: boolean | null
          featured: boolean | null
          featured_until: string | null
          total_budget: number | null
          completion_percentage: number | null
          payment_status: string | null
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
          duration_type?: string | null
          duration_value?: number | null
          start_date?: string | null
          end_date?: string | null
          workers_needed?: number | null
          workers_hired?: number | null
          urgency_level?: string | null
          category?: string | null
          subcategory?: string | null
          contact_phone?: string | null
          auto_match?: boolean | null
          featured?: boolean | null
          featured_until?: string | null
          total_budget?: number | null
          completion_percentage?: number | null
          payment_status?: string | null
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
          duration_type?: string | null
          duration_value?: number | null
          start_date?: string | null
          end_date?: string | null
          workers_needed?: number | null
          workers_hired?: number | null
          urgency_level?: string | null
          category?: string | null
          subcategory?: string | null
          contact_phone?: string | null
          auto_match?: boolean | null
          featured?: boolean | null
          featured_until?: string | null
          total_budget?: number | null
          completion_percentage?: number | null
          payment_status?: string | null
        }
        Relationships: []
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
          // New fields
          date_of_birth: string | null
          gender: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          aadhar_number: string | null
          pan_number: string | null
          driving_license: string | null
          bank_account_number: string | null
          ifsc_code: string | null
          bank_name: string | null
          rating: number | null
          total_jobs_completed: number | null
          total_earnings: number | null
          subscription_type: string | null
          subscription_expires_at: string | null
          is_active: boolean | null
          last_active_at: string | null
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
          date_of_birth?: string | null
          gender?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          aadhar_number?: string | null
          pan_number?: string | null
          driving_license?: string | null
          bank_account_number?: string | null
          ifsc_code?: string | null
          bank_name?: string | null
          rating?: number | null
          total_jobs_completed?: number | null
          total_earnings?: number | null
          subscription_type?: string | null
          subscription_expires_at?: string | null
          is_active?: boolean | null
          last_active_at?: string | null
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
          date_of_birth?: string | null
          gender?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          aadhar_number?: string | null
          pan_number?: string | null
          driving_license?: string | null
          bank_account_number?: string | null
          ifsc_code?: string | null
          bank_name?: string | null
          rating?: number | null
          total_jobs_completed?: number | null
          total_earnings?: number | null
          subscription_type?: string | null
          subscription_expires_at?: string | null
          is_active?: boolean | null
          last_active_at?: string | null
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
      // New tables for Empower platform
      document_verifications: {
        Row: {
          id: string
          user_id: string
          document_type: string
          document_url: string
          verification_status: string
          verified_by: string | null
          verification_notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          document_type: string
          document_url: string
          verification_status?: string
          verified_by?: string | null
          verification_notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          document_type?: string
          document_url?: string
          verification_status?: string
          verified_by?: string | null
          verification_notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      escrow_payments: {
        Row: {
          id: string
          job_id: string
          employer_id: string
          worker_id: string
          amount: number
          platform_fee: number
          status: string
          payment_method: string | null
          transaction_id: string | null
          escrowed_at: string | null
          released_at: string | null
          refunded_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          job_id: string
          employer_id: string
          worker_id: string
          amount: number
          platform_fee: number
          status?: string
          payment_method?: string | null
          transaction_id?: string | null
          escrowed_at?: string | null
          released_at?: string | null
          refunded_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          job_id?: string
          employer_id?: string
          worker_id?: string
          amount?: number
          platform_fee?: number
          status?: string
          payment_method?: string | null
          transaction_id?: string | null
          escrowed_at?: string | null
          released_at?: string | null
          refunded_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "escrow_payments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_type: string
          plan_duration: string
          amount: number
          status: string
          started_at: string | null
          expires_at: string
          auto_renew: boolean | null
          payment_method: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          plan_type: string
          plan_duration: string
          amount: number
          status?: string
          started_at?: string | null
          expires_at: string
          auto_renew?: boolean | null
          payment_method?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          plan_type?: string
          plan_duration?: string
          amount?: number
          status?: string
          started_at?: string | null
          expires_at?: string
          auto_renew?: boolean | null
          payment_method?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          job_id: string | null
          type: string
          amount: number
          description: string | null
          status: string
          payment_method: string | null
          transaction_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          job_id?: string | null
          type: string
          amount: number
          description?: string | null
          status?: string
          payment_method?: string | null
          transaction_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          job_id?: string | null
          type?: string
          amount?: number
          description?: string | null
          status?: string
          payment_method?: string | null
          transaction_id?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          is_read: boolean | null
          action_url: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: string
          is_read?: boolean | null
          action_url?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          is_read?: boolean | null
          action_url?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      sms_notifications: {
        Row: {
          id: string
          phone_number: string
          message: string
          status: string
          sent_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          phone_number: string
          message: string
          status?: string
          sent_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          phone_number?: string
          message?: string
          status?: string
          sent_at?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      skills_catalog: {
        Row: {
          id: string
          name: string
          category: string
          description: string | null
          verification_required: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          category: string
          description?: string | null
          verification_required?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string | null
          verification_required?: boolean | null
          created_at?: string | null
        }
        Relationships: []
      }
      user_skills: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          proficiency_level: string | null
          years_of_experience: number | null
          verified: boolean | null
          verified_by: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          skill_id: string
          proficiency_level?: string | null
          years_of_experience?: number | null
          verified?: boolean | null
          verified_by?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string
          proficiency_level?: string | null
          years_of_experience?: number | null
          verified?: boolean | null
          verified_by?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills_catalog"
            referencedColumns: ["id"]
          }
        ]
      }
      disputes: {
        Row: {
          id: string
          job_id: string
          raised_by: string
          against_user: string
          reason: string
          status: string
          resolution: string | null
          resolved_by: string | null
          created_at: string | null
          resolved_at: string | null
        }
        Insert: {
          id?: string
          job_id: string
          raised_by: string
          against_user: string
          reason: string
          status?: string
          resolution?: string | null
          resolved_by?: string | null
          created_at?: string | null
          resolved_at?: string | null
        }
        Update: {
          id?: string
          job_id?: string
          raised_by?: string
          against_user?: string
          reason?: string
          status?: string
          resolution?: string | null
          resolved_by?: string | null
          created_at?: string | null
          resolved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disputes_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          }
        ]
      }
      job_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          is_active: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Relationships: []
      }
      job_subcategories: {
        Row: {
          id: string
          category_id: string
          name: string
          description: string | null
          is_active: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          description?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          description?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "job_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      training_programs: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string | null
          duration_hours: number | null
          price: number | null
          instructor_id: string | null
          is_online: boolean | null
          location: string | null
          max_participants: number | null
          current_participants: number | null
          status: string | null
          start_date: string | null
          end_date: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category?: string | null
          duration_hours?: number | null
          price?: number | null
          instructor_id?: string | null
          is_online?: boolean | null
          location?: string | null
          max_participants?: number | null
          current_participants?: number | null
          status?: string | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string | null
          duration_hours?: number | null
          price?: number | null
          instructor_id?: string | null
          is_online?: boolean | null
          location?: string | null
          max_participants?: number | null
          current_participants?: number | null
          status?: string | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_programs_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      training_enrollments: {
        Row: {
          id: string
          program_id: string
          user_id: string
          enrollment_date: string | null
          completion_date: string | null
          completion_percentage: number | null
          certificate_url: string | null
          status: string | null
        }
        Insert: {
          id?: string
          program_id: string
          user_id: string
          enrollment_date?: string | null
          completion_date?: string | null
          completion_percentage?: number | null
          certificate_url?: string | null
          status?: string | null
        }
        Update: {
          id?: string
          program_id?: string
          user_id?: string
          enrollment_date?: string | null
          completion_date?: string | null
          completion_percentage?: number | null
          certificate_url?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_enrollments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      active_workers: {
        Row: {
          id: string | null
          first_name: string | null
          last_name: string | null
          location: string | null
          phone: string | null
          rating: number | null
          total_jobs_completed: number | null
          total_earnings: number | null
          skills_count: number | null
          jobs_completed_count: number | null
          is_active: boolean | null
          verified: boolean | null
        }
        Relationships: []
      }
      job_stats: {
        Row: {
          id: string | null
          title: string | null
          location: string | null
          salary_min: number | null
          salary_max: number | null
          status: string | null
          category: string | null
          featured: boolean | null
          application_count: number | null
          average_rating: number | null
          review_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      update_worker_stats: {
        Args: {
          worker_id: string
          earnings: number
          jobs_completed: number
        }
        Returns: undefined
      }
      calculate_verification_score: {
        Args: {
          user_id: string
        }
        Returns: number
      }
      check_minimum_verification: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      send_job_alerts_to_nearby_workers: {
        Args: {
          job_id: string
          max_distance_km?: number
        }
        Returns: number
      }
      check_subscription_limit: {
        Args: {
          user_id: string
          limit_type: string
        }
        Returns: boolean
      }
      calculate_mrr: {
        Args: {}
        Returns: number
      }
      update_user_rating: {
        Args: {
          user_id: string
          new_rating: number
        }
        Returns: undefined
      }
      get_job_recommendations: {
        Args: {
          user_id: string
          limit_count?: number
        }
        Returns: {
          job_id: string
          title: string
          location: string
          salary_min: number
          salary_max: number
          match_score: number
        }[]
      }
      get_platform_statistics: {
        Args: {}
        Returns: Json
      }
      cleanup_expired_featured_jobs: {
        Args: {}
        Returns: number
      }
      expire_subscriptions: {
        Args: {}
        Returns: number
      }
      send_application_reminders: {
        Args: {}
        Returns: number
      }
      daily_maintenance: {
        Args: {}
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for the Empower platform
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Job = Database['public']['Tables']['jobs']['Row']
export type JobApplication = Database['public']['Tables']['job_applications']['Row']
export type EscrowPayment = Database['public']['Tables']['escrow_payments']['Row']
export type DocumentVerification = Database['public']['Tables']['document_verifications']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type SMSNotification = Database['public']['Tables']['sms_notifications']['Row']
export type Skill = Database['public']['Tables']['skills_catalog']['Row']
export type UserSkill = Database['public']['Tables']['user_skills']['Row']
export type Dispute = Database['public']['Tables']['disputes']['Row']
export type JobCategory = Database['public']['Tables']['job_categories']['Row']
export type TrainingProgram = Database['public']['Tables']['training_programs']['Row']

// Enum types for better type safety
export type VerificationStatus = 'pending' | 'verified' | 'rejected'
export type PaymentStatus = 'pending' | 'escrowed' | 'released' | 'refunded' | 'disputed'
export type JobStatus = 'open' | 'in_progress' | 'completed' | 'cancelled'
export type ApplicationStatus = 'applied' | 'shortlisted' | 'accepted' | 'rejected'
export type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'enterprise'
export type UserType = 'worker' | 'employer' | 'admin'
export type NotificationType = 'job_match' | 'application' | 'payment' | 'review' | 'system' | 'marketing'
export type DocumentType = 'aadhar' | 'pan' | 'driving_license' | 'bank_statement' | 'address_proof' | 'skill_certificate'
export type TransactionType = 'payment' | 'earning' | 'refund' | 'subscription' | 'commission'