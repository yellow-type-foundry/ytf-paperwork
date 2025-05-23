// Structured data for YTF typefaces
export const ytfTypefaces = [
  {
    family: "YTF Oldman",
    variants: ["Thin", "Light", "Regular", "Medium", "Bold", "Black"],
    basePrice: 90.0,
    totalStyles: 6,
  },
  {
    family: "YTF Eon A",
    variants: ["Regular", "Medium", "Bold", "Black"],
    basePrice: 90.0,
    totalStyles: 4,
  },
  {
    family: "YTF Eon B",
    variants: ["Regular", "Medium", "Bold", "Black"],
    basePrice: 90.0,
    totalStyles: 4,
  },
  {
    family: "YTF Eon C",
    variants: ["Regular", "Medium", "Bold", "Black"],
    basePrice: 90.0,
    totalStyles: 4,
  },
  {
    family: "YTF Xanh",
    variants: ["Thin", "Light", "Regular", "Thin Italic", "Light Italic", "Regular Italic"],
    basePrice: 100.0,
    totalStyles: 6,
  },
  {
    family: "YTF Xanh Mono",
    variants: ["Thin", "Light", "Regular", "Thin Italic", "Light Italic", "Regular Italic"],
    basePrice: 100.0,
    totalStyles: 6,
  },
  {
    family: "YTF Cafuné Sans",
    variants: ["Air", "Thin", "UltraLight", "Light", "Book", "Medium", "Bold", "Heavy"],
    basePrice: 90.0,
    totalStyles: 8,
  },
  {
    family: "YTF Cafuné",
    variants: [
      "Thin",
      "Light",
      "UltraLight",
      "Book",
      "Medium",
      "Bold",
      "Heavy",
      "Thin Italic",
      "Light Italic",
      "UltraLight Italic",
      "Book Italic",
      "Medium Italic",
      "Bold Italic",
      "Heavy Italic",
    ],
    basePrice: 100.0,
    totalStyles: 14,
  },
  {
    family: "YTF Millie",
    variants: [
      "Thin",
      "Light",
      "Regular",
      "Medium",
      "Bold",
      "Heavy",
      "Black",
      "Thin Italic",
      "Light Italic",
      "Regular Italic",
      "Medium Italic",
      "Bold Italic",
      "Heavy Italic",
      "Black Italic",
    ],
    basePrice: 90.0,
    totalStyles: 14,
  },
  {
    family: "YTF Millie Mono",
    variants: ["Light", "Regular", "Medium", "Bold", "Light Italic", "Regular Italic", "Medium Italic", "Bold Italic"],
    basePrice: 90.0,
    totalStyles: 8,
  },
  {
    family: "YTF Gióng",
    variants: ["Roman", "Italic"],
    basePrice: 100.0,
    totalStyles: 2,
  },
]

// Business sizes and license multipliers
export const businessSizes = [
  {
    id: "individual",
    name: "Individual",
    description: "For sole individuals only. No commercial use.",
    multiplier: 1,
    employeeCount: "N/A",
  },
  {
    id: "xs",
    name: "XS — Business",
    description: "For businesses with fewer than 20 employees",
    multiplier: 2,
    employeeCount: "<20",
  },
  {
    id: "s",
    name: "S — Business",
    description: "For businesses with fewer than 50 employees",
    multiplier: 3,
    employeeCount: "<50",
  },
  {
    id: "m",
    name: "M — Business",
    description: "For businesses with fewer than 150 employees",
    multiplier: 5,
    employeeCount: "<150",
  },
  {
    id: "l",
    name: "L — Business",
    description: "For businesses with fewer than 250 employees",
    multiplier: 8,
    employeeCount: "<250",
  },
  {
    id: "xl",
    name: "XL — Business",
    description: "For businesses with fewer than 500 employees",
    multiplier: 10,
    employeeCount: "<500",
  },
  {
    id: "custom",
    name: "Custom / Unlimited License",
    description: "For businesses with more than 500 employees or needing unlimited use/customization",
    multiplier: null,
    employeeCount: ">500",
    contactRequired: true,
  },
]

// File format options
export const fileFormatOptions = [
  { id: "otf_ttf", name: "OTF, TTF", multiplier: 1 },
  { id: "woff_woff2", name: "WOFF, WOFF2", multiplier: 1 },
]

// Duration options
export const durationOptions = [
  { id: "perpetual", name: "Perpetual", multiplier: 1 },
  { id: "custom", name: "Custom (Years)", multiplier: 0.7 }, // Base multiplier for 1 year
]

// Helper function to get language/cut options based on variant
export function getLanguageCutForVariant(variant: string): string {
  if (variant.includes("Italic")) {
    return "Latin, Italic"
  } else if (variant === "Roman") {
    return "Latin, Roman"
  } else if (variant === "Bold") {
    return "Latin, Bold"
  } else if (variant === "Medium") {
    return "Latin, Medium"
  } else if (variant === "Light") {
    return "Latin, Light"
  } else if (variant === "Thin") {
    return "Latin, Thin"
  } else if (variant === "Black") {
    return "Latin, Black"
  } else if (variant === "Heavy") {
    return "Latin, Heavy"
  } else if (variant === "Book") {
    return "Latin, Book"
  } else if (variant === "UltraLight") {
    return "Latin, UltraLight"
  } else if (variant === "Air") {
    return "Latin, Air"
  } else {
    return "Latin, Medium" // Default
  }
}

// Calculate duration multiplier based on years
// 1st year: 70% of perpetual
// 2nd year: 65% of perpetual
// 3rd year and beyond: 60% of perpetual
export function calculateDurationMultiplier(durationYears: number): number {
  if (durationYears <= 0) return 0

  let totalMultiplier = 0

  // First year: 70%
  if (durationYears >= 1) {
    totalMultiplier += 0.7
  }

  // Second year: 65%
  if (durationYears >= 2) {
    totalMultiplier += 0.65
  }

  // Third year and beyond: 60% each
  if (durationYears >= 3) {
    totalMultiplier += 0.6 * (durationYears - 2)
  }

  return totalMultiplier
}

// Helper function to calculate the license price based on base price, business size, file formats, duration, and discounts
export function calculateLicensePrice(
  basePrice: number,
  businessSizeId: string,
  fileFormats: string[],
  durationType: string,
  durationYears = 1,
  nonProfitDiscount = false,
  customDiscountPercent = 0,
): number | null {
  const businessSize = businessSizes.find((size) => size.id === businessSizeId)
  if (!businessSize) return basePrice // Default to base price if business size not found
  if (businessSize.contactRequired) return null // Return null for custom/contact pricing

  // Calculate base price with business size multiplier
  let price = basePrice * businessSize.multiplier

  // Apply duration pricing
  if (durationType === "custom" && durationYears > 0) {
    // Apply the duration multiplier
    const durationMultiplier = calculateDurationMultiplier(durationYears)
    price = price * durationMultiplier
  }

  // Double the price if both file formats are selected
  if (fileFormats.includes("otf_ttf") && fileFormats.includes("woff_woff2")) {
    price *= 2
  }

  // Apply non-profit discount (30%)
  if (nonProfitDiscount) {
    price = price * 0.7 // 30% discount
  }

  // Apply custom discount
  if (customDiscountPercent > 0) {
    price = price * (1 - customDiscountPercent / 100)
  }

  return price
}

// Helper function to get a typeface by family name
export function getTypefaceByFamily(family: string) {
  return ytfTypefaces.find((typeface) => typeface.family === family)
}

// Helper function to format file formats for display
export function formatFileFormats(fileFormats: string[]): string {
  if (fileFormats.length === 0) return ""

  return fileFormats
    .map((format) => {
      const option = fileFormatOptions.find((opt) => opt.id === format)
      return option ? option.name : format
    })
    .join("; ")
}

// Helper function to format duration for display
export function formatDuration(durationType: string, durationYears = 1): string {
  if (durationType === "perpetual") {
    return "Perpetual"
  } else if (durationType === "custom") {
    return `${durationYears} Year${durationYears > 1 ? "s" : ""}`
  }
  return "Perpetual" // Default
}

// Helper function to get duration pricing explanation
export function getDurationPricingExplanation(durationType: string, durationYears = 1): string {
  if (durationType === "perpetual") {
    return "Perpetual license"
  } else if (durationType === "custom") {
    if (durationYears === 1) {
      return "1 Year: 70% of perpetual price"
    } else if (durationYears === 2) {
      return "2 Years: 70% + 65% = 135% of perpetual price"
    } else {
      const multiplier = calculateDurationMultiplier(durationYears)
      return `${durationYears} Years: 70% + 65% + ${durationYears - 2} × 60% = ${(multiplier * 100).toFixed(0)}% of perpetual price`
    }
  }
  return ""
}
