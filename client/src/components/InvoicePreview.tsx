import { forwardRef } from "react";
import { Card } from "@/components/ui/card";
import type { Invoice } from "@shared/schema";

interface InvoicePreviewProps {
  invoice: Invoice;
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ invoice }, ref) => {
    return (
      <div className="p-6 overflow-y-auto bg-background">
        <Card
          ref={ref}
          className="max-w-4xl mx-auto p-8 bg-card text-card-foreground print:shadow-none"
          id="invoice-preview"
          data-testid="invoice-preview"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">INVOICE</h1>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Invoice #: <span className="font-semibold text-foreground">{invoice.invoiceNumber}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Date: <span className="font-semibold text-foreground">{invoice.date}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Due Date: <span className="font-semibold text-foreground">{invoice.dueDate}</span>
              </p>
            </div>
          </div>

          {/* From and To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-foreground mb-2">From:</h3>
              <div className="text-sm space-y-1">
                <p className="font-semibold text-foreground">{invoice.fromName}</p>
                {invoice.fromEmail && <p className="text-muted-foreground">{invoice.fromEmail}</p>}
                <p className="text-muted-foreground">{invoice.fromAddress}</p>
                <p className="text-muted-foreground">
                  {invoice.fromCity}, {invoice.fromPostalCode}
                </p>
                <p className="text-muted-foreground">{invoice.fromCountry}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Bill To:</h3>
              <div className="text-sm space-y-1">
                <p className="font-semibold text-foreground">{invoice.toName}</p>
                {invoice.toEmail && <p className="text-muted-foreground">{invoice.toEmail}</p>}
                <p className="text-muted-foreground">{invoice.toAddress}</p>
                <p className="text-muted-foreground">
                  {invoice.toCity}, {invoice.toPostalCode}
                </p>
                <p className="text-muted-foreground">{invoice.toCountry}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-3 font-semibold text-foreground">Description</th>
                    <th className="text-center p-3 font-semibold text-foreground w-20">Qty</th>
                    <th className="text-right p-3 font-semibold text-foreground w-24">Rate</th>
                    <th className="text-right p-3 font-semibold text-foreground w-24">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-t border-border">
                      <td className="p-3 text-foreground">{item.description}</td>
                      <td className="p-3 text-center text-muted-foreground">{item.quantity}</td>
                      <td className="p-3 text-right text-muted-foreground">${item.rate.toFixed(2)}</td>
                      <td className="p-3 text-right font-semibold text-foreground">${item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-full max-w-sm space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-semibold text-foreground">${invoice.subtotal.toFixed(2)}</span>
              </div>
              {invoice.taxRate > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({invoice.taxRate}%):</span>
                  <span className="font-semibold text-foreground">${invoice.taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                <span className="text-foreground">Total:</span>
                <span className="text-foreground">${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          {(invoice.notes || invoice.terms) && (
            <div className="space-y-4 border-t border-border pt-6">
              {invoice.notes && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Notes:</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{invoice.notes}</p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Terms & Conditions:</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{invoice.terms}</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    );
  }
);

InvoicePreview.displayName = "InvoicePreview";