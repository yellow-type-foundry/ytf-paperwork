"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface CurrencyConverterProps {
  amount: number
  from: string
  to: string
}

export function CurrencyConverter({ amount, from, to }: CurrencyConverterProps) {
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)

  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (amount <= 0) {
        setConvertedAmount(0)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // For demo purposes, we'll use a fixed exchange rate
        // In a production app, you would fetch this from an API
        // Example API: https://api.exchangerate-api.com/v4/latest/USD

        // Fixed exchange rate: 1 USD = ~24,500 VND (as of May 2024)
        const rate = 24500
        setExchangeRate(rate)

        // Calculate the converted amount
        const converted = amount * rate
        setConvertedAmount(converted)
      } catch (err) {
        console.error("Error fetching exchange rate:", err)
        setError("Failed to fetch exchange rate. Using estimated rate.")

        // Fallback to an estimated rate
        const estimatedRate = 24500
        setExchangeRate(estimatedRate)
        const converted = amount * estimatedRate
        setConvertedAmount(converted)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExchangeRate()
  }, [amount, from, to])

  if (isLoading) {
    return (
      <div className="flex items-center text-sm text-muted-foreground">
        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
        Converting...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-sm">
        <span className="text-muted-foreground">
          ≈ {convertedAmount?.toLocaleString()} {to}
        </span>
        <span className="text-xs text-yellow-500 ml-2">(estimated)</span>
      </div>
    )
  }

  if (convertedAmount === null) {
    return null
  }

  return (
    <div className="text-sm">
      <span className="text-muted-foreground">
        ≈ {convertedAmount.toLocaleString()} {to}
      </span>
      {exchangeRate && (
        <span className="text-xs text-muted-foreground ml-2">
          (1 {from} = {exchangeRate.toLocaleString()} {to})
        </span>
      )}
    </div>
  )
}
