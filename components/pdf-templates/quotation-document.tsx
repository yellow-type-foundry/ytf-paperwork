"use client"
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"
import { QuotationData } from "@/types"

// Define types
interface BusinessSize {
  name: string
  description: string
}

interface QuotationItem {
  typeface: string
  licenseType: string
  duration: string
  languageCut: string
  fileFormats: string
  amount: number
}

// Register fonts
Font.register({
  family: "YTF Oldman",
  src: "/fonts/YTFOldman-Bold.ttf",
  fontWeight: "bold"
})

Font.register({
  family: "YTF Vang Mono",
  src: "/fonts/YTFVangMono-Regular.ttf",
  fontWeight: "normal"
})

Font.register({
  family: "YTF Grand 123",
  src: "/fonts/YTFGrand123-Regular.ttf",
  fontWeight: "normal"
})

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: "YTF Grand 123",
    backgroundColor: "#E7E5E4",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 18,
    paddingBottom: 6,
  },
  headerText: {
    fontFamily: "YTF Vang Mono",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontFamily: "YTF Oldman",
    fontSize: 38,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#D6D3D1",
    paddingVertical: 12,
    letterSpacing: -0.5,
    marginHorizontal: 32,
    marginBottom: 8,
  },
  infoBlock: {
    flexDirection: "row",
    gap: 32,
    paddingHorizontal: 32,
    paddingVertical: 8,
    backgroundColor: "#E7E5E4",
    marginBottom: 8,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: "YTF Vang Mono",
    fontSize: 9,
    textTransform: "uppercase",
    opacity: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: "YTF Grand 123",
    fontSize: 11,
    lineHeight: 1.2,
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: "30%",
    fontSize: 12,
  },
  value: {
    width: "70%",
    fontSize: 12,
  },
  table: {
    marginHorizontal: 32,
    marginBottom: 0,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 4,
    marginBottom: 2,
    backgroundColor: "#E7E5E4",
  },
  tableRow: {
    flexDirection: "row",
    minHeight: 24,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#D6D3D1",
  },
  tableCell: {
    fontSize: 10,
    paddingVertical: 4,
    paddingHorizontal: 2,
    flexWrap: "wrap",
    fontFamily: "YTF Grand 123",
  },
  totalSection: {
    backgroundColor: "#F7FEE7",
    marginHorizontal: 32,
    marginTop: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  totalLabel: {
    fontFamily: "YTF Vang Mono",
    fontSize: 10,
    textTransform: "uppercase",
  },
  totalValue: {
    fontFamily: "YTF Grand 123",
    fontSize: 10,
    textAlign: "right",
  },
  totalBig: {
    fontFamily: "YTF Grand 123",
    fontSize: 24,
    fontWeight: "light",
    textAlign: "right",
  },
  notesSection: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingHorizontal: 32,
    paddingBottom: 16,
    paddingTop: 12,
  },
  notesLabel: {
    fontFamily: 'YTF Vang Mono',
    fontSize: 8,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 2,
  },
  notesText: {
    fontFamily: 'YTF Grand 123',
    fontSize: 7,
    lineHeight: 1.4,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingBottom: 12,
  },
  footerText: {
    fontFamily: 'YTF Vang Mono',
    fontSize: 8,
    textTransform: 'uppercase',
  },
})

interface QuotationDocumentProps {
  data: QuotationData
}

export const QuotationDocument: React.FC<QuotationDocumentProps> = ({ data }) => {
  // Ensure we have valid data
  const safeData: QuotationData = {
    quotationNumber: data?.quotationNumber || "",
    quotationDate: data?.quotationDate || "",
    clientName: data?.clientName || "",
    clientEmail: data?.clientEmail || "",
    clientAddress: data?.clientAddress || "",
    businessSize: data?.businessSize || { name: "", description: "" },
    items: Array.isArray(data?.items) ? data.items : [],
    subtotal: Number(data?.subtotal) || 0,
    total: Number(data?.total) || 0,
  }

  // Format date
  const today = new Date(safeData.quotationDate)
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).toUpperCase()

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Yellow Type Foundry</Text>
          <Text style={styles.headerText}>Quotation No. {safeData.quotationNumber}</Text>
          <Text style={styles.headerText}>Issued on {formattedDate}</Text>
        </View>
        {/* Title */}
        <Text style={styles.title}>Typeface Licensing Quotation</Text>
        {/* Info Blocks */}
        <View style={styles.infoBlock}>
          {/* Provider Info */}
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>License Provider</Text>
            <Text style={styles.infoValue}>Yellow Type Foundry</Text>
          </View>
          {/* Licensee Info */}
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Licensee</Text>
            <Text style={styles.infoValue}>{safeData.clientName}</Text>
            <Text style={styles.infoValue}>{safeData.clientEmail}</Text>
            {safeData.clientAddress && <Text style={styles.infoValue}>{safeData.clientAddress}</Text>}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{safeData.clientName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{safeData.clientEmail}</Text>
          </View>
          {safeData.clientAddress && (
            <View style={styles.row}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{safeData.clientAddress}</Text>
            </View>
          )}
          {safeData.businessSize?.name && (
            <View style={styles.row}>
              <Text style={styles.label}>Business Size:</Text>
              <Text style={styles.value}>{safeData.businessSize.name}</Text>
            </View>
          )}
        </View>

        {/* Table Section */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { width: '7%' }]}>No</Text>
            <Text style={[styles.tableCell, { width: '18%' }]}>Typeface</Text>
            <Text style={[styles.tableCell, { width: '18%' }]}>License Type</Text>
            <Text style={[styles.tableCell, { width: '13%' }]}>Duration</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>Languages/Cuts</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>File Format</Text>
            <Text style={[styles.tableCell, { width: '14%', textAlign: 'right' }]}>Amount</Text>
          </View>
          {safeData.items.map((item, index) => {
            // File format logic
            let fileFormats = String(item.fileFormats || "");
            fileFormats = fileFormats.replace(/otf_ttf/gi, "OTF, TTF").replace(/woff_woff2/gi, "WOFF, WOFF2");
            let fileFormatLines = [fileFormats];
            if (/WOFF/i.test(fileFormats) || /WOFF2/i.test(fileFormats)) {
              fileFormatLines = fileFormats.split(/,\s*/);
            }
            // Duration logic
            const duration = item.duration && item.duration.trim() ? item.duration : 'Perpetual';
            return (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '7%' }]}>{`0${index + 1}.`}</Text>
                <Text style={[styles.tableCell, { width: '18%' }]}>{item.typeface}</Text>
                <Text style={[styles.tableCell, { width: '18%' }]}>{item.licenseType}</Text>
                <Text style={[styles.tableCell, { width: '13%' }]}>{duration}</Text>
                <Text style={[styles.tableCell, { width: '15%' }]}>{item.languageCut}</Text>
                <Text style={[styles.tableCell, { width: '15%' }]}>
                  {fileFormatLines.length > 1
                    ? fileFormatLines.map((f, i) => <Text key={i}>{f}</Text>)
                    : fileFormatLines[0]}
                </Text>
                <Text style={[styles.tableCell, { width: '14%', textAlign: 'right' }]}>${item.amount.toFixed(2)}</Text>
              </View>
            );
          })}
        </View>

        {/* Totals Section */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>${safeData.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>VAT:</Text>
            <Text style={styles.totalValue}>$0.00</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { fontWeight: 'bold' }]}>Total:</Text>
            <Text style={[styles.totalValue, { fontWeight: 'bold', fontSize: 18 }]}>${safeData.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Notes Section */}
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Notes</Text>
          <Text style={styles.notesText}>
            {`This quotation is valid until ${new Date(new Date(safeData.quotationDate).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}. Payment terms are net 30 days. All prices are in USD and exclude VAT. For any questions, please contact us at hi@yellowtype.com`}
          </Text>
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>©2025 YELLOW TYPE FOUNDRY</Text>
          <Text style={styles.footerText}>YELLOWTYPE.COM</Text>
          <Text style={styles.footerText}>STRICTLY CONFIDENTIAL</Text>
        </View>
      </Page>
    </Document>
  )
}
