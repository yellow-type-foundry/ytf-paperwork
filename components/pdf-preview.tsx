import { businessSizes, formatFileFormats, formatDuration } from "@/utils/typeface-data"
import "../styles/typography.css"
import { useEffect, useState } from "react";

function PDFPreview({ formData }: { formData: any }) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let url: string | null = null;
    async function generatePdf() {
      const { pdf } = await import("@react-pdf/renderer");
      const { QuotationDocument } = await import("./pdf-templates/quotation-document");
      const instance = pdf(<QuotationDocument data={formData} />);
      const blob = await instance.toBlob();
      url = URL.createObjectURL(blob);
      if (isMounted) setPdfUrl(url);
    }
    generatePdf();
    return () => {
      isMounted = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [formData]);

  if (!pdfUrl) {
    return <div className="w-full aspect-[1/1.414] flex items-center justify-center bg-stone-200 rounded-md">Generating preview...</div>;
  }

  return (
    <div className="w-full aspect-[1/1.414] rounded-md shadow-sm overflow-hidden border flex items-center justify-center bg-stone-200">
      <iframe src={pdfUrl} className="w-full h-full" title="PDF Preview" />
    </div>
  );
}

export default PDFPreview;
