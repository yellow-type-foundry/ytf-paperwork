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
    <div className="w-[595px] h-[842px] bg-stone-200 inline-flex flex-col justify-start items-center overflow-hidden">
      {/* YTF Logo */}
      <div className="self-stretch p-2 flex flex-col justify-center items-center">
        <div data-style="YFT" className="h-4 py-[0.45px] flex flex-col justify-center items-center overflow-hidden">
          <div className="w-7 h-4 bg-black"></div>
        </div>
      </div>

      {/* Divider */}
      <div data-inset="False" className="self-stretch opacity-20 flex flex-col justify-start items-start">
        <div className="self-stretch h-0 outline outline-[0.20px] outline-offset-[-0.10px] outline-black"></div>
      </div>

      {/* Header */}
      <div className="self-stretch p-2 inline-flex justify-between items-center">
        <div className="flex-1 justify-start text-black text-[5px] font-normal font-['YTF_Millie_Mono'] uppercase leading-[5.05px]">yellow type foundry</div>
        <div className="text-center justify-start text-black text-[5px] font-normal font-['YTF_Millie_Mono'] uppercase leading-[5.05px]">QUOTATION NO.{formattedQuotationNumber}</div>
        <div className="flex-1 text-right justify-start text-black text-[5px] font-normal font-['YTF_Millie_Mono'] uppercase leading-[5.05px]">ISSUED ON {formattedDate}</div>
      </div>

      {/* Divider */}
      <div data-inset="False" className="self-stretch opacity-20 flex flex-col justify-start items-start">
        <div className="self-stretch h-0 outline outline-[0.20px] outline-offset-[-0.10px] outline-black"></div>
      </div>

      {/* Title */}
      <div className="self-stretch px-1 pt-0.5 pb-1 inline-flex justify-start items-center">
        <div className="flex-1 text-center justify-start text-black text-6xl font-bold font-['YTF_Oldman'] uppercase leading-[58.50px]">Typeface Licensing Quotation</div>
      </div>

      {/* Divider */}
      <div data-inset="False" className="self-stretch opacity-20 flex flex-col justify-start items-start">
        <div className="self-stretch h-0 outline outline-[0.20px] outline-offset-[-0.10px] outline-black"></div>
      </div>

      {/* Main Content */}
      <div className="self-stretch flex-1 relative flex flex-col justify-start items-start">
        {/* Provider and Client Info */}
        <div className="self-stretch h-52 inline-flex justify-start items-start">
          <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start">
            <div className="self-stretch p-2 flex flex-col justify-start items-start gap-2">
              <div className="self-stretch opacity-50 justify-start text-black text-[5px] font-normal font-['YTF_Millie_Mono'] uppercase leading-[5.05px]">License PROVIDER</div>
              <div className="self-stretch justify-start text-black text-[6px] font-normal font-['YTF_Grand_123'] leading-[9.60px] tracking-tight">
                Yellow Type Foundry Company Ltd.<br/>
                No.6, Lane 36, Nguyen Hong Street<br/>
                Lang Ha Ward, Dong Da District, Hanoi, Vietnam<br/>
                Tax ID 0109884491
              </div>
            </div>
            <div className="self-stretch p-2 flex flex-col justify-start items-start gap-2">
              <div className="self-stretch opacity-50 justify-start text-black text-[5px] font-normal font-['YTF_Millie_Mono'] uppercase leading-[5.05px]">Quotation Date</div>
              <div className="self-stretch justify-start text-black text-[6px] font-normal font-['YTF_Grand_123'] leading-[9.60px] tracking-tight">
                {formattedDate}<br/>
                (Valid for 30 days from the issue day)
              </div>
            </div>
          </div>
          <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start">
            <div className="self-stretch p-2 flex flex-col justify-start items-start gap-2">
              <div className="self-stretch opacity-50 text-right justify-start text-black text-[5px] font-normal font-['YTF_Millie_Mono'] uppercase leading-[5.05px]">LicenseE / End user</div>
              <div className="self-stretch text-right justify-start text-black text-[6px] font-normal font-['YTF_Grand_123'] leading-[9.60px] tracking-tight">
                {formData.clientName}<br/>
                {formData.clientEmail}
              </div>
            </div>
            <div className="self-stretch p-2 flex flex-col justify-start items-start gap-2">
              <div className="self-stretch opacity-50 text-right justify-start text-black text-[5px] font-normal font-['YTF_Millie_Mono'] uppercase leading-[5.05px]">Billing Address</div>
              <div className="self-stretch h-8 text-right justify-start text-black text-[6px] font-normal font-['YTF_Grand_123'] leading-[9.60px] tracking-tight">
                {formData.clientAddress || "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div className="self-stretch inline-flex justify-start items-start">
          <div className="w-10 p-2 inline-flex flex-col justify-start items-start gap-2">
            <div className="w-48 justify-start text-black text-[5px] font-normal font-['YTF_Millie_Mono'] uppercase leading-[5.05px]">No</div>
          </div>
          <div className="flex-1 p-2 inline-flex flex-col justify-start items-start gap-2">
            <div className="self-stretch justify-start text-black text-[5px] font-normal font-['YTF_Millie_Mono'] uppercase leading-[5.05px]">Typeface</div>
          </div>
          <div className="flex-1 p-2 inline-flex flex-col justify-start items-start gap-2">
            <div className="self-stretch justify-start text-black text-[5px] font-normal font-['YTF_Millie_Mono'] uppercase leading-[5.05px]">License type</div>
          </div>
          <div className="flex-1 p-2 inline-flex flex-col justify-start items-start gap-2">
            <div className="self-stretch text-center justify-start text-black text-[5px] font-normal font-['YTF_Millie_Mono'] uppercase leading-[5.05px]">Duration</div>
          </div>
          <div className="flex-1 p-2 inline-flex flex-col justify-start items-start gap-2">
            <div className="self-stretch text-right justify-start text-black text-[5px] font-normal font-['YTF_Millie_Mono'] uppercase leading-[5.05px]">Languages/cuts</div>
          </div>
          <div className="flex-1 p-2 inline-flex flex-col justify-start items-start gap-2">
            <div className="self-stretch text-right justify-start text-black text-[5px] font-normal font-['YTF_Millie_Mono'] uppercase leading-[5.05px]">File format</div>
          </div>
          <div className="flex-1 p-2 inline-flex flex-col justify-start items-start gap-2">
            <div className="self-stretch text-right justify-start text-black text-[5px] font-normal font-['YTF_Millie_Mono'] uppercase leading-[5.05px]">Amount (USD)</div>
          </div>
        </div>

        {/* Table Rows */}
        {formData.items
          .filter((item: any) => item.typefaceFamily && item.typefaceVariant)
          .map((item: any, index: number) => (
            <div key={index} className="self-stretch inline-flex justify-start items-start">
              <div className="w-10 self-stretch p-2 inline-flex flex-col justify-center items-start gap-2">
                <div className="self-stretch justify-start text-black text-[5px] font-normal font-['YTF_Millie_Mono'] uppercase leading-[5.05px]">{`0${index + 1}.`}</div>
              </div>
              <div className="flex-1 self-stretch p-2 inline-flex flex-col justify-center items-start gap-1.5">
                <div className="self-stretch justify-start text-black text-lg font-medium font-['YTF_Eon_B'] leading-none">{item.typefaceFamily}</div>
              </div>
              <div className="flex-1 self-stretch p-2 inline-flex flex-col justify-center items-start gap-1.5">
                <div className="w-20 justify-start text-black text-[8px] font-normal font-['YTF_Grand_123'] leading-[9.60px] tracking-tight">{item.licenseType}</div>
              </div>
              <div className="flex-1 self-stretch p-2 inline-flex flex-col justify-center items-start gap-1.5">
                <div className="self-stretch text-center justify-start text-black text-[8px] font-normal font-['YTF_Grand_123'] leading-3 tracking-tight">{formatDuration(item.durationType, item.durationYears)}</div>
              </div>
              <div className="flex-1 self-stretch p-2 inline-flex flex-col justify-center items-start gap-1.5">
                <div className="self-stretch text-right justify-start text-black text-[8px] font-normal font-['YTF_Grand_123'] leading-[9.60px] tracking-tight">{item.languageCut}</div>
              </div>
              <div className="flex-1 self-stretch p-2 inline-flex flex-col justify-center items-start gap-1.5">
                <div className="self-stretch text-right justify-start text-black text-[8px] font-normal font-['YTF_Grand_123'] leading-3 tracking-tight">{formatFileFormats(item.fileFormats)}</div>
              </div>
              <div className="flex-1 self-stretch p-2 inline-flex flex-col justify-center items-start gap-1.5">
                <div className="self-stretch text-right justify-start text-black text-[8px] font-normal font-['YTF_Grand_123'] leading-3 tracking-tight">${Number.parseFloat(String(item.amount)).toFixed(2)}</div>
              </div>
            </div>
          ))}

        {/* Totals */}
        <div className="self-stretch h-5 p-2 inline-flex justify-start items-center gap-1.5">
          <div className="flex-1 justify-start text-black text-[5px] font-normal font-['YTF_Millie_Mono'] uppercase leading-[5.05px]">Subtotal</div>
          <div className="flex-1 text-right justify-start text-black text-[8px] font-normal font-['YTF_Grand_123'] leading-3 tracking-tight">${formData.subtotal.toFixed(2)}</div>
        </div>
        <div className="self-stretch h-5 p-2 inline-flex justify-start items-center gap-1.5">
          <div className="justify-start text-black text-[5px] font-normal font-['YTF_Millie_Mono'] uppercase leading-[5.05px]">Vietnam Value added tax (deducted)</div>
          <div className="flex-1 text-right justify-start text-black text-[8px] font-normal font-['YTF_Grand_123'] leading-3 tracking-tight">$0</div>
        </div>
        <div className="self-stretch p-2 bg-lime-50 inline-flex justify-start items-center gap-1.5">
          <div className="flex-1 justify-start text-black text-xl font-light font-['YTF_Grand_123'] leading-tight tracking-tight">Total (USD):</div>
          <div className="flex-1 text-right justify-start text-black text-xl font-light font-['YTF_Grand_123'] leading-tight tracking-tight">${formData.total.toFixed(2)}</div>
        </div>

        {/* Extensions */}
        <div className="w-[595px] flex-1 inline-flex justify-start items-start">
          <div className="flex-1 self-stretch p-2 inline-flex flex-col justify-start items-start gap-2">
            <div className="self-stretch opacity-50 justify-start text-black text-[5px] font-normal font-['YTF_Millie_Mono'] uppercase leading-[5.05px]">Extensions — included</div>
          </div>
          <div className="flex-1 self-stretch p-2 inline-flex flex-col justify-start items-start gap-2">
            <div className="self-stretch opacity-50 text-right justify-start text-black text-[5px] font-normal font-['YTF_Millie_Mono'] uppercase leading-[5.05px]">Extensions — Excluded</div>
          </div>
        </div>

        {/* Notes */}
        <div className="self-stretch p-2 flex flex-col justify-center items-center gap-2">
          <div className="self-stretch text-center justify-start text-black text-[5px] font-normal font-['YTF_Millie_Mono'] uppercase leading-[7px]">NOTES</div>
          <div className="w-80 text-center justify-start text-black text-[6px] font-normal font-['YTF_Grand_123'] leading-[9.60px] tracking-tight">
            All offers and license agreements from Yellow Type Foundry are governed exclusively by Yellow Type Foundry's General Terms and Conditions (EULA), with any conflicting terms from the licensees' general conditions expressly excluded.
          </div>
        </div>

        {/* Dividers */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            data-inset="False"
            className="w-[595px] left-0 absolute opacity-20 flex flex-col justify-start items-start"
            style={{ top: `${210.39 + i * 20}px` }}
          >
            <div className="self-stretch h-0 outline outline-[0.20px] outline-offset-[-0.10px] outline-black"></div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="self-stretch pb-1.5 flex flex-col justify-start items-start gap-1.5">
        <div data-inset="False" className="self-stretch opacity-20 flex flex-col justify-start items-start">
          <div className="self-stretch h-0 outline outline-[0.20px] outline-offset-[-0.10px] outline-black"></div>
        </div>
        <div className="self-stretch px-2 inline-flex justify-between items-center">
          <div className="flex-1 justify-start text-black text-[5px] font-normal font-['YTF_Millie_Mono'] uppercase leading-[5px]">©2025 YELLOW TYPE FOUNDRY</div>
          <div className="flex-1 text-center justify-start text-black text-[5px] font-normal font-['YTF_Millie_Mono'] uppercase leading-[5px]">YELLOWTYPE.com</div>
          <div className="flex-1 text-right justify-start text-black text-[5px] font-normal font-['YTF_Millie_Mono'] uppercase leading-[5px]">STRICTLY CONFIDENTIAL</div>
        </div>
      </div>
    </div>
  )
}
