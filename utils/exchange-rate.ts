const API_KEY = process.env.NEXT_PUBLIC_VNAPP_API_KEY || 'YOUR_API_KEY_HERE';

export async function fetchUsdToVndRate(): Promise<number | null> {
  const res = await fetch('https://api.vnappmob.com/api/v2/exchange_rate/vcb', {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Accept': 'application/json',
    },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const data = await res.json();
  const usd = data.results.find((r: any) => r.currency === 'USD');
  return usd ? usd.sell : null;
}

import { useEffect, useState } from 'react';

export function useUsdToVndRate() {
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchUsdToVndRate()
      .then((r) => {
        setRate(r);
        setLoading(false);
      })
      .catch((e) => {
        setError('Failed to fetch exchange rate');
        setLoading(false);
      });
  }, []);

  return { rate, loading, error };
} 