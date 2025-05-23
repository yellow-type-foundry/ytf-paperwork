import { pdf, Document, Page } from "@react-pdf/renderer"
import { QuotationDocument } from "@/components/pdf-templates/quotation-document"
import { businessSizes } from "./typeface-data"
import React from "react"

interface QuotationData {
  quotationNumber: string
  quotationDate: string
  clientName: string
  clientEmail: string
  clientAddress?: string
  businessSize?: {
    name: string
    description: string
  }
  items: Array<{
    typeface: string
    licenseType: string
    duration: string
    languageCut: string
    fileFormats: string
    amount: number
  }>
  subtotal: number
  total: number
}

export async function generateQuotationPDF(formData: QuotationData): Promise<Blob> {
  try {
    console.log("Starting PDF generation...")
    
    // Create the PDF document
    const blob = await pdf(
      React.createElement(Document, null,
        React.createElement(QuotationDocument, { data: formData })
      )
    ).toBlob()
    
    console.log("PDF generated successfully")
    return blob
  } catch (error) {
    console.error("Error in generateQuotationPDF:", error)
    throw error
  }
}
