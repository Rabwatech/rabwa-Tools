import { useState, useEffect } from "react";
import { ArrowRightLeft, DollarSign, RefreshCw } from "lucide-react";

// Static exchange rates - in a real app, you'd fetch from an API
const exchangeRates: Record<string, number> = {
  USD: 1,      // Base currency
  SAR: 3.75,   // Saudi Riyal
  EUR: 0.92,   // Euro
  GBP: 0.79,   // British Pound
  JPY: 149.5,  // Japanese Yen
  CAD: 1.36,   // Canadian Dollar
  AUD: 1.52,   // Australian Dollar
  CHF: 0.88,   // Swiss Franc
  CNY: 7.24,   // Chinese Yuan
  AED: 3.67,   // UAE Dirham
};

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
];

export const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('SAR');
  const [result, setResult] = useState<number | null>(null);

  const convert = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    // Convert from source currency to USD, then to target currency
    const usdAmount = amountNum / exchangeRates[fromCurrency];
    const convertedAmount = usdAmount * exchangeRates[toCurrency];
    
    setResult(convertedAmount);
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  useEffect(() => {
    if (amount) {
      convert();
    }
  }, [amount, fromCurrency, toCurrency]);

  const getExchangeRate = () => {
    if (!amount || isNaN(parseFloat(amount))) return null;
    const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    return rate;
  };

  const fromCurrencyInfo = currencies.find(c => c.code === fromCurrency);
  const toCurrencyInfo = currencies.find(c => c.code === toCurrency);
  const exchangeRate = getExchangeRate();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="tool-input"
            min="0"
            step="0.01"
          />
        </div>

        {/* From Currency */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            From
          </label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="tool-input"
          >
            {currencies.map(currency => (
              <option key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </option>
            ))}
          </select>
        </div>

        {/* To Currency */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            To
          </label>
          <div className="flex gap-2">
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="tool-input flex-1"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
            <button
              onClick={swapCurrencies}
              className="btn-secondary p-3"
              title="Swap currencies"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Result */}
      {result !== null && amount && !isNaN(parseFloat(amount)) && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {toCurrencyInfo?.symbol}{result.toLocaleString(undefined, { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })} {toCurrency}
            </div>
            <div className="text-muted-foreground">
              {fromCurrencyInfo?.symbol}{parseFloat(amount).toLocaleString()} {fromCurrency} equals
            </div>
          </div>
        </div>
      )}

      {/* Exchange Rate Info */}
      {exchangeRate && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Exchange Rate Information
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">1 {fromCurrency} equals:</span>
              <span className="font-medium text-foreground">
                {exchangeRate.toFixed(4)} {toCurrency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">1 {toCurrency} equals:</span>
              <span className="font-medium text-foreground">
                {(1/exchangeRate).toFixed(4)} {fromCurrency}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Popular Conversions */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-3">Popular Currency Pairs</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {[
            { from: 'USD', to: 'SAR' },
            { from: 'EUR', to: 'USD' },
            { from: 'GBP', to: 'USD' },
            { from: 'SAR', to: 'USD' },
          ].map(pair => {
            const rate = exchangeRates[pair.to] / exchangeRates[pair.from];
            return (
              <button
                key={`${pair.from}-${pair.to}`}
                onClick={() => {
                  setFromCurrency(pair.from);
                  setToCurrency(pair.to);
                }}
                className="flex justify-between items-center p-3 bg-background rounded-lg hover:bg-card-hover transition-colors"
              >
                <span className="text-foreground">{pair.from} → {pair.to}</span>
                <span className="font-medium text-primary">{rate.toFixed(4)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        * Exchange rates are for demonstration purposes only and may not reflect current market rates.
      </div>
    </div>
  );
};