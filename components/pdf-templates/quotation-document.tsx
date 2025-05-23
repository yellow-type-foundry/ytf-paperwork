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
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
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
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  tableCell: {
    fontSize: 10,
    padding: 5,
  },
  total: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  totalLabel: {
    width: 100,
    fontSize: 12,
  },
  totalValue: {
    width: 100,
    fontSize: 12,
    textAlign: "right",
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Quotation</Text>
          <Text style={styles.subtitle}>Quotation #{safeData.quotationNumber}</Text>
          <Text style={styles.subtitle}>Date: {safeData.quotationDate}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Client Information</Text>
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

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { width: "30%" }]}>Typeface</Text>
            <Text style={[styles.tableCell, { width: "20%" }]}>License</Text>
            <Text style={[styles.tableCell, { width: "20%" }]}>Duration</Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>Amount</Text>
          </View>
          {safeData.items.map((item: QuotationData['items'][0], index: number) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "30%" }]}>{item.typeface}</Text>
              <Text style={[styles.tableCell, { width: "20%" }]}>{item.licenseType}</Text>
              <Text style={[styles.tableCell, { width: "20%" }]}>{item.duration}</Text>
              <Text style={[styles.tableCell, { width: "15%" }]}>${item.amount.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.total}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>${safeData.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${safeData.total.toFixed(2)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
