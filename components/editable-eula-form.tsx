"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define the field types
type FieldType = "text" | "textarea" | "date"

// Define the field interface
interface Field {
  name: string
  label: string
  type: FieldType
  x: number
  y: number
  page: number
  width: number
  fontSize: number
  required: boolean
  defaultValue?: string
}

// Define the auto-generated field interface
interface AutoField {
  name: string
  quotationField: string
  x: number
  y: number
  page: number
  width: number
  fontSize: number
}

// Update the EDITABLE_FIELDS array with more accurate coordinates based on the actual PDF layout
// Replace the existing EDITABLE_FIELDS array with this updated version:

const EDITABLE_FIELDS: Field[] = [
  // Page 2 - License Holder
  {
    name: "licenseHolderCompanyName",
    label: "License Holder - Company Name",
    type: "text",
    x: 200,
    y: 650,
    page: 1,
    width: 200,
    fontSize: 12,
    required: true,
  },
  {
    name: "licenseHolderBrandName",
    label: "License Holder - Brand Name",
    type: "text",
    x: 200,
    y: 620,
    page: 1,
    width: 200,
    fontSize: 12,
    required: false,
  },
  {
    name: "licenseHolderAddress",
    label: "License Holder - Address",
    type: "textarea",
    x: 200,
    y: 560,
    page: 1,
    width: 200,
    fontSize: 10,
    required: true,
  },
  {
    name: "licenseHolderTaxId",
    label: "License Holder - Tax Identification No.",
    type: "text",
    x: 200,
    y: 590,
    page: 1,
    width: 200,
    fontSize: 12,
    required: false,
  },
  {
    name: "licenseHolderContactName",
    label: "License Holder - Contact Name",
    type: "text",
    x: 200,
    y: 520,
    page: 1,
    width: 200,
    fontSize: 12,
    required: true,
  },
  {
    name: "licenseHolderEmail",
    label: "License Holder - Email",
    type: "text",
    x: 200,
    y: 490,
    page: 1,
    width: 200,
    fontSize: 12,
    required: true,
  },

  // Page 2 - Billing
  {
    name: "billingCompanyName",
    label: "Billing - Company Name",
    type: "text",
    x: 450,
    y: 650,
    page: 1,
    width: 200,
    fontSize: 12,
    required: true,
  },
  {
    name: "billingTaxId",
    label: "Billing - Tax Identification No.",
    type: "text",
    x: 450,
    y: 590,
    page: 1,
    width: 200,
    fontSize: 12,
    required: false,
  },
  {
    name: "billingAddress",
    label: "Billing - Address",
    type: "textarea",
    x: 450,
    y: 560,
    page: 1,
    width: 200,
    fontSize: 10,
    required: true,
  },
  {
    name: "billingContactName",
    label: "Billing - Contact Name",
    type: "text",
    x: 450,
    y: 520,
    page: 1,
    width: 200,
    fontSize: 12,
    required: true,
  },
  {
    name: "billingEmail",
    label: "Billing - Email",
    type: "text",
    x: 450,
    y: 490,
    page: 1,
    width: 200,
    fontSize: 12,
    required: true,
  },

  // Page 2 - General Info
  {
    name: "date",
    label: "Date",
    type: "date",
    x: 200,
    y: 460,
    page: 1,
    width: 200,
    fontSize: 12,
    required: true,
  },
  {
    name: "licenseNo",
    label: "License No.",
    type: "text",
    x: 450,
    y: 460,
    page: 1,
    width: 200,
    fontSize: 12,
    required: true,
  },

  // Page 3 - License Extensions
  {
    name: "licenseExtensionsIncluded",
    label: "License Extensions - Included",
    type: "textarea",
    x: 200,
    y: 400,
    page: 2,
    width: 200,
    fontSize: 10,
    required: false,
  },
  {
    name: "licenseExtensionsExcluded",
    label: "License Extensions - Excluded",
    type: "textarea",
    x: 450,
    y: 400,
    page: 2,
    width: 200,
    fontSize: 10,
    required: false,
  },

  // Page 17 - Signature
  {
    name: "representativeName",
    label: "Representative Name",
    type: "text",
    x: 200,
    y: 200,
    page: 16,
    width: 200,
    fontSize: 12,
    required: true,
  },
  {
    name: "representativeTitle",
    label: "Representative Title",
    type: "text",
    x: 200,
    y: 170,
    page: 16,
    width: 200,
    fontSize: 12,
    required: true,
  },
]

// Update the AUTO_GENERATED_FIELDS array with more accurate coordinates based on the actual PDF layout
// Replace the existing AUTO_GENERATED_FIELDS array with this updated version:

const AUTO_GENERATED_FIELDS: AutoField[] = [
  // Page 2
  {
    name: "date",
    quotationField: "quotationDate",
    x: 200,
    y: 460,
    page: 1,
    width: 200,
    fontSize: 12,
  },
  {
    name: "licenseNo",
    quotationField: "quotationNumber",
    x: 450,
    y: 460,
    page: 1,
    width: 200,
    fontSize: 12,
  },

  // Page 3
  {
    name: "fontSoftwareName",
    quotationField: "selectedFonts",
    x: 350,
    y: 650,
    page: 2,
    width: 250,
    fontSize: 12,
  },
  {
    name: "languages",
    quotationField: "languages",
    x: 350,
    y: 620,
    page: 2,
    width: 250,
    fontSize: 12,
  },
  {
    name: "styles",
    quotationField: "styles",
    x: 350,
    y: 590,
    page: 2,
    width: 250,
    fontSize: 12,
  },
  {
    name: "fileFormats",
    quotationField: "fileFormats",
    x: 350,
    y: 560,
    page: 2,
    width: 250,
    fontSize: 12,
  },
  {
    name: "licenseDuration",
    quotationField: "duration",
    x: 350,
    y: 530,
    page: 2,
    width: 250,
    fontSize: 12,
  },
  {
    name: "businessSize",
    quotationField: "businessSize",
    x: 350,
    y: 500,
    page: 2,
    width: 250,
    fontSize: 12,
  },
  {
    name: "licenseGranted",
    quotationField: "licenseType",
    x: 350,
    y: 450,
    page: 2,
    width: 250,
    fontSize: 12,
  },
  {
    name: "totalFeeVND",
    quotationField: "totalVND",
    x: 350,
    y: 400,
    page: 2,
    width: 250,
    fontSize: 12,
  },
  {
    name: "totalFeeUSD",
    quotationField: "total",
    x: 350,
    y: 370,
    page: 2,
    width: 250,
    fontSize: 12,
  },

  // Page 17
  {
    name: "signatureDate",
    quotationField: "quotationDate",
    x: 450,
    y: 170,
    page: 16,
    width: 200,
    fontSize: 12,
  },
]

interface EditableEulaFormProps {
  pdfUrl: string // URL to your existing EULA PDF
  fileName?: string // Default filename for the downloaded PDF
  quotationData?: any // Quotation data for auto-generated fields
}

// Updated styles for the A4 canvas and input fields
const styles = {
  page: {
    width: '210mm',
    height: '297mm',
    padding: '20px',
    backgroundColor: '#ffffff',
    fontFamily: 'YTF Grand 123 Regular',
    fontSize: '9px',
    lineHeight: '120%',
  },
  header: {
    marginBottom: '20px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    marginBottom: '16px',
  },
  clientInfo: {
    marginBottom: '20px',
  },
  clientName: {
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  clientDetail: {
    fontSize: '9px',
    marginBottom: '2px',
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  text: {
    fontSize: '9px',
    marginBottom: '4px',
  },
  fontList: {
    marginLeft: '20px',
  },
  fontItem: {
    fontSize: '9px',
    marginBottom: '2px',
  },
  footer: {
    marginTop: '20px',
    fontSize: '9px',
    textAlign: 'center',
  },
  inputContainer: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
  },
  inputColumn: {
    flex: 1,
  },
  inputField: {
    marginBottom: '10px',
  },
  inputLabel: {
    fontSize: '9px',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    height: '24px',
    fontSize: '9px',
    padding: '4px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
};

export function EditableEulaForm({ pdfUrl, fileName = "YTF-EULA.pdf", quotationData }: EditableEulaFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("form")

  // Initialize form data with default values
  useEffect(() => {
    const initialData: Record<string, string> = {}

    // Initialize editable fields
    EDITABLE_FIELDS.forEach((field) => {
      if (field.defaultValue) {
        initialData[field.name] = field.defaultValue
      } else {
        initialData[field.name] = ""
      }
    })

    // Initialize auto-generated fields from quotation data if available
    if (quotationData) {
      AUTO_GENERATED_FIELDS.forEach((field) => {
        let value = ""

        // Handle special cases for formatting
        if (field.quotationField === "selectedFonts" && quotationData.selectedFonts) {
          value = quotationData.selectedFonts.map((font: any) => font.label).join(", ")
        } else if (field.quotationField === "fileFormats" && quotationData.fileFormats) {
          value = quotationData.fileFormats.join(", ")
        } else if (field.name === "totalFeeVND" && quotationData.total) {
          // Assuming an exchange rate of 24,500 VND to 1 USD
          value = (quotationData.total * 24500).toLocaleString() + " VND"
        } else if (field.name === "totalFeeUSD" && quotationData.total) {
          value = "$" + quotationData.total.toLocaleString()
        } else if (quotationData[field.quotationField]) {
          value = quotationData[field.quotationField].toString()
        }

        initialData[field.name] = value
      })
    }

    setFormData(initialData)
  }, [quotationData])

  // Load the PDF for preview
  useEffect(() => {
    const loadPdf = async () => {
      try {
        console.log("Attempting to load PDF from:", pdfUrl)

        // First check if the PDF exists with a more detailed check
        console.log("Checking if PDF exists...")
        const checkResponse = await fetch(pdfUrl, { method: "HEAD" })
        console.log("HEAD request status:", checkResponse.status)
        console.log("Content-Type:", checkResponse.headers.get("content-type"))
        console.log("Content-Length:", checkResponse.headers.get("content-length"))

        if (!checkResponse.ok) {
          console.error(`PDF not found at ${pdfUrl}. Status: ${checkResponse.status}`)
          // Show a user-friendly error message
          setPreviewUrl("error")
          return
        }

        // Check if the content type is actually a PDF
        const contentType = checkResponse.headers.get("content-type")
        if (contentType && !contentType.includes("pdf")) {
          console.error(`File is not a PDF. Content-Type: ${contentType}`)
          setPreviewUrl("error")
          return
        }

        console.log("Fetching PDF content...")
        const response = await fetch(pdfUrl)

        if (!response.ok) {
          console.error(`Failed to fetch PDF: ${response.statusText}`)
          setPreviewUrl("error")
          return
        }

        console.log("PDF fetched successfully, processing...")
        const pdfBuffer = await response.arrayBuffer()
        console.log("PDF buffer size:", pdfBuffer.byteLength, "bytes")

        // Check if we actually got content
        if (pdfBuffer.byteLength === 0) {
          console.error("PDF file is empty")
          setPreviewUrl("error")
          return
        }

        // Check for PDF header
        const uint8Array = new Uint8Array(pdfBuffer)
        const header = new TextDecoder().decode(uint8Array.slice(0, 10))
        console.log("File header:", header)

        if (!header.startsWith("%PDF-")) {
          console.error("File does not have a valid PDF header. Header:", header)
          setPreviewUrl("error")
          return
        }

        console.log("Loading PDF with pdf-lib...")
        const pdfDoc = await PDFDocument.load(pdfBuffer)
        console.log("PDF loaded successfully. Pages:", pdfDoc.getPageCount())

        const pdfBytes = await pdfDoc.save()
        setPdfBytes(pdfBytes)

        // Create a preview URL
        console.log("Creating preview URL...")
        const blob = new Blob([pdfBytes], { type: "application/pdf" })
        const url = URL.createObjectURL(blob)
        console.log("Preview URL created:", url)
        setPreviewUrl(url)
      } catch (error) {
        console.error("Error loading PDF:", error)
        setPreviewUrl("error")
      }
    }

    loadPdf()

    // Cleanup function
    return () => {
      if (previewUrl && previewUrl !== "error") {
        console.log("Cleaning up preview URL:", previewUrl)
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [pdfUrl])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const isFormValid = () => {
    return EDITABLE_FIELDS.filter((field) => field.required).every((field) => formData[field.name])
  }

  const generatePDF = async () => {
    if (!pdfBytes) return

    setIsLoading(true)

    try {
      // Load the PDF document
      const pdfDoc = await PDFDocument.load(pdfBytes)

      // Get the pages
      const pages = pdfDoc.getPages()

      // Embed the YTF Grand 123 Regular font
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica) // Replace with actual font embedding if available

      // Add text for each editable field
      EDITABLE_FIELDS.forEach((field) => {
        const value = formData[field.name] || ""

        if (value) {
          // Get the correct page (0-indexed in pdf-lib)
          const page = pages[field.page]

          if (field.type === "textarea") {
            // Split text into lines for textarea fields
            const lines = value.split("\n")
            lines.forEach((line, index) => {
              page.drawText(line, {
                x: field.x,
                y: field.y - index * 15, // Adjust y position for each line
                size: 9, // Font size: 9px
                font,
                color: rgb(0, 0, 0),
                lineHeight: 1.2, // Line height: 120%
              })
            })
          } else {
            // Draw single line text
            page.drawText(value, {
              x: field.x,
              y: field.y,
              size: 9, // Font size: 9px
              font,
              color: rgb(0, 0, 0),
              lineHeight: 1.2, // Line height: 120%
            })
          }
        }
      })

      // Add text for each auto-generated field
      AUTO_GENERATED_FIELDS.forEach((field) => {
        const value = formData[field.name] || ""

        if (value) {
          // Get the correct page (0-indexed in pdf-lib)
          const page = pages[field.page]

          // Draw the text
          page.drawText(value, {
            x: field.x,
            y: field.y,
            size: 9, // Font size: 9px
            font,
            color: rgb(0, 0, 0),
            lineHeight: 1.2, // Line height: 120%
          })
        }
      })

      // Save the PDF
      const filledPdfBytes = await pdfDoc.save()

      // Create a download link
      const blob = new Blob([filledPdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("There was an error generating the PDF. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="form" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-6">
          <div style={styles.inputContainer}>
            <div style={styles.inputColumn}>
              <div style={styles.inputField}>
                <Label style={styles.inputLabel}>Client Name</Label>
                <Input
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputField}>
                <Label style={styles.inputLabel}>Company</Label>
                <Input
                  name="clientCompany"
                  value={formData.clientCompany}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputField}>
                <Label style={styles.inputLabel}>Email</Label>
                <Input
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
            </div>
            <div style={styles.inputColumn}>
              <div style={styles.inputField}>
                <Label style={styles.inputLabel}>Project Name</Label>
                <Input
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputField}>
                <Label style={styles.inputLabel}>License Date</Label>
                <Input
                  name="licenseDate"
                  value={formData.licenseDate}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
            </div>
          </div>
          <Button
            className="bg-yellow-500 hover:bg-yellow-600"
            onClick={generatePDF}
            disabled={!isFormValid() || isLoading || !pdfBytes}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                {pdfBytes ? "Download PDF" : "PDF Not Available"}
              </>
            )}
          </Button>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>EULA Preview</CardTitle>
              <CardDescription>Preview of your document</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-full h-[800px] bg-muted rounded-md flex items-center justify-center overflow-hidden">
                {previewUrl === "error" ? (
                  <div className="text-center p-6">
                    <div className="text-red-500 mb-4">
                      <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-red-600 mb-2">PDF Loading Error</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      The PDF file could not be loaded. This might be because:
                    </p>
                    <ul className="text-xs text-muted-foreground text-left mb-4 space-y-1">
                      <li>• The PDF file doesn't exist at the specified location</li>
                      <li>• The file is corrupted or not a valid PDF</li>
                      <li>• The file path is incorrect</li>
                    </ul>
                    <div className="space-y-2">
                      <Button
                        className="bg-yellow-500 hover:bg-yellow-600"
                        onClick={() => window.open(pdfUrl, "_blank")}
                      >
                        Try Opening PDF Directly
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        You can still fill out the form and generate a PDF without the preview.
                      </p>
                    </div>
                  </div>
                ) : previewUrl ? (
                  <div className="w-full h-full">
                    <iframe
                      src={previewUrl}
                      className="w-full h-full border-0"
                      title="PDF Preview"
                      onError={(e) => {
                        console.error("Error loading PDF in iframe:", e)
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-yellow-500" />
                    <p className="text-sm text-muted-foreground">Loading preview...</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                className="bg-yellow-500 hover:bg-yellow-600"
                onClick={generatePDF}
                disabled={!isFormValid() || isLoading || !pdfBytes}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    {pdfBytes ? "Download PDF" : "PDF Not Available"}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
