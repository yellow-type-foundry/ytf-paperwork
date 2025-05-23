import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { businessSizes, formatFileFormats, formatDuration } from "./typeface-data"

// Helper function to convert ArrayBuffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

// Define the PDF layout based on the provided template and design notes
export async function generateQuotationPDF(formData: any): Promise<jsPDF> {
  try {
    console.log("Starting PDF generation...")
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt", // Use points for exact sizing
      format: "a4", // A4 size: 595x842 points
    })

    // Load custom fonts
    console.log("Loading custom fonts...")
    try {
      // Load YTF Grand
      const grandFontResponse = await fetch("/fonts/YTFGrand123-Regular.woff2")
      const grandFontBuffer = await grandFontResponse.arrayBuffer()
      const grandFontBase64 = arrayBufferToBase64(grandFontBuffer)
      doc.addFileToVFS("YTFGrand123-Regular.ttf", grandFontBase64)
      doc.addFont("YTFGrand123-Regular.ttf", "YTF Grand 123", "normal")
      console.log("YTF Grand 123 font loaded successfully")

      // Load YTF VangMono
      const vangMonoFontResponse = await fetch("/fonts/YTFVangMono-Regular.woff2")
      const vangMonoFontBuffer = await vangMonoFontResponse.arrayBuffer()
      const vangMonoFontBase64 = arrayBufferToBase64(vangMonoFontBuffer)
      doc.addFileToVFS("YTFVangMono-Regular.ttf", vangMonoFontBase64)
      doc.addFont("YTFVangMono-Regular.ttf", "YTFVangMono", "normal")
      console.log("YTF VangMono font loaded successfully")

      // Load YTF Oldman
      const oldmanFontResponse = await fetch("/fonts/YTFOldman-Bold.woff2")
      const oldmanFontBuffer = await oldmanFontResponse.arrayBuffer()
      const oldmanFontBase64 = arrayBufferToBase64(oldmanFontBuffer)
      doc.addFileToVFS("YTFOldman-Bold.ttf", oldmanFontBase64)
      doc.addFont("YTFOldman-Bold.ttf", "YTFOldman", "bold")
      console.log("YTF Oldman font loaded successfully")
    } catch (error) {
      console.error("Error loading fonts:", error)
      throw new Error("Failed to load custom fonts")
    }

    // Get the selected business size
    const selectedBusinessSize = businessSizes.find((size) => size.id === formData.businessSize)

    // Set document properties
    doc.setProperties({
      title: `YTF Quotation ${formData.quotationNumber}`,
      subject: "Typeface License Quotation",
      author: "Yellow Type Foundry",
      keywords: "typeface, font, license, quotation",
      creator: "YTF Paperwork",
    })

    // Add content to PDF
    console.log("Adding content to PDF...")
    try {
      // Add header
      doc.setFont("YTFOldman", "bold")
      doc.setFontSize(24)
      doc.text("QUOTATION", 297.5, 30, { align: "center" })

      // Add quotation details
      doc.setFont("YTFVangMono", "normal")
      doc.setFontSize(10)
      doc.text(`Quotation Number: ${formData.quotationNumber}`, 20, 80)
      doc.text(`Date: ${formData.quotationDate}`, 20, 85)

      // Add client information
      doc.text("Client Information:", 20, 100)
      doc.setFont("YTF Grand 123", "normal")
      doc.text(`Name: ${formData.clientName}`, 20, 105)
      doc.text(`Email: ${formData.clientEmail}`, 20, 110)
      if (formData.clientAddress) {
        doc.text(`Address: ${formData.clientAddress}`, 20, 115)
      }

      // Add business size information
      if (selectedBusinessSize) {
        doc.setFont("YTFOldman", "bold")
        doc.setFontSize(14)
        doc.text(`${selectedBusinessSize.name} License`, 20, 140)

        doc.setFont("YTF Grand 123", "normal")
        doc.setFontSize(10)
        doc.text(selectedBusinessSize.description, 20, 160)
      }

      // Add discount information if applicable
      let yPos = 190
      if (formData.nonProfitDiscount || formData.customDiscountPercent > 0) {
        doc.setFont("YTFVangMono", "normal")
        doc.setFontSize(10)
        doc.text("Applied Discounts:", 20, yPos)
        yPos += 20

        doc.setFont("YTF Grand 123", "normal")
        doc.setFontSize(8)

        if (formData.nonProfitDiscount) {
          doc.text("• Non-profit / Charity Discount: 30%", 30, yPos)
          yPos += 15
        }

        if (formData.customDiscountPercent > 0) {
          doc.text(`• Custom Discount: ${formData.customDiscountPercent}%`, 30, yPos)
          yPos += 15
        }

        yPos += 10 // Add some extra space
      }

      // Create table for items
      const tableColumn = ["NO", "TYPEFACE", "LICENSE TYPE", "DURATION", "LANGUAGES/CUTS", "FILE FORMAT", "AMOUNT (USD)"]

      // Transform the items to match the template format
      const tableRows = formData.items
        .filter((item: any) => item.typefaceFamily && item.typefaceVariant)
        .map((item: any, index: number) => [
          `0${index + 1}.`,
          item.typeface || `${item.typefaceFamily} ${item.typefaceVariant}`,
          item.licenseType,
          formatDuration(item.durationType, item.durationYears),
          item.languageCut,
          formatFileFormats(item.fileFormats),
          `$${Number.parseFloat(String(item.amount)).toFixed(2)}`,
        ])

      // Add the table with styling
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: yPos + 20,
        theme: "plain",
        styles: {
          fontSize: 8,
          cellPadding: 5,
          font: "YTF Grand 123",
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [232, 234, 221],
          textColor: [0, 0, 0],
          fontStyle: "normal",
          fontSize: 8,
          lineWidth: 0.1,
          font: "YTFVangMono",
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 80 },
          2: { cellWidth: 100 },
          3: { cellWidth: 70 },
          4: { cellWidth: 100 },
          5: { cellWidth: 70 },
          6: { cellWidth: 70, halign: "right" },
        },
        didDrawPage: (data) => {
          // Add footer on each page
          doc.setFont("YTFVangMono", "normal")
          doc.setFontSize(8)
          doc.text("©2025 YELLOW TYPE FOUNDRY", 50, 800)
          doc.text("YELLOWTYPE.COM", 297.5, 800, { align: "center" })
          doc.text("STRICTLY CONFIDENTIAL", 545, 800, { align: "right" })
        },
      })

      // Get the final y position after the table
      const finalY = (doc as any).lastAutoTable.finalY + 20

      // Add subtotal
      doc.setFont("YTFVangMono", "normal")
      doc.setFontSize(8)
      doc.text("SUBTOTAL", 50, finalY)

      doc.setFont("YTF Grand 123", "normal")
      doc.setFontSize(8)
      doc.text(`$${formData.subtotal.toFixed(2)}`, 545, finalY, { align: "right" })

      // Add tax
      doc.setFont("YTFVangMono", "normal")
      doc.setFontSize(8)
      doc.text("VIETNAM VALUE ADDED TAX (DEDUCTED)", 50, finalY + 15)

      doc.setFont("YTF Grand 123", "normal")
      doc.setFontSize(8)
      doc.text("$0", 545, finalY + 15, { align: "right" })

      // Add total in bold
      doc.setFont("YTFOldman", "bold")
      doc.setFontSize(14)
      doc.text("Total (USD):", 50, finalY + 40)
      doc.text(`$${formData.total.toFixed(2)}`, 545, finalY + 40, { align: "right" })

      // Add VND conversion
      doc.setFont("YTF Grand 123", "normal")
      doc.setFontSize(10)
      const vndAmount = formData.total * 24500 // Fixed exchange rate for PDF
      doc.text(`≈ ${vndAmount.toLocaleString()} VND`, 545, finalY + 60, { align: "right" })

      // Add extensions sections
      doc.setFont("YTFVangMono", "normal")
      doc.setFontSize(8)
      doc.text("EXTENSIONS - INCLUDED", 50, finalY + 80)
      doc.text("EXTENSIONS - EXCLUDED", 545, finalY + 80, { align: "right" })

      // Add notes section
      doc.setFont("YTFVangMono", "normal")
      doc.setFontSize(8)
      doc.text("NOTES:", 297.5, finalY + 110, { align: "center" })

      // Add standard terms text
      doc.setFont("YTF Grand 123", "normal")
      doc.setFontSize(8)
      const termsText =
        "All offers and license agreements from Yellow Type Foundry are governed exclusively by Yellow Type Foundry's General Terms\nand Conditions (EULA), with any conflicting terms from the licensees' general conditions expressly excluded."
      const termsLines = doc.splitTextToSize(termsText, 400)
      doc.text(termsLines, 297.5, finalY + 120, { align: "center" })

      return doc
    } catch (error) {
      console.error("Error adding content to PDF:", error)
      throw error
    }
  } catch (error) {
    console.error("Error in generateQuotationPDF:", error)
    throw error
  }
}
