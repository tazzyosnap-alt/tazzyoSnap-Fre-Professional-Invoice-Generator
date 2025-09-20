import { useState } from 'react';
import { InvoiceForm } from '../InvoiceForm';
import { ThemeProvider } from '../ThemeProvider';
import type { Invoice } from '@shared/schema';

// Mock invoice data for example
const mockInvoice: Invoice = {
  invoiceNumber: "INV-001",
  date: "2024-01-15",
  dueDate: "2024-02-15",
  currency: "USD",
  fromName: "TazzyoSnap Solutions",
  fromEmail: "billing@tazzyosnap.com",
  fromAddress: "123 Business St",
  fromCity: "New York",
  fromPostalCode: "10001",
  fromCountry: "United States",
  toName: "Acme Corporation",
  toEmail: "accounts@acme.com",
  toAddress: "456 Client Ave",
  toCity: "Los Angeles",
  toPostalCode: "90210",
  toCountry: "United States",
  items: [
    {
      id: "1",
      description: "Web Development Services",
      quantity: 40,
      rate: 75.00,
      amount: 3000.00
    },
    {
      id: "2", 
      description: "UI/UX Design",
      quantity: 20,
      rate: 85.00,
      amount: 1700.00
    }
  ],
  subtotal: 4700.00,
  taxRate: 8.5,
  taxAmount: 399.50,
  total: 5099.50,
  notes: "Thank you for your business!",
  terms: "Payment due within 30 days."
};

export default function InvoiceFormExample() {
  const [invoice, setInvoice] = useState<Invoice>(mockInvoice);

  return (
    <ThemeProvider>
      <div className="max-w-2xl mx-auto">
        <InvoiceForm
          invoice={invoice}
          onInvoiceChange={setInvoice}
        />
      </div>
    </ThemeProvider>
  );
}