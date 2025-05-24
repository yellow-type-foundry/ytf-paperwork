export interface FormItem {
  typefaceFamily: string
  typefaceVariant: string
  typeface: string
  licenseType: string
  durationType: string
  durationYears: number
  languageCut: string
  fileFormats: string[]
  basePrice: number
  amount: number
}

export interface FormData {
  clientName: string
  clientEmail: string
  clientAddress: string
  quotationNumber: string
  quotationDate: string
  businessSize: string
  nonProfitDiscount: boolean
  customDiscountPercent: number
  items: FormItem[]
  subtotal: number
  tax: number
  total: number
}

export interface BusinessSize {
  id: string
  name: string
  description: string
  multiplier: number | null
  contactRequired: boolean
}

export interface Font {
  family: string
  variant: string
  value: string
  label: string
}

export interface PDFDocumentProps {
  data: {
    quotationNumber: string
    quotationDate: string
    clientName: string
    clientEmail: string
    clientAddress?: string
    businessSize?: BusinessSize
    items: Array<{
      typeface: string
      licenseType: string
      duration: string
      languageCut: string
      fileFormats: string
      amount: number
    }>
    subtotal: number
    total: number
  }
}

export interface PDFRendererProps {
  documentFactory: () => Promise<Blob>
  fileName: string
}

export interface FontSelectorProps {
  onSelectionChange: (fonts: Font[]) => void
  selectedFonts?: Font[]
}

export interface QuotationData {
  quotationNumber: string
  quotationDate: string
  clientName: string
  clientEmail: string
  clientAddress?: string
  businessSize?: {
    name: string
    description: string
  }
  items: Array<{
    typeface: string
    licenseType: string
    duration: string
    languageCut: string
    fileFormats: string
    amount: number
  }>
  subtotal: number
  total: number
  extensionsIncluded?: string
  extensionsExcluded?: string
} 