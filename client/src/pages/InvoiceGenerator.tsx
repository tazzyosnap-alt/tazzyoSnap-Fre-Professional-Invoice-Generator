import { useState, useRef } from "react";
import { InvoiceForm } from "@/components/InvoiceForm";
import { InvoicePreview } from "@/components/InvoicePreview";
import { PDFGenerator } from "@/components/PDFGenerator";
import type { Invoice } from "@shared/schema";

// Initial empty invoice
const initialInvoice: Invoice = {
  invoiceNumber: "",
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
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
  taxRate: 0,
  taxAmount: 0,
  total: 0,
  notes: "",
  terms: "",
};

export default function InvoiceGenerator() {
  const [invoice, setInvoice] = useState<Invoice>(initialInvoice);
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Panel - Invoice Form */}
        <div className="border-r bg-card">
          <div className="p-4 border-b bg-muted/30">
            <h2 className="text-lg font-semibold text-foreground">Invoice Details</h2>
            <p className="text-sm text-muted-foreground">Fill in the form to create your invoice</p>
          </div>
          <InvoiceForm
            invoice={invoice}
            onInvoiceChange={setInvoice}
          />
        </div>

        {/* Right Panel - Invoice Preview */}
        <div className="bg-background">
          <div className="p-4 border-b bg-muted/30">
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
    </div>
  );
}