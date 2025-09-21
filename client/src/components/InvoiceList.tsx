import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { invoiceService } from '@/lib/supabase-client'
import { useToast } from '@/hooks/use-toast'
import { FileText, Calendar, DollarSign, Trash2, Eye } from 'lucide-react'
import { format } from 'date-fns'

interface Invoice {
  id: string
  invoice_number: string
  date: string
  due_date: string
  total: number
  currency: string
  to_name: string | null
  created_at: string
}

export function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      loadInvoices()
    }
  }, [user])

  const loadInvoices = async () => {
    if (!user) return

    try {
      setLoading(true)
      const data = await invoiceService.getInvoices(user.id)
      setInvoices(data || [])
    } catch (error) {
      console.error('Error loading invoices:', error)
      toast({
        title: "Error",
        description: "Failed to load invoices. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      await invoiceService.deleteInvoice(invoiceId)
      setInvoices(invoices.filter(invoice => invoice.id !== invoiceId))
      toast({
        title: "Invoice Deleted",
        description: "The invoice has been deleted successfully.",
      })
    } catch (error) {
      console.error('Error deleting invoice:', error)
      toast({
        title: "Error",
        description: "Failed to delete invoice. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Sign In Required</h3>
          <p className="text-muted-foreground">
            Please sign in to view your saved invoices.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading invoices...</p>
        </CardContent>
      </Card>
    )
  }

  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Invoices Found</h3>
          <p className="text-muted-foreground">
            You haven't saved any invoices yet. Create your first invoice!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Invoices</h2>
        <Badge variant="secondary">
          {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid gap-4">
        {invoices.map((invoice) => (
          <Card key={invoice.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-lg">{invoice.invoice_number}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // TODO: Implement view invoice functionality
                    toast({
                      title: "Coming Soon",
                      description: "Invoice preview feature will be available soon.",
                    })
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteInvoice(invoice.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Client</p>
                  <p className="font-medium">{invoice.to_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {format(new Date(invoice.date), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-medium flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {invoice.total.toFixed(2)} {invoice.currency}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
