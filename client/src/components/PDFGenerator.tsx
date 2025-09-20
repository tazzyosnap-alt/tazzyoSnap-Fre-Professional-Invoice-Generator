import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { Invoice } from "@shared/schema";

interface PDFGeneratorProps {
  invoice: Invoice;
}

export function PDFGenerator({ invoice }: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePDF = async () => {
    if (!invoice.invoiceNumber) {
      toast({
        title: "Missing Invoice Number",
        description: "Please enter an invoice number before generating PDF.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const element = document.getElementById("invoice-preview");
      if (!element) {
        throw new Error("Invoice preview not found");
      }

      // Create canvas from the invoice preview
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      const filename = `Invoice-${invoice.invoiceNumber}.pdf`;
      pdf.save(filename);

      toast({
        title: "PDF Generated",
        description: `Invoice ${invoice.invoiceNumber} has been downloaded successfully.`,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex justify-center p-6 border-t">
      <Button
        onClick={generatePDF}
        disabled={isGenerating}
        size="lg"
        className="min-w-32"
        data-testid="button-generate-pdf"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </>
        )}
      </Button>
    </div>
  );
}