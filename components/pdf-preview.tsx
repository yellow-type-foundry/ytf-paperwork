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
    <div className="w-[794px] h-[1123px] bg-white p-5">
      {/* Header */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        <div className="space-y-1">
          <label className="block text-[9px] leading-[120%] font-ytf-grand">Quotation Number</label>
          <input
            type="text"
            value={formattedQuotationNumber}
            readOnly
            className="w-full h-6 px-2 text-[9px] leading-[120%] font-ytf-grand bg-muted"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[9px] leading-[120%] font-ytf-grand">Date</label>
          <input
            type="text"
            value={formattedDate}
            readOnly
            className="w-full h-6 px-2 text-[9px] leading-[120%] font-ytf-grand bg-muted"
          />
        </div>
      </div>

      {/* Client Information */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        <div className="space-y-1">
          <label className="block text-[9px] leading-[120%] font-ytf-grand">Client Name</label>
          <input
            type="text"
            value={formData.clientName}
            readOnly
            className="w-full h-6 px-2 text-[9px] leading-[120%] font-ytf-grand bg-muted"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[9px] leading-[120%] font-ytf-grand">Email</label>
          <input
            type="text"
            value={formData.clientEmail}
            readOnly
            className="w-full h-6 px-2 text-[9px] leading-[120%] font-ytf-grand bg-muted"
          />
        </div>
      </div>

      {/* Business Size */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        <div className="space-y-1">
          <label className="block text-[9px] leading-[120%] font-ytf-grand">Business Size</label>
          <input
            type="text"
            value={selectedBusinessSize?.name || ""}
            readOnly
            className="w-full h-6 px-2 text-[9px] leading-[120%] font-ytf-grand bg-muted"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[9px] leading-[120%] font-ytf-grand">Description</label>
          <input
            type="text"
            value={selectedBusinessSize?.description || ""}
            readOnly
            className="w-full h-6 px-2 text-[9px] leading-[120%] font-ytf-grand bg-muted"
          />
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#e8eadd]">
              <th className="text-left p-2 text-[9px] leading-[120%] font-ytf-vangmono">NO</th>
              <th className="text-left p-2 text-[9px] leading-[120%] font-ytf-vangmono">TYPEFACE</th>
              <th className="text-left p-2 text-[9px] leading-[120%] font-ytf-vangmono">LICENSE TYPE</th>
              <th className="text-left p-2 text-[9px] leading-[120%] font-ytf-vangmono">DURATION</th>
              <th className="text-left p-2 text-[9px] leading-[120%] font-ytf-vangmono">LANGUAGES/CUTS</th>
              <th className="text-left p-2 text-[9px] leading-[120%] font-ytf-vangmono">FILE FORMAT</th>
              <th className="text-right p-2 text-[9px] leading-[120%] font-ytf-vangmono">AMOUNT (USD)</th>
            </tr>
          </thead>
          <tbody>
            {formData.items
              .filter((item: any) => item.typefaceFamily && item.typefaceVariant)
              .map((item: any, index: number) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="p-2 text-[9px] leading-[120%] font-ytf-grand">{`0${index + 1}.`}</td>
                  <td className="p-2 text-[9px] leading-[120%] font-ytf-grand">{item.typefaceFamily}</td>
                  <td className="p-2 text-[9px] leading-[120%] font-ytf-grand">{item.licenseType}</td>
                  <td className="p-2 text-[9px] leading-[120%] font-ytf-grand">{formatDuration(item.durationType, item.durationYears)}</td>
                  <td className="p-2 text-[9px] leading-[120%] font-ytf-grand">{item.languageCut}</td>
                  <td className="p-2 text-[9px] leading-[120%] font-ytf-grand">{formatFileFormats(item.fileFormats)}</td>
                  <td className="p-2 text-[9px] leading-[120%] font-ytf-grand text-right">${Number.parseFloat(String(item.amount)).toFixed(2)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        <div className="space-y-1">
          <label className="block text-[9px] leading-[120%] font-ytf-grand">Subtotal</label>
          <input
            type="text"
            value={`$${formData.subtotal.toFixed(2)}`}
            readOnly
            className="w-full h-6 px-2 text-[9px] leading-[120%] font-ytf-grand bg-muted"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[9px] leading-[120%] font-ytf-grand">Tax (Deducted)</label>
          <input
            type="text"
            value="$0.00"
            readOnly
            className="w-full h-6 px-2 text-[9px] leading-[120%] font-ytf-grand bg-muted"
          />
        </div>
      </div>

      {/* Total */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        <div className="space-y-1">
          <label className="block text-[9px] leading-[120%] font-ytf-grand">Total (USD)</label>
          <input
            type="text"
            value={`$${formData.total.toFixed(2)}`}
            readOnly
            className="w-full h-6 px-2 text-[9px] leading-[120%] font-ytf-grand bg-muted"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[9px] leading-[120%] font-ytf-grand">Total (VND)</label>
          <input
            type="text"
            value={`${vndAmount.toLocaleString()} VND`}
            readOnly
            className="w-full h-6 px-2 text-[9px] leading-[120%] font-ytf-grand bg-muted"
          />
        </div>
      </div>

      {/* Extensions */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        <div className="space-y-1">
          <label className="block text-[9px] leading-[120%] font-ytf-grand">Extensions - Included</label>
          <input
            type="text"
            value="Standard license terms"
            readOnly
            className="w-full h-6 px-2 text-[9px] leading-[120%] font-ytf-grand bg-muted"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[9px] leading-[120%] font-ytf-grand">Extensions - Excluded</label>
          <input
            type="text"
            value="Custom modifications"
            readOnly
            className="w-full h-6 px-2 text-[9px] leading-[120%] font-ytf-grand bg-muted"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <label className="block text-[9px] leading-[120%] font-ytf-grand">Notes</label>
        <textarea
          value="All offers and license agreements from Yellow Type Foundry are governed exclusively by Yellow Type Foundry's General Terms and Conditions (EULA), with any conflicting terms from the licensees' general conditions expressly excluded."
          readOnly
          className="w-full h-24 px-2 py-1 text-[9px] leading-[120%] font-ytf-grand bg-muted resize-none"
        />
      </div>

      {/* Footer */}
      <div className="absolute bottom-5 left-5 right-5 flex justify-between text-[9px] leading-[120%] font-ytf-vangmono">
        <span>©2025 YELLOW TYPE FOUNDRY</span>
        <span>YELLOWTYPE.COM</span>
        <span>STRICTLY CONFIDENTIAL</span>
      </div>
    </div>
  )
}
