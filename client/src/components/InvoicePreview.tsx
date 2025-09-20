import { forwardRef } from "react";
import { Card } from "@/components/ui/card";
import { getCurrencySymbol } from "@/utils/currency";
import type { Invoice } from "@shared/schema";

interface InvoicePreviewProps {
  invoice: Invoice;
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ invoice }, ref) => {
    return (
      <div className="p-3 md:p-6 overflow-y-auto bg-background">
        <Card
          ref={ref}
          className="invoice-preview max-w-4xl mx-auto p-4 md:p-8 bg-card text-card-foreground print:shadow-none"
          id="invoice-preview"
          data-testid="invoice-preview"
        >
          {/* Header */}
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">INVOICE</h1>
            </div>
            <div className="text-left md:text-right w-full md:w-auto">
              {invoice.fromLogo && (
                <div className="mb-4 flex justify-start md:justify-end">
                  <img
                    src={invoice.fromLogo}
                    alt="Company Logo"
                    className="w-24 h-18 md:w-32 md:h-24 object-contain"
                    data-testid="preview-company-logo"
                  />
                </div>
              )}
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Invoice #: <span className="font-semibold text-foreground">{invoice.invoiceNumber || 'N/A'}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Date: <span className="font-semibold text-foreground">{invoice.date}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Due Date: <span className="font-semibold text-foreground">{invoice.dueDate}</span>
                </p>
              </div>
            </div>
          </div>

          {/* From and To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            <div>
              <h3 className="font-semibold text-foreground mb-2">From:</h3>
              <div className="text-sm space-y-1">
                <p className="font-semibold text-foreground">{invoice.fromName || 'Your Business Name'}</p>
                {invoice.fromEmail && <p className="text-muted-foreground">{invoice.fromEmail}</p>}
                <p className="text-muted-foreground">{invoice.fromAddress || 'Your Address'}</p>
                <p className="text-muted-foreground">
                  {invoice.fromCity || 'City'}, {invoice.fromPostalCode || 'Postal Code'}
                </p>
                <p className="text-muted-foreground">{invoice.fromCountry || 'Country'}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Bill To:</h3>
              <div className="text-sm space-y-1">
                <p className="font-semibold text-foreground">{invoice.toName || 'Client Name'}</p>
                {invoice.toEmail && <p className="text-muted-foreground">{invoice.toEmail}</p>}
                <p className="text-muted-foreground">{invoice.toAddress || 'Client Address'}</p>
                <p className="text-muted-foreground">
                  {invoice.toCity || 'City'}, {invoice.toPostalCode || 'Postal Code'}
                </p>
                <p className="text-muted-foreground">{invoice.toCountry || 'Country'}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6 md:mb-8">
            {/* Mobile Layout - Cards */}
            <div className="block md:hidden space-y-3">
              {invoice.items.map((item) => (
                <div key={item.id} className="border border-border rounded-lg p-4 bg-card">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Description</p>
                      <p className="text-foreground">{item.description || 'Item description'}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Qty</p>
                        <p className="text-foreground">{item.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Rate</p>
                        <p className="text-foreground">{getCurrencySymbol(invoice.currency)}{item.rate.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Amount</p>
                        <p className="text-foreground font-semibold">{getCurrencySymbol(invoice.currency)}{item.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Layout - Table */}
            <div className="hidden md:block border border-border rounded-lg overflow-hidden">
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
                      <td className="p-3 text-foreground">{item.description || 'Item description'}</td>
                      <td className="p-3 text-center text-muted-foreground">{item.quantity}</td>
                      <td className="p-3 text-right text-muted-foreground">{getCurrencySymbol(invoice.currency)}{item.rate.toFixed(2)}</td>
                      <td className="p-3 text-right font-semibold text-foreground">{getCurrencySymbol(invoice.currency)}{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-6 md:mb-8">
            <div className="w-full max-w-sm space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-semibold text-foreground">{getCurrencySymbol(invoice.currency)}{invoice.subtotal.toFixed(2)}</span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Discount {invoice.discountType === "percentage" ? `(${invoice.discountValue}%)` : ""}:
                  </span>
                  <span className="font-semibold text-foreground">-{getCurrencySymbol(invoice.currency)}{invoice.discountAmount.toFixed(2)}</span>
                </div>
              )}
              {invoice.taxRate > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({invoice.taxRate}%):</span>
                  <span className="font-semibold text-foreground">{getCurrencySymbol(invoice.currency)}{invoice.taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base md:text-lg font-bold border-t border-border pt-2">
                <span className="text-foreground">Total:</span>
                <span className="text-foreground">{getCurrencySymbol(invoice.currency)}{invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes, Terms and Signature */}
          {(invoice.notes || invoice.terms || invoice.signatureImage) && (
            <div className="space-y-4 border-t border-border pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Notes and Terms */}
                <div className="space-y-4">
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

                {/* Right Column - Signature */}
                {invoice.signatureImage && (
                  <div className="flex justify-center ml-10 mt-8">
                    <div className="text-center">
                      <div className="mb-0">
                        <img
                          src={invoice.signatureImage}
                          alt="Digital Signature"
                          className="max-h-16 object-contain"
                        />
                      </div>
                      <div className="border-t border-border pt-2 ml-10">
                        <p className="text-sm font-medium text-foreground">{invoice.signatureName}</p>
                        <p className="text-xs text-muted-foreground">Digital Signature</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }
);

InvoicePreview.displayName = "InvoicePreview";