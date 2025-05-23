import { pdf } from "@react-pdf/renderer"
import { QuotationDocument } from "@/components/pdf-templates/quotation-document"
import { businessSizes } from "./typeface-data"

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

// Cache for PDF blobs
const pdfCache = new Map<string, Blob>()

export async function generateQuotationPDF(formData: any): Promise<Blob> {
  try {
    console.log("Starting PDF generation...")
    
    // Create a cache key from the form data
    const cacheKey = JSON.stringify({
      quotationNumber: formData.quotationNumber,
      items: (formData.items || []).map((item: any) => ({
        typeface: item.typeface || "",
        licenseType: item.licenseType || "",
        duration: item.durationType || "",
        amount: Number(item.amount) || 0
      }))
    })

    // Check if we have a cached version
    const cachedBlob = pdfCache.get(cacheKey)
    if (cachedBlob) {
      console.log("Using cached PDF")
      return cachedBlob
    }
    
    // Transform form data to match QuotationDocument interface
    const transformedData: QuotationData = {
      quotationNumber: formData.quotationNumber || "",
      quotationDate: formData.quotationDate || "",
      clientName: formData.clientName || "",
      clientEmail: formData.clientEmail || "",
      clientAddress: formData.clientAddress || "",
      businessSize: businessSizes.find(size => size.id === formData.businessSize),
      items: (formData.items || []).map((item: any) => {
        const safeItem = {
          typeface: String(item.typeface || ""),
          licenseType: String(item.licenseType || ""),
          duration: item.durationType === "perpetual" ? "Perpetual" : `${item.durationYears || 1} Years`,
          languageCut: String(item.languageCut || ""),
          fileFormats: Array.isArray(item.fileFormats) ? item.fileFormats.join(", ") : String(item.fileFormats || ""),
          amount: Number(item.amount) || 0
        }
        return safeItem
      }),
      subtotal: Number(formData.subtotal) || 0,
      total: Number(formData.total) || 0
    }
    
    // Generate PDF blob with timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("PDF generation timed out")), 30000) // 30 second timeout
    })
    
    const pdfPromise = pdf(<QuotationDocument data={transformedData} />).toBlob()
    const blob = await Promise.race([pdfPromise, timeoutPromise]) as Blob
    
    if (!blob) {
      throw new Error("Failed to generate PDF blob")
    }
    
    // Cache the generated blob
    pdfCache.set(cacheKey, blob)
    
    console.log("PDF generated successfully")
    return blob
  } catch (error: unknown) {
    console.error("Error in generateQuotationPDF:", error)
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export type { QuotationData }
