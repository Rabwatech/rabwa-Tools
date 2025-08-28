import { useState } from "react";
import { TrendingUp, Calculator, Info, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-components";

export const InvestmentReturnCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [timeUnit, setTimeUnit] = useState("years");
  const [results, setResults] = useState<any>(null);

  const calculateReturns = () => {
    const initial = parseFloat(initialInvestment);
    const final = parseFloat(finalValue);
    const time = parseFloat(timePeriod);

    if (isNaN(initial) || isNaN(final) || isNaN(time) || initial <= 0 || time <= 0) {
      return;
    }

    // Convert time to years
    const years = timeUnit === "months" ? time / 12 : timeUnit === "weeks" ? time / 52 : timeUnit === "days" ? time / 365 : time;

    // Calculate returns
    const totalReturn = final - initial;
    const totalReturnPercent = (totalReturn / initial) * 100;
    
    // Calculate CAGR (Compound Annual Growth Rate)
    let cagr: number;
    if (years > 0) {
      cagr = (Math.pow(final / initial, 1 / years) - 1) * 100;
    } else {
      cagr = 0;
    }

    // Calculate monthly and daily returns
    const monthlyReturn = years > 0 ? (Math.pow(final / initial, 1 / (years * 12)) - 1) * 100 : 0;
    const dailyReturn = years > 0 ? (Math.pow(final / initial, 1 / (years * 365)) - 1) * 100 : 0;

    setResults({
      initialInvestment: initial.toFixed(2),
      finalValue: final.toFixed(2),
      totalReturn: totalReturn.toFixed(2),
      totalReturnPercent: totalReturnPercent.toFixed(2),
      cagr: cagr.toFixed(2),
      monthlyReturn: monthlyReturn.toFixed(2),
      dailyReturn: dailyReturn.toFixed(2),
      years: years.toFixed(2)
    });
  };

  const resetCalculator = () => {
    setInitialInvestment("");
    setFinalValue("");
    setTimePeriod("");
    setTimeUnit("years");
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Investment Return Calculator</h2>
        <p className="text-muted-foreground">
          Calculate ROI, CAGR, and total returns for investments
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
              Enter initial investment, final value, and time period
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="initialInvestment">Initial Investment (SAR)</Label>
              <Input
                id="initialInvestment"
                type="number"
                placeholder="Enter initial investment"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="finalValue">Final Value (SAR)</Label>
              <Input
                id="finalValue"
                type="number"
                placeholder="Enter final value"
                value={finalValue}
                onChange={(e) => setFinalValue(e.target.value)}
                min="0"
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
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateReturns} className="flex-1">
                Calculate Returns
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
                Return Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Initial Investment</p>
                  <p className="text-2xl font-bold text-primary">
                    SAR {results.initialInvestment}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Final Value</p>
                  <p className="text-2xl font-bold text-green-600">
                    SAR {results.finalValue}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Return</p>
                  <p className="text-2xl font-bold text-blue-600">
                    SAR {results.totalReturn}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Return %</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {results.totalReturnPercent}%
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">CAGR</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {results.cagr}%
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Time Period</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {results.years} years
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Additional Metrics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span>Monthly Return:</span>
                    <span className="font-semibold">{results.monthlyReturn}%</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span>Daily Return:</span>
                    <span className="font-semibold">{results.dailyReturn}%</span>
                  </div>
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
            About Investment Returns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Key Metrics</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Total Return: Absolute gain/loss in currency</li>
                <li>• Return %: Percentage gain/loss</li>
                <li>• CAGR: Compound Annual Growth Rate</li>
                <li>• Monthly/Daily: Periodic return rates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">CAGR Formula</h4>
              <p className="text-sm text-muted-foreground">
                CAGR = (Final Value / Initial Investment)^(1/Years) - 1
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                CAGR provides a smoothed annual return rate that accounts for compounding effects.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
