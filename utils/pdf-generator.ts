import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { businessSizes, formatFileFormats, formatDuration } from "./typeface-data"
import fs from "fs"
import path from "path"

// Define the PDF layout based on the provided template and design notes
export async function generateQuotationPDF(formData: any) {
  try {
    // Create a new jsPDF instance with A4 size (595x842 points)
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt", // Use points for exact sizing
      format: "a4", // A4 size: 595x842 points
    })

    // Get the selected business size
    const selectedBusinessSize = businessSizes.find((size) => size.id === formData.businessSize)

    // Set document properties
    doc.setProperties({
      title: `Typeface Licensing Quotation for ${formData.clientName}`,
      subject: `Quotation No. ${formData.quotationNumber}`,
      author: "Yellow Type Foundry",
      creator: "Yellow Type Foundry Document Generator",
    })

    // Add custom fonts
    try {
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

    // Background color - light cream/off-white
    doc.setFillColor(232, 234, 221) // #e8eadd - Exact Figma background color
    doc.rect(0, 0, 595, 842, "F") // A4 size in points

    // Add YTF logo at the top centered
    const logoContainerHeight = 32
    const logoY = 50
    doc.rect(0, logoY, 595, logoContainerHeight, "F") // Fill with background color
    
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
      doc.setFont("YTF Grand 123", "bold")
      doc.setFontSize(16)
      doc.text("YTF", 297.5, logoY + 20, { align: "center" })
    }

    // Header information - Mono font text style: 5px size, 100% leading, -1% tracking
    doc.setFont("YTF Vang Mono", "normal")
    doc.setFontSize(8) // Increased from 5px to match preview
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

    // Main title - Large title: 58px, 90% leading, -1.5% tracking
    doc.setFont("YTF Grand 123", "bold")
    doc.setFontSize(24) // Increased from 58px to match preview
    doc.text("TYPEFACE LICENSING QUOTATION", 50, logoY + logoContainerHeight + 100)

    // License provider section
    doc.setFont("YTF Vang Mono", "normal")
    doc.setFontSize(8) // Increased from 5px to match preview
    doc.text("LICENSE PROVIDER", 50, logoY + logoContainerHeight + 140)

    doc.setFont("YTF Grand 123", "normal")
    doc.setFontSize(10) // Increased from 6px to match preview
    doc.text("Yellow Type Foundry Company Ltd.", 50, logoY + logoContainerHeight + 150)
    doc.text("No.6, Lane 36, Nguyen Hong Street", 50, logoY + logoContainerHeight + 160)
    doc.text("Lang Ha Ward, Dong Da District, Hanoi, Vietnam", 50, logoY + logoContainerHeight + 170)
    doc.text("Tax ID: 0109884491", 50, logoY + logoContainerHeight + 180)

    // Licensee section
    doc.setFont("YTF Vang Mono", "normal")
    doc.setFontSize(8) // Increased from 5px to match preview
    doc.text("LICENSEE / END USER", 545, logoY + logoContainerHeight + 140, { align: "right" })

    doc.setFont("YTF Grand 123", "normal")
    doc.setFontSize(10) // Increased from 6px to match preview
    doc.text(formData.clientName, 545, logoY + logoContainerHeight + 150, { align: "right" })
    doc.text(formData.clientEmail, 545, logoY + logoContainerHeight + 160, { align: "right" })

    // Billing address
    doc.setFont("YTF Vang Mono", "normal")
    doc.setFontSize(8) // Increased from 5px to match preview
    doc.text("BILLING ADDRESS", 545, logoY + logoContainerHeight + 180, { align: "right" })

    doc.setFont("YTF Grand 123", "normal")
    doc.setFontSize(10) // Increased from 6px to match preview
    doc.text(formData.clientAddress || "N/A", 545, logoY + logoContainerHeight + 190, { align: "right" })

    // Quotation date section
    doc.setFont("YTF Vang Mono", "normal")
    doc.setFontSize(8) // Increased from 5px to match preview
    doc.text("QUOTATION DATE", 50, logoY + logoContainerHeight + 210)

    doc.setFont("YTF Grand 123", "normal")
    doc.setFontSize(10) // Increased from 6px to match preview
    doc.text(formattedDate, 50, logoY + logoContainerHeight + 220)
    doc.text(`(Valid for 30 days from the issue day)`, 50, logoY + logoContainerHeight + 230)

    // Add business size information
    if (selectedBusinessSize) {
      doc.setFont("YTF Grand 123", "bold")
      doc.setFontSize(18) // Increased from 14px to match preview
      doc.text(`${selectedBusinessSize.name} License`, 50, logoY + logoContainerHeight + 260)

      doc.setFont("YTF Grand 123", "normal")
      doc.setFontSize(12) // Increased from 10px to match preview
      doc.text(selectedBusinessSize.description, 50, logoY + logoContainerHeight + 280)
    }

    // Add discount information if applicable
    let discountY = logoY + logoContainerHeight + 300
    if (formData.nonProfitDiscount || formData.customDiscountPercent > 0) {
      doc.setFont("YTF Grand 123", "bold")
      doc.setFontSize(12) // Increased from 10px to match preview
      doc.text("Applied Discounts:", 50, discountY)
      discountY += 20

      doc.setFont("YTF Grand 123", "normal")
      doc.setFontSize(10) // Increased from 8px to match preview

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

    // Create table for items - using a more structured approach similar to the template
    const tableColumn = ["NO", "TYPEFACE", "LICENSE TYPE", "DURATION", "LANGUAGES/CUTS", "FILE FORMAT", "AMOUNT (USD)"]

    // Transform the items to match the template format
    const tableRows = formData.items
      .filter((item: any) => item.typefaceFamily && item.typefaceVariant) // Only include items with typeface family and variant
      .map((item: any, index: number) => [
        `0${index + 1}.`, // Format as 01., 02., etc.
        item.typeface || `${item.typefaceFamily} ${item.typefaceVariant}`, // Use combined name or construct it
        item.licenseType,
        formatDuration(item.durationType, item.durationYears), // Format duration
        item.languageCut,
        formatFileFormats(item.fileFormats), // Format file formats for display
        `$${Number.parseFloat(String(item.amount)).toFixed(2)}`,
      ])

    // Add the table with styling to match the template
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: discountY + 20,
      theme: "plain",
      styles: {
        fontSize: 10, // Increased from 6px to match preview
        cellPadding: 5,
        font: "YTF Grand 123", // Use YTF Grand 123
      },
      headStyles: {
        fillColor: [232, 234, 221], // Same as background
        textColor: [0, 0, 0],
        fontStyle: "normal",
        font: "YTF Vang Mono", // Use YTF Vang Mono
        fontSize: 8, // Increased from 5px to match preview
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: 30 }, // NO
        1: { cellWidth: 80 }, // TYPEFACE
        2: { cellWidth: 100 }, // LICENSE TYPE
        3: { cellWidth: 70 }, // DURATION
        4: { cellWidth: 100 }, // LANGUAGES/CUTS
        5: { cellWidth: 70 }, // FILE FORMAT
        6: { cellWidth: 70, halign: "right" }, // AMOUNT
      },
      didDrawPage: (data) => {
        // Add footer on each page
        doc.setFont("YTF Vang Mono", "normal")
        doc.setFontSize(8) // Increased from 5px to match preview
        doc.text("©2025 YELLOW TYPE FOUNDRY", 50, 800)
        doc.text("YELLOWTYPE.COM", 297.5, 800, { align: "center" })
        doc.text("STRICTLY CONFIDENTIAL", 545, 800, { align: "right" })
      },
    })

    // Get the final y position after the table
    const finalY = (doc as any).lastAutoTable.finalY + 20

    // Add subtotal
    doc.setFont("YTF Vang Mono", "normal")
    doc.setFontSize(8) // Increased from 5px to match preview
    doc.text("SUBTOTAL", 50, finalY)

    doc.setFont("YTF Grand 123", "normal")
    doc.setFontSize(10) // Increased from 6px to match preview
    doc.text(`$${formData.subtotal.toFixed(2)}`, 545, finalY, { align: "right" })

    // Add tax (labeled as "VIETNAM VALUE ADDED TAX (DEDUCTED)" to match template)
    doc.setFont("YTF Vang Mono", "normal")
    doc.setFontSize(8) // Increased from 5px to match preview
    doc.text("VIETNAM VALUE ADDED TAX (DEDUCTED)", 50, finalY + 15)

    doc.setFont("YTF Grand 123", "normal")
    doc.setFontSize(10) // Increased from 6px to match preview
    doc.text("$0", 545, finalY + 15, { align: "right" })

    // Add total in bold
    doc.setFont("YTF Grand 123", "bold")
    doc.setFontSize(18) // Increased from 14px to match preview
    doc.text("Total (USD):", 50, finalY + 40)
    doc.text(`$${formData.total.toFixed(2)}`, 545, finalY + 40, { align: "right" })

    // Add VND conversion
    doc.setFont("YTF Grand 123", "normal")
    doc.setFontSize(12) // Increased from 10px to match preview
    const vndAmount = formData.total * 24500 // Fixed exchange rate for PDF
    doc.text(`≈ ${vndAmount.toLocaleString()} VND`, 545, finalY + 60, { align: "right" })

    // Add extensions sections
    doc.setFont("YTF Vang Mono", "normal")
    doc.setFontSize(8) // Increased from 5px to match preview
    doc.text("EXTENSIONS - INCLUDED", 50, finalY + 80)
    doc.text("EXTENSIONS - EXCLUDED", 545, finalY + 80, { align: "right" })

    // Add notes section
    doc.setFont("YTF Vang Mono", "normal")
    doc.setFontSize(8) // Increased from 5px to match preview
    doc.text("NOTES:", 297.5, finalY + 110, { align: "center" })

    // Add standard terms text
    doc.setFont("YTF Grand 123", "normal")
    doc.setFontSize(10) // Increased from 6px to match preview
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
