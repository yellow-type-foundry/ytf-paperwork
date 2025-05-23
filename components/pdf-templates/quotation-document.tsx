"use client"
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 30,
    borderBottom: "1px solid #EEEEEE",
    paddingBottom: 10,
  },
  logo: {
    width: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#F59E0B", // Yellow color
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
    color: "#6B7280", // Gray color
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#F59E0B", // Yellow color
  },
  text: {
    fontSize: 10,
    marginBottom: 5,
    lineHeight: 1.5,
  },
  clientInfo: {
    marginBottom: 20,
  },
  clientName: {
    fontSize: 12,
    fontWeight: "bold",
  },
  clientDetail: {
    fontSize: 10,
    marginBottom: 3,
    color: "#6B7280", // Gray color
  },
  fontList: {
    marginTop: 10,
    marginBottom: 10,
  },
  fontItem: {
    fontSize: 10,
    marginBottom: 5,
    paddingLeft: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: "center",
    fontSize: 8,
    color: "#9CA3AF", // Light gray
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    borderBottomStyle: "solid",
  },
  tableRowHeader: {
    backgroundColor: "#F9FAFB",
  },
  tableCol: {
    padding: 8,
  },
  tableColDescription: {
    width: "50%",
  },
  tableColQuantity: {
    width: "15%",
  },
  tableColPrice: {
    width: "15%",
  },
  tableColTotal: {
    width: "20%",
  },
  tableCell: {
    fontSize: 10,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#4B5563",
  },
  totals: {
    marginTop: 10,
    marginLeft: "auto",
    width: "40%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 10,
  },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    borderTopStyle: "solid",
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
  notes: {
    marginTop: 30,
    fontSize: 10,
    color: "#6B7280",
    lineHeight: 1.5,
  },
})

// Create Document Component
export const QuotationDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Yellow Type Foundry</Text>
        <Text style={styles.subtitle}>Quotation</Text>
      </View>

      {/* Client Information */}
      <View style={styles.clientInfo}>
        <Text style={styles.clientName}>{data.clientName}</Text>
        <Text style={styles.clientDetail}>{data.clientCompany}</Text>
        <Text style={styles.clientDetail}>{data.clientEmail}</Text>
        <Text style={styles.clientDetail}>{data.clientAddress}</Text>
      </View>

      {/* Quotation Details */}
      <View style={styles.section}>
        <Text style={styles.text}>Quotation Date: {data.quotationDate}</Text>
        <Text style={styles.text}>Valid Until: {data.validUntil}</Text>
        <Text style={styles.text}>Project: {data.projectName}</Text>
        {data.projectDescription && <Text style={styles.text}>Description: {data.projectDescription}</Text>}
      </View>

      {/* Selected Fonts */}
      {data.selectedFonts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Fonts</Text>
          <View style={styles.fontList}>
            {data.selectedFonts.map((font, index) => (
              <Text key={index} style={styles.fontItem}>
                • {font.label}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Items Table */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quotation Items</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableRowHeader]}>
            <View style={[styles.tableCol, styles.tableColDescription]}>
              <Text style={styles.tableCellHeader}>Description</Text>
            </View>
            <View style={[styles.tableCol, styles.tableColQuantity]}>
              <Text style={styles.tableCellHeader}>Quantity</Text>
            </View>
            <View style={[styles.tableCol, styles.tableColPrice]}>
              <Text style={styles.tableCellHeader}>Unit Price</Text>
            </View>
            <View style={[styles.tableCol, styles.tableColTotal]}>
              <Text style={styles.tableCellHeader}>Total</Text>
            </View>
          </View>

          {/* Table Rows */}
          {data.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={[styles.tableCol, styles.tableColDescription]}>
                <Text style={styles.tableCell}>{item.description}</Text>
              </View>
              <View style={[styles.tableCol, styles.tableColQuantity]}>
                <Text style={styles.tableCell}>{item.quantity}</Text>
              </View>
              <View style={[styles.tableCol, styles.tableColPrice]}>
                <Text style={styles.tableCell}>${item.unitPrice.toFixed(2)}</Text>
              </View>
              <View style={[styles.tableCol, styles.tableColTotal]}>
                <Text style={styles.tableCell}>${item.total.toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>${data.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax (10%):</Text>
            <Text style={styles.totalValue}>${data.tax.toFixed(2)}</Text>
          </View>
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>Total:</Text>
            <Text style={styles.grandTotalValue}>${data.total.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Notes */}
      {data.notes && (
        <View style={styles.notes}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text>{data.notes}</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Yellow Type Foundry • www.yellowtypefoundry.com • contact@yellowtypefoundry.com</Text>
      </View>
    </Page>
  </Document>
)
