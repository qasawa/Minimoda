import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Create client with error handling
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClientComponentClient()
  : null

// For admin operations (server-side only)
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null

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
      products: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name_he: string
          name_ar: string
          name_en: string
          description_he: string
          description_ar: string
          description_en: string
          price: number
          cost: number
          original_price: number | null
          is_sale: boolean
          is_new: boolean
          is_featured: boolean
          category: string
          subcategory: string | null
          season: string
          age_group: string
          gender: string
          brand: string | null
          sku: string
          barcode: string | null
          material: string | null
          care_symbols: string[]
          sizes: string[]
          colors: Json[]
          images: string[]
          is_active: boolean
          sort_order: number
          seo_title: string | null
          seo_description: string | null
          last_stocked: string | null
          supplier_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name_he: string
          name_ar: string
          name_en: string
          description_he: string
          description_ar: string
          description_en: string
          price: number
          cost: number
          original_price?: number | null
          is_sale?: boolean
          is_new?: boolean
          is_featured?: boolean
          category: string
          subcategory?: string | null
          season: string
          age_group: string
          gender: string
          brand?: string | null
          sku: string
          barcode?: string | null
          material?: string | null
          care_symbols?: string[]
          sizes: string[]
          colors: Json[]
          images: string[]
          is_active?: boolean
          sort_order?: number
          seo_title?: string | null
          seo_description?: string | null
          last_stocked?: string | null
          supplier_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name_he?: string
          name_ar?: string
          name_en?: string
          description_he?: string
          description_ar?: string
          description_en?: string
          price?: number
          cost?: number
          original_price?: number | null
          is_sale?: boolean
          is_new?: boolean
          is_featured?: boolean
          category?: string
          subcategory?: string | null
          season?: string
          age_group?: string
          gender?: string
          brand?: string | null
          sku?: string
          barcode?: string | null
          material?: string | null
          care_symbols?: string[]
          sizes?: string[]
          colors?: Json[]
          images?: string[]
          is_active?: boolean
          sort_order?: number
          seo_title?: string | null
          seo_description?: string | null
          last_stocked?: string | null
          supplier_id?: string | null
        }
      }
      inventory: {
        Row: {
          id: string
          product_id: string
          size: string
          color_index: number
          stock_quantity: number
          reserved_quantity: number
          low_stock_threshold: number
          last_updated: string
          last_restocked: string | null
          cost_per_unit: number
        }
        Insert: {
          id?: string
          product_id: string
          size: string
          color_index: number
          stock_quantity: number
          reserved_quantity?: number
          low_stock_threshold?: number
          last_updated?: string
          last_restocked?: string | null
          cost_per_unit: number
        }
        Update: {
          id?: string
          product_id?: string
          size?: string
          color_index?: number
          stock_quantity?: number
          reserved_quantity?: number
          low_stock_threshold?: number
          last_updated?: string
          last_restocked?: string | null
          cost_per_unit?: number
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_name: string
          customer_phone: string
          customer_email: string | null
          shipping_address: Json
          billing_address: Json | null
          items: Json[]
          subtotal: number
          shipping_cost: number
          tax_amount: number
          discount_amount: number
          total_amount: number
          payment_method: string
          payment_status: string
          order_status: string
          tracking_number: string | null
          estimated_delivery: string | null
          actual_delivery: string | null
          notes: string | null
          created_at: string
          updated_at: string
          whatsapp_sent: boolean
          sms_sent: boolean
          email_sent: boolean
        }
        Insert: {
          id?: string
          order_number: string
          customer_name: string
          customer_phone: string
          customer_email?: string | null
          shipping_address: Json
          billing_address?: Json | null
          items: Json[]
          subtotal: number
          shipping_cost: number
          tax_amount: number
          discount_amount: number
          total_amount: number
          payment_method: string
          payment_status?: string
          order_status?: string
          tracking_number?: string | null
          estimated_delivery?: string | null
          actual_delivery?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          whatsapp_sent?: boolean
          sms_sent?: boolean
          email_sent?: boolean
        }
        Update: {
          id?: string
          order_number?: string
          customer_name?: string
          customer_phone?: string
          customer_email?: string | null
          shipping_address?: Json
          billing_address?: Json | null
          items?: Json[]
          subtotal?: number
          shipping_cost?: number
          tax_amount?: number
          discount_amount?: number
          total_amount?: number
          payment_method?: string
          payment_status?: string
          order_status?: string
          tracking_number?: string | null
          estimated_delivery?: string | null
          actual_delivery?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          whatsapp_sent?: boolean
          sms_sent?: boolean
          email_sent?: boolean
        }
      }
      analytics: {
        Row: {
          id: string
          date: string
          product_id: string | null
          event_type: string
          user_agent: string | null
          ip_address: string | null
          country: string | null
          city: string | null
          referrer: string | null
          session_id: string | null
          user_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          product_id?: string | null
          event_type: string
          user_agent?: string | null
          ip_address?: string | null
          country?: string | null
          city?: string | null
          referrer?: string | null
          session_id?: string | null
          user_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          product_id?: string | null
          event_type?: string
          user_agent?: string | null
          ip_address?: string | null
          country?: string | null
          city?: string | null
          referrer?: string | null
          session_id?: string | null
          user_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          phone: string
          name: string | null
          email: string | null
          preferred_language: string
          birth_date: string | null
          addresses: Json[]
          kids_profiles: Json[]
          preferences: Json | null
          loyalty_points: number
          total_spent: number
          order_count: number
          last_order_date: string | null
          marketing_consent: boolean
          whatsapp_consent: boolean
          sms_consent: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          phone: string
          name?: string | null
          email?: string | null
          preferred_language?: string
          birth_date?: string | null
          addresses?: Json[]
          kids_profiles?: Json[]
          preferences?: Json | null
          loyalty_points?: number
          total_spent?: number
          order_count?: number
          last_order_date?: string | null
          marketing_consent?: boolean
          whatsapp_consent?: boolean
          sms_consent?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone?: string
          name?: string | null
          email?: string | null
          preferred_language?: string
          birth_date?: string | null
          addresses?: Json[]
          kids_profiles?: Json[]
          preferences?: Json | null
          loyalty_points?: number
          total_spent?: number
          order_count?: number
          last_order_date?: string | null
          marketing_consent?: boolean
          whatsapp_consent?: boolean
          sms_consent?: boolean
          created_at?: string
          updated_at?: string
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
