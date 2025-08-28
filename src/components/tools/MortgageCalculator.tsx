import { useState } from "react";
import { Home, Calculator, Info, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const MortgageCalculator = () => {
  const [homePrice, setHomePrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("30");
  const [results, setResults] = useState<any>(null);

  const calculateMortgage = () => {
    const price = parseFloat(homePrice);
    const down = parseFloat(downPayment);
    const rate = parseFloat(interestRate);
    const term = parseInt(loanTerm);

    if (isNaN(price) || isNaN(down) || isNaN(rate) || isNaN(term) || 
        price <= 0 || down < 0 || rate <= 0 || term <= 0 || down >= price) {
      return;
    }

    const loanAmount = price - down;
    const monthlyRate = rate / 100 / 12;
    const totalMonths = term * 12;

    // Calculate monthly payment using mortgage formula
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                          (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalPayment = monthlyPayment * totalMonths;
    const totalInterest = totalPayment - loanAmount;
    const downPaymentPercent = (down / price) * 100;

    // Generate amortization schedule (first 12 months)
    const schedule = [];
    let remainingBalance = loanAmount;

    for (let month = 1; month <= Math.min(totalMonths, 12); month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;

      schedule.push({
        month,
        payment: monthlyPayment.toFixed(2),
        principal: principalPayment.toFixed(2),
        interest: interestPayment.toFixed(2),
        balance: Math.max(0, remainingBalance).toFixed(2)
      });
    }

    setResults({
      homePrice: price.toFixed(2),
      downPayment: down.toFixed(2),
      downPaymentPercent: downPaymentPercent.toFixed(2),
      loanAmount: loanAmount.toFixed(2),
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      loanTerm: term,
      totalMonths,
      schedule
    });
  };

  const resetCalculator = () => {
    setHomePrice("");
    setDownPayment("");
    setInterestRate("");
    setLoanTerm("30");
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Home className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Mortgage Calculator</h2>
        <p className="text-muted-foreground">
          Calculate mortgage payments, interest, and amortization
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Property Details
            </CardTitle>
            <CardDescription>
              Enter home price, down payment, and loan terms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="homePrice">Home Price (SAR)</Label>
              <Input
                id="homePrice"
                type="number"
                placeholder="Enter home price"
                value={homePrice}
                onChange={(e) => setHomePrice(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="downPayment">Down Payment (SAR)</Label>
              <Input
                id="downPayment"
                type="number"
                placeholder="Enter down payment"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
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

            <div className="space-y-2">
              <Label htmlFor="loanTerm">Loan Term</Label>
              <Select value={loanTerm} onValueChange={setLoanTerm}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 Years</SelectItem>
                  <SelectItem value="20">20 Years</SelectItem>
                  <SelectItem value="25">25 Years</SelectItem>
                  <SelectItem value="30">30 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateMortgage} className="flex-1">
                Calculate Mortgage
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
                Mortgage Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Home Price</p>
                  <p className="text-2xl font-bold text-primary">
                    SAR {results.homePrice}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Down Payment</p>
                  <p className="text-2xl font-bold text-blue-600">
                    SAR {results.downPayment}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Loan Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    SAR {results.loanAmount}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Monthly Payment</p>
                  <p className="text-2xl font-bold text-purple-600">
                    SAR {results.monthlyPayment}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Interest</p>
                  <p className="text-2xl font-bold text-destructive">
                    SAR {results.totalInterest}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Payment</p>
                  <p className="text-2xl font-bold text-orange-600">
                    SAR {results.totalPayment}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Amortization Schedule (First 12 months)</h4>
                <div className="max-h-64 overflow-y-auto">
                  <div className="grid grid-cols-5 gap-2 text-xs font-medium text-muted-foreground mb-2">
                    <div>Month</div>
                    <div>Payment</div>
                    <div>Principal</div>
                    <div>Interest</div>
                    <div>Balance</div>
                  </div>
                  {results.schedule.map((row: any) => (
                    <div key={row.month} className="grid grid-cols-5 gap-2 text-sm border-b py-1">
                      <div>{row.month}</div>
                      <div>SAR {row.payment}</div>
                      <div>SAR {row.principal}</div>
                      <div>SAR {row.interest}</div>
                      <div>SAR {row.balance}</div>
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
            About Mortgages
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">How It Works</h4>
              <p className="text-sm text-muted-foreground">
                A mortgage is a loan used to purchase real estate. The property serves as collateral, 
                and you make monthly payments that include both principal and interest over the loan term.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Key Factors</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Home Price: Total cost of the property</li>
                <li>• Down Payment: Initial payment (usually 20%)</li>
                <li>• Interest Rate: Annual percentage rate</li>
                <li>• Loan Term: Length of the mortgage</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
