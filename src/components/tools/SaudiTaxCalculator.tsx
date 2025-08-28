import { useState } from "react";
import { Receipt, Calculator, Info, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-components";
import { Badge } from "@/components/ui/badge";

export const SaudiTaxCalculator = () => {
  const [amount, setAmount] = useState("");
  const [taxType, setTaxType] = useState("vat");
  const [isVatInclusive, setIsVatInclusive] = useState(false);
  const [results, setResults] = useState<any>(null);

  const calculateTax = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    let gross, tax, net, effectiveRate;

    switch (taxType) {
      case "vat":
        if (isVatInclusive) {
          gross = numAmount;
          tax = (numAmount * 15) / 115;
          net = numAmount - tax;
          effectiveRate = (tax / gross) * 100;
        } else {
          net = numAmount;
          tax = numAmount * 0.15;
          gross = numAmount + tax;
          effectiveRate = 15;
        }
        break;
      case "corporate":
        if (numAmount <= 375000) {
          tax = 0;
        } else if (numAmount <= 500000) {
          tax = (numAmount - 375000) * 0.20;
        } else {
          tax = (numAmount - 500000) * 0.25 + 25000;
        }
        gross = numAmount;
        net = numAmount - tax;
        effectiveRate = (tax / gross) * 100;
        break;
      case "withholding":
        tax = numAmount * 0.15;
        gross = numAmount;
        net = numAmount - tax;
        effectiveRate = 15;
        break;
      default:
        return;
    }

    setResults({
      gross: gross.toFixed(2),
      tax: tax.toFixed(2),
      net: net.toFixed(2),
      effectiveRate: effectiveRate.toFixed(2),
    });
  };

  const resetCalculator = () => {
    setAmount("");
    setTaxType("vat");
    setIsVatInclusive(false);
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Receipt className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Saudi Tax Calculator</h2>
        <p className="text-muted-foreground">
          Calculate VAT, Corporate Tax, and Withholding Tax for Saudi Arabia
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Tax Calculation
            </CardTitle>
            <CardDescription>
              Enter the amount and select tax type to calculate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (SAR)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxType">Tax Type</Label>
              <Select value={taxType} onValueChange={setTaxType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tax type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vat">VAT (15%)</SelectItem>
                  <SelectItem value="corporate">Corporate Tax</SelectItem>
                  <SelectItem value="withholding">Withholding Tax (15%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {taxType === "vat" && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="vatInclusive"
                  checked={isVatInclusive}
                  onChange={(e) => setIsVatInclusive(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="vatInclusive">Amount includes VAT</Label>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={calculateTax} className="flex-1">
                Calculate Tax
              </Button>
              <Button onClick={resetCalculator} variant="outline">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Gross Amount</p>
                  <p className="text-2xl font-bold text-primary">
                    SAR {results.gross}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Tax Amount</p>
                  <p className="text-2xl font-bold text-destructive">
                    SAR {results.tax}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Net Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    SAR {results.net}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Effective Rate</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {results.effectiveRate}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Tax Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-2">VAT (Value Added Tax)</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Standard Rate: 15%</li>
                <li>• Applies to most goods and services</li>
                <li>• Zero-rated and exempt items available</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Corporate Tax</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 0% on first SAR 375,000</li>
                <li>• 20% on SAR 375,001 - 500,000</li>
                <li>• 25% on amounts above SAR 500,000</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Withholding Tax</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 15% on payments to non-residents</li>
                <li>• Applies to various services</li>
                <li>• Treaty benefits may apply</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
