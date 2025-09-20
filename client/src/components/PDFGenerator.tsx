import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { Invoice } from "@shared/schema";
import { trackPDFGeneration } from "@/lib/analytics";

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

    let originalClasses = '';
    
    try {
      const element = document.getElementById("invoice-preview");
      if (!element) {
        throw new Error("Invoice preview not found");
      }

      // Create a temporary element for PDF generation with desktop layout
      const tempElement = element.cloneNode(true) as HTMLElement;
      tempElement.id = "temp-invoice-preview";
      tempElement.style.position = "absolute";
      tempElement.style.left = "-9999px";
      tempElement.style.top = "0";
      tempElement.style.width = "800px"; // Force desktop width
      tempElement.style.zIndex = "-1";
      
      // Add to body temporarily
      document.body.appendChild(tempElement);

      // Force desktop layout on the temporary element
      const mobileElements = tempElement.querySelectorAll('.block.md\\:hidden');
      const desktopElements = tempElement.querySelectorAll('.hidden.md\\:block');
      
      mobileElements.forEach(el => {
        el.classList.remove('block', 'md:hidden');
        el.classList.add('hidden');
      });
      
      desktopElements.forEach(el => {
        el.classList.remove('hidden', 'md:block');
        el.classList.add('block');
      });

      // Wait for DOM to update
      await new Promise(resolve => setTimeout(resolve, 200));

      // Create canvas from the temporary element
      const canvas = await html2canvas(tempElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 800,
        height: tempElement.scrollHeight,
      });

      // Remove temporary element
      document.body.removeChild(tempElement);

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

             // Track PDF generation
             trackPDFGeneration(invoice.invoiceNumber || 'unknown');

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
      // Clean up any remaining temporary elements
      try {
        const tempElement = document.getElementById("temp-invoice-preview");
        if (tempElement) {
          document.body.removeChild(tempElement);
        }
      } catch (cleanupError) {
        console.warn("Failed to cleanup temporary element:", cleanupError);
      }
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