import { pdf } from '@react-pdf/renderer'
import { QuotationDocument } from '@/components/pdf-templates/quotation-document'
import type { QuotationData } from './pdf-generator'

export async function renderQuotationPDF(data: QuotationData): Promise<Blob> {
  return pdf(<QuotationDocument data={data} />).toBlob()
} 