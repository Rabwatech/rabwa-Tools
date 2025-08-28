import { useState } from "react";
import { DollarSign, Calculator, Info, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-components";

export const TipCalculator = () => {
  const [billAmount, setBillAmount] = useState("");
  const [tipPercentage, setTipPercentage] = useState("15");
  const [numberOfPeople, setNumberOfPeople] = useState("1");
  const [taxAmount, setTaxAmount] = useState("");
  const [results, setResults] = useState<any>(null);

  const calculateTip = () => {
    const bill = parseFloat(billAmount);
    const tip = parseFloat(tipPercentage);
    const people = parseInt(numberOfPeople);
    const tax = parseFloat(taxAmount) || 0;

    if (isNaN(bill) || isNaN(tip) || isNaN(people) || bill <= 0 || people <= 0) {
      return;
    }

    const tipAmount = (bill * tip) / 100;
    const totalWithTax = bill + tax;
    const totalWithTip = totalWithTax + tipAmount;
    const perPerson = totalWithTip / people;
    const tipPerPerson = tipAmount / people;

    setResults({
      billAmount: bill.toFixed(2),
      tipAmount: tipAmount.toFixed(2),
      taxAmount: tax.toFixed(2),
      totalWithTax: totalWithTax.toFixed(2),
      totalWithTip: totalWithTip.toFixed(2),
      perPerson: perPerson.toFixed(2),
      tipPerPerson: tipPerPerson.toFixed(2),
      numberOfPeople: people
    });
  };

  const resetCalculator = () => {
    setBillAmount("");
    setTipPercentage("15");
    setNumberOfPeople("1");
    setTaxAmount("");
    setResults(null);
  };

  const quickTipOptions = [
    { label: "Poor (10%)", value: "10" },
    { label: "Fair (15%)", value: "15" },
    { label: "Good (18%)", value: "18" },
    { label: "Great (20%)", value: "20" },
    { label: "Excellent (25%)", value: "25" }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Tip Calculator</h2>
        <p className="text-muted-foreground">
          Calculate tips with percentages and split bills among people
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Bill Details
            </CardTitle>
            <CardDescription>
              Enter bill amount, tip percentage, and number of people
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="billAmount">Bill Amount (SAR)</Label>
              <Input
                id="billAmount"
                type="number"
                placeholder="Enter bill amount"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipPercentage">Tip Percentage (%)</Label>
              <Input
                id="tipPercentage"
                type="number"
                placeholder="Enter tip percentage"
                value={tipPercentage}
                onChange={(e) => setTipPercentage(e.target.value)}
                min="0"
                max="100"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label>Quick Tip Options</Label>
              <div className="grid grid-cols-2 gap-2">
                {quickTipOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={tipPercentage === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTipPercentage(option.value)}
                    className="text-xs"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxAmount">Tax Amount (SAR) - Optional</Label>
              <Input
                id="taxAmount"
                type="number"
                placeholder="Enter tax amount"
                value={taxAmount}
                onChange={(e) => setTaxAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfPeople">Number of People</Label>
              <Input
                id="numberOfPeople"
                type="number"
                placeholder="Enter number of people"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(e.target.value)}
                min="1"
                step="1"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateTip} className="flex-1">
                Calculate Tip
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
                <Users className="w-5 h-5" />
                Tip Calculation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Bill Amount</p>
                  <p className="text-2xl font-bold text-primary">
                    SAR {results.billAmount}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Tip Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    SAR {results.tipAmount}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Tax Amount</p>
                  <p className="text-2xl font-bold text-blue-600">
                    SAR {results.taxAmount}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total with Tip</p>
                  <p className="text-2xl font-bold text-purple-600">
                    SAR {results.totalWithTip}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Per Person Breakdown</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span>Total per person:</span>
                    <span className="font-semibold">SAR {results.perPerson}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span>Tip per person:</span>
                    <span className="font-semibold">SAR {results.tipPerPerson}</span>
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
            Tipping Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Standard Tipping Rates</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Poor service: 10-12%</li>
                <li>• Average service: 15-18%</li>
                <li>• Good service: 18-20%</li>
                <li>• Excellent service: 20-25%</li>
                <li>• Takeout: 10-15%</li>
                <li>• Delivery: 15-20%</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Calculation Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Tip is calculated on pre-tax amount</li>
                <li>• Round up for convenience</li>
                <li>• Consider service quality</li>
                <li>• Split evenly among diners</li>
                <li>• Include tax in total calculation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
