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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          user_id: string | null
          invoice_number: string
          date: string
          due_date: string
          from_name: string | null
          from_email: string | null
          from_address: string | null
          from_city: string | null
          from_postal_code: string | null
          from_country: string | null
          from_logo: string | null
          to_name: string | null
          to_email: string | null
          to_address: string | null
          to_city: string | null
          to_postal_code: string | null
          to_country: string | null
          items: Json
          subtotal: number
          discount_type: 'percentage' | 'fixed' | null
          discount_value: number
          discount_amount: number
          tax_rate: number
          tax_amount: number
          total: number
          currency: string
          notes: string | null
          terms: string | null
          signature_name: string | null
          signature_image: string | null
          created_at: string
          updated_at: string
          is_deleted: boolean
        }
        Insert: {
          id?: string
          user_id?: string | null
          invoice_number: string
          date: string
          due_date: string
          from_name?: string | null
          from_email?: string | null
          from_address?: string | null
          from_city?: string | null
          from_postal_code?: string | null
          from_country?: string | null
          from_logo?: string | null
          to_name?: string | null
          to_email?: string | null
          to_address?: string | null
          to_city?: string | null
          to_postal_code?: string | null
          to_country?: string | null
          items?: Json
          subtotal?: number
          discount_type?: 'percentage' | 'fixed' | null
          discount_value?: number
          discount_amount?: number
          tax_rate?: number
          tax_amount?: number
          total?: number
          currency?: string
          notes?: string | null
          terms?: string | null
          signature_name?: string | null
          signature_image?: string | null
          created_at?: string
          updated_at?: string
          is_deleted?: boolean
        }
        Update: {
          id?: string
          user_id?: string | null
          invoice_number?: string
          date?: string
          due_date?: string
          from_name?: string | null
          from_email?: string | null
          from_address?: string | null
          from_city?: string | null
          from_postal_code?: string | null
          from_country?: string | null
          from_logo?: string | null
          to_name?: string | null
          to_email?: string | null
          to_address?: string | null
          to_city?: string | null
          to_postal_code?: string | null
          to_country?: string | null
          items?: Json
          subtotal?: number
          discount_type?: 'percentage' | 'fixed' | null
          discount_value?: number
          discount_amount?: number
          tax_rate?: number
          tax_amount?: number
          total?: number
          currency?: string
          notes?: string | null
          terms?: string | null
          signature_name?: string | null
          signature_image?: string | null
          created_at?: string
          updated_at?: string
          is_deleted?: boolean
        }
      }
      invoice_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          template_data: Json
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          template_data: Json
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          template_data?: Json
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          event_type: string
          event_data: Json | null
          user_agent: string | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_type: string
          event_data?: Json | null
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_type?: string
          event_data?: Json | null
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
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
  }
}
