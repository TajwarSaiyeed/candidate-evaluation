export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string
          created_at: string
          user_id: string | null
          name: string
          email: string
          linkedin_url: string | null
          skills: string
          experience: string
          resume_text: string | null
          resume_keywords: string[] | null
          status: string
          job_id: string | null
          match_score: number | null
          summary: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string | null
          name: string
          email: string
          linkedin_url?: string | null
          skills: string
          experience: string
          resume_text?: string | null
          resume_keywords?: string[] | null
          status?: string
          job_id?: string | null
          match_score?: number | null
          summary?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string | null
          name?: string
          email?: string
          linkedin_url?: string | null
          skills?: string
          experience?: string
          resume_text?: string | null
          resume_keywords?: string[] | null
          status?: string
          job_id?: string | null
          match_score?: number | null
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          }
        ]
      }
      jobs: {
        Row: {
          id: string
          created_at: string
          title: string
          department: string
          location: string
          type: string
          description: string
          requirements: string[]
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          department: string
          location: string
          type: string
          description: string
          requirements: string[]
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          department?: string
          location?: string
          type?: string
          description?: string
          requirements?: string[]
          is_active?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          full_name: string | null
          avatar_url: string | null
          is_admin: boolean
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      feedback: {
        Row: {
          id: string
          created_at: string
          application_id: string
          reviewer_id: string
          comment: string
          rating: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          application_id: string
          reviewer_id: string
          comment: string
          rating?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          application_id?: string
          reviewer_id?: string
          comment?: string
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_application_id_fkey"
            columns: ["application_id"]
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_reviewer_id_fkey"
            columns: ["reviewer_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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
  }
}