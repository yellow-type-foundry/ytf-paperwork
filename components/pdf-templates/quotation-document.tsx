"use client"
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"

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

interface QuotationData {
  quotationNumber: string
  quotationDate: string
  clientName: string
  clientEmail: string
  clientAddress?: string
  businessSize?: BusinessSize
  items: QuotationItem[]
  subtotal: number
  total: number
}

// Register fonts
Font.register({
  family: "YTF Oldman",
  src: "/fonts/YTFOldman-Bold.woff2",
  fontWeight: "bold"
})

Font.register({
  family: "YTF Millie Mono",
  src: "/fonts/YTFVangMono-Regular.woff2",
  fontWeight: "normal"
})

Font.register({
  family: "YTF Grand 123",
  src: "/fonts/YTFGrand123-Regular.woff2",
  fontWeight: "normal"
})

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: "#e7e5e4", // bg-stone-200
    width: 595,
    height: 842,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    width: "100%",
    padding: 8, // p-2
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    fontFamily: "YTF Millie Mono",
    fontSize: 5,
    textTransform: "uppercase",
  },
  headerCenter: {
    fontFamily: "YTF Millie Mono",
    fontSize: 5,
    textTransform: "uppercase",
  },
  headerRight: {
    fontFamily: "YTF Millie Mono",
    fontSize: 5,
    textTransform: "uppercase",
  },
  title: {
    width: "100%",
    fontFamily: "YTF Oldman",
    fontSize: 62, // text-6xl
    fontWeight: "bold",
    textTransform: "uppercase",
    lineHeight: 62, // leading-[62px]
    textAlign: "center",
    borderTopWidth: 0.3,
    borderBottomWidth: 0.3,
    borderColor: "#d6d3d1", // border-stone-300
    padding: "8 0",
  },
  section: {
    width: "100%",
    padding: 8, // p-2
  },
  sectionLabel: {
    fontFamily: "YTF Millie Mono",
    fontSize: 5, // text-[5px]
    textTransform: "uppercase",
    lineHeight: 5.05, // leading-[5.05px]
    opacity: 0.5,
    marginBottom: 4,
  },
  content: {
    fontFamily: "YTF Grand 123",
    fontSize: 8, // text-[8px]
    lineHeight: 9.6, // leading-[9.60px]
    letterSpacing: -0.01, // tracking-tight
  },
  table: {
    width: "100%",
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: "row",
    borderTopWidth: 0.3,
    borderBottomWidth: 0.3,
    borderColor: "#000000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.3,
    borderColor: "#000000",
  },
  tableCell: {
    padding: 4,
    fontFamily: "YTF Grand 123",
    fontSize: 8, // text-[8px]
    lineHeight: 9.6, // leading-[9.60px]
  },
  tableCellHeader: {
    fontFamily: "YTF Millie Mono",
    fontSize: 5, // text-[5px]
    textTransform: "uppercase",
    opacity: 0.5,
  },
  totals: {
    width: "100%",
    backgroundColor: "#f7fee7", // bg-lime-50
    padding: 8,
    marginTop: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalLabel: {
    fontFamily: "YTF Millie Mono",
    fontSize: 5, // text-[5px]
    textTransform: "uppercase",
  },
  totalValue: {
    fontFamily: "YTF Grand 123",
    fontSize: 8, // text-[8px]
    textAlign: "right",
  },
  grandTotal: {
    fontFamily: "YTF Grand 123",
    fontSize: 20, // text-xl
    fontWeight: "light",
    textAlign: "right",
  },
  notes: {
    width: "100%",
    padding: 8,
    marginTop: 8,
  },
  notesTitle: {
    fontFamily: "YTF Millie Mono",
    fontSize: 5, // text-[5px]
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 4,
  },
  notesContent: {
    fontFamily: "YTF Grand 123",
    fontSize: 6, // text-[6px]
    lineHeight: 9.6, // leading-[9.60px]
    letterSpacing: -0.01, // tracking-tight
    textAlign: "center",
  },
  footer: {
    width: "100%",
    padding: 8,
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontFamily: "YTF Millie Mono",
    fontSize: 5, // text-[5px]
    textTransform: "uppercase",
  },
})

// Create Document Component
export const QuotationDocument = ({ data }: { data: QuotationData }) => {
  // Ensure data is valid
  const safeData = {
    ...data,
    items: Array.isArray(data.items) ? data.items : [],
    quotationNumber: data.quotationNumber || "",
    quotationDate: data.quotationDate || "",
    clientName: data.clientName || "",
    clientEmail: data.clientEmail || "",
    clientAddress: data.clientAddress || "",
    subtotal: Number(data.subtotal) || 0,
    total: Number(data.total) || 0
  }

  // Format date
  const formattedDate = safeData.quotationDate ? new Date(safeData.quotationDate).toLocaleDateString() : ""

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerLeft}>Yellow Type Foundry</Text>
          <Text style={styles.headerCenter}>Quotation No. {safeData.quotationNumber}</Text>
          <Text style={styles.headerRight}>Issued on {formattedDate}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Typeface Licensing Quotation</Text>

        {/* Info Blocks */}
        <View style={styles.section}>
          <View style={{ flexDirection: "row", gap: 16 }}>
            {/* Provider Info */}
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionLabel}>License Provider</Text>
              <Text style={styles.content}>Yellow Type Foundry</Text>
            </View>
            {/* Licensee Info */}
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionLabel}>Licensee</Text>
              <Text style={styles.content}>{safeData.clientName}</Text>
              <Text style={styles.content}>{safeData.clientEmail}</Text>
              {safeData.clientAddress && <Text style={styles.content}>{safeData.clientAddress}</Text>}
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={[styles.tableCell, { width: "5%" }]}>
              <Text style={styles.tableCellHeader}>No</Text>
            </View>
            <View style={[styles.tableCell, { width: "20%" }]}>
              <Text style={styles.tableCellHeader}>Typeface</Text>
            </View>
            <View style={[styles.tableCell, { width: "15%" }]}>
              <Text style={styles.tableCellHeader}>License Type</Text>
            </View>
            <View style={[styles.tableCell, { width: "15%" }]}>
              <Text style={styles.tableCellHeader}>Duration</Text>
            </View>
            <View style={[styles.tableCell, { width: "15%" }]}>
              <Text style={styles.tableCellHeader}>Languages/Cuts</Text>
            </View>
            <View style={[styles.tableCell, { width: "15%" }]}>
              <Text style={styles.tableCellHeader}>File Format</Text>
            </View>
            <View style={[styles.tableCell, { width: "15%" }]}>
              <Text style={styles.tableCellHeader}>Amount</Text>
            </View>
          </View>

          {safeData.items.map((item, index) => {
            const safeItem = {
              typeface: String(item.typeface || ""),
              licenseType: String(item.licenseType || ""),
              duration: String(item.duration || ""),
              languageCut: String(item.languageCut || ""),
              fileFormats: String(item.fileFormats || ""),
              amount: Number(item.amount) || 0
            }

            return (
              <View key={index} style={styles.tableRow}>
                <View style={[styles.tableCell, { width: "5%" }]}>
                  <Text style={styles.tableCell}>{`0${index + 1}.`}</Text>
                </View>
                <View style={[styles.tableCell, { width: "20%" }]}>
                  <Text style={styles.tableCell} wrap>{safeItem.typeface}</Text>
                </View>
                <View style={[styles.tableCell, { width: "15%" }]}>
                  <Text style={styles.tableCell} wrap>{safeItem.licenseType}</Text>
                </View>
                <View style={[styles.tableCell, { width: "15%" }]}>
                  <Text style={styles.tableCell}>{safeItem.duration}</Text>
                </View>
                <View style={[styles.tableCell, { width: "15%" }]}>
                  <Text style={styles.tableCell}>{safeItem.languageCut}</Text>
                </View>
                <View style={[styles.tableCell, { width: "15%" }]}>
                  <Text style={styles.tableCell}>{safeItem.fileFormats}</Text>
                </View>
                <View style={[styles.tableCell, { width: "15%" }]}>
                  <Text style={styles.tableCell}>${safeItem.amount.toFixed(2)}</Text>
                </View>
              </View>
            )
          })}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>${safeData.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>VAT</Text>
            <Text style={styles.totalValue}>$0.00</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.grandTotal}>${safeData.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.notes}>
          <Text style={styles.notesTitle}>Notes</Text>
          <Text style={styles.notesContent}>
            This quotation is valid for 30 days from the date of issue. Payment terms are net 30 days.
            All prices are in USD and exclude VAT. For any questions, please contact us at contact@yellowtypefoundry.com
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>©2025 YELLOW TYPE FOUNDRY</Text>
          <Text style={styles.footerText}>YELLOWTYPE.COM</Text>
          <Text style={styles.footerText}>STRICTLY CONFIDENTIAL</Text>
        </View>
      </Page>
    </Document>
  )
}
