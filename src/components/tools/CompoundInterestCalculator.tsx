import { useState } from "react";
import { TrendingUp, Calculator, Info, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-components";

export const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [timeUnit, setTimeUnit] = useState("years");
  const [compoundingFrequency, setCompoundingFrequency] = useState("annually");
  const [results, setResults] = useState<any>(null);

  const calculateCompoundInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(interestRate);
    const t = parseFloat(timePeriod);

    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r <= 0 || t <= 0) {
      return;
    }

    // Convert time to years
    const years = timeUnit === "months" ? t / 12 : timeUnit === "days" ? t / 365 : t;

    // Get compounding frequency multiplier
    const frequencyMap: { [key: string]: number } = {
      annually: 1,
      semiannually: 2,
      quarterly: 4,
      monthly: 12,
      daily: 365,
      continuously: 0
    };

    const n = frequencyMap[compoundingFrequency];

    let finalAmount: number;
    let interestEarned: number;

    if (n === 0) {
      // Continuous compounding
      finalAmount = p * Math.exp((r / 100) * years);
    } else {
      // Regular compounding
      finalAmount = p * Math.pow(1 + (r / 100) / n, n * years);
    }

    interestEarned = finalAmount - p;
    const growthRate = ((finalAmount - p) / p) * 100;

    // Generate yearly breakdown
    const yearlyBreakdown = [];
    for (let year = 1; year <= Math.min(Math.ceil(years), 10); year++) {
      let yearAmount: number;
      if (n === 0) {
        yearAmount = p * Math.exp((r / 100) * year);
      } else {
        yearAmount = p * Math.pow(1 + (r / 100) / n, n * year);
      }
      yearlyBreakdown.push({
        year,
        amount: yearAmount.toFixed(2),
        interest: (yearAmount - p).toFixed(2)
      });
    }

    setResults({
      principal: p.toFixed(2),
      finalAmount: finalAmount.toFixed(2),
      interestEarned: interestEarned.toFixed(2),
      growthRate: growthRate.toFixed(2),
      years: years.toFixed(2),
      yearlyBreakdown
    });
  };

  const resetCalculator = () => {
    setPrincipal("");
    setInterestRate("");
    setTimePeriod("");
    setTimeUnit("years");
    setCompoundingFrequency("annually");
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Compound Interest Calculator</h2>
        <p className="text-muted-foreground">
          Calculate compound interest with various frequencies and time periods
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Investment Details
            </CardTitle>
            <CardDescription>
              Enter principal amount, interest rate, and time period
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="principal">Principal Amount (SAR)</Label>
              <Input
                id="principal"
                type="number"
                placeholder="Enter principal amount"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                placeholder="Enter interest rate"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timePeriod">Time Period</Label>
                <Input
                  id="timePeriod"
                  type="number"
                  placeholder="Enter time period"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  min="0.01"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeUnit">Time Unit</Label>
                <Select value={timeUnit} onValueChange={setTimeUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="years">Years</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="compoundingFrequency">Compounding Frequency</Label>
              <Select value={compoundingFrequency} onValueChange={setCompoundingFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annually">Annually</SelectItem>
                  <SelectItem value="semiannually">Semi-annually</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="continuously">Continuously</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateCompoundInterest} className="flex-1">
                Calculate Interest
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
                <BarChart3 className="w-5 h-5" />
                Investment Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Principal</p>
                  <p className="text-2xl font-bold text-primary">
                    SAR {results.principal}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Final Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    SAR {results.finalAmount}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Interest Earned</p>
                  <p className="text-2xl font-bold text-blue-600">
                    SAR {results.interestEarned}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Growth Rate</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {results.growthRate}%
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Yearly Breakdown</h4>
                <div className="max-h-64 overflow-y-auto">
                  <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground mb-2">
                    <div>Year</div>
                    <div>Amount</div>
                    <div>Interest</div>
                  </div>
                  {results.yearlyBreakdown.map((row: any) => (
                    <div key={row.year} className="grid grid-cols-3 gap-2 text-sm border-b py-1">
                      <div>{row.year}</div>
                      <div>SAR {row.amount}</div>
                      <div>SAR {row.interest}</div>
                    </div>
                  ))}
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
            About Compound Interest
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">How It Works</h4>
              <p className="text-sm text-muted-foreground">
                Compound interest is interest earned on both the principal amount and any previously earned interest. 
                This creates exponential growth over time, making it a powerful tool for long-term investments.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Compounding Frequencies</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Annually: Once per year</li>
                <li>• Semi-annually: Twice per year</li>
                <li>• Quarterly: Four times per year</li>
                <li>• Monthly: Twelve times per year</li>
                <li>• Daily: 365 times per year</li>
                <li>• Continuously: Infinite compounding</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
