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

  return (
    <div className="w-[595px] h-[842px] bg-stone-200 flex flex-col items-center">
      {/* Header */}
      <div className="w-full p-2 flex justify-between items-center">
        <div className="font-millie-mono text-[5px] uppercase">Yellow Type Foundry</div>
        <div className="font-millie-mono text-[5px] uppercase">Quotation No. {formattedQuotationNumber}</div>
        <div className="font-millie-mono text-[5px] uppercase">Issued on {formattedDate}</div>
      </div>

      {/* Title */}
      <div className="w-full font-oldman text-[62px] font-bold uppercase leading-[62px] text-center border-t border-b border-stone-300 py-2">
        Typeface Licensing Quotation
      </div>

      {/* Info Blocks */}
      <div className="w-full p-2">
        <div className="flex gap-4">
          {/* Provider Info */}
          <div className="flex-1">
            <div className="font-millie-mono text-[5px] uppercase opacity-50 leading-[5.05px] mb-1">License Provider</div>
            <div className="font-grand text-[8px] leading-[9.60px] tracking-tight">Yellow Type Foundry</div>
          </div>
          {/* Licensee Info */}
          <div className="flex-1">
            <div className="font-millie-mono text-[5px] uppercase opacity-50 leading-[5.05px] mb-1">Licensee</div>
            <div className="font-grand text-[8px] leading-[9.60px] tracking-tight">
              <div>{formData.clientName}</div>
              <div>{formData.clientEmail}</div>
              {formData.clientAddress && <div>{formData.clientAddress}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="w-full mt-2">
        <div className="flex border-t border-b border-black border-opacity-30">
          <div className="w-[5%] p-1">
            <div className="font-millie-mono text-[5px] uppercase opacity-50">No</div>
          </div>
          <div className="w-[20%] p-1">
            <div className="font-millie-mono text-[5px] uppercase opacity-50">Typeface</div>
          </div>
          <div className="w-[15%] p-1">
            <div className="font-millie-mono text-[5px] uppercase opacity-50">License Type</div>
          </div>
          <div className="w-[15%] p-1">
            <div className="font-millie-mono text-[5px] uppercase opacity-50">Duration</div>
          </div>
          <div className="w-[15%] p-1">
            <div className="font-millie-mono text-[5px] uppercase opacity-50">Languages/Cuts</div>
          </div>
          <div className="w-[15%] p-1">
            <div className="font-millie-mono text-[5px] uppercase opacity-50">File Format</div>
          </div>
          <div className="w-[15%] p-1">
            <div className="font-millie-mono text-[5px] uppercase opacity-50">Amount</div>
          </div>
        </div>

        {formData.items.map((item: any, index: number) => (
          <div key={index} className="flex border-b border-black border-opacity-30">
            <div className="w-[5%] p-1">
              <div className="font-grand text-[8px] leading-[9.60px]">{`0${index + 1}.`}</div>
            </div>
            <div className="w-[20%] p-1">
              <div className="font-grand text-[8px] leading-[9.60px]">{item.typeface}</div>
            </div>
            <div className="w-[15%] p-1">
              <div className="font-grand text-[8px] leading-[9.60px]">{item.licenseType}</div>
            </div>
            <div className="w-[15%] p-1">
              <div className="font-grand text-[8px] leading-[9.60px]">{item.duration}</div>
            </div>
            <div className="w-[15%] p-1">
              <div className="font-grand text-[8px] leading-[9.60px]">{item.languageCut}</div>
            </div>
            <div className="w-[15%] p-1">
              <div className="font-grand text-[8px] leading-[9.60px]">{item.fileFormats}</div>
            </div>
            <div className="w-[15%] p-1">
              <div className="font-grand text-[8px] leading-[9.60px] text-right">${item.amount.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="w-full bg-lime-50 p-2 mt-2">
        <div className="flex justify-between mb-1">
          <div className="font-millie-mono text-[5px] uppercase">Subtotal</div>
          <div className="font-grand text-[8px] text-right">${formData.subtotal.toFixed(2)}</div>
        </div>
        <div className="flex justify-between mb-1">
          <div className="font-millie-mono text-[5px] uppercase">VAT</div>
          <div className="font-grand text-[8px] text-right">$0.00</div>
        </div>
        <div className="flex justify-between">
          <div className="font-millie-mono text-[5px] uppercase">Total</div>
          <div className="font-grand text-xl font-light text-right">${formData.total.toFixed(2)}</div>
        </div>
      </div>

      {/* Notes */}
      <div className="w-full p-2 mt-2">
        <div className="font-millie-mono text-[5px] uppercase text-center mb-1">Notes</div>
        <div className="font-grand text-[6px] leading-[9.60px] tracking-tight text-center">
          This quotation is valid for 30 days from the date of issue. Payment terms are net 30 days.
          All prices are in USD and exclude VAT. For any questions, please contact us at contact@yellowtypefoundry.com
        </div>
      </div>

      {/* Footer */}
      <div className="w-full p-2 mt-auto flex justify-between">
        <div className="font-millie-mono text-[5px] uppercase">©2025 YELLOW TYPE FOUNDRY</div>
        <div className="font-millie-mono text-[5px] uppercase">YELLOWTYPE.COM</div>
        <div className="font-millie-mono text-[5px] uppercase">STRICTLY CONFIDENTIAL</div>
      </div>
    </div>
  )
}
