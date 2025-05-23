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

interface FormItem {
  typeface: string
  licenseType: string
  durationType: string
  durationYears: number
  languageCut: string
  fileFormats: string[]
  amount: number
}

export async function generateQuotationPDF(formData: any): Promise<Blob> {
  try {
    console.log("Starting PDF generation...")
    
    // Transform form data to match QuotationDocument interface
    const transformedData: QuotationData = {
      quotationNumber: formData.quotationNumber,
      quotationDate: formData.quotationDate,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientAddress: formData.clientAddress,
      businessSize: businessSizes.find(size => size.id === formData.businessSize),
      items: formData.items.map((item: FormItem) => ({
        typeface: item.typeface,
        licenseType: item.licenseType,
        duration: item.durationType === "perpetual" ? "Perpetual" : `${item.durationYears} Years`,
        languageCut: item.languageCut,
        fileFormats: item.fileFormats.join(", "),
        amount: item.amount
      })),
      subtotal: formData.subtotal,
      total: formData.total
    }
    
    // Create the PDF document with proper error handling
    const pdfDoc = React.createElement(Document, null,
      React.createElement(QuotationDocument, { data: transformedData })
    )
    
    // Generate PDF blob
    const blob = await pdf(pdfDoc).toBlob()
    
    if (!blob) {
      throw new Error("Failed to generate PDF blob")
    }
    
    console.log("PDF generated successfully")
    return blob
  } catch (error) {
    console.error("Error in generateQuotationPDF:", error)
    throw error
  }
}
