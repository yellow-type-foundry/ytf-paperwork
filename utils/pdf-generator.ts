import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { businessSizes, formatFileFormats, formatDuration } from "./typeface-data"

// Define the PDF layout based on the provided template and design notes
export async function generateQuotationPDF(formData: any) {
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

  try {
    // Add custom fonts if available
    try {
      // This is a placeholder for adding custom fonts
      // In a production environment, you would load the fonts from your server
      // and register them with jsPDF
      // Example (commented out as it depends on actual font files):
      // doc.addFont('/fonts/YTFOldman-Bold.woff2', 'YTF Oldman', 'bold');
      // doc.addFont('/fonts/YTFGrand123-Regular.woff2', 'YTF Grand', 'normal');
      // doc.addFont('/fonts/YTFVangMono-Regular.woff2', 'YTF VangMono', 'normal');
    } catch (error) {
      console.warn("Could not load custom fonts, using fallbacks:", error)
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
      const logoImg = await fetch("/YTF-LOGO.svg")
        .then(res => res.arrayBuffer())
        .then(buffer => new Uint8Array(buffer))
      doc.addImage(logoImg, "SVG", 297.5 - 40, logoY + 4, 80, 24, undefined, "FAST")
    } catch (error) {
      // Fallback to text if image fails to load
      doc.setFont("helvetica", "bold")
      doc.setFontSize(16)
      doc.text("YTF", 297.5, logoY + 20, { align: "center" })
    }

    // Header information - Mono font text style: 5px size, 100% leading, -1% tracking
    doc.setFont("courier", "normal") // Use courier for mono font (fallback for YTF VangMono)
    doc.setFontSize(5) // 5px size as specified
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
    // Try to use YTF Oldman if available, otherwise fallback to helvetica bold
    try {
      doc.setFont("YTF Oldman", "bold")
    } catch (e) {
      doc.setFont("helvetica", "bold")
    }
    doc.setFontSize(58) // 58px size as specified
    doc.text("TYPEFACE LICENSING QUOTATION", 50, logoY + logoContainerHeight + 100)

    // License provider section
    doc.setFont("courier", "normal") // Use courier for mono font (fallback for YTF VangMono)
    doc.setFontSize(5) // 5px for labels
    doc.text("LICENSE PROVIDER", 50, logoY + logoContainerHeight + 140)

    // Try to use YTF Grand if available, otherwise fallback to helvetica
    try {
      doc.setFont("YTF Grand", "normal")
    } catch (e) {
      doc.setFont("helvetica", "normal")
    }
    doc.setFontSize(6) // 6px size as specified
    doc.text("Yellow Type Foundry Company Ltd.", 50, logoY + logoContainerHeight + 150)
    doc.text("No.6, Lane 36, Nguyen Hong Street", 50, logoY + logoContainerHeight + 160)
    doc.text("Lang Ha Ward, Dong Da District, Hanoi, Vietnam", 50, logoY + logoContainerHeight + 170)
    doc.text("Tax ID: 0109884491", 50, logoY + logoContainerHeight + 180)

    // Licensee section
    doc.setFont("courier", "normal") // Use courier for mono font (fallback for YTF VangMono)
    doc.setFontSize(5) // 5px for labels
    doc.text("LICENSEE / END USER", 545, logoY + logoContainerHeight + 140, { align: "right" })

    // Try to use YTF Grand if available, otherwise fallback to helvetica
    try {
      doc.setFont("YTF Grand", "normal")
    } catch (e) {
      doc.setFont("helvetica", "normal")
    }
    doc.setFontSize(6) // 6px size as specified
    doc.text(formData.clientName, 545, logoY + logoContainerHeight + 150, { align: "right" })
    doc.text(formData.clientEmail, 545, logoY + logoContainerHeight + 160, { align: "right" })

    // Billing address
    doc.setFont("courier", "normal") // Use courier for mono font (fallback for YTF VangMono)
    doc.setFontSize(5) // 5px for labels
    doc.text("BILLING ADDRESS", 545, logoY + logoContainerHeight + 180, { align: "right" })

    // Try to use YTF Grand if available, otherwise fallback to helvetica
    try {
      doc.setFont("YTF Grand", "normal")
    } catch (e) {
      doc.setFont("helvetica", "normal")
    }
    doc.setFontSize(6) // 6px size as specified
    doc.text(formData.clientAddress || "N/A", 545, logoY + logoContainerHeight + 190, { align: "right" })

    // Quotation date section
    doc.setFont("courier", "normal") // Use courier for mono font (fallback for YTF VangMono)
    doc.setFontSize(5) // 5px for labels
    doc.text("QUOTATION DATE", 50, logoY + logoContainerHeight + 210)

    // Try to use YTF Grand if available, otherwise fallback to helvetica
    try {
      doc.setFont("YTF Grand", "normal")
    } catch (e) {
      doc.setFont("helvetica", "normal")
    }
    doc.setFontSize(6) // 6px size as specified
    doc.text(formattedDate, 50, logoY + logoContainerHeight + 220)
    doc.text(`(Valid for 30 days from the issue day)`, 50, logoY + logoContainerHeight + 230)

    // Add business size information
    if (selectedBusinessSize) {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(14)
      doc.text(`${selectedBusinessSize.name} License`, 50, logoY + logoContainerHeight + 260)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.text(selectedBusinessSize.description, 50, logoY + logoContainerHeight + 280)
    }

    // Add discount information if applicable
    let discountY = logoY + logoContainerHeight + 300
    if (formData.nonProfitDiscount || formData.customDiscountPercent > 0) {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(10)
      doc.text("Applied Discounts:", 50, discountY)
      discountY += 20

      doc.setFont("helvetica", "normal")
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
        fontSize: 6, // 6px size as specified
        cellPadding: 5,
        font: "helvetica", // Fallback for YTF Grand
      },
      headStyles: {
        fillColor: [232, 234, 221], // Same as background
        textColor: [0, 0, 0],
        fontStyle: "normal",
        font: "courier", // Fallback for YTF VangMono
        fontSize: 5, // 5px for headers
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
        doc.setFont("courier", "normal") // Fallback for YTF VangMono
        doc.setFontSize(5) // 5px for footer
        doc.text("©2025 YELLOW TYPE FOUNDRY", 50, 800)
        doc.text("YELLOWTYPE.COM", 297.5, 800, { align: "center" })
        doc.text("STRICTLY CONFIDENTIAL", 545, 800, { align: "right" })
      },
    })

    // Get the final y position after the table
    const finalY = (doc as any).lastAutoTable.finalY + 20

    // Add subtotal
    doc.setFont("courier", "normal") // Fallback for YTF VangMono
    doc.setFontSize(5) // 5px for labels
    doc.text("SUBTOTAL", 50, finalY)

    // Try to use YTF Grand if available, otherwise fallback to helvetica
    try {
      doc.setFont("YTF Grand", "normal")
    } catch (e) {
      doc.setFont("helvetica", "normal")
    }
    doc.setFontSize(6)
    doc.text(`$${formData.subtotal.toFixed(2)}`, 545, finalY, { align: "right" })

    // Add tax (labeled as "VIETNAM VALUE ADDED TAX (DEDUCTED)" to match template)
    doc.setFont("courier", "normal") // Fallback for YTF VangMono
    doc.setFontSize(5)
    doc.text("VIETNAM VALUE ADDED TAX (DEDUCTED)", 50, finalY + 15)

    // Try to use YTF Grand if available, otherwise fallback to helvetica
    try {
      doc.setFont("YTF Grand", "normal")
    } catch (e) {
      doc.setFont("helvetica", "normal")
    }
    doc.setFontSize(6)
    doc.text("$0", 545, finalY + 15, { align: "right" })

    // Add total in bold
    // Try to use YTF Grand if available, otherwise fallback to helvetica
    try {
      doc.setFont("YTF Grand", "bold")
    } catch (e) {
      doc.setFont("helvetica", "bold")
    }
    doc.setFontSize(14) // Larger size for total
    doc.text("Total (USD):", 50, finalY + 40)
    doc.text(`$${formData.total.toFixed(2)}`, 545, finalY + 40, { align: "right" })

    // Add VND conversion
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    const vndAmount = formData.total * 24500 // Fixed exchange rate for PDF
    doc.text(`≈ ${vndAmount.toLocaleString()} VND`, 545, finalY + 60, { align: "right" })

    // Add extensions sections
    doc.setFont("courier", "normal") // Fallback for YTF VangMono
    doc.setFontSize(5) // 5px for labels
    doc.text("EXTENSIONS - INCLUDED", 50, finalY + 80)
    doc.text("EXTENSIONS - EXCLUDED", 545, finalY + 80, { align: "right" })

    // Add notes section
    doc.setFont("courier", "normal") // Fallback for YTF VangMono
    doc.setFontSize(5) // 5px for labels
    doc.text("NOTES:", 297.5, finalY + 110, { align: "center" })

    // Add standard terms text
    // Try to use YTF Grand if available, otherwise fallback to helvetica
    try {
      doc.setFont("YTF Grand", "normal")
    } catch (e) {
      doc.setFont("helvetica", "normal")
    }
    doc.setFontSize(6) // 6px size as specified
    const termsText =
      "All offers and license agreements from Yellow Type Foundry are governed exclusively by Yellow Type Foundry's General Terms\nand Conditions (EULA), with any conflicting terms from the licensees' general conditions expressly excluded."
    const termsLines = doc.splitTextToSize(termsText, 400)
    doc.text(termsLines, 297.5, finalY + 120, { align: "center" })

    return doc
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw error
  }
}
