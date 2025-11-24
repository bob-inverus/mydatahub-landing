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
      users: {
        Row: {
          id: string
          email: string
          anonymous: boolean | null
          daily_message_count: number | null
          daily_reset: string | null
          display_name: string | null
          message_count: number | null
          preferred_model: string | null
          premium: boolean | null
          profile_image: string | null
          created_at: string | null
          last_active_at: string | null
          daily_pro_message_count: number | null
          daily_pro_reset: string | null
          system_prompt: string | null
          tier: string | null
          credits: number | null
        }
        Insert: {
          id: string
          email: string
          anonymous?: boolean | null
          daily_message_count?: number | null
          daily_reset?: string | null
          display_name?: string | null
          message_count?: number | null
          preferred_model?: string | null
          premium?: boolean | null
          profile_image?: string | null
          created_at?: string | null
          last_active_at?: string | null
          daily_pro_message_count?: number | null
          daily_pro_reset?: string | null
          system_prompt?: string | null
          tier?: string | null
          credits?: number | null
        }
        Update: {
          id?: string
          email?: string
          anonymous?: boolean | null
          daily_message_count?: number | null
          daily_reset?: string | null
          display_name?: string | null
          message_count?: number | null
          preferred_model?: string | null
          premium?: boolean | null
          profile_image?: string | null
          created_at?: string | null
          last_active_at?: string | null
          daily_pro_message_count?: number | null
          daily_pro_reset?: string | null
          system_prompt?: string | null
          tier?: string | null
          credits?: number | null
        }
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
