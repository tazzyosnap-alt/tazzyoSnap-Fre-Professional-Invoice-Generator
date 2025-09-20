import { PDFGenerator } from '../PDFGenerator';
import { InvoicePreview } from '../InvoicePreview';
import { ThemeProvider } from '../ThemeProvider';
import type { Invoice } from '@shared/schema';

// Mock invoice for PDF generation example
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
    }
  ],
  subtotal: 3000.00,
  taxRate: 8.5,
  taxAmount: 255.00,
  total: 3255.00,
  notes: "Thank you for your business!",
  terms: "Payment due within 30 days."
};

export default function PDFGeneratorExample() {
  return (
    <ThemeProvider>
      <div className="space-y-4">
        <InvoicePreview invoice={mockInvoice} />
        <PDFGenerator invoice={mockInvoice} />
      </div>
    </ThemeProvider>
  );
}