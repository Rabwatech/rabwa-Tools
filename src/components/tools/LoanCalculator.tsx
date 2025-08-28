import { useState } from "react";
import { CreditCard, Calculator, Info, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [termUnit, setTermUnit] = useState("years");
  const [results, setResults] = useState<any>(null);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const term = parseFloat(loanTerm);

    if (isNaN(principal) || isNaN(rate) || isNaN(term) || principal <= 0 || rate <= 0 || term <= 0) {
      return;
    }

    // Convert annual rate to monthly rate
    const monthlyRate = rate / 100 / 12;
    
    // Convert term to months
    const totalMonths = termUnit === "years" ? term * 12 : term;

    // Calculate monthly payment using loan amortization formula
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                          (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalPayment = monthlyPayment * totalMonths;
    const totalInterest = totalPayment - principal;

    // Generate amortization schedule
    const schedule = [];
    let remainingBalance = principal;

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
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalMonths,
      schedule
    });
  };

  const resetCalculator = () => {
    setLoanAmount("");
    setInterestRate("");
    setLoanTerm("");
    setTermUnit("years");
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Loan Calculator</h2>
        <p className="text-muted-foreground">
          Calculate loan payments, interest, and amortization schedules
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Loan Details
            </CardTitle>
            <CardDescription>
              Enter loan amount, interest rate, and term
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loanAmount">Loan Amount (SAR)</Label>
              <Input
                id="loanAmount"
                type="number"
                placeholder="Enter loan amount"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
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
                <Label htmlFor="loanTerm">Loan Term</Label>
                <Input
                  id="loanTerm"
                  type="number"
                  placeholder="Enter term"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  min="1"
                  step="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="termUnit">Term Unit</Label>
                <Select value={termUnit} onValueChange={setTermUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="years">Years</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateLoan} className="flex-1">
                Calculate Loan
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
                Loan Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Monthly Payment</p>
                  <p className="text-2xl font-bold text-primary">
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
                  <p className="text-2xl font-bold text-green-600">
                    SAR {results.totalPayment}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Loan Term</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {results.totalMonths} months
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
            About Loan Calculations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">How It Works</h4>
              <p className="text-sm text-muted-foreground">
                The loan calculator uses the standard loan amortization formula to determine monthly payments. 
                Each payment consists of principal and interest, with the interest portion decreasing over time 
                as the principal balance is reduced.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Key Terms</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Principal: The original loan amount</li>
                <li>• Interest Rate: Annual percentage rate (APR)</li>
                <li>• Amortization: Gradual repayment of the loan</li>
                <li>• Monthly Payment: Fixed amount paid each month</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
