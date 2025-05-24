"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { useUsdToVndRate } from "@/utils/exchange-rate"

interface CurrencyConverterProps {
  amount: number
  from: string
  to: string
}

export function CurrencyConverter({ amount, from, to }: CurrencyConverterProps) {
  // Use live VCB rate for USD→VND
  const { rate: vcbRate, loading: vcbLoading, error: vcbError } = useUsdToVndRate();
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (from === 'USD' && to === 'VND') {
      if (vcbLoading) {
        setConvertedAmount(null);
        setExchangeRate(null);
        setError(null);
        return;
      }
      if (vcbError || !vcbRate) {
        setError('Failed to fetch exchange rate. Using estimated rate.');
        const estimatedRate = 24500;
        setExchangeRate(estimatedRate);
        setConvertedAmount(amount * estimatedRate);
        return;
      }
      setExchangeRate(vcbRate);
      setConvertedAmount(amount * vcbRate);
      setError(null);
      return;
    }
    // fallback for other conversions (not USD→VND)
    const fallbackRate = 1;
    setExchangeRate(fallbackRate);
    setConvertedAmount(amount * fallbackRate);
    setError(null);
  }, [amount, from, to, vcbRate, vcbLoading, vcbError]);

  if (from === 'USD' && to === 'VND' && vcbLoading) {
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
