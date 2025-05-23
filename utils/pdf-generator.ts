import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { businessSizes, formatFileFormats, formatDuration } from "./typeface-data"
import fs from "fs"
import path from "path"

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

    // Get the selected business size
    const selectedBusinessSize = businessSizes.find((size) => size.id === formData.businessSize)

    // Load custom fonts
    console.log("Loading fonts...")
    try {
      // Load Vang Mono font
      const vangMonoResponse = await fetch("/fonts/YTFVangMono-Regular.woff2", { cache: "no-cache" })
      if (!vangMonoResponse.ok) {
        throw new Error(`Failed to load Vang Mono font: ${vangMonoResponse.status} ${vangMonoResponse.statusText}`)
      }
      const vangMonoFont = await vangMonoResponse.arrayBuffer()
      console.log("Vang Mono font loaded successfully")

      // Load Grand font
      const grandResponse = await fetch("/fonts/YTFGrand123-Regular.woff2", { cache: "no-cache" })
      if (!grandResponse.ok) {
        throw new Error(`Failed to load Grand font: ${grandResponse.status} ${grandResponse.statusText}`)
      }
      const grandFont = await grandResponse.arrayBuffer()
      console.log("Grand font loaded successfully")

      // Convert fonts to base64
      const vangMonoBase64 = arrayBufferToBase64(vangMonoFont)
      const grandBase64 = arrayBufferToBase64(grandFont)

      // Add fonts to virtual file system
      doc.addFileToVFS("YTFVangMono-Regular.woff2", vangMonoBase64)
      doc.addFileToVFS("YTFGrand123-Regular.woff2", grandBase64)

      // Add fonts to document
      doc.addFont("YTFVangMono-Regular.woff2", "YTFVangMono", "normal")
      doc.addFont("YTFGrand123-Regular.woff2", "YTFGrand", "normal")
      console.log("Fonts added to document successfully")
    } catch (fontError) {
      console.error("Error loading fonts:", fontError)
      // Fallback to system fonts
      doc.setFont("helvetica")
      console.log("Using system fonts as fallback")
    }

    // Load logo
    console.log("Loading logo...")
    try {
      const logoResponse = await fetch("/YTF-LOGO.svg", { cache: "no-cache" })
      if (!logoResponse.ok) {
        throw new Error(`Failed to load logo: ${logoResponse.status} ${logoResponse.statusText}`)
      }
      const logoSvg = await logoResponse.text()
      console.log("Logo loaded successfully")

      // Add logo to PDF
      doc.addImage(logoSvg, "SVG", 20, 20, 40, 40)
      console.log("Logo added to PDF successfully")
    } catch (logoError) {
      console.error("Error loading logo:", logoError)
      // Continue without logo
      console.log("Continuing without logo")
    }

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
      doc.setFont("YTFGrand", "normal")
      doc.setFontSize(24)
      doc.text("QUOTATION", 105, 30, { align: "center" })

      // Add quotation details
      doc.setFont("YTFVangMono", "normal")
      doc.setFontSize(10)
      doc.text(`Quotation Number: ${formData.quotationNumber}`, 20, 80)
      doc.text(`Date: ${formData.quotationDate}`, 20, 85)

      // Add client information
      doc.text("Client Information:", 20, 100)
      doc.text(`Name: ${formData.clientName}`, 20, 105)
      console.log("Loading custom fonts...")
      
      // Load and register custom fonts
      const [vangMonoFont, grandFont] = await Promise.all([
        fetch("/fonts/YTFVangMono-Regular.woff2", { cache: "no-cache" }).then(res => {
          if (!res.ok) throw new Error(`Failed to load YTFVangMono-Regular.woff2: ${res.status} ${res.statusText}`)
          return res.arrayBuffer()
        }),
        fetch("/fonts/YTFGrand123-Regular.woff2", { cache: "no-cache" }).then(res => {
          if (!res.ok) throw new Error(`Failed to load YTFGrand123-Regular.woff2: ${res.status} ${res.statusText}`)
          return res.arrayBuffer()
        })
      ])
      
      console.log("Converting fonts to base64...")
      // Convert ArrayBuffer to base64 string
      const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
        const bytes = new Uint8Array(buffer)
        let binary = ''
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        return btoa(binary)
      }
      
      console.log("Adding fonts to VFS...")
      // Add fonts to virtual file system
      doc.addFileToVFS("YTFVangMono-Regular.woff2", arrayBufferToBase64(vangMonoFont))
      doc.addFileToVFS("YTFGrand123-Regular.woff2", arrayBufferToBase64(grandFont))
      
      console.log("Registering fonts...")
      // Register fonts
      doc.addFont("YTFVangMono-Regular.woff2", "YTF Vang Mono", "normal")
      doc.addFont("YTFGrand123-Regular.woff2", "YTF Grand 123", "normal")
      // Use regular weight for bold text since we don't have the bold font
      doc.addFont("YTFGrand123-Regular.woff2", "YTF Grand 123", "bold")

      // Set default font
      doc.setFont("YTF Grand 123", "normal")
      console.log("Fonts loaded successfully")
    } catch (error) {
      console.error("Error loading custom fonts:", error)
      // Fallback to system fonts
      doc.setFont("helvetica", "normal")
    }

    // Background color - light cream/off-white (#E8EADD)
    doc.setFillColor(232, 234, 221)
    doc.rect(0, 0, 595, 842, "F")

    // Add YTF logo at the top centered
    const logoContainerHeight = 32
    const logoY = 50
    doc.rect(0, logoY, 595, logoContainerHeight, "F")
    
    // Add logo image (if available)
    try {
      console.log("Loading logo...")
      const logoResponse = await fetch("/YTF-LOGO.svg")
      if (!logoResponse.ok) throw new Error(`Failed to load logo: ${logoResponse.status} ${logoResponse.statusText}`)
      
      const logoBuffer = await logoResponse.arrayBuffer()
      const logoImg = new Uint8Array(logoBuffer)
      doc.addImage(logoImg, "SVG", 297.5 - 40, logoY + 4, 80, 24, undefined, "FAST")
      console.log("Logo loaded successfully")
    } catch (error) {
      console.error("Error loading logo:", error)
      // Fallback to text if image fails to load
      doc.setFont("YTFGrand", "bold")
      doc.setFontSize(16)
      doc.text("YTF", 297.5, logoY + 20, { align: "center" })
    }

    // Header information
    doc.setFont("YTFVangMono", "normal")
    doc.setFontSize(5)
    doc.setTextColor(0, 0, 0)
    doc.text("YELLOW TYPE FOUNDRY", 50, logoY + logoContainerHeight + 20)

    // Format quotation number as DDMMYYYxxx
    const today = new Date(formData.quotationDate)
    const day = String(today.getDate()).padStart(2, "0")
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const year = today.getFullYear()

    // Extract the sequential number from the existing quotation number or generate a new one
    let sequentialNumber = "001"
    if (formData.quotationNumber && formData.quotationNumber.length >= 3) {
      const existingSeq = formData.quotationNumber.slice(-3)
      if (/^\d{3}$/.test(existingSeq)) {
        sequentialNumber = existingSeq
      }
    }

    const formattedQuotationNumber = `${day}${month}${year}${sequentialNumber}`
    doc.text(`QUOTATION NO. ${formattedQuotationNumber}`, 297.5, logoY + logoContainerHeight + 20, { align: "center" })

    // Current date formatted
    const formattedDate = today
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      .toUpperCase()
    doc.text(`ISSUED ON ${formattedDate}`, 545, logoY + logoContainerHeight + 20, { align: "right" })

    // Main title
    doc.setFont("YTFGrand", "bold")
    doc.setFontSize(58)
    doc.text("TYPEFACE LICENSING QUOTATION", 50, logoY + logoContainerHeight + 100)

    // License provider section
    doc.setFont("YTFVangMono", "normal")
    doc.setFontSize(5)
    doc.text("LICENSE PROVIDER", 50, logoY + logoContainerHeight + 140)

    doc.setFont("YTFGrand", "normal")
    doc.setFontSize(6)
    doc.text("Yellow Type Foundry Company Ltd.", 50, logoY + logoContainerHeight + 150)
    doc.text("No.6, Lane 36, Nguyen Hong Street", 50, logoY + logoContainerHeight + 160)
    doc.text("Lang Ha Ward, Dong Da District, Hanoi, Vietnam", 50, logoY + logoContainerHeight + 170)
    doc.text("Tax ID: 0109884491", 50, logoY + logoContainerHeight + 180)

    // Licensee section
    doc.setFont("YTFVangMono", "normal")
    doc.setFontSize(5)
    doc.text("LICENSEE / END USER", 545, logoY + logoContainerHeight + 140, { align: "right" })

    doc.setFont("YTFGrand", "normal")
    doc.setFontSize(6)
    doc.text(formData.clientName, 545, logoY + logoContainerHeight + 150, { align: "right" })
    doc.text(formData.clientEmail, 545, logoY + logoContainerHeight + 160, { align: "right" })

    // Billing address
    doc.setFont("YTFVangMono", "normal")
    doc.setFontSize(5)
    doc.text("BILLING ADDRESS", 545, logoY + logoContainerHeight + 180, { align: "right" })

    doc.setFont("YTFGrand", "normal")
    doc.setFontSize(6)
    doc.text(formData.clientAddress || "N/A", 545, logoY + logoContainerHeight + 190, { align: "right" })

    // Quotation date section
    doc.setFont("YTFVangMono", "normal")
    doc.setFontSize(5)
    doc.text("QUOTATION DATE", 50, logoY + logoContainerHeight + 210)

    doc.setFont("YTFGrand", "normal")
    doc.setFontSize(6)
    doc.text(formattedDate, 50, logoY + logoContainerHeight + 220)
    doc.text(`(Valid for 30 days from the issue day)`, 50, logoY + logoContainerHeight + 230)

    // Add business size information
    if (selectedBusinessSize) {
      doc.setFont("YTFGrand", "bold")
      doc.setFontSize(14)
      doc.text(`${selectedBusinessSize.name} License`, 50, logoY + logoContainerHeight + 260)

      doc.setFont("YTFGrand", "normal")
      doc.setFontSize(10)
      doc.text(selectedBusinessSize.description, 50, logoY + logoContainerHeight + 280)
    }

    // Add discount information if applicable
    let discountY = logoY + logoContainerHeight + 300
    if (formData.nonProfitDiscount || formData.customDiscountPercent > 0) {
      doc.setFont("YTFGrand", "bold")
      doc.setFontSize(10)
      doc.text("Applied Discounts:", 50, discountY)
      discountY += 20

      doc.setFont("YTFGrand", "normal")
      doc.setFontSize(8)

      if (formData.nonProfitDiscount) {
        doc.text("• Non-profit / Charity Discount: 30%", 60, discountY)
        discountY += 15
      }

      if (formData.customDiscountPercent > 0) {
        doc.text(`• Custom Discount: ${formData.customDiscountPercent}%`, 60, discountY)
        discountY += 15
      }

      discountY += 10 // Add some extra space
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
      startY: discountY + 20,
      theme: "plain",
      styles: {
        fontSize: 6,
        cellPadding: 5,
        font: "YTFGrand",
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [232, 234, 221],
        textColor: [0, 0, 0],
        fontStyle: "normal",
        font: "YTFVangMono",
        fontSize: 5,
        lineWidth: 0.1,
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
        doc.setFontSize(5)
        doc.text("©2025 YELLOW TYPE FOUNDRY", 50, 800)
        doc.text("YELLOWTYPE.COM", 297.5, 800, { align: "center" })
        doc.text("STRICTLY CONFIDENTIAL", 545, 800, { align: "right" })
      },
    })

    // Get the final y position after the table
    const finalY = (doc as any).lastAutoTable.finalY + 20

    // Add subtotal
    doc.setFont("YTFVangMono", "normal")
    doc.setFontSize(5)
    doc.text("SUBTOTAL", 50, finalY)

    doc.setFont("YTFGrand", "normal")
    doc.setFontSize(6)
    doc.text(`$${formData.subtotal.toFixed(2)}`, 545, finalY, { align: "right" })

    // Add tax
    doc.setFont("YTFVangMono", "normal")
    doc.setFontSize(5)
    doc.text("VIETNAM VALUE ADDED TAX (DEDUCTED)", 50, finalY + 15)

    doc.setFont("YTFGrand", "normal")
    doc.setFontSize(6)
    doc.text("$0", 545, finalY + 15, { align: "right" })

    // Add total in bold
    doc.setFont("YTFGrand", "bold")
    doc.setFontSize(14)
    doc.text("Total (USD):", 50, finalY + 40)
    doc.text(`$${formData.total.toFixed(2)}`, 545, finalY + 40, { align: "right" })

    // Add VND conversion
    doc.setFont("YTFGrand", "normal")
    doc.setFontSize(10)
    const vndAmount = formData.total * 24500 // Fixed exchange rate for PDF
    doc.text(`≈ ${vndAmount.toLocaleString()} VND`, 545, finalY + 60, { align: "right" })

    // Add extensions sections
    doc.setFont("YTFVangMono", "normal")
    doc.setFontSize(5)
    doc.text("EXTENSIONS - INCLUDED", 50, finalY + 80)
    doc.text("EXTENSIONS - EXCLUDED", 545, finalY + 80, { align: "right" })

    // Add notes section
    doc.setFont("YTFVangMono", "normal")
    doc.setFontSize(5)
    doc.text("NOTES:", 297.5, finalY + 110, { align: "center" })

    // Add standard terms text
    doc.setFont("YTFGrand", "normal")
    doc.setFontSize(6)
    const termsText =
      "All offers and license agreements from Yellow Type Foundry are governed exclusively by Yellow Type Foundry's General Terms\nand Conditions (EULA), with any conflicting terms from the licensees' general conditions expressly excluded."
    const termsLines = doc.splitTextToSize(termsText, 400)
    doc.text(termsLines, 297.5, finalY + 120, { align: "center" })

    return doc
  } catch (error) {
    console.error("Error in generateQuotationPDF:", error)
    throw error
  }
}
