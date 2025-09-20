import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Invoice functions
export const invoiceService = {
  // Save invoice to database
  async saveInvoice(invoice: any) {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoice.invoiceNumber,
          date: invoice.date,
          due_date: invoice.dueDate,
          from_name: invoice.fromName,
          from_email: invoice.fromEmail,
          from_address: invoice.fromAddress,
          from_city: invoice.fromCity,
          from_postal_code: invoice.fromPostalCode,
          from_country: invoice.fromCountry,
          from_logo: invoice.fromLogo,
          to_name: invoice.toName,
          to_email: invoice.toEmail,
          to_address: invoice.toAddress,
          to_city: invoice.toCity,
          to_postal_code: invoice.toPostalCode,
          to_country: invoice.toCountry,
          items: invoice.items,
          subtotal: invoice.subtotal,
          discount_type: invoice.discountType,
          discount_value: invoice.discountValue,
          discount_amount: invoice.discountAmount,
          tax_rate: invoice.taxRate,
          tax_amount: invoice.taxAmount,
          total: invoice.total,
          currency: invoice.currency,
          notes: invoice.notes,
          terms: invoice.terms,
          signature_name: invoice.signatureName,
          signature_image: invoice.signatureImage,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error saving invoice:', error)
      throw error
    }
  },

  // Get invoices (for future user dashboard)
  async getInvoices(userId?: string) {
    try {
      let query = supabase
        .from('invoices')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching invoices:', error)
      throw error
    }
  },

  // Delete invoice
  async deleteInvoice(invoiceId: string) {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ is_deleted: true })
        .eq('id', invoiceId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting invoice:', error)
      throw error
    }
  }
}

// Analytics functions
export const analyticsService = {
  // Track events
  async trackEvent(eventType: string, eventData?: any) {
    try {
      const { error } = await supabase
        .from('analytics')
        .insert({
          event_type: eventType,
          event_data: eventData,
          user_agent: navigator.userAgent,
        })

      if (error) throw error
    } catch (error) {
      console.error('Error tracking event:', error)
      // Don't throw error for analytics - it shouldn't break the app
    }
  },

  // Track PDF generation
  async trackPDFGeneration(invoiceNumber: string) {
    await this.trackEvent('pdf_generated', {
      invoice_number: invoiceNumber,
      timestamp: new Date().toISOString()
    })
  },

  // Track signature creation
  async trackSignatureCreated() {
    await this.trackEvent('signature_created', {
      timestamp: new Date().toISOString()
    })
  },

  // Track invoice creation
  async trackInvoiceCreated() {
    await this.trackEvent('invoice_created', {
      timestamp: new Date().toISOString()
    })
  }
}

// Template functions
export const templateService = {
  // Get public templates
  async getTemplates() {
    try {
      const { data, error } = await supabase
        .from('invoice_templates')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching templates:', error)
      throw error
    }
  },

  // Save template
  async saveTemplate(name: string, description: string, templateData: any) {
    try {
      const { data, error } = await supabase
        .from('invoice_templates')
        .insert({
          name,
          description,
          template_data: templateData,
          is_public: true
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error saving template:', error)
      throw error
    }
  }
}
