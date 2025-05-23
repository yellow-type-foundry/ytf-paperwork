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
  fontWeight: "bold",
})

Font.register({
  family: "YTF Grand",
  src: "/fonts/YTFGrand123-Regular.woff2",
})

Font.register({
  family: "YTF VangMono",
  src: "/fonts/YTFVangMono-Regular.woff2",
})

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "YTF Grand",
    fontSize: 14,
    lineHeight: 1.6,
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontFamily: "YTF Oldman",
    fontSize: 32,
    lineHeight: 1.1,
    letterSpacing: -0.015,
    marginBottom: 16,
    textTransform: "uppercase",
  },
  subtitle: {
    fontFamily: "YTF VangMono",
    fontSize: 12,
    lineHeight: 1.4,
    letterSpacing: -0.01,
    textTransform: "uppercase",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: "YTF VangMono",
    fontSize: 12,
    lineHeight: 1.4,
    letterSpacing: -0.01,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  body: {
    fontFamily: "YTF Grand",
    fontSize: 14,
    lineHeight: 1.6,
    letterSpacing: 0.0025,
  },
  table: {
    width: "100%",
    marginBottom: 32,
  },
  tableHeader: {
    backgroundColor: "#e8eadd",
    flexDirection: "row",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableCell: {
    padding: 12,
    flex: 1,
  },
  tableCellHeader: {
    fontFamily: "YTF VangMono",
    fontSize: 12,
    lineHeight: 1.4,
    letterSpacing: -0.01,
    textTransform: "uppercase",
  },
  tableCellBody: {
    fontFamily: "YTF Grand",
    fontSize: 14,
    lineHeight: 1.6,
    letterSpacing: 0.0025,
  },
  totals: {
    marginBottom: 32,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalLabel: {
    fontFamily: "YTF VangMono",
    fontSize: 12,
    lineHeight: 1.4,
    letterSpacing: -0.01,
    textTransform: "uppercase",
  },
  totalValue: {
    fontFamily: "YTF Grand",
    fontSize: 14,
    lineHeight: 1.6,
    letterSpacing: 0.0025,
  },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  grandTotalLabel: {
    fontFamily: "YTF Grand",
    fontSize: 18,
    lineHeight: 1.2,
    fontWeight: "bold",
  },
  grandTotalValue: {
    fontFamily: "YTF Grand",
    fontSize: 18,
    lineHeight: 1.2,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontFamily: "YTF VangMono",
    fontSize: 10,
    lineHeight: 1.4,
    letterSpacing: -0.01,
  },
})

// Create Document Component
export const QuotationDocument = ({ data }: { data: QuotationData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>QUOTATION</Text>
        <View style={styles.subtitle}>
          <Text>Quotation Number: {data.quotationNumber}</Text>
          <Text>Date: {data.quotationDate}</Text>
        </View>
      </View>

      {/* Client Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Client Information:</Text>
        <View style={styles.body}>
          <Text>Name: {data.clientName}</Text>
          <Text>Email: {data.clientEmail}</Text>
          {data.clientAddress && <Text>Address: {data.clientAddress}</Text>}
        </View>
      </View>

      {/* Business Size Information */}
      {data.businessSize && (
        <View style={styles.section}>
          <Text style={styles.title}>{data.businessSize.name} License</Text>
          <Text style={styles.body}>{data.businessSize.description}</Text>
        </View>
      )}

      {/* Items Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <View style={[styles.tableCell, { flex: 0.5 }]}>
            <Text style={styles.tableCellHeader}>NO</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableCellHeader}>TYPEFACE</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableCellHeader}>LICENSE TYPE</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableCellHeader}>DURATION</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableCellHeader}>LANGUAGES/CUTS</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableCellHeader}>FILE FORMAT</Text>
          </View>
          <View style={[styles.tableCell, { flex: 0.8 }]}>
            <Text style={styles.tableCellHeader}>AMOUNT (USD)</Text>
          </View>
        </View>

        {data.items.map((item: QuotationItem, index: number) => (
          <View key={index} style={styles.tableRow}>
            <View style={[styles.tableCell, { flex: 0.5 }]}>
              <Text style={styles.tableCellBody}>{`0${index + 1}.`}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellBody}>{item.typeface}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellBody}>{item.licenseType}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellBody}>{item.duration}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellBody}>{item.languageCut}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellBody}>{item.fileFormats}</Text>
            </View>
            <View style={[styles.tableCell, { flex: 0.8 }]}>
              <Text style={styles.tableCellBody}>${Number.parseFloat(String(item.amount)).toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>SUBTOTAL</Text>
          <Text style={styles.totalValue}>${data.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>VIETNAM VALUE ADDED TAX (DEDUCTED)</Text>
          <Text style={styles.totalValue}>$0</Text>
        </View>
        <View style={styles.grandTotal}>
          <Text style={styles.grandTotalLabel}>Total (USD):</Text>
          <Text style={styles.grandTotalValue}>${data.total.toFixed(2)}</Text>
        </View>
        <Text style={[styles.totalValue, { textAlign: "right", marginTop: 8 }]}>
          ≈ {(data.total * 24500).toLocaleString()} VND
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
