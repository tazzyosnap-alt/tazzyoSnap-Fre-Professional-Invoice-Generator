import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { CURRENCY_OPTIONS, getCurrencySymbol } from "@/utils/currency";
import type { Invoice, InvoiceItem } from "@shared/schema";

interface InvoiceFormProps {
  invoice: Invoice;
  onInvoiceChange: (invoice: Invoice) => void;
}

export function InvoiceForm({ invoice, onInvoiceChange }: InvoiceFormProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('Logo file size must be less than 2MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateInvoice({ fromLogo: result });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeLogo = () => {
    setLogoFile(null);
    updateInvoice({ fromLogo: undefined });
    // Reset the file input
    const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const updateInvoice = (updates: Partial<Invoice>) => {
    const updatedInvoice = { ...invoice, ...updates };
    
    // Recalculate totals
    const subtotal = updatedInvoice.items.reduce((sum, item) => sum + item.amount, 0);
    
    // Calculate discount amount
    let discountAmount = 0;
    if (updatedInvoice.discountValue > 0) {
      if (updatedInvoice.discountType === "percentage") {
        discountAmount = (subtotal * updatedInvoice.discountValue) / 100;
      } else {
        discountAmount = updatedInvoice.discountValue;
      }
    }
    
    // Calculate tax on amount after discount
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * updatedInvoice.taxRate) / 100;
    const total = taxableAmount + taxAmount;
    
    onInvoiceChange({
      ...updatedInvoice,
      subtotal,
      discountAmount,
      taxAmount,
      total,
    });
  };

  const updateItem = (index: number, updates: Partial<InvoiceItem>) => {
    const newItems = [...invoice.items];
    const updatedItem = { ...newItems[index], ...updates };
    
    // Recalculate amount
    if ('quantity' in updates || 'rate' in updates) {
      updatedItem.amount = updatedItem.quantity * updatedItem.rate;
    }
    
    newItems[index] = updatedItem;
    updateInvoice({ items: newItems });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    updateInvoice({ items: [...invoice.items, newItem] });
  };

  const removeItem = (index: number) => {
    const newItems = invoice.items.filter((_, i) => i !== index);
    updateInvoice({ items: newItems });
  };

  return (
    <div className="space-y-6 p-6 overflow-y-auto">
      {/* Invoice Details */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              value={invoice.invoiceNumber}
              onChange={(e) => updateInvoice({ invoiceNumber: e.target.value })}
              data-testid="input-invoice-number"
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={invoice.currency}
              onValueChange={(value) => updateInvoice({ currency: value })}
            >
              <SelectTrigger data-testid="select-currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={invoice.date}
              onChange={(e) => updateInvoice({ date: e.target.value })}
              data-testid="input-date"
            />
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={invoice.dueDate}
              onChange={(e) => updateInvoice({ dueDate: e.target.value })}
              data-testid="input-due-date"
            />
          </div>
        </CardContent>
      </Card>

      {/* From Details */}
      <Card>
        <CardHeader>
          <CardTitle>From (Your Business)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Company Logo Upload */}
          <div>
            <Label>Company Logo</Label>
            <div className="mt-2">
              {invoice.fromLogo ? (
                <div className="flex items-start gap-4">
                  <img
                    src={invoice.fromLogo}
                    alt="Company Logo"
                    className="w-24 h-24 object-contain border rounded-md"
                    data-testid="img-company-logo"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={removeLogo}
                    data-testid="button-remove-logo"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    data-testid="input-logo-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    data-testid="button-upload-logo"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 2MB. Recommended: 200x80px
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Business Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fromName">Business Name</Label>
              <Input
                id="fromName"
                value={invoice.fromName}
                onChange={(e) => updateInvoice({ fromName: e.target.value })}
                data-testid="input-from-name"
              />
            </div>
          <div>
            <Label htmlFor="fromEmail">Email</Label>
            <Input
              id="fromEmail"
              type="email"
              value={invoice.fromEmail || ""}
              onChange={(e) => updateInvoice({ fromEmail: e.target.value })}
              data-testid="input-from-email"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="fromAddress">Address</Label>
            <Input
              id="fromAddress"
              value={invoice.fromAddress}
              onChange={(e) => updateInvoice({ fromAddress: e.target.value })}
              data-testid="input-from-address"
            />
          </div>
          <div>
            <Label htmlFor="fromCity">City</Label>
            <Input
              id="fromCity"
              value={invoice.fromCity}
              onChange={(e) => updateInvoice({ fromCity: e.target.value })}
              data-testid="input-from-city"
            />
          </div>
          <div>
            <Label htmlFor="fromPostalCode">Postal Code</Label>
            <Input
              id="fromPostalCode"
              value={invoice.fromPostalCode}
              onChange={(e) => updateInvoice({ fromPostalCode: e.target.value })}
              data-testid="input-from-postal"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="fromCountry">Country</Label>
            <Input
              id="fromCountry"
              value={invoice.fromCountry}
              onChange={(e) => updateInvoice({ fromCountry: e.target.value })}
              data-testid="input-from-country"
            />
          </div>
          </div>
        </CardContent>
      </Card>

      {/* To Details */}
      <Card>
        <CardHeader>
          <CardTitle>Bill To (Client)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="toName">Client Name</Label>
            <Input
              id="toName"
              value={invoice.toName}
              onChange={(e) => updateInvoice({ toName: e.target.value })}
              data-testid="input-to-name"
            />
          </div>
          <div>
            <Label htmlFor="toEmail">Email</Label>
            <Input
              id="toEmail"
              type="email"
              value={invoice.toEmail || ""}
              onChange={(e) => updateInvoice({ toEmail: e.target.value })}
              data-testid="input-to-email"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="toAddress">Address</Label>
            <Input
              id="toAddress"
              value={invoice.toAddress}
              onChange={(e) => updateInvoice({ toAddress: e.target.value })}
              data-testid="input-to-address"
            />
          </div>
          <div>
            <Label htmlFor="toCity">City</Label>
            <Input
              id="toCity"
              value={invoice.toCity}
              onChange={(e) => updateInvoice({ toCity: e.target.value })}
              data-testid="input-to-city"
            />
          </div>
          <div>
            <Label htmlFor="toPostalCode">Postal Code</Label>
            <Input
              id="toPostalCode"
              value={invoice.toPostalCode}
              onChange={(e) => updateInvoice({ toPostalCode: e.target.value })}
              data-testid="input-to-postal"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="toCountry">Country</Label>
            <Input
              id="toCountry"
              value={invoice.toCountry}
              onChange={(e) => updateInvoice({ toCountry: e.target.value })}
              data-testid="input-to-country"
            />
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Items</CardTitle>
          <Button
            onClick={addItem}
            size="sm"
            data-testid="button-add-item"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {invoice.items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5">
                <Label>Description</Label>
                <Input
                  value={item.description}
                  onChange={(e) => updateItem(index, { description: e.target.value })}
                  data-testid={`input-item-description-${index}`}
                />
              </div>
              <div className="col-span-2">
                <Label>Qty</Label>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, { quantity: parseInt(e.target.value) || 1 })}
                  data-testid={`input-item-quantity-${index}`}
                />
              </div>
              <div className="col-span-2">
                <Label>Rate ({getCurrencySymbol(invoice.currency)})</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.rate}
                  onChange={(e) => updateItem(index, { rate: parseFloat(e.target.value) || 0 })}
                  data-testid={`input-item-rate-${index}`}
                />
              </div>
              <div className="col-span-2">
                <Label>Amount ({getCurrencySymbol(invoice.currency)})</Label>
                <Input
                  type="number"
                  value={item.amount.toFixed(2)}
                  readOnly
                  className="bg-muted"
                  data-testid={`text-item-amount-${index}`}
                />
              </div>
              <div className="col-span-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                  data-testid={`button-remove-item-${index}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tax and Totals */}
      <Card>
        <CardHeader>
          <CardTitle>Tax & Totals</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="discountType">Discount Type</Label>
            <Select
              value={invoice.discountType}
              onValueChange={(value: "percentage" | "fixed") => updateInvoice({ discountType: value })}
            >
              <SelectTrigger data-testid="select-discount-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage (%)</SelectItem>
                <SelectItem value="fixed">Fixed Amount ({getCurrencySymbol(invoice.currency)})</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="discountValue">
              Discount {invoice.discountType === "percentage" ? "(%)" : `(${getCurrencySymbol(invoice.currency)})`}
            </Label>
            <Input
              id="discountValue"
              type="number"
              min="0"
              step="0.01"
              value={invoice.discountValue}
              onChange={(e) => updateInvoice({ discountValue: parseFloat(e.target.value) || 0 })}
              data-testid="input-discount-value"
            />
          </div>
          <div>
            <Label htmlFor="taxRate">Tax Rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={invoice.taxRate}
              onChange={(e) => updateInvoice({ taxRate: parseFloat(e.target.value) || 0 })}
              data-testid="input-tax-rate"
            />
          </div>
          <div>
            <Label>Subtotal</Label>
            <Input
              value={`${getCurrencySymbol(invoice.currency)}${invoice.subtotal.toFixed(2)}`}
              readOnly
              className="bg-muted"
              data-testid="text-subtotal"
            />
          </div>
          {invoice.discountAmount > 0 && (
            <div>
              <Label>Discount Amount</Label>
              <Input
                value={`-${getCurrencySymbol(invoice.currency)}${invoice.discountAmount.toFixed(2)}`}
                readOnly
                className="bg-muted"
                data-testid="text-discount-amount"
              />
            </div>
          )}
          <div>
            <Label>Tax Amount</Label>
            <Input
              value={`${getCurrencySymbol(invoice.currency)}${invoice.taxAmount.toFixed(2)}`}
              readOnly
              className="bg-muted"
              data-testid="text-tax-amount"
            />
          </div>
          <div>
            <Label>Total</Label>
            <Input
              value={`${getCurrencySymbol(invoice.currency)}${invoice.total.toFixed(2)}`}
              readOnly
              className="bg-muted font-semibold"
              data-testid="text-total"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes and Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={invoice.notes || ""}
              onChange={(e) => updateInvoice({ notes: e.target.value })}
              placeholder="Add any additional notes..."
              data-testid="textarea-notes"
            />
          </div>
          <div>
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              value={invoice.terms || ""}
              onChange={(e) => updateInvoice({ terms: e.target.value })}
              placeholder="Add payment terms and conditions..."
              data-testid="textarea-terms"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}