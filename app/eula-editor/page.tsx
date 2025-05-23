"use client"

import { useState, useEffect } from "react"
import { EditableEulaForm } from "@/components/editable-eula-form"
import { useSearchParams } from "next/navigation"

export default function EulaEditorPage() {
  const [quotationData, setQuotationData] = useState<any>(null)
  const searchParams = useSearchParams()
  const quotationId = searchParams.get("quotationId")

  // Update the eulaTemplatePath to ensure it's correct
  // Path to your existing EULA PDF template
  const eulaTemplatePath = "/documents/YTF-EULA.pdf"

  // Add this console log to verify the path
  console.log("Loading PDF from:", eulaTemplatePath)

  // Fetch quotation data if quotationId is provided
  useEffect(() => {
    const fetchQuotationData = async () => {
      if (quotationId) {
        try {
          // In a real application, you would fetch the data from your API
          // For now, we'll use mock data
          const mockQuotationData = {
            quotationNumber: quotationId,
            quotationDate: new Date().toISOString().split("T")[0],
            clientName: "Sample Client",
            clientCompany: "Sample Company",
            clientEmail: "client@example.com",
            businessSize: "M — Business (< 150 employees)",
            selectedFonts: [
              { label: "YTF Sans", value: "ytf-sans" },
              { label: "YTF Serif", value: "ytf-serif" },
            ],
            fileFormats: ["OTF, TTF", "WOFF, WOFF2"],
            duration: "Perpetual",
            languages: "Latin",
            styles: "Regular, Bold, Italic",
            licenseType: "Desktop, Web, App License",
            total: 1200,
          }

          setQuotationData(mockQuotationData)
        } catch (error) {
          console.error("Error fetching quotation data:", error)
        }
      }
    }

    fetchQuotationData()
  }, [quotationId])

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Generate EULA</h1>
        <p className="text-muted-foreground">Fill in the details to customize your EULA document</p>
        {quotationId && <p className="text-sm text-yellow-600 mt-2">Using data from Quotation #{quotationId}</p>}
      </div>

      <EditableEulaForm
        pdfUrl={eulaTemplatePath}
        fileName={`YTF-EULA-${quotationData?.clientCompany || "Document"}.pdf`}
        quotationData={quotationData}
      />
    </div>
  )
}
