import { useState, useRef } from "react";
import { InvoiceForm } from "@/components/InvoiceForm";
import { InvoicePreview } from "@/components/InvoicePreview";
import { PDFGenerator } from "@/components/PDFGenerator";
import { InvoiceList } from "@/components/InvoiceList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import type { Invoice } from "@shared/schema";

// Initial empty invoice
const initialInvoice: Invoice = {
  invoiceNumber: "",
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
  currency: "USD",
  fromName: "",
  fromEmail: "",
  fromAddress: "",
  fromCity: "",
  fromPostalCode: "",
  fromCountry: "",
  toName: "",
  toEmail: "",
  toAddress: "",
  toCity: "",
  toPostalCode: "",
  toCountry: "",
  items: [
    {
      id: "item-1",
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    }
  ],
  subtotal: 0,
  discountType: "percentage" as const,
  discountValue: 0,
  discountAmount: 0,
  taxRate: 0,
  taxAmount: 0,
  total: 0,
  notes: "",
  terms: "",
  signatureName: "",
  signatureImage: "",
};

export default function InvoiceGenerator() {
  const [invoice, setInvoice] = useState<Invoice>(initialInvoice);
  const [activeTab, setActiveTab] = useState("create");
  const previewRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Invoice</TabsTrigger>
            <TabsTrigger value="invoices" disabled={!user}>
              My Invoices
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
              {/* Left Panel - Invoice Form */}
              <div className="border-r bg-card overflow-y-auto">
                <div className="p-3 md:p-4 border-b bg-muted/30 sticky top-0 z-10">
                  <h2 className="text-lg font-semibold text-foreground">Invoice Details</h2>
                  <p className="text-sm text-muted-foreground">Fill in the form to create your invoice</p>
                </div>
                <InvoiceForm
                  invoice={invoice}
                  onInvoiceChange={setInvoice}
                />
              </div>

              {/* Right Panel - Invoice Preview */}
              <div className="bg-background overflow-y-auto">
                <div className="p-3 md:p-4 border-b bg-muted/30 sticky top-0 z-10">
                  <h2 className="text-lg font-semibold text-foreground">Live Preview</h2>
                  <p className="text-sm text-muted-foreground">See how your invoice will look</p>
                </div>
                <InvoicePreview
                  ref={previewRef}
                  invoice={invoice}
                />
                <PDFGenerator invoice={invoice} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="invoices" className="mt-4">
            <InvoiceList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}