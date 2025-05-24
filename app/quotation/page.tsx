"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Loader2, AlertCircle, Download, Info } from "lucide-react"
import { generateQuotationPDF } from "@/utils/pdf-generator"
import dynamic from "next/dynamic"
import { CurrencyConverter } from "@/components/currency-converter"
import {
  ytfTypefaces,
  businessSizes,
  fileFormatOptions,
  durationOptions,
  getLanguageCutForVariant,
  calculateLicensePrice,
  getTypefaceByFamily,
  getDurationPricingExplanation,
} from "@/utils/typeface-data"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const PDFPreview = dynamic(() => import("@/components/pdf-preview"), { ssr: false })

// Add type definitions
interface FormItem {
  typefaceFamily: string
  typefaceVariant: string
  fileFormats: string[]
  typeface: string
  licenseType: string
  durationType: string
  durationYears: number
  languageCut: string
  basePrice: number
  amount: number
}

interface FormData {
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
  billingAddress: {
    streetNumber: string
    address1: string
    address2: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

// Update TouchedFields interface to use a type for item fields
type ItemTouchedFields = {
  [K in keyof FormItem]: boolean
}

type ItemErrors = {
  [K in keyof FormItem]: string
}

interface TouchedFields {
  clientName: boolean
  clientEmail: boolean
  businessSize: boolean
  items: ItemTouchedFields[]
}

interface Errors {
  clientName: string
  clientEmail: string
  businessSize: string
  items: ItemErrors[]
}

export default function QuotationPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Update the generateQuotationNumber function in the quotation page
  const generateQuotationNumber = () => {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, "0")
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const year = today.getFullYear()

    // Generate a sequential number (001-999)
    // In a real app, this would come from a database
    const sequentialNumber = String(Math.floor(1 + Math.random() * 999)).padStart(3, "0")

    return `${day}${month}${year}${sequentialNumber}`
  }

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    quotationNumber: generateQuotationNumber(),
    quotationDate: new Date().toISOString().split("T")[0],
    businessSize: "individual", // Default to individual
    nonProfitDiscount: false, // Non-profit discount (30%)
    customDiscountPercent: 0, // Custom discount percentage
    items: [
      {
        typefaceFamily: "YTF Gióng", // Set default typeface family
        typefaceVariant: "Roman", // Set default variant
        typeface: "YTF Gióng Roman", // Set default full typeface name
        licenseType: "Individual License (No commercial use)",
        durationType: "perpetual", // "perpetual" or "custom"
        durationYears: 1, // Number of years for custom duration
        languageCut: "Latin, Roman", // Set to match style
        fileFormats: ["otf_ttf"], // Set default to OTF, TTF
        basePrice: 100.0, // Set base price for YTF Gióng
        amount: calculateLicensePrice(
          100.0,
          "individual",
          ["otf_ttf"],
          "perpetual",
          1,
          false,
          0
        ) || 0, // Set initial amount using helper
      },
    ],
    subtotal: calculateLicensePrice(
      100.0,
      "individual",
      ["otf_ttf"],
      "perpetual",
      1,
      false,
      0
    ) || 0, // Set initial subtotal from calculated amount
    tax: 0, // Vietnam value added tax (deducted)
    total: calculateLicensePrice(
      100.0,
      "individual",
      ["otf_ttf"],
      "perpetual",
      1,
      false,
      0
    ) || 0, // Set initial total from calculated amount
    billingAddress: {
      streetNumber: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  })

  // Track touched fields for validation
  const defaultTouchedItem = {
    typefaceFamily: false,
    typefaceVariant: false,
    fileFormats: false,
    typeface: false,
    licenseType: false,
    durationType: false,
    durationYears: false,
    languageCut: false,
    basePrice: false,
    amount: false,
  }
  const defaultErrorItem = {
    typefaceFamily: "",
    typefaceVariant: "",
    fileFormats: "",
    typeface: "",
    licenseType: "",
    durationType: "",
    durationYears: "",
    languageCut: "",
    basePrice: "",
    amount: "",
  }
  const [touchedFields, setTouchedFields] = useState({
    clientName: false,
    clientEmail: false,
    businessSize: false,
    items: [ { ...defaultTouchedItem } ],
  })
  const [errors, setErrors] = useState({
    clientName: "",
    clientEmail: "",
    businessSize: "",
    items: [ { ...defaultErrorItem } ],
  })

  // Track available variants for each item
  const [availableVariants, setAvailableVariants] = useState([["Roman", "Italic"]]) // Set default variants for YTF Gióng

  // Enable client-side rendering detection
  useEffect(() => {
    setIsClient(true)
  }, [])

  // On mount, recalculate all item amounts, subtotal, and total to ensure default values are reflected
  useEffect(() => {
    setFormData((prev) => {
      const updatedItems = prev.items.map((item) => {
        const amount = calculateLicensePrice(
          item.basePrice,
          prev.businessSize,
          item.fileFormats,
          item.durationType,
          item.durationYears,
          prev.nonProfitDiscount,
          prev.customDiscountPercent
        ) || 0;
        return { ...item, amount };
      });
      const subtotal = updatedItems.reduce((sum, item) => sum + (Number.parseFloat(String(item.amount)) || 0), 0);
      const total = subtotal;
      return { ...prev, items: updatedItems, subtotal, total };
    });
  }, []);

  // Update license type based on business size
  useEffect(() => {
    const selectedBusinessSize = businessSizes.find((size) => size.id === formData.businessSize)
    if (!selectedBusinessSize) return

    // Update license type for all items
    const licenseType =
      selectedBusinessSize.id === "individual"
        ? "Individual License (No commercial use)"
        : `${selectedBusinessSize.name} License (${selectedBusinessSize.employeeCount} employees)`

    // Update all items with the new license type and recalculate prices
    const updatedItems = formData.items.map((item) => {
      const basePrice = item.basePrice || 0
      const amount =
        calculateLicensePrice(
          basePrice,
          formData.businessSize,
          item.fileFormats,
          item.durationType,
          item.durationYears,
          formData.nonProfitDiscount,
          formData.customDiscountPercent,
        ) || 0
      return {
        ...item,
        licenseType,
        amount,
      }
    })

    // Calculate new totals
    const subtotal = updatedItems.reduce((sum, item) => sum + (Number.parseFloat(String(item.amount)) || 0), 0)
    const total = subtotal // No tax applied as per template (tax deducted)

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      subtotal,
      total,
    }))
  }, [formData.businessSize, formData.nonProfitDiscount, formData.customDiscountPercent])

  // Recalculate prices when discounts change
  useEffect(() => {
    // Update all items with the new discounts and recalculate prices
    const updatedItems = formData.items.map((item) => {
      const basePrice = item.basePrice || 0
      const amount =
        calculateLicensePrice(
          basePrice,
          formData.businessSize,
          item.fileFormats,
          item.durationType,
          item.durationYears,
          formData.nonProfitDiscount,
          formData.customDiscountPercent,
        ) || 0
      return {
        ...item,
        amount,
      }
    })

    // Calculate new totals
    const subtotal = updatedItems.reduce((sum, item) => sum + (Number.parseFloat(String(item.amount)) || 0), 0)
    const total = subtotal // No tax applied as per template (tax deducted)

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      subtotal,
      total,
    }))
  }, [formData.nonProfitDiscount, formData.customDiscountPercent])

  // Update validateField with proper types
  const validateField = (name: keyof FormData, value: string): string => {
    switch (name) {
      case "clientName":
        return value.trim() === "" ? "Client name is required" : ""
      case "clientEmail":
        if (value.trim() === "") return "Email is required"
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return !emailRegex.test(value) ? "Please enter a valid email address" : ""
      case "businessSize":
        return value.trim() === "" ? "Business size is required" : ""
      default:
        return ""
    }
  }

  // Update validateItemField with proper types
  const validateItemField = (index: number, field: keyof FormItem, value: string | string[]): string => {
    if (field === "typefaceFamily" && typeof value === "string" && value.trim() === "") {
      return "Typeface family is required"
    }
    if (field === "typefaceVariant" && typeof value === "string" && value.trim() === "") {
      return "Typeface variant is required"
    }
    if (field === "fileFormats" && Array.isArray(value) && value.length === 0) {
      return "At least one file format is required"
    }
    return ""
  }

  // Update handleInputChange with proper types
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name.startsWith("billingAddress.")) {
      const field = name.replace("billingAddress.", "")
      setFormData((prev) => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [field]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // If the field has been touched, validate it (for global fields only)
    if (name === "clientName" || name === "clientEmail" || name === "businessSize") {
      if (touchedFields[name as keyof TouchedFields]) {
        setErrors((prev) => ({
          ...prev,
          [name]: validateField(name as keyof FormData, value),
        }))
      }
    }
  }

  // Update handleCustomDiscountChange with proper types
  const handleCustomDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0
    // Limit discount to 0-100%
    const limitedValue = Math.min(Math.max(value, 0), 100)
    setFormData((prev) => ({ ...prev, customDiscountPercent: limitedValue }))
  }

  // Update handleNonProfitDiscountChange with proper types
  const handleNonProfitDiscountChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, nonProfitDiscount: checked }))
  }

  // Update handleBusinessSizeChange with proper types
  const handleBusinessSizeChange = (value: string) => {
    setFormData((prev) => {
      // If the new business size does not allow custom duration, reset durationType and durationYears
      const allowCustom = ["xl", "custom"].includes(value);
      const updatedItems = prev.items.map(item => {
        if (!allowCustom && item.durationType === "custom") {
          return { ...item, durationType: "perpetual", durationYears: 1 };
        }
        return item;
      });
      return { ...prev, businessSize: value, items: updatedItems };
    });
    if (touchedFields.businessSize) {
      setErrors((prev) => ({
        ...prev,
        businessSize: validateField("businessSize", value),
      }));
    }
  }

  // Update handleBlur with proper types
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === "clientName" || name === "clientEmail" || name === "businessSize") {
      setTouchedFields((prev) => ({
        ...prev,
        [name]: true,
      }))
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name as keyof FormData, value),
      }))
    }
  }

  // Handle business size blur
  const handleBusinessSizeBlur = () => {
    setTouchedFields((prev) => ({
      ...prev,
      businessSize: true,
    }))
    setErrors((prev) => ({
      ...prev,
      businessSize: validateField("businessSize", formData.businessSize),
    }))
  }

  // Update handleFileFormatChange with proper types
  const handleFileFormatChange = (index: number, formatId: string, checked: boolean) => {
    const newItems = [...formData.items]
    let newFileFormats = [...newItems[index].fileFormats]

    if (checked) {
      // Add the format if it's not already in the array
      if (!newFileFormats.includes(formatId)) {
        newFileFormats.push(formatId)
      }
    } else {
      // Remove the format if it's in the array
      newFileFormats = newFileFormats.filter((format) => format !== formatId)
    }

    // Update the item with the new file formats
    newItems[index] = {
      ...newItems[index],
      fileFormats: newFileFormats,
    }

    // Recalculate the price based on the new file formats
    if (newItems[index].basePrice > 0) {
      newItems[index].amount =
        calculateLicensePrice(
          newItems[index].basePrice,
          formData.businessSize,
          newFileFormats,
          newItems[index].durationType,
          newItems[index].durationYears,
          formData.nonProfitDiscount,
          formData.customDiscountPercent,
        ) || 0
    }

    // Calculate subtotal and total
    const subtotal = newItems.reduce((sum, item) => sum + (Number.parseFloat(String(item.amount)) || 0), 0)
    const total = subtotal // No tax applied as per template (tax deducted)

    setFormData((prev) => ({
      ...prev,
      items: newItems,
      subtotal,
      total,
    }))

    // Validate file formats if they've been touched
    const newTouchedItems = [...touchedFields.items]
    if (newTouchedItems[index] && newTouchedItems[index].fileFormats) {
      const newItemErrors = [...errors.items]
      newItemErrors[index] = {
        ...newItemErrors[index],
        fileFormats: validateItemField(index, "fileFormats", newFileFormats),
      }

      setErrors((prev) => ({
        ...prev,
        items: newItemErrors,
      }))
    }
  }

  // Update handleDurationTypeChange with proper types
  const handleDurationTypeChange = (index: number, value: string) => {
    const newItems = [...formData.items]

    // Update the duration type
    newItems[index] = {
      ...newItems[index],
      durationType: value,
    }

    // Recalculate the price based on the new duration type
    if (newItems[index].basePrice > 0) {
      newItems[index].amount =
        calculateLicensePrice(
          newItems[index].basePrice,
          formData.businessSize,
          newItems[index].fileFormats,
          value,
          newItems[index].durationYears,
          formData.nonProfitDiscount,
          formData.customDiscountPercent,
        ) || 0
    }

    // Calculate subtotal and total
    const subtotal = newItems.reduce((sum, item) => sum + (Number.parseFloat(String(item.amount)) || 0), 0)
    const total = subtotal // No tax applied as per template (tax deducted)

    setFormData((prev) => ({
      ...prev,
      items: newItems,
      subtotal,
      total,
    }))
  }

  // Update handleDurationYearsChange with proper types
  const handleDurationYearsChange = (index: number, value: string) => {
    const years = Number.parseInt(value) || 1
    // Ensure years is at least 1
    const limitedYears = Math.max(years, 1)

    const newItems = [...formData.items]

    // Update the duration years
    newItems[index] = {
      ...newItems[index],
      durationYears: limitedYears,
    }

    // Recalculate the price based on the new duration years
    if (newItems[index].basePrice > 0) {
      newItems[index].amount =
        calculateLicensePrice(
          newItems[index].basePrice,
          formData.businessSize,
          newItems[index].fileFormats,
          newItems[index].durationType,
          limitedYears,
          formData.nonProfitDiscount,
          formData.customDiscountPercent,
        ) || 0
    }

    // Calculate subtotal and total
    const subtotal = newItems.reduce((sum, item) => sum + (Number.parseFloat(String(item.amount)) || 0), 0)
    const total = subtotal // No tax applied as per template (tax deducted)

    setFormData((prev) => ({
      ...prev,
      items: newItems,
      subtotal,
      total,
    }))
  }

  // Update handleItemChange to handle number type correctly
  const handleItemChange = (index: number, field: keyof FormItem, value: string | number | string[]) => {
    const newItems = [...formData.items]
    const newAvailableVariants = [...availableVariants]
    const newTouchedItems = [...touchedFields.items]
    const newItemErrors = [...errors.items]

    if (field === "typefaceFamily") {
      const selectedTypeface = getTypefaceByFamily(value as string)
      if (selectedTypeface) {
        newAvailableVariants[index] = selectedTypeface.variants
        if (selectedTypeface.variants.length > 0) {
          newItems[index] = {
            ...newItems[index],
            typefaceVariant: selectedTypeface.variants[0],
            languageCut: `Latin, ${selectedTypeface.variants[0]}`,
            basePrice: selectedTypeface.basePrice,
            typeface: `${value} ${selectedTypeface.variants[0]}`,
            amount: calculateLicensePrice(
              selectedTypeface.basePrice,
              formData.businessSize,
              newItems[index].fileFormats,
              newItems[index].durationType,
              newItems[index].durationYears,
              formData.nonProfitDiscount,
              formData.customDiscountPercent,
            ) || 0,
          }
        }
      }
    }

    if (field === "typefaceVariant") {
      newItems[index] = {
        ...newItems[index],
        languageCut: `Latin, ${value}`,
        typeface: `${newItems[index].typefaceFamily} ${value}`,
      }
    }

    // Handle amount change directly
    if (field === "amount") {
      newItems[index] = {
        ...newItems[index],
        amount: Number(value) || 0,
      }
    } else {
      // Update the field value
      newItems[index] = {
        ...newItems[index],
        [field]: value,
      }
    }

    // Calculate subtotal and total
    const subtotal = newItems.reduce((sum, item) => sum + (Number.parseFloat(String(item.amount)) || 0), 0)
    const total = subtotal // No tax applied as per template (tax deducted)

    setFormData((prev) => ({
      ...prev,
      items: newItems,
      subtotal,
      total,
    }))

    setAvailableVariants(newAvailableVariants)

    // Validate the item field if it's been touched
    if (
      touchedFields.items[index] &&
      (field === "typefaceFamily" || field === "typefaceVariant" || field === "fileFormats")
    ) {
      newItemErrors[index] = {
        ...newItemErrors[index],
        [field]: validateItemField(index, field, value as string | string[]),
      }

      setErrors((prev) => ({
        ...prev,
        items: newItemErrors,
      }))
    }
  }

  // Update handleSelectChange with proper types
  const handleSelectChange = (index: number, field: keyof FormItem, value: string) => {
    handleItemChange(index, field, value)
  }

  // Update handleItemBlur to use proper type assertions
  const handleItemBlur = (index: number, field: keyof FormItem, value: string | string[] | number) => {
    const newTouchedItems = [...touchedFields.items]
    if (!newTouchedItems[index]) {
      newTouchedItems[index] = {
        typefaceFamily: false,
        typefaceVariant: false,
        fileFormats: false,
        typeface: false,
        licenseType: false,
        durationType: false,
        durationYears: false,
        languageCut: false,
        basePrice: false,
        amount: false,
      } as ItemTouchedFields
    }
    newTouchedItems[index][field] = true

    setTouchedFields((prev) => ({
      ...prev,
      items: newTouchedItems,
    }))

    const newItemErrors = [...errors.items]
    if (!newItemErrors[index]) {
      newItemErrors[index] = {
        typefaceFamily: "",
        typefaceVariant: "",
        fileFormats: "",
        typeface: "",
        licenseType: "",
        durationType: "",
        durationYears: "",
        languageCut: "",
        basePrice: "",
        amount: "",
      } as ItemErrors
    }
    newItemErrors[index][field] = validateItemField(index, field, value as string | string[])

    setErrors((prev) => ({
      ...prev,
      items: newItemErrors,
    }))
  }

  const addItem = () => {
    const defaultTypeface = getTypefaceByFamily("YTF Gióng")
    const defaultVariant = defaultTypeface?.variants[0] || "Roman"
    const basePrice = defaultTypeface?.basePrice || 100.0
    const fileFormats = ["otf_ttf"]
    const durationType = "perpetual"
    const durationYears = 1

    const amount = calculateLicensePrice(
      basePrice,
      formData.businessSize,
      fileFormats,
      durationType,
      durationYears,
      formData.nonProfitDiscount,
      formData.customDiscountPercent
    ) || 0

    // Build the new items array
    const newItems = [
      ...formData.items,
      {
        typefaceFamily: "YTF Gióng",
        typefaceVariant: defaultVariant,
        typeface: `YTF Gióng ${defaultVariant}`,
        languageCut: `Latin, ${defaultVariant}`,
        fileFormats,
        basePrice,
        amount,
        licenseType: businessSizes.find((size) => size.id === formData.businessSize)?.name || "Individual License",
        durationType,
        durationYears,
      },
    ];

    // Calculate new subtotal and total
    const subtotal = newItems.reduce((sum, item) => sum + (Number.parseFloat(String(item.amount)) || 0), 0);
    const total = subtotal;

    setFormData((prev) => ({
      ...prev,
      items: newItems,
      subtotal,
      total,
    }));
    setAvailableVariants((prev) => [...prev, defaultTypeface?.variants || ["Roman", "Italic"]]);
    setTouchedFields((prev) => ({
      ...prev,
      items: [...prev.items, { ...defaultTouchedItem }],
    }));
    setErrors((prev) => ({
      ...prev,
      items: [...prev.items, { ...defaultErrorItem }],
    }));
  }

  // Update removeItem with proper types
  const removeItem = (index: number) => {
    if (formData.items.length === 1) return

    const newItems = formData.items.filter((_, i) => i !== index)
    const newAvailableVariants = availableVariants.filter((_, i) => i !== index)
    const newTouchedItems = touchedFields.items.filter((_, i) => i !== index)
    const newItemErrors = errors.items.filter((_, i) => i !== index)

    // Recalculate totals
    const subtotal = newItems.reduce((sum, item) => sum + (Number.parseFloat(String(item.amount)) || 0), 0)
    const total = subtotal // No tax applied as per template

    setFormData((prev) => ({
      ...prev,
      items: newItems,
      subtotal,
      total,
    }))

    setAvailableVariants(newAvailableVariants)

    setTouchedFields((prev) => ({
      ...prev,
      items: newTouchedItems,
    }))

    setErrors((prev) => ({
      ...prev,
      items: newItemErrors,
    }))
  }

  // Validate all fields before submission
  const validateForm = () => {
    const newErrors = {
      clientName: validateField("clientName", formData.clientName),
      clientEmail: validateField("clientEmail", formData.clientEmail),
      businessSize: validateField("businessSize", formData.businessSize),
      items: formData.items.map((item, index) => ({
        typefaceFamily: validateItemField(index, "typefaceFamily", item.typefaceFamily),
        typefaceVariant: validateItemField(index, "typefaceVariant", item.typefaceVariant),
        fileFormats: validateItemField(index, "fileFormats", item.fileFormats),
        typeface: "",
        licenseType: "",
        durationType: "",
        durationYears: "",
        languageCut: "",
        basePrice: "",
        amount: "",
      })),
    }
    setErrors(newErrors)
    setTouchedFields({
      clientName: true,
      clientEmail: true,
      businessSize: true,
      items: formData.items.map(() => ({ ...defaultTouchedItem })),
    })
    return (
      !newErrors.clientName &&
      !newErrors.clientEmail &&
      !newErrors.businessSize &&
      !newErrors.items.some((item) => item.typefaceFamily || item.typefaceVariant || item.fileFormats)
    )
  }

  const isFormValid = () => {
    return (
      formData.clientName &&
      formData.clientEmail &&
      formData.businessSize &&
      formData.items.some((item) => item.typefaceFamily && item.typefaceVariant && item.fileFormats.length > 0)
    )
  }

  // Generate PDF using jsPDF with custom fonts and layout
  const generatePDF = async () => {
    if (!isFormValid() || !validateForm()) {
      return
    }

    setIsGenerating(true)
    let blobUrl: string | null = null
    let link: HTMLAnchorElement | null = null

    try {
      console.log("Starting PDF generation...")
      
      // Generate PDF blob with retry logic
      let blob: Blob | null = null
      let retryCount = 0
      const maxRetries = 3

      while (!blob && retryCount < maxRetries) {
        try {
          blob = await generateQuotationPDF(formData)
          console.log("PDF generated successfully")
        } catch (error) {
          console.error(`PDF generation attempt ${retryCount + 1} failed:`, error)
          retryCount++
          if (retryCount === maxRetries) {
            throw error
          }
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }

      if (!blob) {
        throw new Error("Failed to generate PDF blob after multiple attempts")
      }

      // Create URL for blob
      blobUrl = URL.createObjectURL(blob)
      console.log("Blob URL created successfully")

      // Create temporary link element
      link = document.createElement("a")
      link.href = blobUrl
      link.download = `YTF-Quotation-${formData.quotationNumber}.pdf`
      console.log("Download link created successfully")

      // Append link to document and trigger download
      document.body.appendChild(link)
      link.click()
      console.log("Download triggered successfully")
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert(`Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsGenerating(false)
      // Clean up
      if (link && link.parentNode) {
        link.parentNode.removeChild(link)
      }
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
      }
      console.log("Cleanup completed successfully")
    }
  }

  // Get the selected business size object
  const selectedBusinessSize = businessSizes.find((size) => size.id === formData.businessSize)

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Generate Quotation</h1>
        <p className="text-muted-foreground">Create a typeface licensing quotation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quotation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quotationNumber">Quotation Number</Label>
                  <Input
                    id="quotationNumber"
                    name="quotationNumber"
                    value={formData.quotationNumber}
                    onChange={handleInputChange}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quotationDate">Issue Date</Label>
                  <Input
                    id="quotationDate"
                    name="quotationDate"
                    type="date"
                    value={formData.quotationDate}
                    readOnly
                    disabled
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Label htmlFor="businessSize" className="flex items-center">
                  Business Size <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select
                  value={formData.businessSize}
                  onValueChange={handleBusinessSizeChange}
                  onOpenChange={handleBusinessSizeBlur}
                >
                  <SelectTrigger
                    id="businessSize"
                    className={errors.businessSize && touchedFields.businessSize ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select business size" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessSizes.map((size) => (
                      <SelectItem key={size.id} value={size.id}>
                        {size.name}
                        {size.multiplier ? ` (${size.multiplier}×)` : ""}
                        {size.description ? ` – ${size.description}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.businessSize && touchedFields.businessSize && (
                  <div className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.businessSize}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Licensee / End User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName" className="flex items-center">
                    Client Name <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="clientName"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Herb Lubalin"
                    className={errors.clientName && touchedFields.clientName ? "border-red-500" : ""}
                  />
                  {errors.clientName && touchedFields.clientName && (
                    <div className="text-red-500 text-sm flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.clientName}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail" className="flex items-center">
                    Email <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="clientEmail"
                    name="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="name@email.com"
                    className={errors.clientEmail && touchedFields.clientEmail ? "border-red-500" : ""}
                    autoComplete="email"
                  />
                  {errors.clientEmail && touchedFields.clientEmail && (
                    <div className="text-red-500 text-sm flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.clientEmail}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Billing Address</Label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <Input
                    name="billingAddress.country"
                    value={formData.billingAddress.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                  />
                  <Input
                    name="billingAddress.city"
                    value={formData.billingAddress.city}
                    onChange={handleInputChange}
                    placeholder="City"
                  />
                  <Input
                    name="billingAddress.state"
                    value={formData.billingAddress.state}
                    onChange={handleInputChange}
                    placeholder="State/Province/Region"
                  />
                  <Input
                    name="billingAddress.postalCode"
                    value={formData.billingAddress.postalCode}
                    onChange={handleInputChange}
                    placeholder="Postal/ZIP Code"
                  />
                </div>
                <Input
                  name="billingAddress.streetNumber"
                  value={formData.billingAddress.streetNumber}
                  onChange={handleInputChange}
                  placeholder="Street number"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle>Typefaces</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={addItem}
                  aria-label="Add typeface"
                  className="ml-2"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.items.map((item, index) => (
                <div key={index} className="p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Typeface #{index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={formData.items.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor={`item-${index}-family`} className="flex items-center">
                        Typeface <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Select
                        value={item.typefaceFamily}
                        onValueChange={(value) => handleSelectChange(index, "typefaceFamily", value)}
                        onOpenChange={() => {
                          if (!touchedFields.items[index]?.typefaceFamily) {
                            handleItemBlur(index, "typefaceFamily", item.typefaceFamily)
                          }
                        }}
                      >
                        <SelectTrigger
                          id={`item-${index}-family`}
                          className={
                            errors.items[index]?.typefaceFamily && touchedFields.items[index]?.typefaceFamily
                              ? "border-red-500"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Select typeface family" />
                        </SelectTrigger>
                        <SelectContent>
                          {ytfTypefaces.map((typeface) => (
                            <SelectItem key={typeface.family} value={typeface.family}>
                              {typeface.family}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.items[index]?.typefaceFamily && touchedFields.items[index]?.typefaceFamily && (
                        <div className="text-red-500 text-sm flex items-center mt-1">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.items[index]?.typefaceFamily}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`item-${index}-variant`} className="flex items-center">
                        Style <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Select
                        value={item.typefaceVariant}
                        onValueChange={(value) => handleSelectChange(index, "typefaceVariant", value)}
                        onOpenChange={() => {
                          if (!touchedFields.items[index]?.typefaceVariant) {
                            handleItemBlur(index, "typefaceVariant", item.typefaceVariant)
                          }
                        }}
                      >
                        <SelectTrigger id={`item-${index}-variant`} className={errors.items[index]?.typefaceVariant && touchedFields.items[index]?.typefaceVariant ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableVariants[index]?.map((variant) => (
                            <SelectItem key={variant} value={variant}>
                              {variant}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.items[index]?.typefaceVariant && touchedFields.items[index]?.typefaceVariant && (
                        <div className="text-red-500 text-sm flex items-center mt-1">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.items[index]?.typefaceVariant}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor={`item-${index}-license-type`}>License Type</Label>
                      <Input id={`item-${index}-license-type`} value={item.licenseType} readOnly disabled className="bg-[#B6B8AA]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`item-${index}-duration-type`}>Duration</Label>
                      <Select
                        value={item.durationType}
                        onValueChange={(value) => handleDurationTypeChange(index, value)}
                        disabled={!["xl", "custom"].includes(formData.businessSize)}
                      >
                        <SelectTrigger id={`item-${index}-duration-type`} className={!["xl", "custom"].includes(formData.businessSize) ? "bg-[#B6B8AA] border-transparent" : ""}>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {durationOptions.map((option) => {
                            // Only show custom duration for XL businesses and above
                            if (option.id === "custom" && !["xl", "custom"].includes(formData.businessSize)) {
                              return null;
                            }
                            return (
                              <SelectItem key={option.id} value={option.id}>
                                {option.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    {item.durationType === "custom" && (
                      <div className="space-y-2">
                        <Label htmlFor={`item-${index}-duration-years`}>Number of Years</Label>
                        <Input
                          id={`item-${index}-duration-years`}
                          type="number"
                          min="1"
                          value={item.durationYears}
                          onChange={(e) => handleDurationYearsChange(index, e.target.value)}
                          className="w-full"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor={`item-${index}-language-cut`}>Language/Cut</Label>
                      <Input id={`item-${index}-language-cut`} value={item.languageCut} readOnly disabled className="bg-[#B6B8AA]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center">
                      File Format <span className="text-red-500 ml-1">*</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Selecting both formats will double the price.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="space-y-2">
                      {fileFormatOptions.map((format) => (
                        <div key={format.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`item-${index}-format-${format.id}`}
                            checked={item.fileFormats.includes(format.id)}
                            onCheckedChange={(checked) => handleFileFormatChange(index, format.id, Boolean(checked))}
                            onBlur={() => handleItemBlur(index, "fileFormats", item.fileFormats)}
                          />
                          <Label
                            htmlFor={`item-${index}-format-${format.id}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {format.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.items[index]?.fileFormats && touchedFields.items[index]?.fileFormats && (
                      <div className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.items[index]?.fileFormats}
                      </div>
                    )}
                    {item.fileFormats.length > 1 && (
                      <div className="text-yellow-600 text-sm mt-1">Note: Price is doubled for both file formats.</div>
                    )}
                  </div>

                  {item.typefaceFamily && item.basePrice > 0 && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm">
                      <p>
                        <span className="font-medium">{item.typefaceFamily}</span> base price: $
                        {item.basePrice.toFixed(2)} per style
                      </p>
                      {selectedBusinessSize?.multiplier && (
                        <p className="mt-1">
                          {selectedBusinessSize.name} license multiplier: {selectedBusinessSize.multiplier}×
                        </p>
                      )}
                      {item.durationType === "custom" && (
                        <p className="mt-1">{getDurationPricingExplanation(item.durationType, item.durationYears)}</p>
                      )}
                      {item.fileFormats.length > 1 && <p className="mt-1">Multiple file formats: 2× (price doubled)</p>}
                      {formData.nonProfitDiscount && <p className="mt-1">Non-profit discount: 0.7× (30% off)</p>}
                      {formData.customDiscountPercent > 0 && (
                        <p className="mt-1">
                          Custom discount: {(1 - formData.customDiscountPercent / 100).toFixed(2)}× (
                          {formData.customDiscountPercent}% off)
                        </p>
                      )}
                      {!selectedBusinessSize?.contactRequired && (
                        <p className="mt-1 font-medium">Final price: ${item.amount.toFixed(2)} per style</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pricing Card */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Pricing Summary */}
              <div className="space-y-2 border-b pb-4">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal:</span>
                  <span>${formData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Vietnam Value Added Tax (Deducted):</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total (USD):</span>
                  <span>${formData.total.toFixed(2)}</span>
                </div>
                {formData.total > 0 && (
                  <div className="flex justify-end">
                    <CurrencyConverter amount={formData.total} from="USD" to="VND" />
                  </div>
                )}
              </div>
              {/* Discounts Section */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Discounts</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="nonProfitDiscount"
                      checked={formData.nonProfitDiscount}
                      onCheckedChange={handleNonProfitDiscountChange}
                    />
                    <Label htmlFor="nonProfitDiscount" className="text-sm font-normal cursor-pointer">
                      Non-profit / Charity Discount (30%)
                    </Label>
                  </div>
                  <div className="text-xs text-muted-foreground ml-6">
                    Requires proof of non-profit status. Documentation will be requested after quotation.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="customDiscountPercent">Custom Discount (%)</Label>
                      <Input
                        id="customDiscountPercent"
                        name="customDiscountPercent"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.customDiscountPercent}
                        onChange={handleCustomDiscountChange}
                        placeholder="0"
                      />
                    </div>
                    {(formData.nonProfitDiscount || formData.customDiscountPercent > 0) && (
                      <div className="space-y-2 flex items-end">
                        <div className="p-2 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-md text-sm w-full">
                          <p className="font-medium text-yellow-800 dark:text-yellow-400">Applied Discounts:</p>
                          <ul className="mt-1 text-sm">
                            {formData.nonProfitDiscount && <li>Non-profit / Charity: 30%</li>}
                            {formData.customDiscountPercent > 0 && (
                              <li>Custom Discount: {formData.customDiscountPercent}%</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="sticky top-6">
          <Card>
            <CardHeader>
              <CardTitle>Quotation Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {isClient ? (
                <PDFPreview formData={formData} />
              ) : (
                <div className="w-full aspect-[1/1.414] bg-muted rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-yellow-500" />
                    <p className="text-sm text-muted-foreground">Loading preview...</p>
                  </div>
                </div>
              )}
              <Button
                className="w-full mt-6 bg-black text-white hover:bg-neutral-800 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                size="lg"
                onClick={generatePDF}
                disabled={isGenerating || !isFormValid()}
              >
                <Download className="h-5 w-5 mr-2" />
                Export
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
