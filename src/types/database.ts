
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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone_number: string | null
          company_name: string | null
          company_size: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone_number?: string | null
          company_name?: string | null
          company_size?: string | null
          role: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone_number?: string | null
          company_name?: string | null
          company_size?: string | null
          role?: string
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
      carriers: {
        Row: {
          id: string
          name: string
          code: string
          logo_url: string | null
          tracking_url_template: string | null
          api_endpoint: string | null
          api_key_name: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          logo_url?: string | null
          tracking_url_template?: string | null
          api_endpoint?: string | null
          api_key_name?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          logo_url?: string | null
          tracking_url_template?: string | null
          api_endpoint?: string | null
          api_key_name?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      shipments: {
        Row: {
          id: string
          tracking_number: string
          carrier_id: string | null
          external_tracking_number: string | null
          user_id: string | null
          business_id: string | null
          status: string
          estimated_delivery: string | null
          actual_delivery: string | null
          origin_address: Json
          destination_address: Json
          package_details: Json | null
          weight: number | null
          dimensions: Json | null
          shipping_cost: number | null
          insurance_amount: number | null
          is_signature_required: boolean
          is_priority: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tracking_number: string
          carrier_id?: string | null
          external_tracking_number?: string | null
          user_id?: string | null
          business_id?: string | null
          status: string
          estimated_delivery?: string | null
          actual_delivery?: string | null
          origin_address: Json
          destination_address: Json
          package_details?: Json | null
          weight?: number | null
          dimensions?: Json | null
          shipping_cost?: number | null
          insurance_amount?: number | null
          is_signature_required?: boolean
          is_priority?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tracking_number?: string
          carrier_id?: string | null
          external_tracking_number?: string | null
          user_id?: string | null
          business_id?: string | null
          status?: string
          estimated_delivery?: string | null
          actual_delivery?: string | null
          origin_address?: Json
          destination_address?: Json
          package_details?: Json | null
          weight?: number | null
          dimensions?: Json | null
          shipping_cost?: number | null
          insurance_amount?: number | null
          is_signature_required?: boolean
          is_priority?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipments_carrier_id_fkey"
            columns: ["carrier_id"]
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_business_id_fkey"
            columns: ["business_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tracking_events: {
        Row: {
          id: string
          shipment_id: string
          status: string
          location: string | null
          description: string | null
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          shipment_id: string
          status: string
          location?: string | null
          description?: string | null
          timestamp: string
          created_at?: string
        }
        Update: {
          id?: string
          shipment_id?: string
          status?: string
          location?: string | null
          description?: string | null
          timestamp?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracking_events_shipment_id_fkey"
            columns: ["shipment_id"]
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          }
        ]
      }
      drivers: {
        Row: {
          id: string
          license_number: string | null
          vehicle_type: string | null
          vehicle_plate: string | null
          current_location: Json | null
          is_active: boolean
          availability_status: string | null
          rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          license_number?: string | null
          vehicle_type?: string | null
          vehicle_plate?: string | null
          current_location?: Json | null
          is_active?: boolean
          availability_status?: string | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          license_number?: string | null
          vehicle_type?: string | null
          vehicle_plate?: string | null
          current_location?: Json | null
          is_active?: boolean
          availability_status?: string | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "drivers_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      delivery_assignments: {
        Row: {
          id: string
          shipment_id: string
          driver_id: string | null
          status: string
          assigned_at: string
          accepted_at: string | null
          completed_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shipment_id: string
          driver_id?: string | null
          status: string
          assigned_at?: string
          accepted_at?: string | null
          completed_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          shipment_id?: string
          driver_id?: string | null
          status?: string
          assigned_at?: string
          accepted_at?: string | null
          completed_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_assignments_shipment_id_fkey"
            columns: ["shipment_id"]
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_assignments_driver_id_fkey"
            columns: ["driver_id"]
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          }
        ]
      }
      proof_of_delivery: {
        Row: {
          id: string
          shipment_id: string
          driver_id: string | null
          signature_url: string | null
          photo_url: string | null
          recipient_name: string | null
          notes: string | null
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          shipment_id: string
          driver_id?: string | null
          signature_url?: string | null
          photo_url?: string | null
          recipient_name?: string | null
          notes?: string | null
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          shipment_id?: string
          driver_id?: string | null
          signature_url?: string | null
          photo_url?: string | null
          recipient_name?: string | null
          notes?: string | null
          timestamp?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "proof_of_delivery_shipment_id_fkey"
            columns: ["shipment_id"]
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proof_of_delivery_driver_id_fkey"
            columns: ["driver_id"]
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          shipment_id: string | null
          title: string
          message: string
          type: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          shipment_id?: string | null
          title: string
          message: string
          type: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          shipment_id?: string | null
          title?: string
          message?: string
          type?: string
          is_read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_shipment_id_fkey"
            columns: ["shipment_id"]
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          }
        ]
      }
      business_settings: {
        Row: {
          id: string
          company_logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          tracking_page_url: string | null
          email_template: Json | null
          sms_template: Json | null
          api_key: string | null
          webhook_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          company_logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          tracking_page_url?: string | null
          email_template?: Json | null
          sms_template?: Json | null
          api_key?: string | null
          webhook_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          tracking_page_url?: string | null
          email_template?: Json | null
          sms_template?: Json | null
          api_key?: string | null
          webhook_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_settings_id_fkey"
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
      generate_tracking_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      update_shipment_status: {
        Args: {
          p_shipment_id: string
          p_status: string
          p_location: string
          p_description: string | null
        }
        Returns: undefined
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