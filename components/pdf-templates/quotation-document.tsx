"use client"
import { Document, Page, Text, View, StyleSheet, Font, Image, Svg, Path } from "@react-pdf/renderer"
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

// Register YTF Grand 123 Light
Font.register({
  family: "YTF Grand 123 Light",
  src: "/fonts/YTFGrand123-Light.ttf",
  fontWeight: "light"
})

// Value tokens
const COLORS = {
  bgPrimary: "#E8EADD",
  bgSecondary: "#F4F6E9",
  infoBlock: "#E8EADD",
  tableHeader: "#E8EADD",
  totalSection: "#F4F6E9",
  border: "#D6D3D1",
  outlinePrimary: "#CCD0B3",
  contentSecondary: "#7E7E4E",
  contentPrimary: "#000000",
};
const SPACING = {
  pagePadding: 0,
  horizontal: 4,
  vertical: 4,
  gap: 4,
  borderRadius: 4,
};

// Define footnote style for reuse
const footnoteStyle = {
  fontFamily: 'YTF Vang Mono',
  fontSize: 5,
  lineHeight: 1,
  letterSpacing: -0.005, // -0.5% tracking
};

// Define body text styles for reuse
const bodyPrimaryStyle = {
  fontFamily: 'YTF Grand 123',
  fontSize: 8,
  lineHeight: 1.2, // 120%
  letterSpacing: 0.0025, // 0.25% tracking
};
const bodySecondaryStyle = {
  fontFamily: 'YTF Grand 123',
  fontSize: 6,
  lineHeight: 1.6, // 160%
  letterSpacing: 0.0025, // 0.25% tracking
};

// Define heading style for Oldman title
const headingStyle = {
  fontFamily: "YTF Oldman",
  fontSize: 62,
  fontWeight: "bold",
  textTransform: 'uppercase' as const,
  textAlign: 'center' as const,
  letterSpacing: -0.6,
  lineHeight: 1.0,
  margin: 0,
  padding: 0,
};

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: "YTF Grand 123",
    backgroundColor: COLORS.bgPrimary,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.horizontal,
    paddingTop: SPACING.vertical,
    paddingBottom: SPACING.vertical,
  },
  headerText: {
    ...footnoteStyle,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: "YTF Oldman",
    fontSize: 62,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    borderTopWidth: 0.3,
    borderBottomWidth: 0.3,
    borderColor: COLORS.outlinePrimary,
    paddingVertical: SPACING.vertical,
    letterSpacing: -0.6,
    lineHeight: 1,
    margin: 0,
    padding: 0,
  },
  infoBlock: {
    flexDirection: "row",
    gap: SPACING.gap,
    paddingHorizontal: SPACING.horizontal,
    paddingVertical: SPACING.vertical,
    backgroundColor: COLORS.infoBlock,
    marginBottom: 0,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    ...footnoteStyle,
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
    marginBottom: 0,
  },
  row: {
    flexDirection: "row",
    marginBottom: 0,
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
    marginHorizontal: 0,
    marginBottom: 0,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 0.3,
    borderBottomColor: COLORS.outlinePrimary,
    paddingBottom: 4,
    marginBottom: 0,
    backgroundColor: COLORS.tableHeader,
  },
  tableRow: {
    flexDirection: "row",
    minHeight: 24,
    alignItems: "center",
    borderBottomWidth: 0.3,
    borderBottomColor: COLORS.outlinePrimary,
    marginBottom: 0,
  },
  tableCell: {
    fontSize: 10,
    paddingVertical: 4,
    paddingHorizontal: 2,
    flexWrap: "wrap",
    fontFamily: "YTF Grand 123",
  },
  totalSection: {
    backgroundColor: COLORS.bgSecondary,
    marginHorizontal: SPACING.horizontal,
    marginTop: SPACING.vertical,
    marginBottom: 0,
    padding: SPACING.vertical,
    borderRadius: SPACING.borderRadius,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
  },
  totalLabel: {
    ...footnoteStyle,
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
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
    gap: 4,
    marginBottom: 0,
  },
  notesLabel: {
    ...footnoteStyle,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 0,
  },
  notesText: {
    ...bodySecondaryStyle,
    textAlign: 'center',
    maxWidth: '70%',
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingBottom: 4,
    marginBottom: 0,
  },
  footerText: {
    ...footnoteStyle,
    textTransform: 'uppercase',
  },
  footnote: footnoteStyle,
  bodyPrimary: bodyPrimaryStyle,
  bodySecondary: bodySecondaryStyle,
  heading: headingStyle,
})

interface QuotationDocumentProps {
  data: QuotationData
}

// Reusable components
const LicenseInfo = ({ licensee, quotationDate, validityDate, billingAddress, businessSize }: {
  licensee: { name: string; email: string; address?: string },
  quotationDate: string,
  validityDate: string,
  billingAddress?: string,
  businessSize?: { name: string; description: string }
}) => (
  <View style={{ flexDirection: 'row', width: 595, height: 210, margin: '0 auto' }}>
    {/* License Provider Container */}
    <View style={{ width: 297.5, flexDirection: 'column' }}>
      {/* License Provider Info */}
      <View style={{ height: 64, padding: 8, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', overflow: 'hidden', gap: 8 }}>
        <Text style={[styles.footnote, { color: COLORS.contentSecondary }]}>LICENSE PROVIDER</Text>
        <Text style={[styles.bodySecondary, { color: COLORS.contentPrimary }]}>Yellow Type Foundry Company Ltd.{"\n"}No.6, Lane 36, Nguyen Hong Street{"\n"}Lang Ha Ward, Dong Da District, Hanoi, Vietnam{"\n"}Tax ID 0109884491</Text>
      </View>
      {/* Quotation Date Info */}
      <View style={{ height: 64, padding: 8, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', overflow: 'hidden', gap: 8 }}>
        <Text style={[styles.footnote, { color: COLORS.contentSecondary }]}>QUOTATION DATE</Text>
        <Text style={[styles.bodySecondary, { color: COLORS.contentPrimary }]}>{`${quotationDate}. ${validityDate}`}</Text>
      </View>
    </View>
    {/* Licensee Info Container */}
    <View style={{ width: 297.5, flexDirection: 'column' }}>
      {/* Licensee Info */}
      <View style={{ height: 64, padding: 8, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', overflow: 'hidden', gap: 8 }}>
        <Text style={[styles.footnote, { color: COLORS.contentSecondary, textAlign: 'right' }]}>LICENSEE / END USER</Text>
        <Text style={[styles.bodySecondary, { color: COLORS.contentPrimary, textAlign: 'right' }]}>
          {(licensee.name || "") + (licensee.email ? "\n" + licensee.email : "")}
          {businessSize && businessSize.name && businessSize.description && (
            "\n" + `${businessSize.name.split(" ")[0]}—Business (${businessSize.description.replace(/.*(fewer than|more than) ([0-9>]+) employees.*/i, (m, type, count) => type === 'fewer than' ? `No more than ${count} employees` : `More than ${count} employees`)})`
          )}
        </Text>
      </View>
      {/* Billing Address Info */}
      <View style={{ height: 64, padding: 8, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', overflow: 'hidden', gap: 8 }}>
        <Text style={[styles.footnote, { color: COLORS.contentSecondary, textAlign: 'right' }]}>BILLING ADDRESS</Text>
        <Text style={[styles.bodySecondary, { color: COLORS.contentPrimary, textAlign: 'right' }]}>{billingAddress || 'N/A'}</Text>
      </View>
    </View>
  </View>
)

const SectionRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
)

// Logo component for PDF
const LogoComponent = () => (
  <View style={{ height: 32, padding: 8, alignItems: 'center', justifyContent: 'center' }}>
    <Svg width="29" height="16" viewBox="0 0 29 17">
      <Path d="M8.45437 11.6261H10.8617L9.33844 8.26746L7.96474 -0.203903H5.92459L6.97187 4.99041L3.39481 -0.203903H0.756226L6.91747 8.18587L8.45437 11.6261ZM11.8954 16.4261H14.3436V11.6261H17.0638V9.65442H14.3436V6.58134H17.2814V4.59608H11.8954V16.4261ZM21.6745 -0.203903L20.7497 1.79496H22.7898L18.2335 11.6261H20.7225L25.2924 1.79496H27.3325L28.2438 -0.203903H21.6745Z" fill="black" />
    </Svg>
  </View>
)

// PageTitle component
const PageTitle = ({ children }: { children: React.ReactNode }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: -1, borderBottomWidth: 0.3, borderColor: COLORS.outlinePrimary, paddingBottom: 0 }}>
    <Text style={{ ...styles.heading, transform: 'translateY(-8px)' }}>{children}</Text>
  </View>
)

// PageInfoTop component
const PageInfoTop = ({ quotationNumber, formattedDate }: { quotationNumber: string; formattedDate: string }) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 0.3,
    borderBottomWidth: 0.3,
    borderColor: COLORS.outlinePrimary,
  }}>
    <Text style={[styles.footnote, { textTransform: 'uppercase', width: 150 }]}>Yellow Type Foundry</Text>
    <Text style={[styles.footnote, { textTransform: 'uppercase', flex: 1, textAlign: 'center' }]}>{`Quotation No. ${quotationNumber}`}</Text>
    <Text style={[styles.footnote, { textTransform: 'uppercase', width: 150, textAlign: 'right' }]}>{`Issued on ${formattedDate}`}</Text>
  </View>
)

// PageInfoBottom component
const PageInfoBottom = () => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 0.3,
    borderBottomWidth: 0.3,
    borderColor: COLORS.outlinePrimary,
  }}>
    <Text style={[styles.footnote, { textTransform: 'uppercase', width: 150 }]}>©2025 YELLOW TYPE FOUNDRY</Text>
    <Text style={[styles.footnote, { textTransform: 'uppercase', flex: 1, textAlign: 'center' }]}>YELLOWTYPE.COM</Text>
    <Text style={[styles.footnote, { textTransform: 'uppercase', width: 150, textAlign: 'right' }]}>STRICTLY CONFIDENTIAL</Text>
  </View>
)

// QuotationTableHeader component
const QuotationTableHeader = () => (
  <View style={{
    flexDirection: 'row',
    borderTopWidth: 0.3,
    borderBottomWidth: 0.3,
    borderColor: COLORS.outlinePrimary,
    marginBottom: 0,
    backgroundColor: COLORS.tableHeader,
  }}>
    <Text style={[styles.footnote, { width: '7%', textTransform: 'uppercase', paddingHorizontal: 8, paddingVertical: 8 }]}>No</Text>
    <Text style={[styles.footnote, { width: '18%', textTransform: 'uppercase', paddingHorizontal: 8, paddingVertical: 8 }]}>Typeface</Text>
    <Text style={[styles.footnote, { width: '18%', textTransform: 'uppercase', paddingHorizontal: 8, paddingVertical: 8 }]}>License Type</Text>
    <Text style={[styles.footnote, { width: '13%', textTransform: 'uppercase', paddingHorizontal: 8, paddingVertical: 8, textAlign: 'center' }]}>Duration</Text>
    <Text style={[styles.footnote, { width: '15%', textTransform: 'uppercase', paddingHorizontal: 8, paddingVertical: 8, textAlign: 'right' }]}>Languages/Cuts</Text>
    <Text style={[styles.footnote, { width: '15%', textTransform: 'uppercase', paddingHorizontal: 8, paddingVertical: 8, textAlign: 'right' }]}>File Format</Text>
    <Text style={[styles.footnote, { width: '14%', textAlign: 'right', textTransform: 'uppercase', paddingHorizontal: 8, paddingVertical: 8 }]}>Amount</Text>
  </View>
)

// QuotationRowContainer component
const QuotationRowContainer = ({ index, item }: { index: number, item: QuotationItem }) => {
  // File format logic
  let fileFormats = String(item.fileFormats || "");
  const displayFormat = fileFormats.includes('woff') && fileFormats.includes('woff2') 
    ? "OTF, TTF, WOFF, WOFF2"
    : "OTF, TTF";

  // Duration logic
  const duration = item.duration && item.duration.trim() ? item.duration : 'Perpetual';
  return (
    <View style={styles.tableRow}>
      <Text style={[styles.footnote, { width: '7%', paddingHorizontal: 8, paddingVertical: 8 }]}>{`0${index + 1}.`}</Text>
      <Text style={[styles.bodyPrimary, { width: '18%', paddingHorizontal: 8, paddingVertical: 8 }]}>{item.typeface}</Text>
      <Text style={[styles.bodyPrimary, { width: '18%', paddingHorizontal: 8, paddingVertical: 8 }]}>{item.licenseType}</Text>
      <Text style={[styles.bodyPrimary, { width: '13%', paddingHorizontal: 8, paddingVertical: 8, textAlign: 'center' }]}>{duration}</Text>
      <Text style={[styles.bodyPrimary, { width: '15%', paddingHorizontal: 8, paddingVertical: 8, textAlign: 'right' }]}>{item.languageCut}</Text>
      <Text style={[styles.bodyPrimary, { width: '15%', paddingHorizontal: 8, paddingVertical: 8, textAlign: 'right' }]}>{displayFormat}</Text>
      <Text style={[styles.bodyPrimary, { width: '14%', textAlign: 'right', paddingHorizontal: 8, paddingVertical: 8 }]}>${item.amount.toFixed(2)}</Text>
    </View>
  );
}

// VATSummaryRow component
const VATSummaryRow = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 24 }}>
    <Text style={[styles.footnote, { flex: 1, paddingHorizontal: 8, paddingVertical: 4, textTransform: 'uppercase' }]}>Vietnam Value Added Tax (Deducted)</Text>
    <Text style={[styles.bodyPrimary, { flex: 1, textAlign: 'right', paddingHorizontal: 8, paddingVertical: 4 }]}>$0</Text>
  </View>
)

// TotalSummaryRow component
const TotalSummaryRow = ({ total }: { total: number }) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 24,
  }}>
    <Text style={[styles.footnote, { flex: 1, paddingHorizontal: 8, paddingVertical: 4 }]}>SUBTOTAL</Text>
    <Text style={[styles.bodyPrimary, { flex: 1, textAlign: 'right', paddingHorizontal: 8, paddingVertical: 4 }]}>{`$${total.toFixed(2)}`}</Text>
  </View>
)

// TotalRow component
const TotalRow = ({ total }: { total: number }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 28, backgroundColor: COLORS.bgSecondary }}>
    <Text style={{
      flex: 1,
      fontFamily: 'YTF Grand 123 Light',
      fontWeight: 'light',
      fontSize: 20,
      lineHeight: 1,
      letterSpacing: -0.01,
      textAlign: 'left',
      paddingHorizontal: 8,
      paddingTop: 6,
      paddingBottom: 10,
    }}>Total (USD)</Text>
    <Text style={{
      flex: 1,
      fontFamily: 'YTF Grand 123 Light',
      fontWeight: 'light',
      fontSize: 20,
      lineHeight: 1,
      letterSpacing: -0.01,
      textAlign: 'right',
      paddingHorizontal: 8,
      paddingTop: 6,
      paddingBottom: 10,
    }}>{`$${total.toFixed(2)}`}</Text>
  </View>
)

// ExtensionsRow component
const ExtensionsRow = ({ included = '', excluded = '' }: { included?: string; excluded?: string }) => (
  <View style={{ flex: 1, flexDirection: 'row', minHeight: 32, borderBottomWidth: 0.3, borderColor: COLORS.outlinePrimary, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
    {/* Included cell */}
    <View style={{ flex: 1, padding: 8 }}>
      <Text style={[styles.footnote, { textAlign: 'left', textTransform: 'uppercase', color: COLORS.contentSecondary }]}>EXTENSIONS — INCLUDED</Text>
      {included ? (
        <Text style={[styles.bodySecondary, { textAlign: 'left', marginTop: 2 }]}>{included}</Text>
      ) : null}
    </View>
    {/* Excluded cell */}
    <View style={{ flex: 1, padding: 8 }}>
      <Text style={[styles.footnote, { textAlign: 'right', textTransform: 'uppercase', color: COLORS.contentSecondary }]}>EXTENSIONS — EXCLUDED</Text>
      {excluded ? (
        <Text style={[styles.bodySecondary, { textAlign: 'right', marginTop: 2 }]}>{excluded}</Text>
      ) : null}
    </View>
  </View>
)

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
      <Page size="A4" style={{ ...styles.page, flexDirection: 'column', flex: 1 }}>
        {/* Logo at the top */}
        <LogoComponent />
        {/* Header Row */}
        <PageInfoTop quotationNumber={safeData.quotationNumber} formattedDate={formattedDate} />
        {/* Title */}
        <PageTitle>
          <Text style={styles.heading}>Typeface Licensing Quotation</Text>
        </PageTitle>
        {/* Info Blocks */}
        <LicenseInfo
          licensee={{ name: safeData.clientName, email: safeData.clientEmail, address: safeData.clientAddress }}
          quotationDate={formattedDate}
          validityDate={`Valid until ${new Date(new Date(safeData.quotationDate).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
          billingAddress={safeData.clientAddress}
          businessSize={safeData.businessSize}
        />

        {/* Table Section */}
        <View style={styles.table}>
          <QuotationTableHeader />
          {safeData.items.map((item, index) => {
            return <QuotationRowContainer key={index} index={index} item={item} />;
          })}
          <VATSummaryRow />
          <TotalSummaryRow total={safeData.subtotal} />
          <TotalRow total={safeData.total} />
        </View>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <ExtensionsRow included={data?.extensionsIncluded || ''} excluded={data?.extensionsExcluded || ''} />
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>
              {`All offers and license agreements from Yellow Type Foundry are governed exclusively by Yellow Type Foundry's General Terms and Conditions (EULA), with any conflicting terms from the licensees' general conditions expressly excluded.`}
            </Text>
          </View>
        </View>
        <PageInfoBottom />
      </Page>
    </Document>
  )
}
