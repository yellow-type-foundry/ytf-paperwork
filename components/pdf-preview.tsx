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
    <div className="w-[595px] h-[842px] bg-white inline-flex flex-col justify-start items-center overflow-hidden">
      {/* Header */}
      <div className="self-stretch p-4 flex flex-col items-center">
        <div className="text-2xl font-bold font-['YTFOldman'] uppercase mb-2">QUOTATION</div>
        <div className="text-sm font-['YTFVangMono']">
          <div>Quotation Number: {formData.quotationNumber}</div>
          <div>Date: {formData.quotationDate}</div>
        </div>
      </div>

      {/* Client Information */}
      <div className="self-stretch px-4 mb-4">
        <div className="text-sm font-['YTFVangMono'] mb-2">Client Information:</div>
        <div className="text-sm font-['YTF Grand 123']">
          <div>Name: {formData.clientName}</div>
          <div>Email: {formData.clientEmail}</div>
          {formData.clientAddress && <div>Address: {formData.clientAddress}</div>}
        </div>
      </div>

      {/* Business Size Information */}
      {selectedBusinessSize && (
        <div className="self-stretch px-4 mb-4">
          <div className="text-lg font-bold font-['YTFOldman'] mb-2">{selectedBusinessSize.name} License</div>
          <div className="text-sm font-['YTF Grand 123']">{selectedBusinessSize.description}</div>
        </div>
      )}

      {/* Items Table */}
      <div className="self-stretch px-4 mb-4">
        <table className="w-full text-sm">
          <thead className="bg-[#E8EADD]">
            <tr>
              <th className="p-2 text-left font-['YTFVangMono']">NO</th>
              <th className="p-2 text-left font-['YTFVangMono']">TYPEFACE</th>
              <th className="p-2 text-left font-['YTFVangMono']">LICENSE TYPE</th>
              <th className="p-2 text-left font-['YTFVangMono']">DURATION</th>
              <th className="p-2 text-left font-['YTFVangMono']">LANGUAGES/CUTS</th>
              <th className="p-2 text-left font-['YTFVangMono']">FILE FORMAT</th>
              <th className="p-2 text-right font-['YTFVangMono']">AMOUNT (USD)</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item: any, index: number) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="p-2 font-['YTF Grand 123']">{`0${index + 1}.`}</td>
                <td className="p-2 font-['YTF Grand 123']">{item.typeface}</td>
                <td className="p-2 font-['YTF Grand 123']">{item.licenseType}</td>
                <td className="p-2 font-['YTF Grand 123']">{formatDuration(item.durationType, item.durationYears)}</td>
                <td className="p-2 font-['YTF Grand 123']">{item.languageCut}</td>
                <td className="p-2 font-['YTF Grand 123']">{formatFileFormats(item.fileFormats)}</td>
                <td className="p-2 font-['YTF Grand 123'] text-right">${Number.parseFloat(String(item.amount)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="self-stretch px-4 mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-['YTFVangMono']">SUBTOTAL</span>
          <span className="font-['YTF Grand 123']">${formData.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="font-['YTFVangMono']">VIETNAM VALUE ADDED TAX (DEDUCTED)</span>
          <span className="font-['YTF Grand 123']">$0</span>
        </div>
        <div className="flex justify-between text-lg font-bold mt-4">
          <span className="font-['YTFOldman']">Total (USD):</span>
          <span className="font-['YTFOldman']">${formData.total.toFixed(2)}</span>
        </div>
        <div className="text-right text-sm mt-2">
          <span className="font-['YTF Grand 123']">≈ {vndAmount.toLocaleString()} VND</span>
        </div>
      </div>

      {/* Footer */}
      <div className="self-stretch px-4 mt-auto mb-4 text-xs font-['YTFVangMono']">
        <div className="flex justify-between">
          <span>©2025 YELLOW TYPE FOUNDRY</span>
          <span>YELLOWTYPE.COM</span>
          <span>STRICTLY CONFIDENTIAL</span>
        </div>
      </div>
    </div>
  )
}
