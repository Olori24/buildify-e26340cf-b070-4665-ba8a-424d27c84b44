
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
      packages: {
        Row: {
          id: string
          tracking_number: string
          sender_name: string
          sender_address: string
          recipient_name: string
          recipient_address: string
          weight: number
          dimensions: string | null
          status: string
          estimated_delivery: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tracking_number: string
          sender_name: string
          sender_address: string
          recipient_name: string
          recipient_address: string
          weight: number
          dimensions?: string | null
          status?: string
          estimated_delivery?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tracking_number?: string
          sender_name?: string
          sender_address?: string
          recipient_name?: string
          recipient_address?: string
          weight?: number
          dimensions?: string | null
          status?: string
          estimated_delivery?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tracking_events: {
        Row: {
          id: string
          package_id: string
          status: string
          location: string
          description: string | null
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          package_id: string
          status: string
          location: string
          description?: string | null
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          package_id?: string
          status?: string
          location?: string
          description?: string | null
          timestamp?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracking_events_package_id_fkey"
            columns: ["package_id"]
            referencedRelation: "packages"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: string
          phone_number: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: string
          phone_number?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: string
          phone_number?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}