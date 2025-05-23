import { businessSizes, formatFileFormats, formatDuration } from "@/utils/typeface-data"
import "../styles/typography.css"

export function PDFPreview({ formData }: { formData: any }) {
  if (!formData.clientName) {
    return (
      <div className="w-full aspect-[1/1.414] bg-muted rounded-md flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Fill out the form to see a preview</p>
      </div>
    )
  }

  // Get the selected business size
  const selectedBusinessSize = businessSizes.find((size) => size.id === formData.businessSize)

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

  // Format today's date
  const formattedDate = today
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase()

  // Fixed exchange rate for preview
  const vndAmount = formData.total * 24500

  // Helper function to determine typeface style class
  const getTypefaceStyleClass = (typefaceFamily: any) => {
    if (typefaceFamily.includes("Eon")) return "ytf-eon"
    if (typefaceFamily.includes("Cafuné")) return "ytf-cafune"
    if (typefaceFamily.includes("Gióng")) return "ytf-giong"
    if (typefaceFamily.includes("Millie")) return "ytf-millie"
    return ""
  }

  return (
    <div className="w-full aspect-[1/1.414] rounded-md shadow-sm overflow-hidden border">
      <div
        className="p-6 text-xs text-black relative ytf-bg"
        style={{
          transform: "scale(0.7)",
          transformOrigin: "top left",
          width: "143%",
          height: "143%",
        }}
      >
        {/* YTF Logo */}
        <div className="flex justify-between items-center mb-12 pt-6">
          <div className="w-1/3"></div>
          <div className="text-center w-1/3">
            <img src="/YTF-LOGO.svg" alt="YTF Logo" style={{ display: 'inline-block', height: 32, width: 'auto', margin: '0 auto' }} />
          </div>
          <div className="w-1/3"></div>
        </div>

        {/* Header information */}
        <div className="flex justify-between mb-12">
          <span className="ytf-label">YELLOW TYPE FOUNDRY</span>
          <span className="ytf-label">QUOTATION NO. {formattedQuotationNumber}</span>
          <span className="ytf-label">ISSUED ON {formattedDate}</span>
        </div>

        {/* Main title */}
        <h1 className="ytf-title mb-12 mt-8">TYPEFACE LICENSING QUOTATION</h1>

        {/* Business Size Information */}
        {selectedBusinessSize && (
          <div className="mb-6">
            <h2 className="text-lg font-bold">{selectedBusinessSize.name} License</h2>
            <p className="text-xs">{selectedBusinessSize.description}</p>
          </div>
        )}

        {/* Discount Information */}
        {(formData.nonProfitDiscount || formData.customDiscountPercent > 0) && (
          <div className="mb-6">
            <h3 className="text-sm font-bold">Applied Discounts:</h3>
            <ul className="text-[8px] mt-1 ml-2">
              {formData.nonProfitDiscount && <li>• Non-profit / Charity Discount: 30%</li>}
              {formData.customDiscountPercent > 0 && <li>• Custom Discount: {formData.customDiscountPercent}%</li>}
            </ul>
          </div>
        )}

        {/* Provider and client sections */}
        <div className="flex justify-between mb-12">
          <div>
            <p className="ytf-label mb-2">LICENSE PROVIDER</p>
            <p className="ytf-body">Yellow Type Foundry Company Ltd.</p>
            <p className="ytf-body">No.6, Lane 36, Nguyen Hong Street</p>
            <p className="ytf-body">Lang Ha Ward, Dong Da District, Hanoi, Vietnam</p>
            <p className="ytf-body">Tax ID: 0109884491</p>
          </div>

          <div className="text-right">
            <p className="ytf-label mb-2">LICENSEE / END USER</p>
            <p className="ytf-body">{formData.clientName}</p>
            <p className="ytf-body">{formData.clientEmail}</p>
            <p className="ytf-label mt-4 mb-2">BILLING ADDRESS</p>
            <p className="ytf-body">{formData.clientAddress || "N/A"}</p>
          </div>
        </div>

        {/* Quotation date */}
        <div className="mb-12">
          <p className="ytf-label mb-2">QUOTATION DATE</p>
          <p className="ytf-body">{formattedDate}</p>
          <p className="ytf-body">(Valid for 30 days from the issue day)</p>
        </div>

        {/* Items table */}
        <div className="mb-8 overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-1 ytf-label">NO</th>
                <th className="text-left p-1 ytf-label">TYPEFACE</th>
                <th className="text-left p-1 ytf-label">LICENSE TYPE</th>
                <th className="text-left p-1 ytf-label">DURATION</th>
                <th className="text-left p-1 ytf-label">LANGUAGES/CUTS</th>
                <th className="text-left p-1 ytf-label">FILE FORMAT</th>
                <th className="text-right p-1 ytf-label">AMOUNT (USD)</th>
              </tr>
            </thead>
            <tbody>
              {formData.items
                .filter((item: any) => item.typefaceFamily && item.typefaceVariant)
                .map((item: any, index: number) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td className="p-1 ytf-body">{`0${index + 1}.`}</td>
                    <td className={`p-1 ytf-body ${getTypefaceStyleClass(item.typefaceFamily)}`}>
                      {item.typefaceFamily}
                    </td>
                    <td className="p-1 ytf-body">{item.licenseType}</td>
                    <td className="p-1 ytf-body">{formatDuration(item.durationType, item.durationYears)}</td>
                    <td className="p-1 ytf-body">{item.languageCut}</td>
                    <td className="p-1 ytf-body">{formatFileFormats(item.fileFormats)}</td>
                    <td className="p-1 ytf-body text-right">${Number.parseFloat(String(item.amount)).toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between">
            <span className="ytf-label">SUBTOTAL</span>
            <span className="ytf-subtotal">${formData.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="ytf-label">VIETNAM VALUE ADDED TAX (DEDUCTED)</span>
            <span className="ytf-subtotal">$0</span>
          </div>
          <div className="flex justify-between mt-8">
            <span className="ytf-total">Total (USD):</span>
            <span className="ytf-total">${formData.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Extensions */}
        <div className="flex justify-between mt-12">
          <span className="ytf-label">EXTENSIONS - INCLUDED</span>
          <span className="ytf-label">EXTENSIONS - EXCLUDED</span>
        </div>

        {/* Notes */}
        <div className="mt-16 text-center">
          <p className="ytf-label mb-2">NOTES:</p>
          <p className="ytf-body max-w-md mx-auto">
            All offers and license agreements from Yellow Type Foundry are governed exclusively by Yellow Type Foundry's
            General Terms and Conditions (EULA), with any conflicting terms from the licensees' general conditions
            expressly excluded.
          </p>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-between px-6">
          <span className="ytf-footer">©2025 YELLOW TYPE FOUNDRY</span>
          <span className="ytf-footer">YELLOWTYPE.COM</span>
          <span className="ytf-footer">STRICTLY CONFIDENTIAL</span>
        </div>
      </div>
    </div>
  )
}
