import { InvoicePreview } from '../InvoicePreview';
import { ThemeProvider } from '../ThemeProvider';
import type { Invoice } from '@shared/schema';

// Mock invoice data for preview
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
    },
    {
      id: "3",
      description: "Project Management",
      quantity: 15,
      rate: 65.00,
      amount: 975.00
    }
  ],
  subtotal: 5675.00,
  discountType: "percentage",
  discountValue: 0,
  discountAmount: 0,
  taxRate: 8.5,
  taxAmount: 482.38,
  total: 6157.38,
  notes: "Thank you for choosing TazzyoSnap Solutions. We appreciate your business and look forward to working with you again.",
  terms: "Payment due within 30 days. Late payments may incur a 1.5% monthly service charge.",
  signatureName: "",
  signatureImage: ""
};

export default function InvoicePreviewExample() {
  return (
    <ThemeProvider>
      <InvoicePreview invoice={mockInvoice} />
    </ThemeProvider>
  );
}