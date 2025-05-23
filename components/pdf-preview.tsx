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

  return (
    <div className="w-[595px] h-[842px] bg-white inline-flex flex-col justify-start items-center overflow-hidden p-8">
      {/* Header */}
      <div className="self-stretch flex flex-col items-center mb-12">
        <div className="ytf-title mb-4">QUOTATION</div>
        <div className="ytf-label space-y-1">
          <div>Quotation Number: {formData.quotationNumber}</div>
          <div>Date: {formData.quotationDate}</div>
        </div>
      </div>

      {/* Client Information */}
      <div className="self-stretch mb-8">
        <div className="ytf-label mb-2">Client Information:</div>
        <div className="ytf-body">
          <div>Name: {formData.clientName}</div>
          <div>Email: {formData.clientEmail}</div>
          {formData.clientAddress && <div>Address: {formData.clientAddress}</div>}
        </div>
      </div>

      {/* Business Size Information */}
      {selectedBusinessSize && (
        <div className="self-stretch mb-8">
          <div className="ytf-title text-2xl mb-2">{selectedBusinessSize.name} License</div>
          <div className="ytf-body">{selectedBusinessSize.description}</div>
        </div>
      )}

      {/* Items Table */}
      <div className="self-stretch mb-8">
        <table className="w-full">
          <thead className="ytf-bg">
            <tr>
              <th className="p-3 text-left ytf-label">NO</th>
              <th className="p-3 text-left ytf-label">TYPEFACE</th>
              <th className="p-3 text-left ytf-label">LICENSE TYPE</th>
              <th className="p-3 text-left ytf-label">DURATION</th>
              <th className="p-3 text-left ytf-label">LANGUAGES/CUTS</th>
              <th className="p-3 text-left ytf-label">FILE FORMAT</th>
              <th className="p-3 text-right ytf-label">AMOUNT (USD)</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item: any, index: number) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="p-3 ytf-body">{`0${index + 1}.`}</td>
                <td className="p-3 ytf-body">{item.typeface}</td>
                <td className="p-3 ytf-body">{item.licenseType}</td>
                <td className="p-3 ytf-body">{formatDuration(item.durationType, item.durationYears)}</td>
                <td className="p-3 ytf-body">{item.languageCut}</td>
                <td className="p-3 ytf-body">{formatFileFormats(item.fileFormats)}</td>
                <td className="p-3 ytf-body text-right">${Number.parseFloat(String(item.amount)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="self-stretch mb-8">
        <div className="flex justify-between mb-2">
          <span className="ytf-label">SUBTOTAL</span>
          <span className="ytf-subtotal">${formData.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="ytf-label">VIETNAM VALUE ADDED TAX (DEDUCTED)</span>
          <span className="ytf-subtotal">$0</span>
        </div>
        <div className="flex justify-between mt-4">
          <span className="ytf-total">Total (USD):</span>
          <span className="ytf-total">${formData.total.toFixed(2)}</span>
        </div>
        <div className="text-right mt-2">
          <span className="ytf-body">≈ {vndAmount.toLocaleString()} VND</span>
        </div>
      </div>

      {/* Footer */}
      <div className="self-stretch mt-auto">
        <div className="flex justify-between ytf-footer">
          <span>©2025 YELLOW TYPE FOUNDRY</span>
          <span>YELLOWTYPE.COM</span>
          <span>STRICTLY CONFIDENTIAL</span>
        </div>
      </div>
    </div>
  )
}
